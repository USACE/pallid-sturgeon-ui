import { queryFromObject } from 'utils';

import { toast } from 'react-toastify';
import { tSuccess, tError } from 'common/toast/toastHelper';

export default {
  name: 'datasheet',
  getReducer: () => {
    const initialData = {
      pageSize: 20,
      pageNumber: 0,
      totalResults: 0,
      params: {},
      data: {},
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'UPDATE_DATASHEET_PARAMS':
          return {
            ...state,
            params: payload,
          };
        case 'SET_DATASHEET_PAGINATION':
          return {
            ...state,
            pageSize: payload.pageSize,
            pageNumber: payload.pageNumber,
          };
        case 'DATASHEETS_UPDATED_DATA':
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

  selectDatasheet: state => state.datasheet,
  selectDatasheetPageSize: state => state.datasheet.pageSize,
  selectDatasheetPageNumber: state => state.datasheet.pageNumber,
  selectDatasheetTotalResults: state => state.datasheet.totalResults,
  selectDatasheetParams: state => state.datasheet.params,
  selectDatasheetData: state => state.datasheet.data,

  doDatasheetLoadData: () => ({ dispatch, store }) => {
    dispatch({ type: 'LOADING_DATASHEET_INIT_DATA' });
    store.doDomainProjectsFetch();
    store.doDomainSeasonsFetch();
  },

  doDatasheetFetch: (tab) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'DATASHEET_FETCH_DATA_START' });

    const uris = {
      missouriRiverData: '/missouriDataSummary',
      fishData: '/fishDataSummary',
      suppData: '/suppDataSummary',
    };

    const uriKeys = Object.keys(uris);
    const uriValues = Object.values(uris);
    const { tab, ...params } = store.selectDatasheetParams();
    const size = store.selectDatasheetPageSize();
    const number = store.selectDatasheetPageNumber();

    const query = queryFromObject({
      ...params,
      officeCode: 'MO',
      size,
      number,
    });

    const url = `/psapi${uriValues[tab]}${query}`;

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'DATASHEETS_UPDATED_DATA',
        payload: {
          key: uriKeys[tab],
          data: body,
        }
      });
      dispatch({ type: 'DATASHEET_FETCH_DATA_FINISHED' });
    });
  },

  doFetchAllMissouriData: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'DATASHEET_ALL_MISSOURI_FETCH_START' });

    const uri = '/missouriFullDataSummary';

    apiGet(uri, (_err, body) => {
      console.log('response :', body);
    });
  },

  doSetDatasheetPagination: ({ pageSize, pageNumber }) => ({ dispatch, store }) => {
    dispatch({ type: 'SET_DATASHEET_PAGINATION', payload: { pageSize, pageNumber }});
    store.doDatasheetFetch();
  },

  doUpdateDatasheetParams: (params) => ({ dispatch, store }) => {
    dispatch({ type: 'UPDATE_DATASHEET_PARAMS', payload: params });
  },
};