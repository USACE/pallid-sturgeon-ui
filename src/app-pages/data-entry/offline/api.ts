import { db } from './db';
import type { DataEntry, OutboxItem } from './db';

// why do I need this? 
const API_BASE = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? '';

export config API_CONFIG = {
    sites: {
        table: db.sites,
        endpoint: /* endpoint URL - find in API/network tab */,
        idField: /* primary key found in DB */,
    },
    /* complete also for moriver, search, fish, telemetry, supplemental, procedure */
};

async function getAuthHeaders(): Promise<HeadersInit> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const getToken = (window as any).getAuthTokenAsync;

    if (typeof getToken === 'function') {
        try {
            const token = await getToken();
            if (token) headers.Authorization = `Bearer ${token}`;
        } catch (e) {
            console.warn('Token fetch failed', e);
        }
    }
    return headers;
}

export const isOnline = () => navigator.onLine;

function toServerDto(entry: Partial<DataEntry>) {
    const { clientId, _status, ...rest } = entry;
    return rest;
}

async function upsertLocal(
    table: any,
    entry: Partial<DataEntry> & { clientId: string }
) {
    const current = await table.get(entry.clientId);
    
    const merged: DataEntry = {
        ...(current ?? {}),
        ...entry,
    };
    await table.put(merged);
}

async function queueOp(
    entity: string,
    op: OutboxItem['op'],
    entry: DataEntry,
    payload?: Partial<DataEntry>
) {
    await db.outbox.add({
        entity,
        op,
        clientId: entry.clientId,
        serverId: entry.serverId,
        payload: payload ?? entry,
        clientVersion: entry.version ?? 0,
        ts: Date.now(),
    });
}

export async function createData(
    entityKey: keyof typeof API_CONFIG,
    entry: DataEntry,
) {
    const config = API_CONFIG[entityKey];

    const clientId = entry.clientId ?? crypto.randomUUID();

    const local: DataEntry = {
        ...entry,
        clientId,
        _status: 'queued',
        version: 0,
    };

    await config.table.put(local);

    await queueOp(entityKey, 'create', local, local);

    return { queued: true, clientId };
}

export async function updateData(
    entityKey: keyof typeof API_CONFIG,
    clientId: string,
    changes: Partial<DataEntry>,
) {
    const config = API_CONFIG[entityKey];

    const current = await config.table.get(clientId);
    if (!current) throw new Error('Record not found');

    const updated = { ...current, ...changes };

    await upsertLocal(config.table, {
        ...updated,
        _status: isOnline() ? 'synced' : 'queued',
    });

    if (!isOnline()) {
        await queueOp(entityKey, 'update', updated, changes);
        return { queued: true };
    }

    try {
        const res = await fetch(`${API_BASE}${config.endpoint}`, {
            method: 'PUT',
            headers: await getAuthHeaders(),
            body: JSON.stringify(toServerDto(updated)),
        });

        if (!res.ok) throw new Error();

        return { synced: true };
    } catch {
        await queueOp(entityKey, 'update', updated, changes);
        return { queued: true };
    }
}

export async function deleteData(
    entityKey: keyof typeof API_CONFIG,
    clientId: string,
) {
    const config = API_CONFIG[entityKey];

    const current = await config.table.get(clientId);
    if (!current) return;

    await config.table.delete(clientId);

    if (!isOnline()) {
        await queueOp(entityKey, 'delete', current);
        return { queued: true };
    }

    try {
        await fetch(`${API_BASE}${config.endpoint}/${current.serverId}`, {
            method: 'DELETE',
            headers: await getAuthHeaders(),
        });
        return { synced: 'true'};
    } catch {
        await queueOp(entityKey, 'delete', current);
        return { queued: true };
    }
}

export async function pushOutboxItem(item: OutboxItem) {
    const config = API_CONFIG[item.entity as keyof typeof API_CONFIG];

    const method = 
    item.op === 'create'
    ? 'POST'
    : item.op === 'update'
    ? 'PUT'
    : item.op === 'delete'
    ? 'DELETE'
    : null;

    if (!method) return { status: 'skipped' };

    const res = await fetch(`${API_BASE}${config.endpoint}`, {
        method,
        headers: await getAuthHeaders(),
        body: JSON.stringify(item.payload ?? {}),
    });

    if (!res.ok) {
        return { status: 'error', http: res.status};
    }
    return { status: 'ok'};
}