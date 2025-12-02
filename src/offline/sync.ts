// push-only sync orchestrator for MoRiver outbox (no pull endpoint yet)
// - flush queued creates/updates using /psapi/moriverDataEntry
// - update local rows with serverId/version/updatedAt on success
// - mark conflicts if backend signals one in the JSON (adjust condition when known)

import { db } from './db';
import { isOnline, pushOutboxItem } from './api';
import type { OutboxItem } from './db';

export type SyncResult = {
  tried: number;
  ok: number;
  errors: number;
  conflicts: number;
};

export async function syncNow(): Promise<SyncResult> {
  if (!isOnline()) return { tried: 0, ok: 0, errors: 0, conflicts: 0 };

  const items = await db.outbox.orderBy('ts').toArray();
  if (!items.length) return { tried: 0, ok: 0, errors: 0, conflicts: 0 };

  let ok = 0,
    errors = 0,
    conflicts = 0;

  // process sequentially (MVP), you can parallelize later with small concurrency
  for (const it of items) {
    try {
      const res: any = await pushOutboxItem(it);

      if (res.status === 'ok') {
        ok++;
        await db.transaction('rw', db.outbox, db.moriver, async () => {
          // remove the outbox item
          await db.outbox.delete(it._id!);

          // update the local row with server identity + version stamps
          const row = await db.moriver.get(it.clientId);

          if (row) {
            await db.moriver.put({
              ...row,
              serverId: res.serverId ?? row.serverId,
              version: res.serverVersion ?? (row.version ?? 0) + 1,
              updatedAt: res.lastUpdated ?? row.updatedAt ?? new Date().toISOString(),
              _status: 'synced',
              ...(res.json ?? {}),
            });
          }
        });
      } else if (res.status === 'conflict') {
        conflicts++;
      } else {
        errors++;
        // leave item in outbox; UI will still show "Queued", optionally set a retry/backoff
      }
    } catch (e) {
      console.error('Error syncing outbox item', e);
      errors++;
      // network error - leave item in outbox
    }
  }

  return { tried: items.length, ok, errors, conflicts };
}

/** utility to count queued items (for a header badge) */
export async function getPendingCount(): Promise<number> {
  return db.outbox.count();
}

/** hook-like polling you can call from a React effect if you want periodic sync when online */
export function scheduleAutoSync(intervalMs = 15000) {
  let timer: number | undefined;
  const start = () => {
    stop();
    timer = window.setInterval(() => {
      if (isOnline()) void syncNow();
    }, intervalMs);
  };
  const stop = () => {
    if (timer != null) window.clearInterval(timer);
    timer = undefined;
  };
  return { start, stop };
}
