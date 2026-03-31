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
  year?: number;
  fieldoffice?: string;
  project_id?: number;
  segment_id?: number;
  season?: string;
  bend?: number;
  bendrn?: string;
  site_fid?: string;
  last_updated?: string;
  uploaded_by?: string;
  last_edit_comment?: string;
  edit_initials?: string;
  complete?: number;
  approved?: number;
  upload_filename?: string;
  upload_session_id?: number;
  sample_unit_type?: string;
  brm_id?: number;
}

export interface MoriverEntry extends DataEntry {
  // --- form fields ---
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
  site_id?: number;
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
  ds_id?: number;
  site_id?: number;
  site_fid?: string;
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
  f_id?: number;
  mr_id?: number;
  last_updated?: string;
  uploaded_by?: string;
  approved?: number;
  f_fid?: string;
  last_edit_comment?: string;
  edit_initial?: string;
  checkby?: string;
  complete?: number;
  upload_filename?: string;
  upload_session_id?: number;
  mr_fid?: string;
  cca_date?: string;
  rsd?: string;
  kn?: number;
  wr?: number;
  fin_curl?: string;
  genetics_vial_number?: string;
  condition?: number;
  length_type?: string;
  tagnumber?: number;
}

export interface TelemetryEntry extends DataEntry {
  t_id?: number;
  t_fid?: string;
  se_id?: number;
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
  s_id?: number;
  f_id?: number;
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
  last_updated?: string;
  uploaded_by?: string;
  approved?: number;
  f_fid?: string;
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
  f_id?: number;
  f_fid?: string;
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
  s_id?: number;
  serial_num?: string;
}

export interface OutboxItem {
  _id?: number;

  tableName?:
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

  constructor() {
    super('ps_offline_db');

    this.version(1).stores({
      sites: 'clientId, serverId, site_id, _status',
      moriver: 'clientId, serverId, updatedAt, setdate, _status',
      search: 'clientId, serverId, se_id, site_id, _status',
      fish: 'clientId, serverId, f_id, _status',
      telemetry: 'clientId, serverId, t_id, se_id, _status',
      supplemental: 'clientId, serverId, s_id, _status',
      procedure: 'clientId, serverId, id, _status',

      outbox: '++_id, entity, op, ts, clientId, serverId',
      meta: 'key',
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

export async function submitEntry(entityName: OutboxItem['entity'], table: Table<any, string>, entry: DataEntry) {
  entry._status = 'queued';
  entry.version += 1;
  entry.updatedAt = new Date().toISOString();

  await table.put(entry);

  await db.outbox.add({
    entity: entityName,
    op: entry.serverId ? 'update' : 'create',
    clientId: entry.clientId,
    serverId: entry.serverId,
    payload: entry,
    clientVersion: entry.version,
    ts: Date.now(),
  });
}
