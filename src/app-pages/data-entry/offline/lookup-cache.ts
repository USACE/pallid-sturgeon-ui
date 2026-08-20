import { db, type LookupItem } from './db';

const API_BASE = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? '';

export function getCurrentFieldStudyYear() {
  const today = new Date();
  const calendarYear = today.getFullYear();
  const month = today.getMonth();

  return month >= 9 ? calendarYear + 1 : calendarYear;
}

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

export async function downloadSitesForOffline(token?: string, userRoleId?: number | string) {
  if (!userRoleId) {
    throw new Error('Cannot download offline Sites because the user role ID is missing');
  }
  const fieldStudyYear = getCurrentFieldStudyYear();
  const pageSize = 500;

  const existingSites = await db.sites.toArray();
  const oldDownloadedSiteIds = existingSites
    .filter((site) => {
      const siteId = site?.siteId ?? site?.site_id ?? site?.serverId;

      return Number(siteId) > 0 && site?._status !== 'queued' && site?._status !== 'draft';
    })
    .map((site) => site.clientId)
    .filter(Boolean);

  if (oldDownloadedSiteIds.length > 0) {
    await db.sites.bulkDelete(oldDownloadedSiteIds);
  }

  let page = 0;
  let totalCount = 0;
  let downloadedCount = 0;
  let keepLoading = true;

  while (keepLoading) {
    const query = new URLSearchParams({
      id: String(userRoleId),
      year: String(fieldStudyYear),
      size: String(pageSize),
      page: String(page),
    });

    const res = await fetch(`${API_BASE}/psapi/Sites/getSites?${query.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!res.ok) {
      throw new Error(`Failed to download current-year Sites: ${res.status}`);
    }

    const json = await res.json();
    const siteData = json?.data ?? json;
    const sites = siteData?.items ?? [];
    totalCount = Number(siteData?.totalCount ?? sites.length);

    if (sites.length === 0) {
      break;
    }

    const sitesToSave = [];

    for (const site of sites) {
      const siteId = Number(site.siteId ?? site.site_id);
      if (!siteId || siteId <= 0) {
        console.warn('Skipping downloaded site with an invalid Site ID:', site);
        continue;
      }
      if (!siteId) {
        console.warn('Skipping downloaded Site without siteId:', site);
        continue;
      }
      let existingSite = await db.sites.where('site_id').equals(siteId).first();
      const downloadedSiteFid = site?.siteFid ?? site?.site_fid;

      if (!existingSite && downloadedSiteFid) {
        existingSite = await db.sites.where('site_fid').equals(downloadedSiteFid).first();
      }
      if (!existingSite) {
        existingSite = await db.sites.filter((row) => Number(row.serverId) === siteId).first();
      }

      const clientId = existingSite?.clientId ?? `server-site-${siteId}`;

      sitesToSave.push({
        ...existingSite,
        ...site,
        clientId,
        serverId: site?.serverId ?? existingSite?.serverId ?? siteId,
        siteId,
        site_id: siteId,
        siteFid: site?.siteFid ?? site?.site_fid ?? existingSite?.siteFid ?? existingSite?.site_fid,
        site_fid: site?.site_fid ?? site?.siteFid ?? existingSite?.site_fid ?? existingSite?.siteFid,
        projectId: site?.projectId ?? site?.project_id,
        project_id: site?.project_id ?? site?.projectId,
        segmentId: site?.segmentId ?? site?.segment_id,
        segment_id: site?.segment_id ?? site?.segmentId,
        sampleUnitType: site?.sampleUnitType ?? site?.sample_unit_type,
        sample_unit_type: site?.sample_unit_type ?? site?.sampleUnitType,
        bendRiverMile: site?.bendRiverMile ?? site?.bend_river_mile ?? site?.brm_id,
        bend_river_mile: site?.bend_river_mile ?? site?.bendRiverMile ?? site?.brm_id,
        editInitials: site?.editInitials ?? site?.edit_initials,
        edit_initials: site?.edit_initials ?? site?.editInitials,
        uploadedBy: site?.uploadedBy ?? site?.uploaded_by,
        uploaded_by: site?.uploaded_by ?? site?.uploadedBy,
        version: existingSite?.version ?? site?.version ?? 0,
        updatedAt: site?.updatedAt ?? site?.lastUpdated ?? site?.last_updated ?? new Date().toISOString(),
        _status: existingSite?._status === 'queued' ? existingSite?._status : 'synced',
      });
    }
    if (sitesToSave.length > 0) {
      await db.sites.bulkPut(sitesToSave);
      downloadedCount += sitesToSave.length;
    }
    page += 1;
    keepLoading = downloadedCount < totalCount && sites.length === pageSize;
  }

  await db.meta.put({
    key: 'sitesLastDownloaded',
    value: new Date().toISOString(),
  });

  await db.meta.put({
    key: 'sitesDownloadedYear',
    value: String(fieldStudyYear),
  });

  return {
    ok: true,
    year: fieldStudyYear,
    count: downloadedCount,
    totalCount,
  };
}

export async function downloadDatasheetsForOffline(token?: string, userRoleId?: number | string) {
  if (!userRoleId) {
    throw new Error('Cannot download offline datasheets because the user role ID is missing');
  }
  await clearOldDownloadedDatasheets();

  const sites = await db.sites.toArray();
  const fieldStudyYear = getCurrentFieldStudyYear();
  const fieldStudySites = sites.filter((site) => {
    const siteId = site?.siteId ?? site?.site_id ?? site?.serverId;
    return Number(site.year) === fieldStudyYear && Number(siteId) > 0;
  });

  let moriverCount = 0;
  let searchCount = 0;
  let fishCount = 0;
  let suppCount = 0;
  let procCount = 0;
  let telemetryCount = 0;

  const draftMrId = new Set<number>();
  const draftSeId = new Set<number>();

  for (const site of fieldStudySites) {
    const siteId = Number(site?.site_id ?? site?.siteId ?? site?.serverId);
    const moriverQuery = new URLSearchParams({
      id: String(userRoleId),
      siteId: String(siteId),
      size: '500',
      number: '0',
    });
    const searchQuery = new URLSearchParams({
      siteId: String(siteId),
      size: '500',
      number: '0',
    });

    const [moriverResponse, searchResponse] = await Promise.all([
      fetch(`${API_BASE}/psapi/missouriDatasheets?${moriverQuery.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      }),
      fetch(`${API_BASE}/psapi/searchDatasheets?${searchQuery.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      }),
    ]);

    if (moriverResponse.status === 401 || searchResponse.status === 401) {
      throw new Error(
        'Offline setup authorization expired while downloading Missouri River and Search Effort datasheets'
      );
    }
    if (!moriverResponse.ok) {
      throw new Error(`Failed to download Missouri River datasheets for Site ${siteId}: ${moriverResponse.status}`);
    }
    if (!searchResponse.ok) {
      throw new Error(`Failed to download Search Effort datasheets for Site ${siteId}: ${searchResponse.status}`);
    }

    const moriverJson = await moriverResponse.json();
    const searchJson = await searchResponse.json();
    const moriverRows = (moriverJson?.data?.items ?? []).filter((row: any) => Number(row?.status) === 1);
    const searchRows = (searchJson?.data?.items ?? []).filter((row: any) => Number(row?.status) === 1);

    // missouri river datasheets
    for (const moriverRow of moriverRows) {
      const mrId = Number(moriverRow?.mrId ?? moriverRow?.mr_id);

      if (!mrId) {
        console.warn('Skipping Missouri River row without mrId:', moriverRow);
        continue;
      }

      draftMrId.add(mrId);
      const moriverDetailQuery = new URLSearchParams({ tableId: String(mrId) });

      const moriverDetailResponse = await fetch(
        `${API_BASE}/psapi/DataEntry/getMoriverDataEntry?${moriverDetailQuery.toString()}`,
        {
          method: 'GET',
          headers: getAuthHeaders(token),
        }
      );

      let fullMoriverRow = moriverRow;
      if (moriverDetailResponse.ok) {
        const moriverDetailJson = await moriverDetailResponse.json();
        const downloadedDetail = moriverDetailJson?.data?.items?.[0];
        if (downloadedDetail) {
          fullMoriverRow = {
            ...moriverRow,
            ...downloadedDetail,
          };
        }
      } else {
        console.warn(`Could not download full Missouri River form ${mrId}. Using summary data instead.`);
      }

      const mrFid = fullMoriverRow?.mrFid ?? fullMoriverRow?.mr_fid ?? moriverRow?.mrFid ?? moriverRow?.mr_fid;
      const existingMoriver = await db.moriver.where('mr_id').equals(mrId).first();

      await db.moriver.put({
        ...existingMoriver,
        ...fullMoriverRow,
        clientId: existingMoriver?.clientId ?? `server-moriver-${mrId}`,
        serverId: existingMoriver?.serverId ?? mrId,
        mrId,
        mr_id: mrId,
        mrFid,
        mr_fid: mrFid,
        siteId,
        site_id: siteId,
        siteFid: site?.siteFid ?? site?.site_fid,
        site_fid: site?.site_fid ?? site?.siteFid,
        siteRouteKey: String(siteId),
        status: 1,
        version: existingMoriver?.version ?? fullMoriverRow?.version ?? 0,
        updatedAt:
          fullMoriverRow?.updatedAt ??
          fullMoriverRow?.lastUpdated ??
          fullMoriverRow?.last_updated ??
          new Date().toISOString(),
        _status: existingMoriver?._status === 'queued' ? 'queued' : 'synced',
      });
      moriverCount += 1;
    }

    // search effort datasheets
    for (const searchRow of searchRows) {
      const seId = Number(searchRow?.seId ?? searchRow?.se_id);

      if (!seId) {
        console.warn('Skipping Search Effort row without seId:', searchRow);
        continue;
      }

      draftSeId.add(seId);

      const seFid = searchRow?.seFid ?? searchRow?.se_fid;
      const existingSearch = await db.search.where('se_id').equals(seId).first();

      await db.search.put({
        ...existingSearch,
        ...searchRow,
        clientId: existingSearch?.clientId ?? `server-search-${seId}`,
        serverId: existingSearch?.serverId ?? seId,
        seId,
        se_id: seId,
        seFid,
        se_fid: seFid,
        siteId,
        site_id: siteId,
        siteFid: site?.siteFid ?? site?.site_fid,
        site_fid: site?.site_fid ?? site?.siteFid,
        siteRouteKey: String(siteId),
        status: 1,
        version: existingSearch?.version ?? searchRow?.version ?? 0,
        _status: existingSearch?._status === 'queued' ? 'queued' : 'synced',
      });
      searchCount += 1;
    }
  }

  const getRows = async (url: string, label: string) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (response.status === 401) {
      throw new Error(`Offline setup authorization expired while downloading ${label}`);
    }
    if (!response.ok) {
      throw new Error(`Failed to download ${label}: ${response.status}`);
    }

    const json = await response.json();

    return json?.data?.items ?? [];
  };

  const draftMrIdList = Array.from(draftMrId);
  const draftSeIdList = Array.from(draftSeId);

  const fishResults = await Promise.all(
    draftMrIdList.map(async (mrId) => {
      const query = new URLSearchParams({
        id: String(userRoleId),
        mrId: String(mrId),
      });
      const rows = await getRows(`${API_BASE}/psapi/fishDataEntry?${query.toString()}`, `Fish for MR ${mrId}`);

      console.log('Offline Download Fish', { mrId, count: rows.length, rows });

      return rows;
    })
  );

  const suppResults = await Promise.all(
    draftMrIdList.map((mrId) => {
      const query = new URLSearchParams({
        id: String(userRoleId),
        mrId: String(mrId),
      });

      return getRows(`${API_BASE}/psapi/supplementalDataEntry?${query.toString()}`, `Supplemental for MR ${mrId}`);
    })
  );

  const procResults = await Promise.all(
    draftMrIdList.map((mrId) => {
      const query = new URLSearchParams({
        id: String(userRoleId),
        mrId: String(mrId),
      });

      return getRows(`${API_BASE}/psapi/procedureDataEntry?${query.toString()}`, `Procedure for MR ${mrId}`);
    })
  );

  const telemetryResults = await Promise.all(
    draftSeIdList.map(async (seId) => {
      const query = new URLSearchParams({
        id: String(userRoleId),
        seId: String(seId),
      });
      const rows = await getRows(
        `${API_BASE}/psapi/telemetryDataEntry?${query.toString()}`,
        `Telemetry for Search Effort ${seId}`
      );

      console.log('Offline Download Telemetry', { seId, count: rows.length, rows });

      return rows;
    })
  );

  const allFishRows = fishResults.flat();
  const allSuppRows = suppResults.flat();
  const allProcRows = procResults.flat();
  const allTelemetryRows = telemetryResults.flat();

  const fishRows = allFishRows.filter((fish: any) => {
    const mrId = fish?.mrId ?? fish?.mr_id;

    return mrId != null && draftMrId.has(Number(mrId));
  });

  const draftFishId = new Set(
    fishRows
      .map((fish: any) => fish?.fid ?? fish?.fId ?? fish?.f_id)
      .filter((id: any) => id !== undefined && id !== null)
      .map(String)
  );

  const suppRows = allSuppRows.filter((supp: any) => {
    const fId = supp?.fid ?? supp?.fId ?? supp?.f_id;

    return fId != null && draftFishId.has(String(fId));
  });

  const procRows = allProcRows.filter((proc: any) => {
    const fId = proc?.fid ?? proc?.fId ?? proc?.f_id;

    return fId != null && draftFishId.has(String(fId));
  });

  const telemetryRows = allTelemetryRows.filter((telemetry: any) => {
    const seId = telemetry?.seId ?? telemetry?.se_id;

    return seId != null && draftSeId.has(Number(seId));
  });

  for (let index = 0; index < fishRows.length; index += 1) {
    const fish = fishRows[index];
    const fId = fish?.fid ?? fish?.fId ?? fish?.f_id;
    const fFid = fish?.fFid ?? fish?.f_fid;
    const existingFish =
      fId != null
        ? await db.fish
            .filter((row) => Number(row?.fid ?? row?.fId ?? row?.f_id ?? row?.serverId) === Number(fId))
            .first()
        : undefined;

    await db.fish.put({
      ...existingFish,
      ...fish,
      clientId: existingFish?.clientId ?? `server-fish-${fId ?? fFid ?? index}`,
      serverId: existingFish?.serverId ?? fId,
      fid: fId,
      fId,
      f_id: fId,
      fFid,
      f_fid: fFid,
      mrId: fish?.mrId ?? fish?.mr_id,
      mr_id: fish?.mr_id ?? fish?.mrId,
      mrFid: fish?.mrFid ?? fish?.mr_fid,
      mr_fid: fish?.mr_fid ?? fish?.mrFid,
      siteId: fish?.siteId ?? fish?.site_id,
      site_id: fish?.site_id ?? fish?.siteId,
      // lengthType: fish?.lengthType ?? fish?.length_type,
      // length_type: fish?.length_type ?? fish?.lengthType,
      version: existingFish?.version ?? fish?.version ?? 0,
      updatedAt: fish?.updatedAt ?? fish?.lastUpdated ?? fish?.last_updated ?? new Date().toISOString(),
      _status: existingFish?._status === 'queued' ? 'queued' : 'synced',
    });
  }
  fishCount = fishRows.length;

  for (let index = 0; index < suppRows.length; index += 1) {
    const supp = suppRows[index];
    const sId = supp?.sid ?? supp?.sId ?? supp?.s_id;
    const existingSupp =
      sId != null
        ? await db.supplemental
            .filter((row) => Number(row?.sid ?? row?.sId ?? row?.s_id ?? row?.serverId) === Number(sId))
            .first()
        : undefined;

    await db.supplemental.put({
      ...existingSupp,
      ...supp,
      clientId: existingSupp?.clientId ?? `server-supplemental-${sId ?? index}`,
      serverId: existingSupp?.serverId ?? sId,
      sid: sId,
      sId,
      s_id: sId,
      fId: supp?.fId ?? supp?.f_id ?? supp?.fid,
      f_id: supp?.f_id ?? supp?.fId ?? supp?.fid,
      fFid: supp?.fFid ?? supp?.f_fid,
      f_fid: supp?.f_fid ?? supp?.fFid,
      mrId: supp?.mrId ?? supp?.mr_id,
      mr_id: supp?.mr_id ?? supp?.mrId,
      siteId: supp?.siteId ?? supp?.site_id,
      site_id: supp?.site_id ?? supp?.siteId,
      version: existingSupp?.version ?? supp?.version ?? 0,
      updatedAt: supp?.updatedAt ?? supp?.lastUpdated ?? supp?.last_updated ?? new Date().toISOString(),
      _status: existingSupp?._status === 'queued' ? 'queued' : 'synced',
    });
  }
  suppCount = suppRows.length;

  for (let index = 0; index < procRows.length; index += 1) {
    const proc = procRows[index];
    const procId = proc?.id ?? proc?.pId ?? proc?.p_id;
    const existingProc =
      procId != null
        ? await db.procedure
            .filter((row) => Number(row?.id ?? row?.pId ?? row?.p_id ?? row?.serverId) === Number(procId))
            .first()
        : undefined;

    await db.procedure.put({
      ...existingProc,
      ...proc,
      clientId: existingProc?.clientId ?? `server-procedure-${procId ?? index}`,
      serverId: existingProc?.serverId ?? procId,
      fId: proc?.fId ?? proc?.f_id ?? proc?.fid,
      f_id: proc?.f_id ?? proc?.fId ?? proc?.fid,
      fFid: proc?.fFid ?? proc?.f_fid,
      f_fid: proc?.f_fid ?? proc?.fFid,
      mrFid: proc?.mrFid ?? proc?.mr_fid,
      mr_fid: proc?.mr_fid ?? proc?.mrFid,
      siteId: proc?.siteId ?? proc?.site_id,
      site_id: proc?.site_id ?? proc?.siteId,
      version: existingProc?.version ?? proc?.version ?? 0,
      updatedAt: proc?.updatedAt ?? proc?.lastUpdated ?? proc?.last_updated ?? new Date().toISOString(),
      _status: existingProc?._status === 'queued' ? 'queued' : 'synced',
    });
  }
  procCount = procRows.length;

  for (let index = 0; index < telemetryRows.length; index += 1) {
    const telemetry = telemetryRows[index];
    const tId = telemetry?.tId ?? telemetry?.t_id;
    const existingTelemetry =
      tId != null
        ? await db.telemetry.filter((row) => Number(row?.tId ?? row?.t_id ?? row?.serverId) === Number(tId)).first()
        : undefined;

    await db.telemetry.put({
      ...existingTelemetry,
      ...telemetry,
      clientId: existingTelemetry?.clientId ?? `server-telemetry-${tId ?? index}`,
      serverId: existingTelemetry?.serverId ?? tId,
      tId,
      t_id: tId,
      seId: telemetry?.seId ?? telemetry?.se_id,
      se_id: telemetry?.se_id ?? telemetry?.seId,
      seFid: telemetry?.seFid ?? telemetry?.se_fid,
      se_fid: telemetry?.se_fid ?? telemetry?.seFid,
      siteId: telemetry?.siteId ?? telemetry?.site_id,
      site_id: telemetry?.site_id ?? telemetry?.siteId,
      version: existingTelemetry?.version ?? telemetry?.version ?? 0,
      updatedAt: telemetry?.updatedAt ?? telemetry?.lastUpdated ?? telemetry?.last_updated ?? new Date().toISOString(),
      _status: existingTelemetry?._status === 'queued' ? 'queued' : 'synced',
    });
  }
  telemetryCount = telemetryRows.length;

  await db.meta.put({
    key: 'datasheetsLastDownloaded',
    value: new Date().toISOString(),
  });
  const totalCount = moriverCount + searchCount + fishCount + suppCount + procCount + telemetryCount;

  return {
    ok: true,
    count: totalCount,
    moriverCount,
    searchCount,
    fishCount,
    suppCount,
    procCount,
    telemetryCount,
  };
}

async function clearOldDownloadedDatasheets() {
  const clearSyncedRows = async (table: any) => {
    const rows = await table.toArray();
    const clientIds = rows
      .filter((row: any) => row?._status !== 'queued' && row?._status !== 'draft')
      .map((row: any) => row.clientId)
      .filter(Boolean);

    if (clientIds.length > 0) {
      await table.bulkDelete(clientIds);
    }
  };
  await clearSyncedRows(db.moriver);
  await clearSyncedRows(db.search);
  await clearSyncedRows(db.telemetry);
  await clearSyncedRows(db.fish);
  await clearSyncedRows(db.supplemental);
  await clearSyncedRows(db.procedure);
}

export async function getLookupOptions(lookupName: string) {
  const rows = await db.lookups.where('lookupName').equals(lookupName).toArray();

  return rows.map((row: any) => ({
    code: row.code,
    description: row.label,
  }));
}
