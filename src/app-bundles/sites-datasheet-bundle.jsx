import { queryFromObject } from '@src/utils';
import { ApiStatuses } from '@src/utils/enums';
import { db } from '@src/app-pages/data-entry/offline/db';

const sitesDatasheetBundle = {
  name: 'sitesDatasheet',

  getReducer: () => {
    const initialData = {
      pageSize: 50,
      pageNumber: 0,
      params: {},
      missouriRiver: {
        data: [],
        totalCount: 0,
      },
      searchEffort: {
        data: [],
        totalCount: 0,
      },
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'UPDATE_SITES_DATASHEET_PARAMS':
          return {
            ...state,
            params: payload,
          };
        case 'SET_SITES_DATASHEET_PAGINATION':
          return {
            ...state,
            pageSize: payload.pageSize,
            pageNumber: payload.pageNumber,
          };
        case 'UPDATE_MORIVER_SITES_DATASHEET':
          return {
            ...state,
            missouriRiver: {
              data: payload.items ?? [],
              totalCount: payload.items?.length ?? 0,
            },
          };
        case 'UPDATE_SEARCH_EFFORT_SITES_DATASHEET':
          return {
            ...state,
            searchEffort: {
              data: payload.items,
              totalCount: payload.items?.length ?? 0,
            },
          };
        default:
          return state;
      }
    };
  },

  selectSitesDatasheet: (state) => state.sitesDatasheet,
  selectSitesDatasheetPageSize: (state) => state.sitesDatasheet.pageSize,
  selectSitesDatasheetPageNumber: (state) => state.sitesDatasheet.pageNumber,
  selectSitesDatasheetParams: (state) => state.sitesDatasheet.params,

  // Missouri River Data
  selectMoriverDraftSitesDatasheetData: (state) =>
    state.sitesDatasheet.missouriRiver.data?.filter((row) => row.status === 1),
  selectMoriverSitesDatasheetData: (state) =>
    state.sitesDatasheet.missouriRiver.data?.filter((row) => row.status === 2),
  selectMoriverSitesDraftDatasheetTotalResults: (state) =>
    state.sitesDatasheet.missouriRiver.data?.filter((row) => row.status === 1).length,
  selectMoriverSitesDatasheetTotalResults: (state) =>
    state.sitesDatasheet.missouriRiver.data?.filter((row) => row.status === 2).length,

  // Search Effort Data
  selectSearchEffortSitesDraftDatasheetData: (state) =>
    state.sitesDatasheet.searchEffort.data?.filter((row) => row.status === 1),
  selectSearchEffortSitesDatasheetData: (state) =>
    state.sitesDatasheet.searchEffort.data?.filter((row) => row.status === 2),
  selectSearchEffortSitesDatasheetTotalResults: (state) =>
    state.sitesDatasheet.searchEffort.data?.filter((row) => row.status === 2).length,
  selectSearchEffortSitesDraftDatasheetTotalResults: (state) =>
    state.sitesDatasheet.searchEffort.data?.filter((row) => row.status === 1).length,

  doSitesDatasheetLoadData:
    (siteRouteKeyFromPage = null) =>
    async ({ dispatch, store }) => {
      if (navigator.onLine) {
        store.doFetchMoRiverSitesDatasheets();
        store.doFetchSearchEffortSitesDatasheets();
        return;
      }
      const params = store.selectSitesDatasheetParams();
      const siteRouteKey =
        siteRouteKeyFromPage ?? params?.siteId ?? params?.site_id ?? params?.siteFid ?? params?.site_fid;
      const moriverData = await db.moriver.toArray();
      const searchData = await db.search.toArray();
      const fishData = await db.fish.toArray();
      const supplementalData = await db.supplemental.toArray();
      const procedureData = await db.procedure.toArray();

      const matchCurrentSite = (row) => {
        const rowSiteKey = [row?.siteRouteKey, row?.siteFid, row?.site_fid, row?.siteId, row?.site_id];
        return rowSiteKey.some(
          (value) => value !== undefined && value !== null && String(value) === String(siteRouteKey)
        );
      };
      const siteMoriverData = moriverData.filter(matchCurrentSite).map((moriverRow) => {
        const moriverIds = [moriverRow?.mrId, moriverRow?.mr_id, moriverRow?.mrFid, moriverRow?.mr_fid]
          .filter((value) => value !== undefined && value !== null)
          .map(String);

        const matchedMoriver = (row) => {
          const childMoriverIds = [row?.mrId, row?.mr_id, row?.mrFid, row?.mr_fid]
            .filter((value) => value !== undefined && value !== null)
            .map(String);

          return childMoriverIds.some((value) => moriverIds.includes(value));
        };
        const fishCount = fishData.filter(matchedMoriver).length;
        const suppCount = supplementalData.filter(matchedMoriver).length;
        const procCount = procedureData.filter(matchedMoriver).length;

        return {
          ...moriverRow,
          fishCount: Math.max(Number(moriverRow?.fishCount ?? 0), fishCount),
          suppCount: Math.max(Number(moriverRow?.suppCount ?? 0), suppCount),
          procCount: Math.max(Number(moriverRow?.procCount ?? 0), procCount),
        };
      });

      const siteSearchData = searchData.filter(matchCurrentSite);

      dispatch({
        type: 'UPDATE_MORIVER_SITES_DATASHEET',
        payload: {
          items: siteMoriverData,
          totalCount: siteMoriverData.length,
        },
      });

      dispatch({
        type: 'UPDATE_SEARCH_EFFORT_SITES_DATASHEET',
        payload: {
          items: siteSearchData,
          totalCount: siteSearchData.length,
        },
      });
    },

  doFetchMoRiverSitesDatasheets:
    () =>
    ({ dispatch, store, apiGet }) => {
      const { ...params } = store.selectSitesDatasheetParams();
      const size = store.selectSitesDatasheetPageSize();
      const number = store.selectSitesDatasheetPageNumber();

      const query = queryFromObject({
        ...params,
        size,
        number,
      });

      const url = `/psapi/missouriDatasheets${query}`;

      apiGet(url, (err, body) => {
        if (!err && body?.status === ApiStatuses.Success) {
          dispatch({ type: 'UPDATE_MORIVER_SITES_DATASHEET', payload: body?.data });
        } else {
          dispatch({
            type: 'MORIVER_SITES_DATASHEETS_FETCH_ERROR',
            payload: err,
          });
        }
      });
    },

  doFetchSearchEffortSitesDatasheets:
    () =>
    ({ dispatch, store, apiGet }) => {
      const { ...params } = store.selectSitesDatasheetParams();
      const size = store.selectSitesDatasheetPageSize();
      const number = store.selectSitesDatasheetPageNumber();

      const query = queryFromObject({
        ...params,
        size,
        number,
      });

      const url = `/psapi/searchDatasheets${query}`;

      apiGet(url, (err, body) => {
        if (!err && body?.status === ApiStatuses.Success) {
          dispatch({
            type: 'UPDATE_SEARCH_EFFORT_SITES_DATASHEET',
            payload: body?.data,
          });
        } else {
          dispatch({
            type: 'SEARCH_EFFORT_SITES_DATASHEETS_FETCH_ERROR',
            payload: err,
          });
        }
      });
    },

  doSetSitesDatasheetPagination:
    ({ pageSize, pageNumber }) =>
    ({ dispatch, store }) => {
      dispatch({
        type: 'SET_SITES_DATASHEET_PAGINATION',
        payload: { pageSize, pageNumber },
      });
    },

  doUpdateSitesDatasheetParams:
    (params) =>
    ({ dispatch, store }) => {
      dispatch({ type: 'UPDATE_SITES_DATASHEET_PARAMS', payload: params });
    },
};

export default sitesDatasheetBundle;
