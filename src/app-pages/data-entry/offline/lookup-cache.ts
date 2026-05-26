import { db, type LookupItem } from './db';

const API_BASE = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? '';

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
