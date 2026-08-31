import { db, type OutboxItem } from './db';

export type RecoveryTarget =
  | {
      type: 'site';
      siteKey: string;
    }
  | {
      type: 'search';
      siteKey: string;
      formKey: string;
      tab: number;
    }
  | {
      type: 'moriver';
      siteKey: string;
      formKey: string;
      tab: number;
    }
  | null;

export const getEntityLabel = (tableName: OutboxItem['tableName']) => {
  switch (tableName) {
    case 'ds_sites':
      return 'Site';
    case 'ds_moriver':
      return 'Missouri River';
    case 'ds_search':
      return 'Search Effort';
    case 'ds_fish':
      return 'Fish';
    case 'ds_telemetry_fish':
      return 'Telemetry';
    case 'ds_supplemental':
      return 'Supplemental';
    case 'ds_procedure':
      return 'Procedure';
    default:
      return 'Offline Record';
  }
};

export const cleanSyncErrorMessage = (rawMessage?: string, http?: number) => {
  if (!rawMessage) {
    return http ? `Server returned HTTP ${http}` : `The record could not be synced`;
  }
  let message = rawMessage;

  try {
    const parsed = JSON.parse(rawMessage);
    message = parsed?.message ?? parsed?.error ?? parsed?.detail ?? rawMessage;
  } catch {
    //
  }
  if (http === 401 || http === 403) {
    return `Authentication failed while syncing. ${message}`;
  }
  if (http === 400 || http === 422) {
    return `The server rejected data in this record. ${message}`;
  }
  if (http && http >= 500) {
    return `The server could not process this record. ${message}`;
  }
  return message;
};

export const getLocalTable = (tableName: OutboxItem['tableName']) => {
  switch (tableName) {
    case 'ds_sites':
      return db.sites;
    case 'ds_moriver':
      return db.moriver;
    case 'ds_search':
      return db.search;
    case 'ds_fish':
      return db.fish;
    case 'ds_telemetry_fish':
      return db.telemetry;
    case 'ds_supplemental':
      return db.supplemental;
    case 'ds_procedure':
      return db.procedure;
    default:
      return null;
  }
};

export const getLocalRecordForOutboxItem = async (item: OutboxItem) => {
  const table = getLocalTable(item.tableName);
  if (!table) {
    return item.payload ?? null;
  }

  const record = await table.get(item.clientId);

  return record ?? item.payload ?? null;
};

const getMrKeyFromRecord = (record: any) => record?.mrId ?? record?.mr_id ?? record?.mrFid ?? record?.mr_fid;
const getSearchKeyFromRecord = (record: any) => record?.seId ?? record?.se_id ?? record?.seFid ?? record?.se_fid;
const getSiteKeyFromRecord = (record: any) =>
  record?.siteRouteKey ?? record?.siteId ?? record?.site_id ?? record?.siteFid ?? record?.site_fid;

const findParentSearch = async (record: any) => {
  const seKeys = [record?.seId, record?.se_id, record?.seFid, record?.se_fid]
    .filter((value) => value !== undefined && value !== null && value !== '')
    .map(String);

  if (!seKeys.length) {
    return null;
  }

  return db.search.filter((search) => {
    const childKeys = [search?.seId, search?.se_id, search?.seFid, search?.se_fid]
      .filter((value) => value !== undefined && value !== null && value !== '')
      .map(String);

    return childKeys.some((value) => seKeys.includes(value));
  });
};

const getFishRecordForChild = async (record: any) => {
  const fishId = [record?.fId ?? record?.f_id ?? record?.fid ?? record?.fFid ?? record?.f_fid]
    .filter((value) => value !== undefined && value !== null && value !== '')
    .map(String);

  if (!fishId.length) {
    return null;
  }

  return db.fish
    .filter((fish) => {
      const childId = [fish?.fId, fish?.f_id, fish?.fid, fish?.fFid, fish?.f_fid]
        .filter((value) => value !== undefined && value !== null && value !== '')
        .map(String);

      return childId.some((value) => fishId.includes(value));
    })
    .first();
};

export const getRecoveryTarget = async (item: OutboxItem): Promise<RecoveryTarget> => {
  const record = await getLocalRecordForOutboxItem(item);
  if (!record) {
    return null;
  }

  switch (item.tableName) {
    case 'ds_sites': {
      const siteKey = getSiteKeyFromRecord(record);

      return siteKey
        ? {
            type: 'site',
            siteKey: String(siteKey),
          }
        : null;
    }
    case 'ds_search': {
      const siteKey = getSiteKeyFromRecord(record);
      const searchKey = getSearchKeyFromRecord(record);

      if (!siteKey || !searchKey) {
        return null;
      }

      return searchKey
        ? {
            type: 'search',
            siteKey: String(siteKey),
            formKey: String(searchKey),
            tab: 0,
          }
        : null;
    }
    case 'ds_telemetry_fish': {
      const parentSearch = await findParentSearch(record);
      const siteKey = getSiteKeyFromRecord(parentSearch) ?? getSiteKeyFromRecord(record);
      const searchKey = getSearchKeyFromRecord(parentSearch) ?? getSearchKeyFromRecord(record);

      if (!siteKey || !searchKey) {
        console.warn('Unable to build Telemetry recovery route:', { record, parentSearch });
        return null;
      }

      return {
        type: 'search',
        siteKey: String(siteKey),
        formKey: String(searchKey),
        tab: 1,
      };
    }
    case 'ds_moriver': {
      const siteKey = getSiteKeyFromRecord(record);
      const mrKey = getMrKeyFromRecord(record);

      if (!siteKey || !mrKey) {
        return null;
      }

      return {
        type: 'moriver',
        siteKey: String(siteKey),
        formKey: String(mrKey),
        tab: 0,
      };
    }
    case 'ds_fish': {
      const siteKey = getSiteKeyFromRecord(record);
      const mrKey = getMrKeyFromRecord(record);

      if (!siteKey || !mrKey) {
        return null;
      }

      return {
        type: 'moriver',
        siteKey: String(siteKey),
        formKey: String(mrKey),
        tab: 1,
      };
    }
    case 'ds_supplemental':
    case 'ds_procedure': {
      const fish = await getFishRecordForChild(record);
      const siteKey = getSiteKeyFromRecord(record) ?? getSiteKeyFromRecord(fish);
      let mrKey = getMrKeyFromRecord(record) && getMrKeyFromRecord(fish);

      if (!siteKey || !mrKey) {
        return null;
      }

      return {
        type: 'moriver',
        siteKey: String(siteKey),
        formKey: String(mrKey),
        tab: 1,
      };
    }
    default:
      return null;
  }
};
