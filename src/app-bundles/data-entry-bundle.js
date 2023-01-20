import { toast } from 'react-toastify';
import { tSuccess, tError, tWarning } from 'common/toast/toastHelper';
import { queryFromObject } from 'utils';

export default {
  name: 'dataEntry',
  getReducer: () => {
    const initialData = {
      data: [],
      fishData: {
        items: [],
        totalCount: 0,
      },
      supplementalData: {
        items: [],
        totalCount: 0,
      },
      procedureData: {
        items: [],
        totalCount: 0,
      },
      telemetryData: {
        items: [],
        totalCount: 0,
      },
      headerData: {},
      totalCount: 0,
      lastParams: {},
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        // Fetch
        case 'MO_RIVER_DATA_ENTRY_FETCH_START':
        case 'FISH_DATA_ENTRY_FETCH_START':
          return {
            ...state,
            lastParams: payload,
          };
        case 'SUPPLEMENTAL_DATA_ENTRY_FETCH_START':
          return {
            ...state,
            lastParams: payload,
          };
        case 'PROCEDURE_DATA_ENTRY_FETCH_START':
          return {
            ...state,
            lastParams: payload,
          };
       
        case 'SEARCH_DATA_ENTRY_FETCH_START':
        case 'TELEMETRY_DATA_ENTRY_FETCH_START':
          return {
            ...state,
            lastParams: payload,
          };

        // Data Update
        case 'DATA_ENTRY_UPDATED_DATA':
          return {
            ...state,
            data: payload.data.items,
            totalCount: payload.data.totalCount,
          };
        case 'DATA_ENTRY_UPDATE_FISH_DATA':
          return {
            ...state,
            fishData: {
              items: payload.items,
              totalCount: payload.totalCount,
            }
          };
        case 'DATA_ENTRY_UPDATE_SUPPLEMENTAL_DATA':
          return {
            ...state,
            supplementalData: {
              items: payload.items,
              totalCount: payload.totalCount,
            }
          };
        case 'DATA_ENTRY_UPDATE_PROCEDURE_DATA':
          return {
            ...state,
            procedureData: {
              items: payload.items,
              totalCount: payload.totalCount,
            }
          };
        case 'DATA_ENTRY_UPDATE_SEARCH_DATA':
          return {
            ...state,
            searchData: payload,
          };
        case 'DATA_ENTRY_UPDATE_TELEMETRY_DATA':
          return {
            ...state,
            telemetryData: {
              items: payload.items,
              totalCount: payload.totalCount,
            },
          };

        case 'UPDATED_HEADER_DATA':
          return { ...state, headerData: payload };
        default:
          return state;
      }
    };
  },

  selectDataEntry: state => state.dataEntry,
  selectDataEntryData: state => state.dataEntry.data.length ? state.dataEntry.data[0] : {},
  selectDataEntryFishData: state => state.dataEntry.fishData,
  selectDataEntryFishTotalCount: state => state.dataEntry.fishData.totalCount,
  selectDataEntrySupplemental: state => state.dataEntry.supplementalData,
  selectDataEntrySupplementalTotalCount: state => state.dataEntry.supplementalData.totalCount,
  selectDataEntryProcedure: state => state.dataEntry.procedureData,
  selectDataEntryProcedureTotalCount: state => state.dataEntry.procedureData.totalCount,
  selectDataEntryTelemetryData: state => state.dataEntry.telemetryData,
  selectDataEntryTelemetryDataTotalCount: state => state.dataEntry.telemetryData.totalCount,
  selectDataEntrySearchData: state => state.dataEntry.searchData,
  selectDataEntryTotalCount: state => state.dataEntry.totalCount,
  selectDataEntryLastParams: state => state.dataEntry.lastParams,
  selectHeaderData: state => state.dataEntry.headerData,

  doDataEntryLoadData: () => ({ dispatch, store }) => {
    dispatch({ type: 'LOADING_DATA_ENTRY_INIT_DATA' });
    store.doDomainFieldOfficesFetch();
    store.doDomainProjectsFetch();
    store.doDomainSeasonsFetch();
    store.doDomainSampleUnitTypesFetch();
  },

  doFetchHeaderData: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'FETCH_HEADER_DATA_START' });

    const url = `/psapi/headerData${queryFromObject(params)}`;

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'UPDATED_HEADER_DATA',
        payload: body,
      });
      dispatch({ type: 'FETCH_HEADER_DATA_FINISHED' });
    });
  },

  doMoRiverDatasheetLoadData: (id) => ({ dispatch, store }) => {
    dispatch({ type: 'LOADING_MORIVER_DATA_ENTRY_INIT_DATA' });
    // Load data
    store.doFetchFishDataEntry({ mrId: id }, null, false);
    store.doFetchSupplementalDataEntry({ mrId: id }, null, false);
    store.doFetchProcedureDataEntry({ mrId: id }, null, false);
    // Load supporting data
    store.doDomainsFtPrefixesFetch();
    store.doDomainsMrFetch();
    store.doDomainsOtolithFetch();
    store.doDomainsSpeciesFetch();
  },

  doSearchEffortDatasheetLoadData: (id) => ({ dispatch, store }) => {
    dispatch({ type: 'LOADING_SEARCH_EFFORT_DATA_ENTRY_INIT_DATA' });
    // Load data
    store.doFetchTelemetryDataEntry({ seId: id }, null, false);
  },

  // DATA ENTRY FETCHES

  doFetchMoRiverDataEntry: (params, callback = null, ignoreToast = false) => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'MO_RIVER_DATA_ENTRY_FETCH_START', payload: params });
    const toastId = ignoreToast ? toast.loading('Finding Missouri River datasheet(s)...') : null;

    const url = `/psapi/moriverDataEntry${queryFromObject(params)}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'DATA_ENTRY_UPDATED_DATA',
          payload: {
            data: body,
            type: 'missouriRiver',
          },
        });

        if (store.selectDataEntryTotalCount() === 0) {
          if (ignoreToast) { tWarning(toastId, 'No Missouri River datasheet(s) found.'); }
        } else {
          if (ignoreToast) { tSuccess(toastId, 'Missouri River datasheet(s) found!'); }
          if (callback && typeof callback === 'function') {
            callback();
          }
        }
        dispatch({ type: 'MO_RIVER_DATA_ENTRY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'MO_RIVER_DATA_ENTRY_FETCH_ERROR', payload: err });
        tError(toastId, 'Error searching for Missouri River datasheet(s). Please try again.');
      }
    });
  },

  doFetchFishDataEntry: (params, callback = null, ignoreToast = false) => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'FISH_DATA_ENTRY_FETCH_START', payload: params });
    const toastId = ignoreToast ? toast.loading('Finding Fish datasheet(s)...') : null;

    const url = `/psapi/fishDataEntry${queryFromObject(params)}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'DATA_ENTRY_UPDATE_FISH_DATA',
          payload: body,
        });

        if (store.selectDataEntryFishTotalCount() === 0) {
          if (ignoreToast) { tWarning(toastId, 'No Fish datasheet(s) found.'); }
        } else {
          if (ignoreToast) { tSuccess(toastId, 'Fish datasheet(s) found!'); }
          if (callback && typeof callback === 'function') {
            callback();
          }
        }
        dispatch({ type: 'FISH_DATA_ENTRY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'FISH_DATA_ENTRY_FETCH_ERROR', payload: err });
        tError(toastId, 'Error searching for Fish datasheet(s). Please try again.');
      }
    });
  },

  doFetchSupplementalDataEntry: (params, callback = null, ignoreToast = false) => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_FETCH_START', payload: params });
    const toastId = ignoreToast ? toast.loading('Finding Supplemental datasheet(s)...') : null;

    const url = `/psapi/supplementalDataEntry${queryFromObject(params)}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'DATA_ENTRY_UPDATE_SUPPLEMENTAL_DATA',
          payload: body,
        });

        if (store.selectDataEntrySupplementalTotalCount() === 0) {
          if (ignoreToast) { tWarning(toastId, 'No Supplemental datasheet(s) found.'); }
        } else {
          if (ignoreToast) { tSuccess(toastId, 'Supplemental datasheet(s) found!'); }
          if (callback && typeof callback === 'function') {
            callback();
          }
        }
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_FETCH_ERROR', payload: err });
        tError(toastId, 'Error searching for Supplemental datasheet(s). Please try again.');
      }
    });
  },

  doFetchProcedureDataEntry: (params, callback = null, ignoreToast = false) => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'PROCEDURE_DATA_ENTRY_FETCH_START', payload: params });
    const toastId = ignoreToast ? toast.loading('Finding Procedure datasheet(s)...') : null;

    const url = `/psapi/procedureDataEntry${queryFromObject(params)}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'DATA_ENTRY_UPDATE_PROCEDURE_DATA',
          payload: body,
        });

        if (store.selectDataEntryProcedureTotalCount() === 0) {
          if (ignoreToast) { tWarning(toastId, 'No Procedure datasheet(s) found.'); }
        } else {
          if (ignoreToast) { tSuccess(toastId, 'Procedure datasheet(s) found!'); }
          if (callback && typeof callback === 'function') {
            callback();
          }
        }
        dispatch({ type: 'PROCEDURE_DATA_ENTRY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'PROCEDURE_DATA_ENTRY_FETCH_ERROR', payload: err });
        tError(toastId, 'Error searching for Procedure datasheet(s). Please try again.');
      }
    });
  },

  doFetchSearchDataEntry: (params, callback = null, ignoreToast = false) => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'SEARCH_DATA_ENTRY_FETCH_START', payload: params });
    const toastId = ignoreToast ? toast.loading('Finding Search Effort datasheet(s)...') : null;

    const url = `/psapi/searchDataEntry${queryFromObject(params)}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'DATA_ENTRY_UPDATED_DATA',
          payload: {
            data: body,
            type: 'searchEffort',
          },
        });

        if (store.selectDataEntryTotalCount() === 0) {
          if (ignoreToast) { tWarning(toastId, 'No Search Effort datasheet(s) found'); }
        } else {
          if (ignoreToast) { tSuccess(toastId, 'Search Effort datasheet(s) found!'); }
          if (callback && typeof callback === 'function') {
            callback();
          }
        }
        dispatch({ type: 'SEARCH_DATA_ENTRY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'SEARCH_DATA_ENTRY_FETCH_ERROR', payload: err });
        tError(toastId, 'Error searching for Search Effort datasheet(s). Please try again.');
      }
    });
  },

  doFetchTelemetryDataEntry: (params, callback = null, ignoreToast = false) => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'TELEMETRY_DATA_ENTRY_FETCH_START', payload: params });
    const toastId = ignoreToast ? toast.loading('Finding Telemetry datasheet(s)...') : null;

    const url = `/psapi/telemetryDataEntry${queryFromObject(params)}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'DATA_ENTRY_UPDATE_TELEMETRY_DATA',
          payload: body,
        });

        if (store.selectDataEntryTelemetryDataTotalCount() === 0) {
          if (ignoreToast) { tWarning(toastId, 'No Telemetry datasheet(s) found.'); }
        } else {
          if (ignoreToast) { tSuccess(toastId, 'Telemetry datasheet(s) found!'); }
          if (callback && typeof callback === 'function') {
            callback();
          }
        }
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_FETCH_ERROR', payload: err });
        tError(toastId, 'Error searching for Telemetry datasheet(s). Please try again.');
      }
    });
  },

  // DATA ENTRY INSERTS

  doSaveMoRiverDataEntry: (formData) => ({ dispatch, store, apiPost }) => {
    dispatch({ type: 'MO_RIVER_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving datasheet...');

    const url = '/psapi/moriverDataEntry';

    apiPost(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'MO_RIVER_DATA_ENTRY_UPDATE_FINISHED' });
        store.doUpdateUrl('/sites-list/datasheet');
      } else {
        dispatch({ type: 'MO_RIVER_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  doSaveFishDataEntry: (formData, params) => ({ dispatch, store, apiPost }) => {
    dispatch({ type: 'FISH_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving datasheet...');

    const url = '/psapi/fishDataEntry';

    apiPost(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'FISH_DATA_ENTRY_UPDATE_FINISHED' });
        store.doFetchFishDataEntry(params);
      } else {
        dispatch({ type: 'FISH_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  doSaveSupplementalDataEntry: (formData, params) => ({ dispatch, store, apiPost }) => {
    dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving datasheet...');

    const url = '/psapi/supplementalDataEntry';

    apiPost(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_UPDATE_FINISHED' });
        store.doFetchSupplementalDataEntry(params, store.doUpdateUrl('/sites-list/datasheet/supplemental'));
      } else {
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  doSaveProcedureDataEntry: (formData, params) => ({ dispatch, store, apiPost }) => {
    dispatch({ type: 'PROCEDURE_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving datasheet...');

    const url = '/psapi/procedureDataEntry';

    apiPost(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'PROCEDURE_DATA_ENTRY_UPDATE_FINISHED' });
        store.doFetchProcedureDataEntry(params, store.doUpdateUrl('/sites-list/datasheet/procedure'));
      } else {
        dispatch({ type: 'PROCEDURE_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  doSaveSearchDataEntry: (formData) => ({ dispatch, store, apiPost }) => {
    dispatch({ type: 'SEARCH_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving datasheet...');

    const url = '/psapi/searchDataEntry';

    apiPost(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'SEARCH_DATA_ENTRY_UPDATE_FINISHED' });
        store.doUpdateUrl('/sites-list/datasheet');
      } else {
        dispatch({ type: 'SEARCH_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  doSaveTelemetryDataEntry: (formData, params) => ({ dispatch, store, apiPost }) => {
    dispatch({ type: 'TELEMETRY_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving datasheet...');

    const url = '/psapi/telemetryDataEntry';

    apiPost(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_UPDATE_FINISHED' });
        store.doFetchTelemetryDataEntry(params, store.doUpdateUrl('/sites-list/datasheet/telemetry'));
      } else {
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  // DATA ENTRY UPDATES

  doUpdateMoRiverDataEntry: (formData) => ({ dispatch, store, apiPut }) => {
    dispatch({ type: 'MO_RIVER_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving datasheet...');

    const url = '/psapi/moriverDataEntry';

    apiPut(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'MO_RIVER_DATA_ENTRY_UPDATE_FINISHED' });
        store.doUpdateUrl('/sites-list/datasheet');
      } else {
        dispatch({ type: 'MO_RIVER_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  doUpdateFishDataEntry: (rowData, params) => ({ dispatch, store, apiPut }) => {
    dispatch({ type: 'FISH_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving fish datasheet...');

    const url = '/psapi/fishDataEntry';

    apiPut(url, rowData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'FISH_DATA_ENTRY_UPDATE_FINISHED' });
        store.doFetchFishDataEntry(params);
      } else {
        dispatch({ type: 'FISH_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your entries and please try again.');
      }
    });
  },

  doUpdateSupplementalDataEntry: (rowData, params) => ({ dispatch, store, apiPut }) => {
    dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving supplemental datasheet...');

    const url = '/psapi/supplementalDataEntry';

    apiPut(url, rowData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_UPDATE_FINISHED' });
        store.doFetchSupplementalDataEntry(params, store.doUpdateUrl('/sites-list/datasheet/supplemental'));
      } else {
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your entries and please try again.');
      }
    });
  },

  doUpdateProcedureDataEntry: (rowData, params) => ({ dispatch, store, apiPut }) => {
    dispatch({ type: 'PROCEDURE_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving procedure datasheet...');

    const url = '/psapi/procedureDataEntry';

    apiPut(url, rowData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'PROCEDURE_DATA_ENTRY_UPDATE_FINISHED' });
        store.doFetchProcedureDataEntry(params, store.doUpdateUrl('/sites-list/datasheet/procedure'));
      } else {
        dispatch({ type: 'PROCEDURE_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your entries and please try again.');
      }
    });
  },

  doUpdateSearchDataEntry: (formData) => ({ dispatch, store, apiPut }) => {
    dispatch({ type: 'SEARCH_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving datasheet...');

    const url = '/psapi/searchDataEntry';

    apiPut(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'SEARCH_DATA_ENTRY_UPDATE_FINISHED' });
        store.doUpdateUrl('/sites-list/datasheet');
      } else {
        dispatch({ type: 'SEARCH_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  doUpdateTelemetryDataEntry: (formData, params) => ({ dispatch, store, apiPut }) => {
    dispatch({ type: 'TELEMETRY_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving datasheet...');

    const url = '/psapi/telemetryDataEntry';

    apiPut(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_UPDATE_FINISHED' });
        store.doFetchTelemetryDataEntry(params, store.doUpdateUrl('/sites-list/datasheet/telemetry'));
      } else {
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  // DATA ENTRY DELETES

  doDeleteFishDataEntry: (id) => ({ dispatch, store, apiDelete }) => {
    dispatch({ type: 'FISH_DATA_ENTRY_DELETE_START' });
    const toastId = toast.loading('Saving fish datasheet...');

    const url = `/psapi/fishDataEntry/${id}`;

    apiDelete(url, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully deleted!');
        dispatch({ type: 'FISH_DATA_ENTRY_DELETE_FINISHED' });
        store.doFetchFishDataEntry(store.selectDataEntryLastParams());
      } else {
        dispatch({ type: 'FISH_DATA_ENTRY_DELETE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your entries and please try again.');
      }
    });
  },
};