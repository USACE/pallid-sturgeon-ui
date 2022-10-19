import { toast } from 'react-toastify';
import { tSuccess } from 'common/toast/toastHelper';
import { queryFromObject } from 'utils';

export default {
  name: 'datasheet',
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

  doDatasheetFetch: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'DATASHEET_FETCH_DATA_START' });

    const uris = {
      missouriRiverData: '/missouriDataSummary',
      fishData: '/fishDataSummary',
      suppData: '/suppDataSummary',
      telemetryData: '/telemetryDataSummary',
      procedureData: '/procedureDataSummary',
      searchData: '/searchDataSummary',
    };

    const uriKeys = Object.keys(uris);
    const uriValues = Object.values(uris);
    const { tab, ...params } = store.selectDatasheetParams();
    const size = store.selectDatasheetPageSize();
    const number = store.selectDatasheetPageNumber();

    const query = queryFromObject({
      ...params,
      size,
      number,
    });

    const url = `/psapi${uriValues[tab]}${query}`;

    apiGet(url, (_err, body) => {
      if (!_err) {
        dispatch({
          type: 'DATASHEETS_UPDATED_DATA',
          payload: {
            key: uriKeys[tab],
            data: body,
          }
        });
        dispatch({ type: 'DATASHEET_FETCH_DATA_FINISHED' });
      } else {
        dispatch({ type: 'DATASHEET_FETCH_DATA_ERROR', payload: _err });
      }
    });
  },

  doFetchAllDatasheet: (filePrefix) => ({ dispatch, store, apiFetch }) => {
    dispatch({ type: 'DATASHEET_ALL_FETCH_START' });
    const toastId = toast.loading('Generating .xlsx file. One moment...');

    const uris = {
      missouriRiverData: '/missouriFullDataSummary',
      fishData: '/fishFullDataSummary',
      suppData: '/suppFullDataSummary',
      telemetryData: '/telemetryFullDataSummary',
      procedureData: '/procedureFullDataSummary',
      searchData: '/searchFullDataSummary',
    };

    const uriKeys = Object.keys(uris);
    const uriValues = Object.values(uris);
    const { tab, ...params } = store.selectDatasheetParams();

    const query = queryFromObject({
      ...params,
    });

    const url = `/psapi${uriValues[tab]}${query}`;

    apiFetch(url)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filePrefix}-${new Date().toISOString()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        tSuccess(toastId, 'File Generated!');
      });
  },

  doSetDatasheetPagination: ({ pageSize, pageNumber }) => ({ dispatch, store }) => {
    dispatch({ type: 'SET_DATASHEET_PAGINATION', payload: { pageSize, pageNumber }});
    store.doDatasheetFetch();
  },

  doUpdateDatasheetParams: (params) => ({ dispatch, store }) => {
    dispatch({ type: 'UPDATE_DATASHEET_PARAMS', payload: params });
    store.doDatasheetFetch();
  },
};
