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

export async function downloadSitesForOffline(token?: string) {
  const currentYear = new Date().getFullYear();
  const pageSize = 500;

  let page = 0;
  let totalCount = 0;
  let downloadedCount = 0;
  let keepLoading = true;

  while (keepLoading) {
    const query = new URLSearchParams({
      year: String(currentYear),
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
    value: String(currentYear),
  });

  return {
    ok: true,
    year: currentYear,
    count: downloadedCount,
    totalCount,
  };
}

export async function downloadDatasheetsForOffline(token?: string, userRoleId?: number | string) {
  console.log('NEW DOWNLOAD DATASHEETS FUNCTION IS RUNNING');
  if (!userRoleId) {
    throw new Error('Cannot download offline datasheets because the user role ID is missing');
  }
  const sites = await db.sites.toArray();
  const currentYear = new Date().getFullYear();
  const currentYearSites = sites.filter((site) => {
    const siteId = site?.siteId ?? site?.site_id ?? site?.serverId;
    return Number(site.year) === currentYear && Number(siteId) > 0;
  });

  let moriverCount = 0;
  let searchCount = 0;
  let fishCount = 0;
  let suppCount = 0;
  let procCount = 0;
  let telemetryCount = 0;

  for (const site of currentYearSites) {
    const siteId = Number(site?.site_id ?? site?.siteId ?? site?.serverId);

    const [moriverResponse, searchResponse] = await Promise.all([
      fetch(`${API_BASE}/psapi/missouriDatasheets?siteId=${siteId}&size=500&number=0`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      }),
      fetch(`${API_BASE}/psapi/searchDatasheets?siteId=${siteId}&size=500&number=0`, {
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
    const moriverRows = moriverJson?.data?.items ?? [];
    const searchRows = searchJson?.data?.items ?? [];

    // missouri river datasheets
    for (const moriverRow of moriverRows) {
      const mrId = Number(moriverRow?.mrId ?? moriverRow?.mr_id);

      if (!mrId) {
        console.warn('Skipping Missouri River row without mrId:', moriverRow);
        continue;
      }

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
        status: Number(fullMoriverRow?.status ?? moriverRow?.status),
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
        status: Number(searchRow?.status),
        version: existingSearch?.version ?? searchRow?.version ?? 0,
        _status: existingSearch?._status === 'queued' ? 'queued' : 'synced',
      });
      searchCount += 1;
    }
  }

  // child datasheets: fish, procedure, supplemental, telemetry
  const userQuery = new URLSearchParams({ id: String(userRoleId) });

  const [fishResponse, suppResponse, procResponse, telemetryResponse] = await Promise.all([
    fetch(`${API_BASE}/psapi/fishDataEntry?${userQuery.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    }),
    fetch(`${API_BASE}/psapi/supplementalDataEntry?${userQuery.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    }),
    fetch(`${API_BASE}/psapi/procedureDataEntry?${userQuery.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    }),
    fetch(`${API_BASE}/psapi/telemetryDataEntry?${userQuery.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    }),
  ]);

  console.log('Child download responses:', {
    fish: fishResponse.status,
    supplemental: suppResponse.status,
    procedure: procResponse.status,
    telemetry: telemetryResponse.status,
  });

  if (!fishResponse.ok) {
    throw new Error(`Failed to download Fish: ${fishResponse.status}`);
  }
  if (!suppResponse.ok) {
    throw new Error(`Failed to download Supplemental: ${suppResponse.status}`);
  }
  // if (!procResponse.ok) {
  //   throw new Error(`Failed to download Procedure: ${procResponse.status}`);
  // }
  if (!telemetryResponse.ok) {
    throw new Error(`Failed to download Telemetry: ${telemetryResponse.status}`);
  }

  const childResponses = [fishResponse, suppResponse, telemetryResponse];

  if (childResponses.some((response) => response.status === 401)) {
    throw new Error('Offline setup authorization expired while downloading child datasheets');
  }
  if (!fishResponse.ok) {
    throw new Error(`Failed to download Fish: ${fishResponse.status}`);
  }
  if (!suppResponse.ok) {
    throw new Error(`Failed to download Supplemental: ${suppResponse.status}`);
  }
  // if (!procResponse.ok) {
  //   throw new Error(`Failed to download Procedure: ${procResponse.status}`);
  // }
  if (!telemetryResponse.ok) {
    throw new Error(`Failed to download Telemetry: ${telemetryResponse.status}`);
  }

  const fishJson = await fishResponse.json();
  const suppJson = await suppResponse.json();
  const telemetryJson = await telemetryResponse.json();

  const allFishRows = fishJson?.data?.items ?? [];
  const allSuppRows = suppJson?.data?.items ?? [];
  const allTelemetryRows = telemetryJson?.data?.items ?? [];

  let allProcRows: any[] = [];

  if (procResponse.ok) {
    const procJson = await procResponse.json();
    allProcRows = procJson?.data?.items ?? [];
  } else {
    const procErrorText = await procResponse.text().catch(() => '');
    console.error('Procedure bulk download failed:', {
      status: procResponse.status,
      response: procErrorText,
    });
    allProcRows = [];
  }

  // if (!procResponse.ok) {
  //   const downloadedMoriver = await db.moriver.toArray();
  //   const mrIds = [
  //     ...new Set(
  //       downloadedMoriver.map((row: any) => Number(row?.mrId ?? row?.mr_id ?? row?.serverId)).filter((mrId) => mrId > 0)
  //     ),
  //   ];
  //   for (const mrId of mrIds) {
  //     const procQuery = new URLSearchParams({ id: String(userRoleId), mrId: String(mrId) });
  //     const response = await fetch(`${API_BASE}/psapi/procedureDataEntry?${procQuery.toString()}`, {
  //       method: 'GET',
  //       headers: getAuthHeaders(token),
  //     });
  //     if (response.status === 401) {
  //       throw new Error('Offline setup authorization expired while downloading Procedure data');
  //     }
  //     if (!response.ok) {
  //       console.warn(`Could not download Procedure records for MR ${mrId}: ${response.status}`);
  //       continue;
  //     }
  //     const json = await response.json();
  //     const rows = json?.data?.items ?? [];
  //     allProcRows.push(...rows);
  //   }
  // }

  const currentSiteIds = new Set(
    currentYearSites
      .map((site) => Number(site?.siteId ?? site?.site_id ?? site?.serverId))
      .filter((siteId) => siteId > 0)
  );
  const fishRows = allFishRows.filter((row: any) => currentSiteIds.has(Number(row?.siteId ?? row?.site_id)));
  const suppRows = allSuppRows.filter((row: any) => currentSiteIds.has(Number(row?.siteId ?? row?.site_id)));
  const procRows = allProcRows.filter((row: any) => currentSiteIds.has(Number(row?.siteId ?? row?.site_id)));
  const telemetryRows = allTelemetryRows.filter((row: any) => currentSiteIds.has(Number(row?.siteId ?? row?.site_id)));

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

export async function getLookupOptions(lookupName: string) {
  const rows = await db.lookups.where('lookupName').equals(lookupName).toArray();

  return rows.map((row: any) => ({
    code: row.code,
    description: row.label,
  }));
}
