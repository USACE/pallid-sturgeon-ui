// purpose: one place for http calls & offline queuing for the Missouri River page

import { db } from "./db";
import type { MoRiverEntry, OutboxItem } from "./db";

// const _env: any = (import.meta as any)?.env || {};
const API_BASE = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? '';
const MORIVER_URL = `${API_BASE}/psapi/moriverDataEntry`;

async function buildJsonHeadersAsync(): Promise<HeadersInit> {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  const g: any = (window as any).getAuthTokenAsync;
  console.log('G man: ', g);
  if (typeof g === 'function') {
    const token = await g();
    console.log('Here we go: ', token);
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const isOnline = () => navigator.onLine;

// --- utilities ---

/** only include fields we actually send to the server (no client-only keys) */
function toServerDto(e: Partial<MoRiverEntry>): Record<string, any> {
  // map 1:1 to ds_moriver column names you edit
  // exclude client-only fields
  const { clientId, serverId, version, updatedAt, _status, ...rest } = e;
  // if server needs mr_id on update, include it when we have it
  if (serverId != null) {
    (rest as any).mr_id = serverId;
  }
  return rest;
}

/** merge helper: write into moriver table safely */
async function upsertLocal(entry: Partial<MoRiverEntry> & { clientId: string }) {
  const current = await db.moriver.get(entry.clientId);

  const merged: MoRiverEntry = {
    version: current?.version ?? 0,
    _status: current?._status,
    ...(current ?? {}),
    ...entry,
  };

  await db.moriver.put(merged);
}

/** queue an outbox item */
async function queueOp(op: OutboxItem['op'], entry: MoRiverEntry, changes?: Partial<MoRiverEntry>) {
  await db.outbox.add({
    entity: 'ds_moriver',
    op,
    clientId: entry.clientId,
    serverId: entry.serverId,
    payload: changes ?? entry,
    clientVersion: entry.version ?? 0,
    ts: Date.now(),
  });
  const count = await db.outbox.count();
  console.log('[queueOp] outbox count after add=', count);
}

// --- CRUD (create/update/delete) ---

/**
 * create a MoRiver row
 * - online: POST to API, write canonical server copy, store serverId/version
 * - offline/failure: queue create, write optimistic local copy
 */
export async function createMoRiver(entry: MoRiverEntry) {
  // ensure have clientId (offline identity)
  const clientId = entry.clientId ?? crypto.randomUUID();

  // this is what we store locally
  const local: MoRiverEntry = {
    ...entry,
    clientId,
    serverId: entry.serverId ?? undefined,
    _status: 'queued',
    version: entry.version ?? 0,
  };

  await db.moriver.put(local);

  await queueOp('create', local);

  // await db.outbox.add({
  //   entity: 'ds_moriver',
  //   op: 'create',
  //   clientId,
  //   serverId: local.serverId,
  //   payload: local,
  //   clientVersion: local.version ?? 0,
  //   ts: Date.now(),
  // });

  return { queued: true, clientId };
}

/**
 * update a MoRiver row (partial)
 * - always updates local copy immediately
 * - online: try PUT; else queue update
 */
export async function updateMoRiver(clientId: string, changes: Partial<MoRiverEntry>) {
  const current = await db.moriver.get(clientId);
  if (!current) throw new Error(`No local record for clientId=${clientId}`);

  // optimistic local merge
  await upsertLocal({ clientId, ...changes, _status: isOnline() ? current._status ?? 'synced' : 'queued' });

  if (!isOnline()) {
    await queueOp('update', { ...current, ...changes }, changes);
    return { queued: true, clientId };
  }

  try {
    // prefer serverId for endpoint if you have it; fallback to clientId path if your API supports it
    const targetId = current.serverId != null ? current.serverId : clientId;
    const res = await fetch(`${API_BASE}/psapi/moriverDataEntry/${encodeURIComponent(String(targetId))}`, {
      method: 'PUT',
      headers: await buildJsonHeadersAsync(),
      body: JSON.stringify({
        ...toServerDto({ ...current, ...changes }),
        clientVersion: current.version ?? 0,
      }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();

    const serverVersion = (json.version as number) ?? (current.version ?? 0) + 1;
    const lastUpdated = (json.last_updated as string) ?? new Date().toISOString();

    await upsertLocal({
      clientId,
      serverId: json.mr_id ?? current.serverId,
      version: serverVersion,
      updatedAt: lastUpdated,
      _status: 'synced',
      ...json,
    });

    return { synced: true, clientId };
  } catch {
    await queueOp('update', { ...current, ...changes }, changes);
    await upsertLocal({ clientId, _status: 'queued' });
    return { queued: true, clientId };
  }
}
/**
 * delete a MoRiver row
 * - online: try DELETE; else queue delete
 * - local: remove immediately for snappy UX
 */
export async function deleteMoRiver(clientId: string) {
  const current = await db.moriver.get(clientId);
  if (!current) return { ok: true };

  // remove locally first
  await db.moriver.delete(clientId);

  if (!isOnline()) {
    await queueOp('delete', current);
    return { queued: true, clientId };
  }

  try {
    const targetId = current.serverId != null ? current.serverId : clientId;
    const res = await fetch(`${API_BASE}/psapi/moriverDataEntry/${encodeURIComponent(String(targetId))}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(String(res.status));
    return { synced: true, clientId };
  } catch {
    // if delete failed online, re-add to outbox and restore local row
    await upsertLocal(current);
    await queueOp('delete', current);
    return { queued: true, clientId };
  }
}

// --- sync ---

/** push the entire outbox in one batch to Go: POST /api/v1/sync/push */
export async function pushOutboxItem(
  it: OutboxItem
): Promise<
  | { status: 'ok'; serverId?: number; serverVersion?: number; lastUpdated?: string; json?: any }
  | { status: 'error'; http?: number }
  | { status: 'skipped' }
> {
  const payload = it.payload ? toServerDto(it.payload) : {};
  const method = it.op === 'create' ? 'POST' : it.op === 'update' ? 'PUT' : null;

  if (!method) {
    return { status: 'skipped' };
  }

  if (it.op === 'update' && it.serverId != null) {
    (payload as any).mr_id = it.serverId;
  }

  (payload as any).clientVersion = it.clientVersion ?? 0;

  const res = await fetch(MORIVER_URL, {
    method,
    headers: await buildJsonHeadersAsync(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return { status: 'error', http: res.status };
  }

  const json = await res.json().catch(() => ({}));

  return {
    status: 'ok',
    serverId: json.mr_id as number | undefined,
    serverVersion: (json.version as number) ?? undefined,
    lastUpdated: (json.last_updated as string) ?? undefined,
    json,
  };
}

/** pull changes since a cursor: GET /api/v1/sync/pull?since=... */
export async function pullSinceCursor() {
  const cursorKV = await db.meta.get('cursor');
  const since = cursorKV?.value ?? '';
  const res = await fetch(`${API_BASE}/api/v1/sync/pull?since=${encodeURIComponent(since)}`);
  if (!res.ok) throw new Error(String(res.status));
  const json = await res.json();

  // expect shape:
  const list = json?.changes?.ds_moriver ?? [];

  await db.transaction('rw', db.moriver, db.meta, async () => {
    for (const srv of list) {
      if (srv.deleted) {
        // remove by serverId; find by serverId then delete local
        const all = await db.moriver.toArray();
        const hit = all.find((r) => r.serverId === srv.mr_id);
        if (hit) await db.moriver.delete(hit.clientId);
      } else {
        const all = await db.moriver.toArray();
        const existing = all.find((r) => r.serverId === srv.mr_id);
        const clientId = existing?.clientId ?? crypto.randomUUID?.() ?? Math.random().toString().slice(2);
        await db.moriver.put({
          ...(existing ?? { clientId }),
          ...srv,
          serverId: srv.mr_id,
          version: srv.version ?? (existing?.version ?? 0) + 1,
          updatedAt: srv.last_updated ?? new Date().toISOString(),
          _status: 'synced',
        } as MoRiverEntry);
      }
    }
    if (json.cursor) await db.meta.put({ key: 'cursor', value: json.cursor });
  });

  return { pulled: list.length };
}

interface MesoApiRow {
  code: string;
  label: string;
}

export async function fetchAndCacheMesoOptions(macro: string, officeId?: string) {
  const res = await fetch(`${API_BASE}/psapi/meso?macro=${encodeURIComponent(macro)}`, {
    method: 'GET',
    headers: await buildJsonHeadersAsync(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch meso options (${res.status})`);
  }

  const json = (await res.json()) as MesoApiRow[];

  await db.mesoOptions.where('macro').equals(macro).delete();

  const now = new Date().toISOString();

  await db.mesoOptions.bulkAdd(
    json.map((row) => ({
      macro,
      code: row.code,
      label: row.label,
      officeId,
      updatedAt: now,
    }))
  );
  return json;
}

export async function getMesoOptions(macro: string, officeId?: string) {
  if (isOnline()) {
    try {
      const rows = await fetchAndCacheMesoOptions(macro, officeId);
      return rows.map((r) => ({ value: r.code, label: r.label }));
    } catch (e) {
      console.warn('Failed to fetch meso options online, falling back to cache', e);
    }
  }

  const cached = await db.mesoOptions.where('macro').equals(macro).toArray();

  return cached.map((r) => ({ value: r.code, label: r.label }));
}
