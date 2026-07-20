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
    // sites
    { key: 'bendRiverMile', name: 'bendRiverMile' },
    { key: 'bendSelections', name: 'bendSelections' },
    { key: 'chutes', name: 'chutes' },
    { key: 'fieldOffices', name: 'fieldOffices' },
    { key: 'fieldOfficeSegments', name: 'fieldOfficeSegments' },
    { key: 'projects', name: 'projects' },
    { key: 'reach', name: 'reach' },
    { key: 'sampleUnitTypes', name: 'sampleUnitTypes' },
    { key: 'seasons', name: 'seasons' },
    { key: 'segments', name: 'segments' },
    { key: 'years', name: 'years' },
    // telemetry
    { key: 'frequencyId', name: 'frequencyId' },
    { key: 'spawnBehavior', name: 'spawnBehavior' },
    { key: 'macros', name: 'macros' },
    { key: 'mesos', name: 'mesos' },
    { key: 'positionConfidence', name: 'positionConfidence' },
    // search effort
    { key: 'searchTypes', name: 'searchTypeCodes' },
    // missouri river
    { key: 'gearCodes', name: 'gearCodes' },
    { key: 'filteredGearCodes', name: 'filteredGearCodes' },
    { key: 'gearTypes', name: 'gearTypes' },
    { key: 'macroMesos', name: 'macroMesos' },
    { key: 'microHabitats', name: 'microHabitats' },
    { key: 'microStructures', name: 'microStructures' },
    { key: 'u6Options', name: 'u6Options' },
    { key: 'u7Options', name: 'u7Options' },
    { key: 'microSetSite', name: 'microSetSite' },
    { key: 'setSite1Options', name: 'setSite1Options' },
    { key: 'setSite2Options', name: 'setSite2Options' },
    { key: 'setSite3Options', name: 'setSite3Options' },
    { key: 'structureFlows', name: 'structureFlows' },
    { key: 'structureMods', name: 'structureMods' },
    { key: 'subsampleTypes', name: 'subsampleTypes' },
    // fish
    { key: 'fishCodes', name: 'fishCodes' },
    { key: 'fishStructures', name: 'fishStructures' },
    { key: 'floyTagPrefixes', name: 'floyTagPrefixes' },
    { key: 'lengthTypes', name: 'lengthTypes' },
    { key: 'markRecaptureOptions', name: 'markRecaptureOptions' },
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
