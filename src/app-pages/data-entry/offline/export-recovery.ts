import { db, type OutboxItem } from './db';
import { getLocalRecordForOutboxItem } from './offline-recovery';

const EXPORT_CONFIG: Array<{ tableName: OutboxItem['tableName']; filename: string }> = [
  {
    tableName: 'ds_sites',
    filename: 'sites',
  },
  {
    tableName: 'ds_moriver',
    filename: 'missouri-river',
  },
  {
    tableName: 'ds_search',
    filename: 'search-effort',
  },
  {
    tableName: 'ds_fish',
    filename: 'fish',
  },
  {
    tableName: 'ds_telemetry_fish',
    filename: 'telemetry',
  },
  {
    tableName: 'ds_supplemental',
    filename: 'supplemental',
  },
  {
    tableName: 'ds_procedure',
    filename: 'procedure',
  },
];

const removeInternalFields = (record: any) => {
  if (!record) {
    return {};
  }

  const { _isPlaceholderRow, _isTouched, ...clean } = record;

  return clean;
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

const rowsToCsv = (rows: any[]) => {
  if (!rows.length) {
    return '';
  }
  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
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

      const clean = removeInternalFields(record);

      const exportRow = {
        ...clean,
        _recoveryTable: item.tableName,
        _recoveryOperation: item.op,
        _recoveryOutboxId: item._id ?? '',
        _recoverySyncError: item.syncError ?? '',
        _recoveryExportedAt: new Date().toISOString(),
      };

      recordMap.set(item.clientId, exportRow);
    }
    const rows = Array.from(recordMap.values());
    if (rows.length === 0) continue;
    exportedRecords += rows.length;
    const csv = rowsToCsv(rows);
    downloadCsv(`offline-${config.filename}-${timestamp}.csv`, csv);
    exportedFiles++;
  }
  return {
    files: exportedFiles,
    records: exportedRecords,
  };
};
