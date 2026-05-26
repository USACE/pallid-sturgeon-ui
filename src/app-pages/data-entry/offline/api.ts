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

function formatPayloadForApi(entry: Partial<DataEntry>): Record<string, any> {
  const { clientId, serverId, version, updatedAt, _status, ...serverPayload } = entry;

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

async function addToSyncQueue(
  entityKey: EntityKey,
  op: OutboxItem['op'],
  entry: DataEntry & { clientId: string },
  payload?: Partial<DataEntry>
) {
  const config = API_CONFIG[entityKey];
  await db.outbox.add({
    tableName: config.tableName,
    op,
    clientId: entry.clientId,
    serverId: entry.serverId,
    payload: payload ?? entry,
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

  const payload = item.payload ? formatPayloadForApi(item.payload) : {};

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
      requestOptions.body = JSON.stringify(payload);
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
      json?.[config.idField] ??
      json?.data?.[config.idField] ??
      json?.data?.seId ??
      json?.data?.se_id ??
      json?.data?.tId ??
      json?.data?.t_id ??
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
