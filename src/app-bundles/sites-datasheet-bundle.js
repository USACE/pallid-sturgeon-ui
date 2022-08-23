import { queryFromObject } from 'utils';

const sitesDatasheetBundle = {
  name: 'sitesDatasheet',

  getReducer: () => {
    const initialData = {
      pageSize: 50,
      pageNumber: 0,
      totalResults: 0,
      params: {},
      data: {},
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
        case 'UPDATE_SITES_DATASHEET':
          return {
            ...state,
            data: {
              ...state.data,
              [payload.key]: payload.data,
            }
          };
        default:
          return state;
      }
    };
  },

  selectSitesDatasheet: state => state.sitesDatasheet,
  selectSitesDatasheetPageSize: state => state.sitesDatasheet.pageSize,
  selectSitesDatasheetPageNumber: state => state.sitesDatasheet.pageNumber,
  selectSitesDatasheetTotalResults: state => state.sitesDatasheet.totalResults,
  selectSitesDatasheetParams: state => state.sitesDatasheet.params,
  selectSitesDatasheetData: state => state.sitesDatasheet.data,

  doFetchSitesDatasheets: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'SITES_DATASHEET_FETCH_DATA_START' });

    const uris = {
      missouriRiverData: '/missouriDatasheets',
      fishData: '/fishDataSummary',
      suppData: '/suppDataSummary',
      telemetryData: '/telemetryDataSummary',
      procedureData: '/procedureDataSummary',
      searchData: '/searchDatasheets',
    };

    const uriKeys = Object.keys(uris);
    const uriValues = Object.values(uris);
    const { tab, ...params } = store.selectSitesDatasheetParams();
    const size = store.selectSitesDatasheetPageSize();
    const number = store.selectSitesDatasheetPageNumber();

    const query = queryFromObject({
      ...params,
      size,
      number,
    });

    const url = `/psapi${uriValues[tab]}${query}`;

    apiGet(url, (_err, body) => {
      if (!_err) {
        dispatch({
          type: 'UPDATE_SITES_DATASHEET',
          payload: {
            key: uriKeys[tab],
            data: body,
          }
        });
        dispatch({ type: 'SITES_DATASHEET_FETCH_DATA_FINISHED' });
      } else {
        dispatch({ type: 'SITES_DATASHEET_FETCH_DATA_ERROR', payload: _err });
      }
    });
  },

  doSetSitesDatasheetPagination: ({ pageSize, pageNumber }) => ({ dispatch, store }) => {
    dispatch({ type: 'SET_SITES_DATASHEET_PAGINATION', payload: { pageSize, pageNumber }});
    // store.doFetchSitesDatasheets();
  },

  doUpdateSitesDatasheetParams: (params) => ({ dispatch, store }) => {
    dispatch({ type: 'UPDATE_SITES_DATASHEET_PARAMS', payload: params });
    store.doFetchSitesDatasheets();
  },

};

export default sitesDatasheetBundle;
