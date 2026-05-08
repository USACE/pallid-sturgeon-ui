import { db, type OutboxItem } from './db';
import { pushOutboxItem } from './api';

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
  ds_telemetry_fish: 3,
  ds_moriver: 4,
  ds_fish: 5,
  ds_supplemental: 6,
  ds_procedure: 7,
};

function getTable(tableName: string) {
  switch (tableName) {
    case 'sites':
      return db.sites;
    case 'moriver':
      return db.moriver;
    case 'search':
      return db.search;
    case 'fish':
      return db.fish;
    case 'telemetry':
      return db.telemetry;
    case 'supplemental':
      return db.supplemental;
    case 'procedure':
      return db.procedure;
    default:
      throw new Error(`Unknown table: ${tableName}`);
  }
}

function sortOutboxItems(items: OutboxItem[]) {
  return items.sort((a, b) => {
    const topPriority = tablePriority[a.tableName] ?? 99;
    const nextPriority = tablePriority[b.tableName] ?? 99;

    if (topPriority !== nextPriority) {
      return topPriority - nextPriority;
    }
    return a.ts - b.ts;
  });
}

export async function syncNow(): Promise<SyncResult> {
  if (!isOnline()) {
    return { tried: 0, ok: 0, errors: 0, conflicts: 0, draftSkip: 0 };
  }
  const items = await db.outbox.orderBy('ts').toArray();

  if (!items.length) {
    return { tried: 0, ok: 0, errors: 0, conflicts: 0, draftSkip: 0 };
  }

  let ok = 0;
  let errors = 0;
  let conflicts = 0;
  let draftSkip = 0;

  for (const item of items) {
    try {
      if (!item.tableName) {
        console.warn('Skipping outbox item with missing tableName', item);
        continue;
      }
      const table: any = getTable(item.tableName);
      const localRow: any = await table.get(item.clientId);

      // if (localRow && localRow._status === 'draft') {
      //   draftSkip++;
      //   continue;
      // }

      const res: any = await pushOutboxItem(item);

      if (res.status === 'ok') {
        ok++;

        if (item._id == null) {
          console.warn('Cannot delete outbox item without _id', item);
          continue;
        }

        await db.transaction('rw', db.outbox, table, async () => {
          await db.outbox.delete(item._id!);

          const currentRow = await table.get(item.clientId);
          if (!currentRow) return;

          await table.put({
            ...currentRow,
            serverId: res.serverId ?? currentRow.serverId,
            version: res.serverVersion ?? (currentRow.version ?? 0) + 1,
            updatedAt: res.lastUpdated ?? new Date().toISOString(),
            _status: 'synced',
            ...(res.json ?? {}),
          });
        });
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
        console.warn('Sync failed. Keeping item in outbox:', res, item);
      }
    } catch (err) {
      console.error('Sync error:', item, err);
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
        void syncNow();
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
