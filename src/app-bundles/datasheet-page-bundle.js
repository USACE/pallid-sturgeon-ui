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
      missouriRiver: {
        data: [],
        totalCount: 0,
      },
      fish: {
        data: [],
        totalCount: 0,
      },
      supplemental: {
        data: [],
        totalCount: 0,
      },
      procedure: {
        data: [],
        totalCount: 0,
      },
      searchEffort: {
        data: [],
        totalCount: 0,
      },
      telemetry: {
        data: [],
        totalCount: 0,
      },
      params: {},
      data: {},
      currentTab: 0,
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'UPDATE_DATASHEET_PARAMS':
          return {
            ...state,
            params: payload,
          };
        case 'UPDATE_DATASHEET_CURRENT_TAB':
          return {
            ...state,
            currentTab: payload,
          };
        case 'SET_DATASHEET_PAGINATION':
          return {
            ...state,
            pageSize: payload.pageSize,
            pageNumber: payload.pageNumber,
          };
        case 'UPDATE_MORIVER_DATA_SUMMARY_DATA':
          return {
            ...state,
            missouriRiver: {
              data: payload.items,
              totalCount: payload.totalCount
            }
          };
        case 'UPDATE_FISH_DATA_SUMMARY_DATA':
          return {
            ...state,
            fish: {
              data: payload.items,
              totalCount: payload.totalCount
            }
          };
        case 'UPDATE_SUPP_DATA_SUMMARY_DATA':
          return {
            ...state,
            supplemental: {
              data: payload.items,
              totalCount: payload.totalCount
            }
          };
        case 'UPDATE_PROCEDURE_DATA_SUMMARY_DATA':
          return {
            ...state,
            procedure: {
              data: payload.items,
              totalCount: payload.totalCount
            }
          };
        case 'UPDATE_SEARCH_DATA_SUMMARY_DATA':
          return {
            ...state,
            searchEffort: {
              data: payload.items,
              totalCount: payload.totalCount
            }
          };
        case 'UPDATE_TELEMETRY_DATA_SUMMARY_DATA':
          return {
            ...state,
            telemetry: {
              data: payload.items,
              totalCount: payload.totalCount
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
  selectMissouriDataSummary: state => state.datasheet.missouriRiver,
  selectFishDataSummary: state => state.datasheet.fish,
  selectSuppDataSummary: state => state.datasheet.supplemental,
  selectProcedureDataSummary: state => state.datasheet.procedure,
  selectSearchDataSummary: state => state.datasheet.searchEffort,
  selectTelemetryDataSummary: state => state.datasheet.telemetry,

  doDataSummaryLoadData: () => ({ dispatch, store }) => {
    dispatch({ type: 'LOADING_DATA_SUMMARY_INIT_DATA' });
    // Load data
    store.doFetchMoRiverDataSummary();
    store.doFetchFishDataSummary();
    store.doFetchSuppDataSummary();
    store.doFetchSearchDataSummary();
    store.doFetchTelemetryDataSummary();
    store.doFetchProcedureDataSummary();
  },

  doDatasheetLoadData: () => ({ dispatch, store }) => {
    dispatch({ type: 'LOADING_DATASHEET_INIT_DATA' });
    // Loading supporting data
    store.doDomainsYearsFetch();
    store.doDomainProjectsFetch(store.selectUserRole().projectCode);
    store.doDomainSeasonsFetch({ project: store.selectUserRole().projectCode });
  },
  
  doFetchMoRiverDataSummary: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'MORIVER_DATA_SUMMARY_FETCH_START' });

    const { ...params } = store.selectDatasheetParams();
    const size = store.selectDatasheetPageSize();
    const page = store.selectDatasheetPageNumber();

    const query = queryFromObject({
      ...params,
      size,
      page,
    });

    const url = `/psapi/missouriDataSummary${query}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({ type: 'UPDATE_MORIVER_DATA_SUMMARY_DATA', payload: body });
        dispatch({ type: 'MORIVER_DATA_SUMMARY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'MORIVER_DATA_SUMMARY_FETCH_ERROR', payload: err });
      }
    });
  },

  doFetchFishDataSummary: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'FISH_DATA_SUMMARY_FETCH_START' });

    const { ...params } = store.selectDatasheetParams();
    const size = store.selectDatasheetPageSize();
    const page = store.selectDatasheetPageNumber();

    const query = queryFromObject({
      ...params,
      size,
      page,
    });

    const url = `/psapi/fishDataSummary${query}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({ type: 'UPDATE_FISH_DATA_SUMMARY_DATA', payload: body });
        dispatch({ type: 'FISH_DATA_SUMMARY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'FISH_DATA_SUMMARY_FETCH_ERROR', payload: err });
      }
    });
  },

  doFetchSuppDataSummary: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'SUPP_DATA_SUMMARY_FETCH_START' });

    const { ...params } = store.selectDatasheetParams();
    const size = store.selectDatasheetPageSize();
    const page = store.selectDatasheetPageNumber();

    const query = queryFromObject({
      ...params,
      size,
      page,
    });

    const url = `/psapi/suppDataSummary${query}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({ type: 'UPDATE_SUPP_DATA_SUMMARY_DATA', payload: body });
        dispatch({ type: 'SUPP_DATA_SUMMARY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'SUPP_DATA_SUMMARY_FETCH_ERROR', payload: err });
      }
    });
  },

  doFetchProcedureDataSummary: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'PROCEDURE_DATA_SUMMARY_FETCH_START' });

    const { ...params } = store.selectDatasheetParams();
    const size = store.selectDatasheetPageSize();
    const page = store.selectDatasheetPageNumber();

    const query = queryFromObject({
      ...params,
      size,
      page,
    });

    const url = `/psapi/procedureDataSummary${query}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({ type: 'UPDATE_PROCEDURE_DATA_SUMMARY_DATA', payload: body });
        dispatch({ type: 'PROCEDURE_DATA_SUMMARY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'PROCEDURE_DATA_SUMMARY_FETCH_ERROR', payload: err });
      }
    });
  },

  doFetchSearchDataSummary: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'SEARCH_DATA_SUMMARY_FETCH_START' });

    const { ...params } = store.selectDatasheetParams();
    const size = store.selectDatasheetPageSize();
    const page = store.selectDatasheetPageNumber();

    const query = queryFromObject({
      ...params,
      size,
      page,
    });

    const url = `/psapi/searchDataSummary${query}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({ type: 'UPDATE_SEARCH_DATA_SUMMARY_DATA', payload: body });
        dispatch({ type: 'SEARCH_DATA_SUMMARY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'SEARCH_DATA_SUMMARY_FETCH_ERROR', payload: err });
      }
    });
  },

  doFetchTelemetryDataSummary: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'TELEMETRY_DATA_SUMMARY_FETCH_START' });

    const { ...params } = store.selectDatasheetParams();
    const size = store.selectDatasheetPageSize();
    const page = store.selectDatasheetPageNumber();

    delete params.spice;

    const query = queryFromObject({
      ...params,
      size,
      page,
    });

    const url = `/psapi/telemetryDataSummary${query}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({ type: 'UPDATE_TELEMETRY_DATA_SUMMARY_DATA', payload: body });
        dispatch({ type: 'TELEMETRY_DATA_SUMMARY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'TELEMETRY_DATA_SUMMARY_FETCH_ERROR', payload: err });
      }
    });
  },

  // doDatasheetFetch: () => ({ dispatch, store, apiGet }) => {
  //   dispatch({ type: 'DATASHEET_FETCH_DATA_START' });

  //   const uris = {
  //     missouriRiverData: '/missouriDataSummary',
  //     fishData: '/fishDataSummary',
  //     suppData: '/suppDataSummary',
  //     telemetryData: '/telemetryDataSummary',
  //     procedureData: '/procedureDataSummary',
  //     searchData: '/searchDataSummary',
  //   };

  //   const uriKeys = Object.keys(uris);
  //   const uriValues = Object.values(uris);
  //   const { tab, ...params } = store.selectDatasheetParams();
  //   const size = store.selectDatasheetPageSize();
  //   const page = store.selectDatasheetPageNumber();

  //   const query = queryFromObject({
  //     ...params,
  //     size,
  //     page,
  //   });

  //   const url = `/psapi${uriValues[tab]}${query}`;

  //   apiGet(url, (_err, body) => {
  //     if (!_err) {
  //       dispatch({
  //         type: 'DATASHEETS_UPDATED_DATA',
  //         payload: {
  //           key: uriKeys[tab],
  //           data: body,
  //         }
  //       });
  //       dispatch({ type: 'DATASHEET_FETCH_DATA_FINISHED' });
  //     } else {
  //       dispatch({ type: 'DATASHEET_FETCH_DATA_ERROR', payload: _err });
  //     }
  //   });
  // },

  doFetchAllDatasheet: (filePrefix) => ({ dispatch, store, apiFetch }) => {
    dispatch({ type: 'DATASHEET_ALL_FETCH_START' });
    const toastId = toast.loading('Generating .xlsx file. One moment...');

    const uris = {
      missouriRiverData: '/missouriFullDataSummary',
      fishData: '/fishFullDataSummary',
      suppData: '/suppFullDataSummary',
      procedureData: '/procedureFullDataSummary',
      searchData: '/searchFullDataSummary',
      telemetryData: '/telemetryFullDataSummary',
    };

    const uriKeys = Object.keys(uris);
    const uriValues = Object.values(uris);
    const { tab, ...params } = store.selectDatasheetParams();

    if (filePrefix === 'telemetry-datasheet') {
      delete params.spice;
    }

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
    // store.doDatasheetFetch();
  },

  doUpdateDatasheetParams: (params) => ({ dispatch, store }) => {
    dispatch({ type: 'UPDATE_DATASHEET_PARAMS', payload: params });
    store.doDataSummaryLoadData();
  },

  doUpdateDatasheetCurrentTab: (payload) => ({ dispatch }) => {
    dispatch({ type: 'UPDATE_DATASHEET_CURRENT_TAB', payload: payload });
  },
};
