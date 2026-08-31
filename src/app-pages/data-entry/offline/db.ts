import Dexie, { Table } from 'dexie';

export interface DataEntry {
  clientId: string;
  serverId?: number;
  version: number;
  updatedAt?: string;
  _status: 'draft' | 'queued' | 'synced' | 'conflict';
}

export interface SiteEntry extends DataEntry {
  site_id?: number;
  siteId?: number;
  year?: number;
  fieldoffice?: string;
  project_id?: number;
  projectId?: number;
  segment_id?: number;
  segmentId?: number;
  season?: string;
  bend?: number;
  bendrn?: string;
  site_fid?: string;
  siteFid?: string;
  last_updated?: string;
  uploaded_by?: string;
  uploadedBy?: string;
  last_edit_comment?: string;
  edit_initials?: string;
  editInitials?: string;
  complete?: number;
  approved?: number;
  upload_filename?: string;
  upload_session_id?: number;
  sample_unit_type?: string;
  sampleUnitType?: string;
  brm_id?: number;
  bendRiverMile?: number;
  bend_river_mile?: number;
}

export interface MoriverEntry extends DataEntry {
  // --- form fields ---
  fishCount?: number;
  fieldoffice?: string;
  project?: number;
  segment?: number;
  uniqueidentifier?: number;
  npage?: number;
  totalpages?: number;
  season?: string;
  setdate?: string;
  bend?: number;
  bendrn?: string;
  replicate?: number;
  replicatern?: string;
  subsample?: number;
  subsamplepass?: number;
  subsamplen?: string;
  biologist?: string;
  recorder?: string;
  checkby?: string;
  gear?: string;
  temp?: number;
  turbidity?: number;
  conductivity?: number;
  do?: number;
  distance?: number;
  width?: number;
  bendrivermile?: number;
  netrivermile?: number;
  structurenumber?: string;
  usgs?: string;
  riverstage?: number;
  discharge?: number;
  u1?: string;
  u2?: string;
  u3?: string;
  u4?: string;
  u5?: string;
  u6?: string;
  u7?: string;
  macro?: string;
  macrosw?: string;
  meso?: string;
  mesosw?: string;
  micro?: string;
  starttime?: string;
  startlatitude?: number;
  startlongitude?: number;
  stoptime?: string;
  stoplatitude?: number;
  stoplongitude?: number;
  depth1?: number;
  depth2?: number;
  depth3?: number;
  velocitybot1?: number;
  velocity08_1?: number;
  velocity02or06_1?: number;
  velocitybot2?: number;
  velocity08_2?: number;
  velocity02or06_2?: number;
  velocitybot3?: number;
  velocity08_3?: number;
  velocity02or06_3?: number;
  watervel?: number;
  habitatrn?: string;
  cobble?: number;
  silt?: number;
  sand?: number;
  gravel?: number;
  organic?: number;
  qc?: string;
  comments?: string;
  mappingbox?: string;
  mr_id?: number;
  mrId?: number;
  site_id?: number;
  siteId?: number;
  site_fid?: string;
  siteFid?: string;
  siteRouteKey?: string;
  micro_structure?: string;
  structure_flow?: string;
  structure_mod?: string;
  set_site_1?: string;
  set_site_2?: string;
  set_site_3?: string;
  gear_type?: string;
  last_updated?: string;
  uploaded_by?: string;
  approved?: number;
  mr_fid?: string;
  mrFid?: string;
  last_edit_comment?: string;
  edit_initials?: string;
  complete?: number;
  upload_filename?: string;
  no_turbidity?: string;
  no_velocity?: string;
  upload_session_id?: number;
  cca_date?: string;
  standard_sample?: string;
  effort?: string;
  se_id?: number;
  se_fid?: string;
  subsample_type?: string;
}

export interface SearchEffortEntry extends DataEntry {
  se_id?: number;
  seId?: number;
  telemetryCount?: number;
  search_date?: string;
  recorder?: string;
  search_type_code?: string;
  start_time?: string;
  start_latitude?: number;
  start_longitude?: number;
  stop_time?: string;
  stop_latitude?: number;
  stop_longitude?: number;
  se_fid?: string;
  seFid?: string;
  ds_id?: number;
  site_id?: number;
  siteId?: number;
  site_fid?: string;
  siteFid?: string;
  siteRouteKey?: string;
  temp?: number;
  conductivity?: number;
  last_updated?: string;
  upload_session_id?: number;
  uploaded_by?: string;
  upload_filename?: string;
  checkby?: string;
  search_day?: number;
  edit_initials?: string;
  last_edit_comment?: string;
}

export interface FishEntry extends DataEntry {
  fieldoffice?: string;
  project?: number;
  segment?: number;
  uniqueidentifier?: number;
  npage?: number;
  totalpages?: number;
  id?: number;
  panelhook?: string;
  bait?: string;
  species?: string;
  length?: number;
  weight?: number;
  fishcount?: number;
  otolith?: string;
  rayspine?: string;
  scale?: string;
  ftprefix?: string;
  ftnum?: string;
  ftmr?: string;
  envelopenumber?: number;
  fid?: number;
  fId?: number;
  f_id?: number;
  mr_id?: number;
  mrId?: number;
  localDisplayId?: string;
  last_updated?: string;
  uploaded_by?: string;
  approved?: number;
  f_fid?: string;
  fFid?: string;
  last_edit_comment?: string;
  edit_initial?: string;
  checkby?: string;
  complete?: number;
  upload_filename?: string;
  upload_session_id?: number;
  mr_fid?: string;
  mrFid?: string;
  cca_date?: string;
  rsd?: string;
  kn?: number;
  wr?: number;
  fin_curl?: string;
  genetics_vial_number?: string;
  condition?: number;
  length_type?: string;
  tagnumber?: number;
  countF?: number;
  lengthType?: string;
  ftPrefix?: string;
  floyTag?: string;
  mR?: string;
  geneticsVialNumber?: string;
  finCurl?: string;
}

export interface TelemetryEntry extends DataEntry {
  t_id?: number;
  tId?: number;
  tFid?: string;
  t_fid?: string;
  se_id?: number;
  seId?: number;
  localDisplayId?: string;
  bend?: number;
  radio_tag_num?: number;
  frequency_id_code?: number;
  capture_time?: string;
  capture_latitude?: number;
  capture_longitude?: number;
  position_confidence?: number;
  macro_id?: string;
  meso_id?: string;
  depth?: number;
  temp?: number;
  conductivity?: number;
  turbidity?: number;
  silt?: number;
  sand?: number;
  gravel?: number;
  comments?: string;
  last_updated?: string;
  upload_session_id?: number;
  uploaded_by?: string;
  upload_filename?: string;
  checkby?: string;
  se_fid?: string;
  seFid?: string;
  edit_initials?: string;
  last_edit_comment?: string;
  suspected_spawning_activity?: number;
}

export interface SupplementalEntry extends DataEntry {
  fieldoffice?: string;
  project?: number;
  segment?: number;
  uniqueidentifier?: number;
  npage?: number;
  totalpages?: number;
  biologist?: string;
  recorder?: string;
  checkby?: string;
  id?: number;
  tagnumber?: string;
  pitrn?: string;
  cwtyn?: string;
  danger?: string;
  scuteloc?: string;
  scutenum?: number;
  elhv?: string;
  elcolor?: string;
  erhv?: string;
  ercolor?: string;
  blacklight?: string;
  glasses?: string;
  finpunch?: string;
  genetic?: string;
  head?: number;
  snouttomouth?: number;
  inter?: number;
  mouthwidth?: number;
  m_ib?: number;
  l_ob?: number;
  l_ib?: number;
  r_ib?: number;
  r_ob?: number;
  anal?: number;
  dorsal?: number;
  sid?: number;
  s_id?: number;
  sId?: number;
  f_id?: number;
  fId?: number;
  fid?: number;
  fishClientId?: string;
  localDisplayId?: string;
  recapture?: string;
  other_tag_info?: string;
  genetics_vial_number?: string;
  sex?: string;
  stage?: string;
  status?: string;
  comments?: string;
  hatchery_origin?: string;
  genetic_needs?: string;
  mr_id?: number;
  mrId?: number;
  last_updated?: string;
  uploaded_by?: string;
  approved?: number;
  f_fid?: string;
  fFid?: string;
  photo?: string;
  last_edit_comment?: string;
  edit_initials?: string;
  complete?: number;
  upload_filename?: string;
  ci?: number;
  mci?: number;
  upload_session_id?: number;
  cca_date?: string;
  broodstock?: number;
  hatch_wild?: number;
  species_id?: number;
  archive?: number;
  pit_tag?: string;
  pittag?: string;
  location?: string;
  standard?: number;
  total?: number;
  mark?: string;
  eh?: string;
  er?: string;
  el?: string;
  tag2?: string;
  fork_length?: number;
  scuteloc2?: string;
  scutenum2?: number;
  project_3_7?: number;
}

export interface ProcedureEntry extends DataEntry {
  id?: number;
  p_id?: number;
  pId?: number;
  f_id?: number;
  fId?: number;
  fid?: number;
  fFid?: string;
  f_fid?: string;
  fishClientId?: string;
  suppClientId?: string;
  localDisplayId?: string;
  purpose_code?: string;
  procedure_date?: string;
  procedure_start_time?: string;
  procedure_end_time?: string;
  procedure_by?: string;
  antibiotic_injection_ind?: number;
  photo_dorsal_ind?: number;
  photo_ventral_ind?: number;
  photo_left_ind?: number;
  old_radio_tag_num?: number;
  old_frequency_id?: number;
  dst_serial_num?: number;
  dst_start_date?: string;
  dst_start_time?: string;
  dst_reimplant_ind?: number;
  new_radio_tag_num?: number;
  new_frequency_id?: number;
  sex_code?: string;
  comments?: string;
  fish_health_comments?: string;
  spawn_code?: string;
  eval_location_code?: string;
  blood_sample_ind?: number;
  egg_sample_ind?: number;
  visual_repro_status_code?: string;
  ultrasound_repro_status_code?: string;
  ultrasound_gonad_length?: number;
  gonad_condition?: string;
  expected_spawn_year?: number;
  last_updated?: string;
  upload_session_id?: number;
  uploaded_by?: string;
  upload_filename?: string;
  checkby?: string;
  edit_initials?: string;
  last_edit_comment?: string;
  mr_fid?: string;
  mrFid?: string;
  s_id?: number;
  sid?: number;
  sId?: number;
  serial_num?: string;
}

export interface OutboxItem {
  _id?: number;

  tableName:
    | 'ds_sites'
    | 'ds_moriver'
    | 'ds_search'
    | 'ds_fish'
    | 'ds_telemetry_fish'
    | 'ds_supplemental'
    | 'ds_procedure';

  op: 'create' | 'update' | 'delete';

  clientId: string;
  serverId?: number;
  payload?: any;
  clientVersion: number;
  ts: number;

  // sync recovery
  syncError?: string;
  syncHttp?: number;
  lastSyncAttempt?: number;
  syncAttempts?: number;
}

export interface MetaKV {
  key: string;
  value: string;
}

export class PSOfflineDB extends Dexie {
  sites!: Table<SiteEntry, string>;
  moriver!: Table<MoriverEntry, string>;
  search!: Table<SearchEffortEntry, string>;
  fish!: Table<FishEntry, string>;
  telemetry!: Table<TelemetryEntry, string>;
  supplemental!: Table<SupplementalEntry, string>;
  procedure!: Table<ProcedureEntry, string>;

  outbox!: Table<OutboxItem, number>;
  meta!: Table<MetaKV, string>;

  lookups!: Table<LookupItem, number>;

  constructor() {
    super('ps_offline_db');

    this.version(9).stores({
      sites: 'clientId, serverId, site_id, site_fid, _status',
      moriver: 'clientId, serverId, mr_id, mr_fid, site_id, site_fid, siteRouteKey, updatedAt, setdate, _status',
      search: 'clientId, serverId, se_id, seFid, site_id, site_fid, siteRouteKey, _status',
      fish: 'clientId, serverId, f_id, fFid, mr_id, mrFid, mr_fid, _status',
      telemetry: 'clientId, serverId, t_id, se_id, tFid, seFid, _status',
      supplemental: 'clientId, serverId, s_id, f_id, fFid, f_fid, _status',
      procedure: 'clientId, serverId, id, s_id, f_id, fFid, f_fid, _status',

      outbox: '++_id, tableName, op, ts, clientId, serverId',
      meta: 'key',
      lookups: '++id, lookupName, code',
    });
  }
}

export const db = new PSOfflineDB();

export function createEntry<T>(init?: Partial<T>): T & DataEntry {
  return {
    clientId: crypto.randomUUID(),
    version: 0,
    _status: 'draft',
    updatedAt: new Date().toISOString(),
    ...init,
  } as T & DataEntry;
}

export async function submitEntry(
  tableName: OutboxItem['tableName'],
  table: Table<any, string>,
  entry: DataEntry & { clientId: string }
) {
  entry._status = 'queued';
  entry.version = (entry.version ?? 0) + 1;
  entry.updatedAt = new Date().toISOString();

  await table.put(entry);

  await db.outbox.add({
    tableName,
    op: entry.serverId ? 'update' : 'create',
    clientId: entry.clientId,
    serverId: entry.serverId,
    payload: entry,
    clientVersion: entry.version,
    ts: Date.now(),
  });
}

export interface LookupItem {
  id?: number;
  lookupName: string;
  code: string | number;
  label: string;
  raw?: any;
  updatedAt: string;
}

if (import.meta.env.DEV) {
  (window as any).ps_offline_db = db;
}
