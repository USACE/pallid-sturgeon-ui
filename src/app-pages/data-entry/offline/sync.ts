import { db, type OutboxItem } from './db';
import { pushOutboxItem } from './api';
import { cleanSyncErrorMessage } from './offline-recovery';

export type SyncResult = {
  tried: number;
  ok: number;
  errors: number;
  conflicts: number;
  draftSkip: number;
};

export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : false;
}

const tablePriority: Record<OutboxItem['tableName'], number> = {
  ds_sites: 1,
  ds_search: 2,
  ds_moriver: 2,
  ds_telemetry_fish: 3,
  ds_fish: 4,
  ds_supplemental: 5,
  ds_procedure: 6,
};

function getTable(tableName: string) {
  switch (tableName) {
    case 'ds_sites':
      return db.sites;
    case 'ds_moriver':
      return db.moriver;
    case 'ds_search':
      return db.search;
    case 'ds_fish':
      return db.fish;
    case 'ds_telemetry_fish':
      return db.telemetry;
    case 'ds_supplemental':
      return db.supplemental;
    case 'ds_procedure':
      return db.procedure;
    default:
      throw new Error(`Unknown table: ${tableName}`);
  }
}

const enum TableName {
  Moriver = 'ds_moriver',
  Search = 'ds_search',
  Telemetry = 'ds_telemetry_fish',
  Fish = 'ds_fish',
  Sites = 'ds_sites',
  Supplemental = 'ds_supplemental',
  Procedure = 'ds_procedure',
}

const hasValue = (value: any) => {
  return value !== undefined && value !== null && value !== '';
};

const valuesMatch = (left: any, right: any) => {
  return hasValue(left) && hasValue(right) && String(left) === String(right);
};

const findParentForTelemetry = async (payload: any) => {
  const telemetrySeId = payload?.seId ?? payload?.se_id;
  const telemetrySeFid = payload?.seFid ?? payload?.se_fid;

  return db.search
    .filter((search: any) => {
      const searchSeId = search?.seId ?? search?.se_id;
      const searchSeFid = search?.seFid ?? search?.se_fid;

      return valuesMatch(searchSeId, telemetrySeId) || valuesMatch(searchSeFid, telemetrySeFid);
    })
    .first();
};

const getSyncDependencyError = async (item: OutboxItem): Promise<string | null> => {
  const payload = item.payload ?? {};
  if (item.tableName === TableName.Telemetry) {
    const telemetryServerSeId = Number(payload?.seId ?? payload?.se_id ?? 0);
    const serverSearchId = Number.isFinite(telemetryServerSeId) && telemetryServerSeId > 0;
    if (serverSearchId) {
      return null;
    }

    const parentSearch = await findParentForTelemetry(payload);
    if (!parentSearch) {
      return (
        'Telemetry cannot sync because its Search Effort cannot be found.' +
        'Confirm this Telemetry record belongs to the Search Effort form.'
      );
    }

    const searchStatus = Number(parentSearch?.status);
    const offlineStatus = String(parentSearch?._status ?? '').toLowerCase();
    const isDraft = searchStatus === 1 || offlineStatus === 'draft';

    if (isDraft) {
      return (
        'Telemetry cannot sync because its Search Effort has not been submitted. ' +
        'Please submit Search Effort form before attempting to sync.'
      );
    }
  }
  return null;
};

async function patchSiteChildrenAfterCreate(siteItem: OutboxItem, siteResult: any) {
  if (siteItem.tableName !== 'ds_sites') return;
  if (siteItem.op !== 'create') return;

  const serverSiteId =
    siteResult.serverId ??
    siteResult.json?.site_id ??
    siteResult.json?.siteId ??
    siteResult.json?.data?.site_id ??
    siteResult.json?.data?.siteId ??
    siteResult.json?.data;

  if (!serverSiteId) {
    console.warn('Site create synced but no site_id returned:', siteResult);
    return;
  }

  const sitePayload = siteItem.payload ?? {};
  const siteFid = sitePayload.site_fid ?? sitePayload.siteFid;

  if (!siteFid) {
    console.warn('Site create synced but no site_fid found:', siteItem);
    return;
  }

  const pendingItems = await db.outbox.toArray();

  for (const pending of pendingItems) {
    if (pending._id == null) continue;

    const payload = pending.payload ?? {};
    const payloadSiteFid = payload.site_fid ?? payload.siteFid ?? payload.siteRouteKey;

    if (payloadSiteFid !== siteFid) continue;

    await db.outbox.update(pending._id, {
      payload: {
        ...payload,
        site_id: Number(serverSiteId),
        siteId: Number(serverSiteId),
        siteFid,
        site_fid: siteFid,
        siteRouteKey: String(serverSiteId),
      },
    });
  }

  const searchRows = await db.search.toArray();

  for (const row of searchRows) {
    const searchRow: any = row;

    const rowSiteFid = row.site_fid ?? row.siteFid ?? row.siteRouteKey;

    if (rowSiteFid === siteFid) {
      await db.search.put({
        ...searchRow,
        site_id: Number(serverSiteId),
        siteId: Number(serverSiteId),
        site_fid: siteFid,
        siteFid,
        siteRouteKey: String(serverSiteId),
      } as any);
    }
  }

  const moriverRows = await db.moriver.toArray();

  for (const row of moriverRows) {
    const moriverRow: any = row;

    const rowSiteFid = moriverRow.site_fid ?? moriverRow.siteFid ?? moriverRow.siteRouteKey;

    if (rowSiteFid === siteFid) {
      await db.moriver.put({
        ...moriverRow,
        site_id: Number(serverSiteId),
        siteId: Number(serverSiteId),
        site_fid: siteFid,
        siteFid,
        siteRouteKey: String(serverSiteId),
      } as any);
    }
  }
}

async function patchSearchChildrenAfterCreate(searchItem: OutboxItem, searchResult: any) {
  if (searchItem.tableName !== 'ds_search') return;
  if (searchItem.op !== 'create') return;

  const serverSeId =
    searchResult.serverId ?? searchResult.json?.data ?? searchResult.json?.seId ?? searchResult.json?.se_id;

  if (!serverSeId) {
    console.warn('Search create synced but no se_id returned:', searchResult);
    return;
  }

  const searchPayload = searchItem.payload ?? {};
  const seFid = searchPayload.seFid ?? searchPayload.se_fid;

  if (!seFid) {
    console.warn('Search create synced but no seFid found:', searchItem);
    return;
  }

  const pendingItems = await db.outbox.toArray();

  console.log('Pending outbox items before patch:', pendingItems);

  for (const pending of pendingItems) {
    if (pending._id == null) continue;

    const payload = pending.payload ?? {};
    const payloadSeFid = payload.seFid ?? payload.se_fid;

    const isSearchUpdate =
      pending.tableName === 'ds_search' &&
      pending.op === 'update' &&
      (pending.clientId === searchItem.clientId || payloadSeFid === seFid);

    const isRelatedTelemetry = pending.tableName === 'ds_telemetry_fish' && payloadSeFid === seFid;

    if (!isSearchUpdate && !isRelatedTelemetry) continue;

    const updates: Partial<OutboxItem> = {
      payload: {
        ...payload,
        se_id: serverSeId,
        seId: serverSeId,
      },
    };

    if (isSearchUpdate) {
      updates.serverId = undefined;

      updates.payload = {
        ...updates.payload,
        t_id: undefined,
        tId: undefined,
      };
    }

    await db.outbox.update(pending._id, updates);

    const telemetryRows = await db.telemetry.where('seFid').equals(seFid).toArray();

    for (const row of telemetryRows) {
      await db.telemetry.put({
        ...row,
        se_id: serverSeId,
      });
    }
  }
}

async function patchMoriverChildrenAfterCreate(outboxItem: OutboxItem, dataResult: any) {
  if (outboxItem.tableName !== TableName.Moriver) return;
  if (outboxItem.op !== 'create') return;

  const serverMrId = dataResult.serverId ?? dataResult.json?.data ?? dataResult.json?.mrId ?? dataResult.json?.mr_id;

  if (!serverMrId) {
    console.warn('Search create synced but no mr_id returned:', dataResult);
    return;
  }

  const moriverPayload = outboxItem.payload ?? {};
  const mrFid = moriverPayload.mrFid ?? moriverPayload.mr_fid;

  if (!mrFid) {
    console.warn('Search create synced but no mrFid found:', outboxItem);
    return;
  }

  const pendingItems = await db.outbox.toArray();

  console.log('Pending outbox items before patch:', pendingItems);

  for (const pending of pendingItems) {
    if (pending._id == null) continue;

    const payload = pending.payload ?? {};
    const payloadMrFid = payload.mrFid ?? payload.mr_fid;

    const isMoriverUpdate =
      pending.tableName === TableName.Moriver &&
      pending.op === 'update' &&
      (pending.clientId === outboxItem.clientId || payloadMrFid === mrFid);

    const isRelatedFish = pending.tableName === TableName.Fish && payloadMrFid === mrFid;

    if (!isMoriverUpdate && !isRelatedFish) continue;

    const updates: Partial<OutboxItem> = {
      payload: {
        ...payload,
        mr_id: serverMrId,
        mrId: serverMrId,
      },
    };

    if (isMoriverUpdate) {
      updates.serverId = undefined;

      updates.payload = {
        ...updates.payload,
        f_id: undefined,
        fid: undefined,
      };
    }

    await db.outbox.update(pending._id, updates);

    // Inject MrId to Fish Data
    const fishRows = await db.fish.where('mrFid').equals(mrFid).toArray();

    for (const row of fishRows) {
      await db.fish.put({
        ...row,
        mr_id: serverMrId,
        mrId: serverMrId,
      });
    }
  }
}

async function patchFishChildrenAfterCreate(fishItem: OutboxItem, fishResult: any) {
  if (fishItem.tableName !== TableName.Fish) return;
  if (fishItem.op !== 'create') return;

  const serverFishId =
    fishResult.serverId ??
    (typeof fishResult.json === 'number' ? fishResult.json : undefined) ??
    fishResult.json?.f_id ??
    fishResult.json?.fId ??
    fishResult.json?.fid ??
    fishResult.json?.data?.f_id ??
    fishResult.json?.data?.fId ??
    fishResult.json?.data?.fid ??
    fishResult.json?.data(typeof fishResult?.json?.data === 'number' ? fishResult?.data : undefined);

  if (!serverFishId) {
    console.warn('Fish create synced but no fish ID was returned:', fishResult);
    return;
  }

  const fishPayload = fishItem.payload ?? {};

  const fishFid = fishPayload.fFid ?? fishPayload.f_fid;

  if (!fishFid) {
    console.warn('Fish create synced but no fFid was found:', fishItem);
    return;
  }

  const pendingItems = await db.outbox.toArray();

  for (const pending of pendingItems) {
    if (pending._id == null) continue;

    const isSupplemental = pending.tableName === TableName.Supplemental;
    const isProcedure = pending.tableName === TableName.Procedure;

    if (!isSupplemental && !isProcedure) {
      continue;
    }

    const payload = pending.payload ?? {};
    const payloadFishFid = payload.fFid ?? payload.f_fid;

    if (String(payloadFishFid) !== String(fishFid)) {
      continue;
    }

    await db.outbox.update(pending._id, {
      payload: {
        ...payload,
        fid: Number(serverFishId),
        fId: Number(serverFishId),
        f_id: Number(serverFishId),
        fFid: fishFid,
        f_fid: fishFid,
      },
    });
  }
  const supplementalRows = await db.supplemental.toArray();

  for (const row of supplementalRows) {
    const rowFishFid = row.fFid ?? row.f_fid;

    if (String(rowFishFid) !== String(fishFid)) {
      continue;
    }
    await db.supplemental.put({
      ...row,
      fid: Number(serverFishId),
      fId: Number(serverFishId),
      f_id: Number(serverFishId),
      fFid: fishFid,
      f_fid: fishFid,
    });
  }
  const procedureRows = await db.procedure.toArray();

  for (const row of procedureRows) {
    const rowFishFid = row.fFid ?? row.f_fid;

    if (String(rowFishFid) !== String(fishFid)) {
      continue;
    }

    await db.procedure.put({
      ...row,
      fid: Number(serverFishId),
      fId: Number(serverFishId),
      fFid: fishFid,
      f_fid: fishFid,
    });
  }
}

async function patchSupplementalChildrenAfterCreate(supplementalItem: OutboxItem, supplementalResult: any) {
  if (supplementalItem.tableName !== TableName.Supplemental) {
    return;
  }

  if (supplementalItem.op !== 'create') {
    return;
  }

  const serverSupplementalId =
    supplementalResult.serverId ??
    supplementalResult.json?.sid ??
    supplementalResult.json?.s_id ??
    supplementalResult.json?.sId ??
    supplementalResult.json?.id ??
    supplementalResult.json?.data?.sid ??
    supplementalResult.json?.data?.s_id ??
    supplementalResult.json?.data?.sId ??
    supplementalResult.json?.data?.id ??
    supplementalResult.json?.data;

  if (!serverSupplementalId) {
    console.warn('Supplemental create synced but no sid was returned:', supplementalResult);
    return;
  }

  const supplementalPayload = supplementalItem.payload ?? {};
  const fishFid = supplementalPayload.fFid ?? supplementalPayload.f_fid;

  if (!fishFid) {
    console.warn('Supplemental create synced but no fFid was found:', supplementalItem);
    return;
  }

  const pendingItems = await db.outbox.toArray();

  for (const pending of pendingItems) {
    if (pending._id == null) continue;

    if (pending.tableName !== TableName.Procedure) {
      continue;
    }

    const payload = pending.payload ?? {};
    const payloadFishFid = payload.fFid ?? payload.f_fid;

    if (String(payloadFishFid) !== String(fishFid)) {
      continue;
    }

    await db.outbox.update(pending._id, {
      payload: {
        ...payload,
        sid: Number(serverSupplementalId),
        s_id: Number(serverSupplementalId),
      },
    });
  }
  const procedureRows = await db.procedure.toArray();

  for (const row of procedureRows) {
    const rowFishFid = row.fFid ?? row.f_fid;

    if (String(rowFishFid) !== String(fishFid)) {
      continue;
    }
    await db.procedure.put({
      ...row,
      sid: Number(serverSupplementalId),
      s_id: Number(serverSupplementalId),
    });
  }
}

const saveSyncFailure = async (item: OutboxItem, message?: string, http?: number) => {
  if (item._id == null) return;

  const syncMessage = cleanSyncErrorMessage(message, http);

  await db.outbox.update(item._id, {
    syncError: syncMessage,
    syncHttp: http,
    lastSyncAttempt: Date.now(),
    syncAttempts: (item.syncAttempts ?? 0) + 1,
  });
};

export async function syncNow(token?: string): Promise<SyncResult> {
  if (!isOnline()) {
    return { tried: 0, ok: 0, errors: 0, conflicts: 0, draftSkip: 0 };
  }

  if (!token) {
    console.warn('Sync skipped: missing auth token. Use manual Sync button after login.');
    return { tried: 0, ok: 0, errors: 1, conflicts: 0, draftSkip: 0 };
  }

  const items = (await db.outbox.toArray()).sort(
    (a, b) => (tablePriority[a.tableName] ?? 99) - (tablePriority[b.tableName] ?? 99) || a.ts - b.ts
  );

  if (!items.length) {
    return { tried: 0, ok: 0, errors: 0, conflicts: 0, draftSkip: 0 };
  }

  let ok = 0;
  let errors = 0;
  let conflicts = 0;
  let draftSkip = 0;

  for (const itemSnap of items) {
    try {
      if (!itemSnap.tableName) {
        console.warn('Skipping outbox item with missing tableName', itemSnap);
        errors++;
        continue;
      }

      if (itemSnap._id == null) {
        console.warn('Skipping outbox item without _id:', itemSnap);
        errors++;
        continue;
      }

      const item = await db.outbox.get(itemSnap._id);

      if (!item) {
        console.log('Outbox item already removed, skipping:', itemSnap._id);
        continue;
      }

      console.log('Syncing outbox item:', item);

      const table: any = getTable(item.tableName);
      const localRow: any = await table.get(item.clientId);

      const dependencyIssue = await getSyncDependencyError(item);

      if (dependencyIssue) {
        console.warn('Sync dependency issue:', {
          outboxId: item._id,
          tableName: item.tableName,
          clientId: item.clientId,
          message: dependencyIssue,
        });
        errors++;

        await saveSyncFailure(item, dependencyIssue);
        continue;
      }

      if (item.tableName === TableName.Supplemental && item.op === 'create') {
        const payload = item.payload ?? {};
        const fishId = Number(payload.f_id ?? payload.fid ?? payload.fId ?? 0);

        if (!Number.isFinite(fishId) || fishId <= 0) {
          console.warn('Skipping Supplemental because Fish has not synced yet:', {
            outboxId: item._id,
            clientId: item.clientId,
            f_id: payload.f_id,
            fid: payload.fid,
            fId: payload.fId,
            fFid: payload.fFid ?? payload.f_fid,
          });
          draftSkip++;
          continue;
        }
      }

      if (item.tableName === TableName.Procedure && item.op === 'create') {
        const payload = item.payload ?? {};
        const supplementalId = Number(payload.s_id ?? payload.sid ?? 0);

        if (!Number.isFinite(supplementalId) || supplementalId <= 0) {
          console.warn('Skipping Procedure because Supplemental has not synced yet:', {
            outboxId: item._id,
            clientId: item.clientId,
            s_id: payload.s_id,
            sid: payload.sid,
            fFid: payload.fFid ?? payload.f_fid,
          });
          draftSkip++;
          continue;
        }
      }

      const res: any = await pushOutboxItem(item, token);

      console.log('Sync result:', res);

      if (res.status === 'ok') {
        ok++;

        await db.transaction('rw', db.outbox, table, async () => {
          console.log('Deleting synced outbox item:', item._id);
          await db.outbox.delete(item._id!);

          const currentRow = await table.get(item.clientId);
          if (!currentRow) {
            console.warn('No local row found after successful sync:', item.clientId);
            return;
          }

          await table.put({
            ...currentRow,
            serverId: res.serverId ?? currentRow.serverId,
            version: res.serverVersion ?? (currentRow.version ?? 0) + 1,
            updatedAt: res.lastUpdated ?? new Date().toISOString(),
            _status: 'synced',
            ...(res.json ?? {}),
          });
        });

        await patchSiteChildrenAfterCreate(item, res);
        await patchSearchChildrenAfterCreate(item, res);
        await patchMoriverChildrenAfterCreate(item, res);
        await patchFishChildrenAfterCreate(item, res);
        await patchSupplementalChildrenAfterCreate(item, res);
      } else if (res.status === 'conflict') {
        conflicts++;

        await saveSyncFailure(
          item,
          'This record conflicts with a newer server version. Review the record before syncing again.',
          409
        );

        if (localRow) {
          await table.put({
            ...localRow,
            _status: 'conflict',
          });
        }
      } else {
        errors++;
        await saveSyncFailure(item, res.message, 'http' in res ? res.http : undefined);
        console.warn('Sync failed. Keeping item in outbox:', {
          item,
          result: res,
        });
      }
    } catch (err: any) {
      console.error('Sync error:', itemSnap, err);
      errors++;
      await saveSyncFailure(itemSnap, err?.message ?? 'Unexpected sync error');
    }
  }

  return {
    tried: items.length,
    ok,
    errors,
    conflicts,
    draftSkip,
  };
}

export async function getPendingCount(): Promise<number> {
  return db.outbox.count();
}

export function scheduleAutoSync(intervalMs = 15000) {
  let timer: number | undefined;

  const start = () => {
    stop();

    timer = window.setInterval(() => {
      if (isOnline()) {
        console.warn('Scheduled auto-sync skipped: auth token required. Use manual Sync button.');
      }
    }, intervalMs);
  };

  const stop = () => {
    if (timer != null) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };

  return { start, stop };
}

export function registerOnlineSyncListener() {
  const handler = () => {
    if (isOnline()) {
      void syncNow();
    }
  };

  window.addEventListener('online', handler);

  return () => {
    window.removeEventListener('online', handler);
  };
}
