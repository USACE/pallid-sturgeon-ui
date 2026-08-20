import { number } from 'yup';
import { db } from './db';
import type { DataEntry, OutboxItem } from './db';

// why do I need this?
const API_BASE = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? '';

type EntityKey = 'sites' | 'search' | 'moriver' | 'fish' | 'supplemental' | 'procedure' | 'telemetry';

type OutboxTable = OutboxItem['tableName'];

type ApiConfigItem = {
  table: any;
  tableName: OutboxTable;
  idField: string;

  endpoints: {
    get?: string;
    create?: string;
    update?: string;
  };
};

export const API_CONFIG: Record<EntityKey, ApiConfigItem> = {
  sites: {
    table: db.sites,
    tableName: 'ds_sites',
    idField: 'site_id',

    endpoints: {
      create: '/psapi/Sites/addSite',
      update: '/psapi/Sites/updateSite',
      get: '/psapi/Sites/getSites',
    },
  },
  moriver: {
    table: db.moriver,
    tableName: 'ds_moriver',
    idField: 'mr_id',

    endpoints: {
      create: '/psapi/DataEntry/addMoriverDataEntry',
      update: '/psapi/DataEntry/updateMoriverDataEntry',
      get: '/psapi/DataEntry/getMoriverDataEntry',
    },
  },
  search: {
    table: db.search,
    tableName: 'ds_search',
    idField: 'se_id',

    endpoints: {
      create: '/psapi/searchDataEntry',
      update: '/psapi/searchDataEntry',
      get: '/psapi/searchDataEntry',
    },
  },
  fish: {
    table: db.fish,
    tableName: 'ds_fish',
    idField: 'f_id',

    endpoints: {
      create: '/psapi/fishDataEntry',
      update: '/psapi/fishDataEntry',
      get: '/psapi/fishDataEntry',
    },
  },
  telemetry: {
    table: db.telemetry,
    tableName: 'ds_telemetry_fish',
    idField: 't_id',

    endpoints: {
      create: '/psapi/telemetryDataEntry',
      update: '/psapi/telemetryDataEntry',
      get: '/psapi/telemetryDataEntry',
    },
  },
  supplemental: {
    table: db.supplemental,
    tableName: 'ds_supplemental',
    idField: 's_id',

    endpoints: {
      create: '/psapi/supplementalDataEntry',
      update: '/psapi/supplementalDataEntry',
      get: '/psapi/supplementalDataEntry',
    },
  },
  procedure: {
    table: db.procedure,
    tableName: 'ds_procedure',
    idField: 'id',

    endpoints: {
      create: '/psapi/procedureDataEntry',
      update: '/psapi/procedureDataEntry',
      get: '/psapi/procedureDataEntry',
    },
  },
};

const getConfigByTableName = (tableName: OutboxTable) => {
  return Object.values(API_CONFIG).find((config) => config.tableName === tableName);
};

function getAuthHeaders(token?: string): HeadersInit {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}

export const isOnline = () => navigator.onLine;

function toSiteServerPayload(entry: any) {
  return {
    ...entry,

    site_id: entry.site_id ?? entry.siteId,
    site_fid: entry.site_fid ?? entry.siteFid,
    project_id: entry.project_id ?? entry.projectId,
    segment_id: entry.segment_id ?? entry.segmentId,
    sample_unit_type: entry.sample_unit_type ?? entry.sampleUnitType,
    bend_river_mile: entry.bend_river_mile ?? entry.bendrivermile,
    edit_initials: entry.edit_initials ?? entry.editInitials,
    uploaded_by: entry.uploaded_by ?? entry.uploadedBy,
    last_updated: entry.last_updated ?? entry.lastUpdated,
    upload_filename: entry.upload_filename ?? entry.uploadFilename,
    upload_session_id: entry.upload_session_id ?? entry.uploadSessionId,
  };
}

function getNumberValue(value: any) {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const numberValue = Number(value);

  return Number.isNaN(numberValue) ? null : numberValue;
}

function toFishServerPayload(entry: any) {
  return {
    ...entry,
    project: getNumberValue(entry?.project ?? entry?.projectId ?? entry?.project_id),
    segment: getNumberValue(entry?.segment ?? entry?.segmentId ?? entry?.segment_id),
    siteId: getNumberValue(entry?.siteId ?? entry?.site_id),
    mrId: getNumberValue(entry?.mrId ?? entry?.mr_id),
  };
}

function toTelemetryServerPayload(entry: any) {
  const payload = {
    ...entry,
  };

  // remove local aliases
  delete payload.site_id;
  delete payload.se_id;
  delete payload.bendrivermile;
  delete payload.bend_river_mile;

  return {
    ...payload,
    siteId: getNumberValue(entry?.siteId ?? entry?.site_id),
    seId: getNumberValue(entry?.seId ?? entry?.se_id),
    bendRiverMile: getNumberValue(entry?.bendRiverMile ?? entry?.bend_river_mile ?? entry?.bendrivermile),
  };
}

function formatPayloadForApi(entry: Partial<DataEntry>, tableName?: OutboxTable): Record<string, any> {
  const {
    clientId,
    serverId,
    version,
    updatedAt,
    _status,
    localDisplayId,
    fishClientId,
    suppClientId,
    _isPlaceholderRows,
    _isTouched,
    ...serverPayload
  } = entry as any;

  if (tableName === 'ds_sites') {
    return toSiteServerPayload(serverPayload);
  }
  if (tableName === 'ds_fish') {
    return toFishServerPayload(serverPayload);
  }
  if (tableName === 'ds_telemetry_fish') {
    return toTelemetryServerPayload(serverPayload);
  }

  return serverPayload;
}

async function saveLocalData(table: any, entry: Partial<DataEntry> & { clientId: string }) {
  const current = await table.get(entry.clientId);

  const merged = {
    ...(current ?? {}),
    ...entry,
  };
  await table.put(merged);
}

function getOfflineRecordKey(tableName: OutboxTable, payload: any): string | undefined {
  if (!payload) return undefined;
  switch (tableName) {
    case 'ds_sites':
      return payload.siteFid ?? payload.site_fid;
    case 'ds_moriver':
      return payload.mrFid ?? payload.mr_fid;
    case 'ds_search':
      return payload.seFid ?? payload.se_fid;
    case 'ds_fish':
      return payload.fFid ?? payload.f_fid;
    case 'ds_telemetry_fish':
      return payload.tFid ?? payload.t_fid ?? payload.clientId;
    case 'ds_supplemental':
      return payload.fFid ?? payload.f_fid;
    case 'ds_procedure':
      return payload.fFid ?? payload.f_fid;
    default:
      return undefined;
  }
}

async function addToSyncQueue(
  entityKey: EntityKey,
  op: OutboxItem['op'],
  entry: DataEntry & { clientId: string },
  payload?: Partial<DataEntry>
) {
  const config = API_CONFIG[entityKey];
  const nextPayload = payload ?? entry;

  const nextOfflineKey = getOfflineRecordKey(config.tableName, nextPayload);

  const outboxItems = await db.outbox.toArray();

  const existingItem = outboxItems.find((item) => {
    if (item.tableName !== config.tableName) {
      return false;
    }
    if (item.clientId === entry.clientId) {
      return true;
    }

    const existingOfflineKey = getOfflineRecordKey(item.tableName, item.payload);

    return (
      nextOfflineKey != null && existingOfflineKey != null && String(existingOfflineKey) === String(nextOfflineKey)
    );
  });

  if (existingItem?._id != null) {
    const finalOp = existingItem.op === 'create' ? 'create' : op;

    console.warn('Updating existing outbox item instead of adding another:', {
      tableName: config.tableName,
      previousClientId: existingItem.clientId,
      nextClientId: entry.clientId,
      offlineKey: nextOfflineKey,
      previousOp: existingItem.op,
      requestedOp: op,
      finalOp,
    });

    await db.outbox.update(existingItem._id, {
      clientId: entry.clientId,
      op: finalOp,
      serverId: entry.serverId,
      payload: nextPayload,
      clientVersion: entry.version ?? 0,
      ts: Date.now(),
    });
    return;
  }
  await db.outbox.add({
    tableName: config.tableName,
    op,
    clientId: entry.clientId,
    serverId: entry.serverId,
    payload: nextPayload,
    clientVersion: entry.version ?? 0,
    ts: Date.now(),
  });
}

export async function createData(entityKey: EntityKey, entry: DataEntry) {
  const config = API_CONFIG[entityKey];

  const clientId = entry.clientId ?? crypto.randomUUID();

  const local: DataEntry = {
    ...entry,
    clientId,
    serverId: entry.serverId ?? undefined,
    version: entry.version ?? 0,
    _status: 'queued',
  };

  await config.table.put(local);

  await addToSyncQueue(entityKey, 'create', local, local);

  return { queued: true, clientId };
}

export async function updateData(entityKey: EntityKey, clientId: string, changes: Partial<DataEntry>) {
  const config = API_CONFIG[entityKey];

  const current = await config.table.get(clientId);
  if (!current) {
    throw new Error('Record not found');
  }

  const updated = { ...current, ...changes, _status: 'queued' };

  await saveLocalData(config.table, updated);
  await addToSyncQueue(entityKey, 'update', updated, updated);

  return {
    queued: true,
    clientId,
  };
}

export async function deleteData(entityKey: EntityKey, clientId: string) {
  const config = API_CONFIG[entityKey];

  const current = await config.table.get(clientId);
  if (!current) {
    return { ok: true };
  }

  await config.table.delete(clientId);

  return { queued: true, clientId };
}

export async function pushOutboxItem(
  item: OutboxItem,
  token?: string
): Promise<
  | {
      status: 'ok';
      serverId?: number;
      serverVersion?: number;
      lastUpdated?: string;
      json?: any;
    }
  | {
      status: 'error';
      http?: number;
      message?: string;
    }
  | {
      status: 'skipped';
      message?: string;
    }
> {
  const config = getConfigByTableName(item.tableName);

  if (!config) {
    return {
      status: 'skipped',
      message: `No API_CONFIG found for entity=${item.tableName}`,
    };
  }

  const endpoint =
    item.op === 'create' ? config.endpoints.create : item.op === 'update' ? config.endpoints.update : undefined;

  if (!endpoint) {
    return {
      status: 'skipped',
      message: `No endpoint configured for ${item.tableName}.${item.op}`,
    };
  }

  const method =
    item.op === 'create' ? 'POST' : item.op === 'update' ? 'PUT' : item.op === 'delete' ? 'DELETE' : undefined;

  if (!method) {
    return {
      status: 'skipped',
      message: `Unsupported operation: ${item.op}`,
    };
  }

  const payload = item.payload ? formatPayloadForApi(item.payload, item.tableName) : {};

  if (item.tableName === 'ds_telemetry_fish') {
    const rawPayload = item.payload as any;

    delete payload.bendrivermile;
    delete payload.bend_river_mile;

    payload.bendRiverMile = getNumberValue(
      rawPayload?.bendRiverMile ?? rawPayload?.bend_river_mile ?? rawPayload?.bendrivermile
    );

    delete payload.site_id;
    delete payload.se_id;

    payload.siteId = getNumberValue(rawPayload?.siteId ?? rawPayload?.site_id);
    payload.seId = getNumberValue(rawPayload?.seId ?? rawPayload?.se_id);
  }

  if (item.tableName === 'ds_telemetry_fish') {
    console.log('Final Telemetry Sync Payload', payload);
    console.log('Telemetry Bend River Mile Check', {
      value: payload.bendRiverMile,
      type: typeof payload.bendRiverMile,
      bendrivermile: payload.bendrivermile,
      bend_river_mile: payload.bend_river_mile,
    });
  }

  if (item.tableName === 'ds_telemetry_fish' && item.op === 'create') {
    delete payload.t_id;
    delete payload.tId;
  }

  if (item.serverId != null && item.op !== 'create') {
    payload[config.idField] = item.serverId;
  }

  payload.clientVersion = item.clientVersion ?? 0;

  try {
    const requestOptions: RequestInit = {
      method,
      headers: getAuthHeaders(token),
    };

    if (method !== 'DELETE') {
      requestOptions.body = JSON.stringify(payload, (key, value) => {
        if (item.tableName === 'ds_telemetry_fish' && (key === 'bendrivermile' || key === 'bend_river_mile')) {
          return undefined;
        }
        return value;
      });
    }

    if (item.tableName === 'ds_telemetry_fish') {
      console.error('Telemetry Body Request', requestOptions.body);
    }

    const res = await fetch(`${API_BASE}${endpoint}`, requestOptions);

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');

      return {
        status: 'error',
        http: res.status,
        message: errorText || `HTTP ${res.status}`,
      };
    }

    const json = await res.json().catch(() => ({}));

    const returnedServerId =
      (typeof json === 'number' ? json : undefined) ??
      json?.[config.idField] ??
      json?.siteId ??
      json?.site_id ??
      json?.data?.[config.idField] ??
      json?.mrId ??
      json?.mr_id ??
      json?.seId ??
      json?.se_id ??
      json?.tId ??
      json?.t_id ??
      json?.fId ??
      json?.f_id ??
      json?.fid ??
      json?.sId ??
      json?.s_id ??
      json?.sid ??
      json?.data?.siteId ??
      json?.data?.site_id ??
      json?.data?.mrId ??
      json?.data?.mr_id ??
      json?.data?.seId ??
      json?.data?.se_id ??
      json?.data?.tId ??
      json?.data?.t_id ??
      json?.data?.fId ??
      json?.data?.fid ??
      json?.data?.f_id ??
      json?.data?.sId ??
      json?.data?.s_id ??
      json?.data?.sid ??
      (typeof json?.data === 'number' ? json.data : undefined);

    return {
      status: 'ok',
      serverId: returnedServerId,
      serverVersion: json?.version,
      lastUpdated: json?.last_updated ?? json?.lastUpdated,
      json,
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: error?.message ?? 'Unknown sync error',
    };
  }
}
