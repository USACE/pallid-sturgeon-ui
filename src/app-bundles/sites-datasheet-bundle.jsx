import { queryFromObject } from '@src/utils';
import { ApiStatuses } from '@src/utils/enums';

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
              data: payload.items,
              totalCount: payload.totalCount,
            },
          };
        case 'UPDATE_SEARCH_EFFORT_SITES_DATASHEET':
          return {
            ...state,
            searchEffort: {
              data: payload.items,
              totalCount: payload.totalCount,
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
  selectMoriverSitesDatasheetData: (state) => state.sitesDatasheet.missouriRiver.data,
  selectSearchEffortDraftSitesDatasheetData: (state) =>
    state.sitesDatasheet.searchEffort.data?.filter((row) => row.status === 1),
  selectSearchEffortSitesDatasheetData: (state) =>
    state.sitesDatasheet.searchEffort.data?.filter((row) => row.status === 2),
  selectMoriverSitesDatasheetTotalResults: (state) => state.sitesDatasheet.missouriRiver.totalCount,
  selectSearchEffortSitesDatasheetTotalResults: (state) =>
    state.sitesDatasheet.searchEffort.data?.filter((row) => row.status === 2).length,
  selectSearchEffortSitesDraftDatasheetTotalResults: (state) =>
    state.sitesDatasheet.searchEffort.data?.filter((row) => row.status === 1).length,

  doSitesDatasheetLoadData:
    () =>
    ({ store }) => {
      store.doFetchMoRiverSitesDatasheets();
      store.doFetchSearchEffortSitesDatasheets();
    },

  doFetchMoRiverSitesDatasheets:
    () =>
    ({ dispatch, store, apiGet }) => {
      console.warn('test: ', store.selectSitesDatasheetParams());

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
