// src/offline/db.ts
// Offline DB for Pallid Sturgeon -> Missouri River ds_moriver
// Uses Dexie (IndexedDB) to store: records, queued ops (outbox), misc. meta
// - we keep BOTH a clientId (UUID) and optional serverId (mr_id) for smooth offline -> online mapping
// - dates/times are strings (ISO or the UI format you already use)
// - numeric fields are numbers (NaN/undefined if not set yet)

import Dexie, { Table } from 'dexie';

/**
 * Missouri River entry (subset of ds_moriver) - only the fields your UI edits,
 * plus sync bookkeeping. Keep types simple for reliability in forms.
 */
export interface MoRiverEntry {
  clientId: string;
  serverId?: number;

    // --- sync bookkeeping ---
  /** server-side version you last knew for this row */
  version?: number;

  /** server-side last_updated you last knew (ISO string) */
  updatedAt?: string;

  /** local status hint for UI (not sent to server) */
  _status?: 'queued' | 'synced' | 'conflict';


  // --- form fields ---
  setdate?: string;
  subsample?: number;
  subsamplepass?: number;
  subsamplen?: string;
  gear_type?: string;
  gear?: string;
  recorder?: string;
  macro?: string;
  meso?: string;
  temp?: number;
  width?: number;
  micro?: string;
  micro_structure?: string;
  structure_flow?: string;
  structure_mod?: string;
  set_site_1?: string;
  set_site_2?: string;
  set_site_3?: string;
  starttime?: string;
  startlatitude?: number;
  startlongitude?: number;
  distance?: number;
  depth1?: number;
  depth2?: number;
  depth3?: number;
  stoptime?: string;
  stoplatitude?: number;
  stoplongitude?: number;
  u1?: string;
  u2?: string;
  u3?: string;
  u4?: string;
  u5?: string;
  u6?: string;
  u7?: string;
  structurenumber?: string;
  netrivermile?: number;
  conductivity?: number;
  do?: number;
  usgs?: string;
  riverstage?: number;
  discharge?: number;
  habitatrn?: string;
  turbidity?: number;
  no_turbidity?: string;
  cobble?: number;
  silt?: number;
  organic?: number;
  sand?: number;
  watervel?: number;
  gravel?: number;
  velocitybot1?: number;
  velocity08_1?: number;
  velocity02or06_1?: number;
  velocitybot2?: number;
  velocity08_2?: number;
  velocity02or06_2?: number;
  velocitybot3?: number;
  velocity08_3?: number;
  velocity02or06_3?: number;
  no_velocity?: string;
  last_edit_comment?: string;
  edit_initials?: string;
}

/**
 * a queued operation to run later when online
 * we batch these to POST /api/v1/sync/push
 */
export interface OutboxItem {
  /** local auto-increment key inside IndexedDB */
  _id?: number;

  /** which entity/table this op targets */
  entity: 'ds_moriver';

  /** operation to perform on the server */
  op: 'create' | 'update' | 'delete';

  /**
   * client-side identifier of the target records (always present)
   * for creates, this is the clientId (UUID)
   * for updates/deletes after sync, you may also include serverId in payload if your API prefers it
   */
  clientId: string;

  /**
   * optional known server id (mr_id) for updates/deletes once created on server
   * not required for offline creates
   */
  serverId?: number;

  /**
   * the data to send
   * - create: full MoRiverEntry fields you want to persist
   * - update: only changed fields is fine (Partial)
   * - delete: usually omitted
   */
  payload?: MoRiverEntry | Partial<MoRiverEntry>;

  /**
   * the version you believed when you queued the change
   * server can compare and return conflict if it has moved on
   */
  clientVersion: number;

  /** when this item was queued */
  ts: number;
}

/** simple key/value store for cursors, settings, etc. */
export interface MetaKV {
  key: string;
  value: string;
}

// meso options
export interface MesoOption {
  id?: number;
  macro: string;
  code: string;
  label: string;
  updatedAt: string;
}

export class PSOfflineDB extends Dexie {
  moriver!: Table<MoRiverEntry, string>;
  outbox!: Table<OutboxItem, number>;
  meta!: Table<MetaKV, string>;
  mesoOptions!: Table<MesoOption, number>;

  constructor() {
    super('ps_offline_moriver_V2');

    // versioned schema - add new versions with .version(n+1).stores({...}) as you evolve
    this.version(1).stores({
      // clientId as primary key; index a few commonly-filtered fields
      moriver: 'clientId, serverId, version, updatedAt, setdate',
      // outbox queue with fast lookup by op time and entity
      outbox: '++_id, entity, op, ts, clientId, serverId, clientVersion',
      // meta for cursors/settings
      meta: 'key',
      mesoOptions: '++id, macro, code',
    });
  }
}

export const db = new PSOfflineDB();

/** helper: create a blank entry */
export function newMoRiverEntry(init?: Partial<MoRiverEntry>): MoRiverEntry {
  return {
    clientId: crypto.randomUUID?.() ?? (Math.random() + '').slice(2),
    version: 0,
    _status: 'queued',
    ...init,
  };
}

