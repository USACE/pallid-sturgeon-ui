import { POSITION } from 'react-toastify/dist/utils';
import { db, type OutboxItem } from './db';
import { getLocalRecordForOutboxItem } from './offline-recovery';
import { toUpper } from 'lodash';

const EXPORT_CONFIG: Array<{ tableName: OutboxItem['tableName']; filename: string; columns: string[] }> = [
  {
    tableName: 'ds_sites',
    filename: 'sites',
    columns: [
      'SITE_ID',
      'SITE_YEAR',
      'SITE_FID',
      'FIELDOFFICE_ID',
      'FIELD_OFFICE',
      'PROJECT_ID',
      'PROJECT',
      'SEGMENT_ID',
      'SEGMENT',
      'SEASON_ID',
      'SEASON',
      'SAMPLE UNIT TYPE',
      'BEND',
      'BENDRN',
      'BENDRIVERMILE',
      'SAMPLE_UNIT_DESC',
    ],
  },
  {
    tableName: 'ds_moriver',
    filename: 'missouri-river',
    columns: [
      'YEAR',
      'FIELD_OFFICE_CODE',
      'PROJECT_CODE',
      'SEGMENT_CODE',
      'SEASON_CODE',
      'BEND_NUMBER',
      'BEND_RIVER_MILE',
      'BEND_R_OR_N',
      'SITE_ID',
      'MR_ID',
      'SET_DATE',
      'SUBSAMPLE',
      'SUBSAMPLE_PASS',
      'COMMENTS',
      'SUBSAMPLE_R_OR_N',
      'RECORDER',
      'GEAR_CODE',
      'GEAR_TYPE_CODE',
      'TEMP',
      'TURBIDITY',
      'CONDUCTIVITY',
      'DO',
      'DISTANCE',
      'WIDTH',
      'NET_RIVER_MILE',
      'STRUCTURE_NUMBER',
      'USGS',
      'RIVER_STAGE',
      'DISCHARGE',
      'U1',
      'U2',
      'U3',
      'U4',
      'U5',
      'U6',
      'MACRO_CODE',
      'MESO_CODE',
      'HABITAT_R_OR_N',
      'MICRO_STRUCTURE',
      'STRUCTURE_FLOW',
      'STRUCTURE_MOD',
      'SET_SITE_1',
      'SET_SITE_2',
      'SET_SITE_3',
      'MICRO',
      'START_TIME',
      'START_LATITUDE',
      'START_LONGITUDE',
      'STOP_TIME',
      'STOP_LATITUDE',
      'STOP_LONGITUDE',
      'DEPTH_1',
      'VELOCITY_BOTTOM_1',
      'VELOCITY_MID_1',
      'VELOCITY_TOP_1',
      'DEPTH_2',
      'VELOCITY_BOTTOM_2',
      'VELOCITY_MID_2',
      'VELOCITY_TOP_2',
      'DEPTH_3',
      'VELOCITY_BOTTOM_3',
      'VELOCITY_MID_3',
      'VELOCITY_TOP_3',
      'WATER_VELOCITY',
      'COBBLE_ESTIMATION_CODE',
      'ORGANIC_ESTIMATION_CODE',
      'SILT',
      'SAND',
      'GRAVEL',
      'CHECKBY',
      'MR_FID',
      'APPROVED',
    ],
  },
  {
    tableName: 'ds_search',
    filename: 'search-effort',
    columns: [
      'YEAR',
      'FIELDOFFICE',
      'PROJECT_ID',
      'SEGMENT_ID',
      'SEASON',
      'BEND',
      'BEND_RIVER_MILE',
      'BENDRN',
      'SE_ID',
      'SITE_ID',
      'SEARCH_DATE',
      'SEARCH_DAY',
      'RECORDER',
      'SEARCH_TYPE_CODE',
      'START_TIME',
      'START_LATITUDE',
      'START_LONGITUDE',
      'STOP_TIME',
      'STOP_LATITUDE',
      'STOP_LONGITUDE',
      'TEMP',
      'CONDUCTIVITY',
      'CHECKBY',
    ],
  },
  {
    tableName: 'ds_fish',
    filename: 'fish',
    columns: [
      'MRID_DISPLAY',
      'FID_DISPLAY',
      'YEAR',
      'FIELD_OFFICE_CODE',
      'PROJECT_CODE',
      'SEGMENT_CODE',
      'SEASON_CODE',
      'BEND_NUMBER',
      'BEND_R_OR_N',
      'BEND_RIVER_MILE',
      'MR_ID',
      'F_ID',
      'PANELHOOK',
      'BAIT',
      'SPECIES_CODE',
      'LENGTH',
      'WEIGHT',
      'FISH_COUNT',
      'OTOLITH',
      'RAYSPINE',
      'SCALE',
      'FT_PREFIX_CODE',
      'FT_NUMBER',
      'FT_MR_CODE',
      'MR_FID',
      'F_FID',
      'SET_DATE',
      'CHECKBY',
      'HATCHERY_ORIGIN_CODE',
    ],
  },
  {
    tableName: 'ds_telemetry_fish',
    filename: 'telemetry',
    columns: [
      'YEAR',
      'FIELD_OFFICE_CODE',
      'PROJECT_CODE',
      'SEGMENT_CODE',
      'SEASON_CODE',
      'BEND_NUMBER',
      'BEND_R_OR_N',
      'T_BEND',
      'BEND_RIVER_MILE',
      'RADIO_TAG_NUM',
      'FREQUENCY_ID',
      'CAPTURE_TIME',
      'CAPTURE_LATITUDE',
      'CAPTURE_LONGITUDE',
      'POSITION_CONFIDENCE',
      'MACRO_CODE',
      'MESO_CODE',
      'DEPTH',
      'TEMP',
      'CONDUCTIVITY',
      'TURBIDITY',
      'SILT',
      'SAND',
      'GRAVEL',
      'COMMENTS',
      'T_ID',
      'SITE_ID',
      'SE_ID',
      'T_FID',
      'SEARCH_DATE',
      'SUSPECTED_SPAWNING_ACTIVITY',
    ],
  },
  {
    tableName: 'ds_supplemental',
    filename: 'supplemental',
    columns: [
      'SID_DISPLAY',
      'FID_DISPLAY',
      'MRID_DISPLAY',
      'YEAR',
      'FIELD_OFFICE_CODE',
      'PROJECT_CODE',
      'SEGMENT_CODE',
      'SEASON_CODE',
      'BEND_NUMBER',
      'BEND_R_OR_N',
      'BEND_RIVER_MILE',
      'MR_ID',
      'SUBSAMPLE',
      'SUBSAMPLE_R_OR_N',
      'SUBSAMPLE_PASS',
      'F_ID',
      'SET_DATE',
      'GEAR_CODE',
      'GEAR_TYPE_CODE',
      'NETRIVERMILE',
      'LENGTH',
      'WEIGHT',
      'CONDITION',
      'RECORDER',
      'CHECKBY',
      'TAG_NUMBER',
      'PIT_R_N_OR_Z',
      'CWT_Y_OR_N',
      'DANGLER_N',
      'SCUTE_LOCATION_CODE',
      'SCUTE_NUMBER',
      'EL_HVX_CODE',
      'EL_COLOR_CODE',
      'ER_HVX_CODE',
      'ER_COLOR_CODE',
      'GENETIC_Y_N_OR_U',
      'GENETICS_VIAL_NUMBER',
      'HEAD',
      'SNOUTTOMOUTH',
      'INTER',
      'MOUTHWIDTH',
      'M_IB',
      'L_OB',
      'L_IB',
      'R_IB',
      'R_OB',
      'ANAL',
      'DORSAL',
      'OTHER_TAG_INFO',
      'LOCATION_STATUS_CODE',
      'CI',
      'MCI',
      'FISH_CODE',
      'MR_FID',
      'F_FID',
      'CHECKBY2',
      'HATCHERY_ORIGIN_CODE',
      'PROJECT_3_7',
    ],
  },
  {
    tableName: 'ds_procedure',
    filename: 'procedure',
    columns: [
      'PID_DISPLAY',
      'FID_DISPLAY',
      'YEAR',
      'FIELD_OFFICE_CODE',
      'PROJECT_CODE',
      'SEGMENT_CODE',
      'SEASON_CODE',
      'BEND_NUMBER',
      'BEND_R_OR_N',
      'BEND_RIVER_MILE',
      'PURPOSE_CODE',
      'PROCEDURE_DATE',
      'PROCEDURE_START_TIME',
      'PROCEDURE_END_TIME',
      'PROCEDURE_BY',
      'ANTIBIOTIC_INJECTION_IND',
      'PHOTO_DORSAL_IND',
      'PHOTO_VENTRAL_IND',
      'PHOTO_LEFT_IND',
      'OLD_RADIO_TAG_NUM',
      'OLD_FREQUENCY_ID',
      'DST_SERIAL_NUM',
      'DST_START_DATE',
      'DST_START_TIME',
      'DST_REIMPLANT_IND',
      'NEW_RADIO_TAG_NUM',
      'NEW_FREQUENCY_ID',
      'SEX_CODE',
      'COMMENTS',
      'FISH_HEALTH_COMMENTS',
      'SPAWN_CODE',
      'EVAL_LOCATION_CODE',
      'BLOOD_SAMPLE_IND',
      'EGG_SAMPLE_IND',
      'VISUAL_REPRO_STATUS_CODE',
      'ULTRASOUND_REPRO_STATUS_CODE',
      'ULTRASOUND_GONAD_LENGTH',
      'GONAD_CONDITION',
      'EXPECTED_SPAWN_YEAR',
      'MR_ID',
      'F_FID',
      'MR_FID',
      'SET_DATE',
      'CHECKBY',
      'SERIAL_NUM',
    ],
  },
];

const RECOVERY_COLUMNS = [
  '_RECOVERY_TABLE',
  '_RECOVERY_OPERATION',
  '_RECOVERY_OUTBOX_ID',
  '_RECOVERY_SYNC_ERROR',
  '_RECOVERY_EXPORTED_AT',
];

const firstValue = (record: any, ...keys: string[]) => {
  for (const key of keys) {
    const value = record?.[key];
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return '';
};

const COLUMN_NAMES: Record<string, string[]> = {
  SITE_ID: ['site_id', 'siteId'],
  SITE_YEAR: ['site_year', 'siteYear', 'year'],
  SITE_FID: ['site_fid', 'siteFid'],
  FIELDOFFICE_ID: ['fieldoffice_id', 'fieldOfficeId', 'fieldoffice'],
  FIELD_OFFICE: ['field_office', 'fieldOffice'],
  FIELD_OFFICE_CODE: ['field_office_code', 'fieldOfficeCode', 'fieldoffice'],
  FIELDOFFICE: ['fieldoffice', 'fieldOffice'],
  PROJECT_CODE: ['project_code', 'projectCode', 'project'],
  SEGMENT_CODE: ['segment_code', 'segmentCode', 'segment'],
  SEASON_CODE: ['season_code', 'seasonCode', 'season'],
  BEND_NUMBER: ['bend_number', 'bendNumber', 'bend'],
  BEND_R_OR_N: ['bend_r_or_n', 'bendrn'],
  BEND_RIVER_MILE: ['bend_river_mile', 'bendRiverMile', 'bendrivermile'],
  BENDRIVERMILE: ['bendrivermile', 'bendRiverMile', 'bend_river_mile'],
  SAMPLE_UNIT_DESC: ['sample_unit_desc', 'sampleUnitDesc'],
  SAMPLE_UNIT_TYPE: ['sample_unit_type', 'sampleUnitType'],
  MR_ID: ['mr_id', 'mrId'],
  MR_FID: ['mr_fid', 'mrFid'],
  SE_ID: ['se_id', 'seId'],
  T_ID: ['t_id', 'tId'],
  T_FID: ['t_fid', 'tFid'],
  F_ID: ['f_id', 'fId', 'fid'],
  F_FID: ['f_fid', 'fFid'],
  SID_DISPLAY: ['sid_display', 'sidDisplay', 'localDisplayId'],
  PID_DISPLAY: ['pid_display', 'pidDisplay', 'localDisplayId'],
  FID_DISPLAY: ['fid_display', 'fidDisplay', 'localDisplayId'],
  MRID_DISPLAY: ['mrid_display', 'mridDisplay'],
  SUBSAMPLE_R_OR_N: ['subsample_r_or_n', 'subsamplen'],
  GEAR_CODE: ['gear_code', 'gearCode', 'gear'],
  GEAR_TYPE_CODE: ['gear_type_code', 'gearTypeCode', 'gear_type'],
  HABITAT_R_OR_N: ['habitat_r_or_n', 'habitatrn'],
  MACRO_CODE: ['macro_code', 'macroCode', 'macro', 'macro_id'],
  MESO_CODE: ['meso_code', 'mesoCode', 'meso', 'meso_id'],
  WATER_VELOCITY: ['water_velocity', 'waterVelocity', 'watervel'],
  VELOCITY_BOTTOM_1: ['velocity_bottom_1', 'velocityBottom1', 'velocitybot1'],
  VELOCITY_MID_1: ['velocity_mid_1', 'velocityMid1', 'velocity08_1'],
  VELOCITY_TOP_1: ['velocity_top_1', 'velocityTop1', 'velocity02or06_1'],
  VELOCITY_BOTTOM_2: ['velocity_bottom_2', 'velocityBottom2', 'velocitybot2'],
  VELOCITY_MID_2: ['velocity_mid_2', 'velocityMid2', 'velocity08_2'],
  VELOCITY_TOP_2: ['velocity_top_2', 'velocityTop2', 'velocity02or06_2'],
  VELOCITY_BOTTOM_3: ['velocity_bottom_3', 'velocityBottom3', 'velocitybot3'],
  VELOCITY_MID_3: ['velocity_mid_3', 'velocityMid3', 'velocity08_3'],
  VELOCITY_TOP_3: ['velocity_top_3', 'velocityTop3', 'velocity02or06_3'],
  COBBLE_ESTIMATION_CODE: ['cobble_estimation_code', 'cobbleEstimationCode', 'cobble'],
  ORGANIC_ESTIMATION_CODE: ['organic_estimation_code', 'organicEstimationCode', 'organic'],
  RADIO_TAG_NUM: ['radio_tag_num', 'radioTagNum'],
  FREQUENCY_ID: ['frequency_id', 'frequencyId', 'frequency_id_code'],
  POSITION_CONFIDENCE: ['position_confidence', 'positionConfidence'],
  SUSPECTED_SPAWNING_ACTIVITY: ['suspected_spawning_activity', 'suspectedSpawningActivity'],
  SPECIES_CODE: ['species_code', 'speciesCode', 'species'],
  FISH_COUNT: ['fish_count', 'fishCount', 'fishcount'],
  FT_PREFIX_CODE: ['ft_prefix_code', 'ftPrefixCode', 'ftprefix', 'ftPrefix'],
  FT_NUMBER: ['ft_number', 'ftNumber', 'ftnum', 'floyTag'],
  FT_MR_CODE: ['ft_mr_code', 'ftMrCode', 'ftmr', 'mR'],
  HATCHERY_ORIGIN_CODE: ['hatchery_origin_code', 'hatcheryOriginCode', 'hatchery_origin'],
  TAG_NUMBER: ['tag_number', 'tagNumber', 'tagnumber'],
  PIT_R_N_OR_Z: ['pit_r_n_or_z', 'pitrn', 'pittag', 'pit_tag'],
  CWT_Y_OR_N: ['cwt_y_or_n', 'cwtyn'],
  DANGLER_N: ['dangler_n', 'danglerN', 'dangler'],
  SCUTE_LOCATION_CODE: ['scute_location_code', 'scuteLocationCode', 'scuteloc'],
  SCUTE_NUMBER: ['scute_number', 'scuteNumber', 'scutenum'],
  EL_HVX_CODE: ['el_hvx_code', 'elHvxCode', 'elhv'],
  EL_COLOR_CODE: ['el_color_code', 'elColorCode', 'elcolor'],
  GENETIC_Y_N_OR_U: ['genetic_y_n_or_u', 'genetic'],
  GENETICS_VIAL_NUMBER: ['genetics_vial_number', 'geneticsVialNumber'],
  OTHER_TAG_INFO: ['other_tag_info', 'otherTagInfo'],
  LOCATION_STATUS_CODE: ['location_status_code', 'locationStatusCode', 'status', 'location'],
  FISH_CODE: ['fish_code', 'fishCode'],
  PROJECT_3_7: ['project_3_7', 'project37'],
};

const upperCase = (value: string) => {
  return value.toLowerCase().replace(/[_ ]+([a-z0-9])/g, (_, char) => char.toUpperCase());
};

const getColumnValue = (record: any, column: string) => {
  const names = COLUMN_NAMES[column];
  if (names) {
    const value = firstValue(record, ...names);
    if (value !== '') {
      return value;
    }
  }

  const lowerCase = column.toLowerCase().replace(/ /g, '_');
  const actualCase = upperCase(column);

  return firstValue(record, lowerCase, actualCase);
};

const makeFlatValue = (value: any) => {
  if (value === undefined || value === null) {
    return '';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return value;
};

const escapeCsv = (value: any) => {
  const str = String(makeFlatValue(value));
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const rowsToCsv = (rows: any[], headers: string[]) => {
  if (!rows.length) {
    return '';
  }
  const lines = [headers.map(escapeCsv).join(',')];

  for (const row of rows) {
    lines.push(headers.map((header) => escapeCsv(row?.[header])).join(','));
  }
  return lines.join('\r\n');
};

const downloadCsv = (filename: string, csv: string) => {
  const blob = new Blob(['\uFEFF', csv], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const getTimestamp = () => {
  return new Date().toISOString().replace(/[:.]/g, '-');
};

const buildRecoveryRow = (record: any, item: OutboxItem, columns: string[]) => {
  const row: Record<string, any> = {};

  for (const column of columns) {
    row[column] = getColumnValue(record, column);
  }

  row._RECOVERY_TABLE = item.tableName;
  row._RECOVERY_OPERATION = item.op;
  row._RECOVERY_OUTBOX_ID = item._id ?? '';
  row._RECOVERY_SYNC_ERROR = item.syncError ?? '';
  row._RECOVERY_EXPORTED_AT = new Date().toISOString();

  return row;
};

export const exportOfflineRecoveryData = async () => {
  const outbox = await db.outbox.toArray();
  const timestamp = getTimestamp();
  let exportedRecords = 0;
  let exportedFiles = 0;

  for (const config of EXPORT_CONFIG) {
    const items = outbox.filter((item) => item.tableName === config.tableName);
    const recordMap = new Map<string, any>();

    for (const item of items) {
      const record = await getLocalRecordForOutboxItem(item);
      if (!record) continue;

      const exportRow = buildRecoveryRow(record, item, config.columns);

      recordMap.set(item.clientId, exportRow);
    }
    const rows = Array.from(recordMap.values());
    if (rows.length === 0) continue;
    exportedRecords += rows.length;

    const headers = [...config.columns, ...RECOVERY_COLUMNS];
    const csv = rowsToCsv(rows, headers);
    downloadCsv(`offline-${config.filename}-${timestamp}.csv`, csv);
    exportedFiles++;
  }
  return {
    files: exportedFiles,
    records: exportedRecords,
  };
};
