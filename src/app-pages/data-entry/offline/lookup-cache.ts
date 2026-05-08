import { head } from 'lodash';
import { db, type LookupItem } from './db';

const API_BASE = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? '';

// type LookupConfig = {
//   lookupName: string;
//   responseKey: string;
//   codeField: string;
//   labelField: string;
// };

// export const LOOKUP_CONFIG: LookupConfig[] = [
//   {
//     lookupName: 'searchTypeCodes',
//     responseKey: 'searchTypes',
//     codeField: 'code',
//     labelField: 'description',
//   },
//   {
//     lookupName: 'frequencyId',
//     responseKey: 'frequencyId',
//     codeField: 'code',
//     labelField: 'description',
//   },
//   {
//     lookupName: 'spawnBehavior',
//     responseKey: 'spawnBehavior',
//     codeField: 'code',
//     labelField: 'description',
//   },
//   {
//     lookupName: 'macros',
//     responseKey: 'macros',
//     codeField: 'code',
//     labelField: 'description',
//   },
//   {
//     lookupName: 'mesos',
//     responseKey: 'mesos',
//     codeField: 'code',
//     labelField: 'description',
//   },
//   {
//     lookupName: 'positionConfidence',
//     responseKey: 'positionConfidence',
//     codeField: 'code',
//     labelField: 'description',
//   },
// ];

function getAuthHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function downloadLookupsForOffline(token?: string) {
  const res = await fetch(`${API_BASE}/psapi/Lookup/getAllLookups`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  if (!res.ok) {
    throw new Error(`Failed to download lookup data: ${res.status}`);
  }
  const json = await res.json();

  console.log('Dexie DB name:', db.name);
  console.log(
    'Dexie tables:',
    db.tables.map((table) => table.name)
  );
  console.log('Lookup API response:', json);

  const lookupData = json?.data ?? json;

  const rowsToSave: LookupItem[] = [];

  const lookupMappings = [
    { key: 'frequencyId', name: 'frequencyId' },
    { key: 'spawnBehavior', name: 'spawnBehavior' },
    { key: 'macros', name: 'macros' },
    { key: 'mesos', name: 'mesos' },
    { key: 'positionConfidence', name: 'positionConfidence' },
    { key: 'searchTypes', name: 'searchTypeCodes' },
  ];

  for (const mapping of lookupMappings) {
    const rows = lookupData?.[mapping.key] ?? [];

    for (const row of rows) {
      rowsToSave.push({
        lookupName: mapping.name,
        code: row.code,
        label: row.description,
        raw: row,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  console.log('Rows to save:', rowsToSave.length);

  await db.lookups.clear();

  if (rowsToSave.length > 0) {
    await db.lookups.bulkAdd(rowsToSave);
  }

  await db.meta.put({
    key: 'lookupsLastDownloaded',
    value: new Date().toISOString(),
  });

  return { ok: true, count: rowsToSave.length };
}

export async function getLookupOptions(lookupName: string) {
  const rows = await db.lookups.where('lookupName').equals(lookupName).toArray();

  return rows.map((row: any) => ({
    code: row.code,
    description: row.label,
  }));
}
