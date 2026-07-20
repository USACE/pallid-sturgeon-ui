import { db, type OutboxItem } from './db';
import { pushOutboxItem } from './api';
import { server } from 'typescript';

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
      } else if (res.status === 'conflict') {
        conflicts++;

        if (localRow) {
          await table.put({
            ...localRow,
            _status: 'conflict',
          });
        }
      } else {
        errors++;
        console.warn('Sync failed. Keeping item in outbox:', {
          item,
          result: res,
        });
      }
    } catch (err) {
      console.error('Sync error:', itemSnap, err);
      errors++;
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
