import { toast } from 'react-toastify';
import { tSuccess, tError, tWarning } from 'common/toast/toastHelper';
import { queryFromObject } from 'utils';
import { createSelector } from 'redux-bundler';

export default {
  name: 'dataEntry',
  getReducer: () => {
    const initialData = {
      data: [],
      totalCount: 0,
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
      lastParams: {},
      currentTab: 0,
      stagedData: [],
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
          return {
            ...state,
            lastParams: payload,
          };
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
        case 'UPDATE_CURRENT_TAB':
          return {
            ...state,
            currentTab: payload,
          };

        case 'RESET_FISH_DATA_ENTRIES':
          return {
            ...state,
            fishData: {
              items: [],
              totalCount: 0,
            }
          };
        case 'RESET_SUPP_DATA_ENTRIES':
          return {
            ...state,
            supplementalData: {
              items: [],
              totalCount: 0,
            }
          };
        case 'RESET_PROCEDURE_DATA_ENTRIES':
          return {
            ...state,
            procedureData: {
              items: [],
              totalCount: 0,
            }
          };
        case 'RESET_TELEMETRY_DATA_ENTRIES':
          return {
            ...state,
            telemetryData: {
              items: [],
              totalCount: 0,
            }
          };
        case 'RESET_STAGED_DATA':
          return { ...state, stagedData: [] };
        case 'UPDATE_STAGED_DATA':
          return { ...state, stagedData: payload };
        default:
          return state;
      }
    };
  },

  selectDataEntry: state => state.dataEntry,
  selectDataEntryData: state => state.dataEntry.data.length ? state.dataEntry.data[0] : {},
  selectDataEntryLastParams: state => state.dataEntry.lastParams,
  selectHeaderData: state => state.dataEntry.headerData,
  selectCurrentTab: state => state.dataEntry.currentTab,
  selectDataEntryTotalCount: state => state.dataEntry.totalCount,

  selectDataEntryFishData: state => state.dataEntry.fishData,
  selectDataEntryFishTotalCount: state => state.dataEntry.fishData.totalCount,

  selectDataEntrySupplemental: state => state.dataEntry.supplementalData,
  selectDataEntrySupplementalTotalCount: state => state.dataEntry.supplementalData.totalCount,

  selectDataEntryProcedure: state => state.dataEntry.procedureData,
  selectDataEntryProcedureTotalCount: state => state.dataEntry.procedureData.totalCount,

  selectDataEntryTelemetryData: state => state.dataEntry.telemetryData,
  selectDataEntryTelemetryTotalCount: state => state.dataEntry.telemetryData.totalCount,

  selectStagedData: state => state.dataEntry.stagedData,
  selectCombinedFishData: createSelector('selectDataEntryFishData', 'selectStagedData', (fishData, stagedData) => [...fishData.items, ...stagedData.filter(item => item.id)]),

  doDataEntryLoadData: () => ({ store }) => {
    store.doDomainFieldOfficesFetch();
    store.doDomainProjectsFetch();
    store.doDomainSeasonsFetch();
    store.doDomainSampleUnitTypesFetch();
  },

  doFetchHeaderData: (params) => ({ dispatch, apiGet }) => {
    const url = `/psapi/headerData${queryFromObject(params)}`;

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'UPDATED_HEADER_DATA',
        payload: body,
      });
    });
  },

  doMoRiverDatasheetLoadData: (id) => ({ store }) => {
    // Load data
    store.doFetchFishDataEntry({ mrId: id, id: store.selectUserRole().id }, null, false);
    store.doFetchSupplementalDataEntry({ mrId: id, id: store.selectUserRole().id }, null, false);
    store.doFetchProcedureDataEntry({ mrId: id, id: store.selectUserRole().id }, null, false);
    // Load supporting data
    store.doDomainsFtPrefixesFetch();
    store.doDomainsMrFetch();
    store.doDomainsOtolithFetch();
    store.doDomainsSpeciesFetch();
  },

  doResetMoRiverDataEntryData: () => ({ store }) => {
    store.doResetFishDataEntries();
    store.doResetSupplementalDataEntries();
    store.doResetProcedureDataEntries();
  },

  doSearchEffortDatasheetLoadData: (id) => ({ store }) => {
    // Load data
    store.doFetchTelemetryDataEntry({ seId: id, id: store.selectUserRole().id }, null, false);
  },

  doUpdateStagedData: (data, dataType) => ({ dispatch, store }) => {
    let iDType;
    switch (dataType) {
      case 'fish':
        iDType = 'fid';
        break;
      default:
        break;
    }

    let finalArr;
    const stagedData = [...store.selectStagedData()];
    const index = stagedData.findIndex(item => data[iDType] ? (item[iDType] === data[iDType]) : (item.id === data.id));
    if (index === -1) {
      finalArr = [...store.selectStagedData(), ...[data]];
    } else {
      stagedData[index] = data;
      finalArr = stagedData;
    }
    dispatch({ type: 'UPDATE_STAGED_DATA', payload: finalArr });
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

        if (store.selectDataEntryTelemetryTotalCount() === 0) {
          if (ignoreToast) { tWarning(toastId, 'No Telemetry datasheet(s) found.'); }
        } else {
          if (ignoreToast) { tSuccess(toastId, 'Telemetry datasheet(s) found!'); }
          if (callback && typeof callback === 'function') {
            callback();
          }
        }
      } else {
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_FETCH_ERROR', payload: err });
        tError(toastId, 'Error searching for Telemetry datasheet(s). Please try again.');
      }
    });
  },

  // DATA ENTRY INSERTS

  doSaveMoRiverDataEntry: (formData) => ({ dispatch, store, apiPost }) => {
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

  doSubmitFishDataEntries: (data) => ({ dispatch, store, apiPost }) => {
    store.doSetLoadingState(true);
    store.doSetLoadingMessage('Submitting Fish data entries...');

    const url = '/psapi/submitFishDataEntries';

    apiPost(url, data, (err, _body) => {
      if (!err) {
        store.doSetLoadingState(false);
        store.doSetLoadingMessage('Loading...');
        toast.success('Fish data entries have been successfully submitted!');
        store.doResetStagedData();
        store.doFetchFishDataEntry({ mrId: store.selectDataEntryLastParams().mrId, id: store.selectUserRole().id });
      } else {
        store.doSetLoadingState(false);
        store.doSetLoadingMessage('Loading...');
        dispatch({ type: 'FISH_DATA_ENTRY_UPDATE_ERROR', payload: err });
        toast.error('Error saving data entries. Check your field entries and please try again.');
      }
    });
  },

  doSaveSupplementalDataEntry: (formData, params) => ({ dispatch, store, apiPost }) => {
    const toastId = toast.loading('Saving datasheet...');

    const url = '/psapi/supplementalDataEntry';

    apiPost(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_UPDATE_FINISHED' });
        store.doFetchSupplementalDataEntry(params);
      } else {
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  doSaveProcedureDataEntry: (formData, params) => ({ dispatch, store, apiPost }) => {
    const toastId = toast.loading('Saving datasheet...');

    const url = '/psapi/procedureDataEntry';

    apiPost(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'PROCEDURE_DATA_ENTRY_UPDATE_FINISHED' });
        store.doFetchProcedureDataEntry(params);
      } else {
        dispatch({ type: 'PROCEDURE_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  doSaveSearchDataEntry: (formData) => ({ dispatch, store, apiPost }) => {
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
    const toastId = toast.loading('Saving datasheet...');

    const url = '/psapi/telemetryDataEntry';

    apiPost(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_UPDATE_FINISHED' });
        store.doFetchTelemetryDataEntry(params);
      } else {
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  // DATA ENTRY UPDATES

  doUpdateMoRiverDataEntry: (formData) => ({ dispatch, store, apiPut }) => {
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
    const toastId = toast.loading('Saving supplemental datasheet...');

    const url = '/psapi/supplementalDataEntry';

    apiPut(url, rowData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_UPDATE_FINISHED' });
        store.doFetchSupplementalDataEntry(params);
      } else {
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your entries and please try again.');
      }
    });
  },

  doUpdateProcedureDataEntry: (rowData, params) => ({ dispatch, store, apiPut }) => {
    const toastId = toast.loading('Saving procedure datasheet...');

    const url = '/psapi/procedureDataEntry';

    apiPut(url, rowData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'PROCEDURE_DATA_ENTRY_UPDATE_FINISHED' });
        store.doFetchProcedureDataEntry(params);
      } else {
        dispatch({ type: 'PROCEDURE_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your entries and please try again.');
      }
    });
  },

  doUpdateSearchDataEntry: (formData) => ({ dispatch, store, apiPut }) => {
    const toastId = toast.loading('Saving datasheet...');

    const url = '/psapi/searchDataEntry';

    apiPut(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'SEARCH_DATA_ENTRY_UPDATE_FINISHED' });
      } else {
        dispatch({ type: 'SEARCH_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  doUpdateTelemetryDataEntry: (formData, params) => ({ dispatch, store, apiPut }) => {
    const toastId = toast.loading('Saving datasheet...');

    const url = '/psapi/telemetryDataEntry';

    apiPut(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_UPDATE_FINISHED' });
        store.doFetchTelemetryDataEntry(params);
      } else {
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  // DATA ENTRY DELETES

  doDeleteFishDataEntry: (id, multi = false) => ({ dispatch, store, apiDelete }) => {
    const url = `/psapi/fishDataEntry/${id}`;

    apiDelete(url, (err, _body) => {
      if (!err) {
        multi === false && toast.success(`Fish data entry ID: ${id} successfully deleted!`);
        dispatch({ type: 'FISH_DATA_ENTRY_DELETE_FINISHED', payload: id });
        store.doFetchFishDataEntry(store.selectDataEntryLastParams());
      } else {
        dispatch({ type: 'FISH_DATA_ENTRY_DELETE_ERROR', payload: err });
        toast.error(`Error deleting fish data ID: ${id}. Please try again.`);
      }
    });
  },

  doDeleteSupplementalDataEntry: (id) => ({ dispatch, store, apiDelete }) => {
    const toastId = toast.loading(`Deleting supplemental datasheet ID: ${id}...`);

    const url = `/psapi/supplementalDataEntry/${id}`;

    apiDelete(url, (err, _body) => {
      if (!err) {
        tSuccess(toastId, `Supplemental datasheet ID: ${id} successfully deleted!`);
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_DELETE_FINISHED' });
        store.doFetchSupplementalDataEntry(store.selectDataEntryLastParams());
      } else {
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_DELETE_ERROR', payload: err });
        tError(toastId, `Error deleting supplemental datasheet ID: ${id}. Please try again.`);
      }
    });
  },

  doDeleteProcedureDataEntry: (id) => ({ dispatch, store, apiDelete }) => {
    const toastId = toast.loading(`Deleting procedure datasheet ID: ${id}...`);

    const url = `/psapi/procedureDataEntry/${id}`;

    apiDelete(url, (err, _body) => {
      if (!err) {
        tSuccess(toastId, `Procedure datasheet ID: ${id} successfully deleted!`);
        dispatch({ type: 'PROCEDURE_DATA_ENTRY_DELETE_FINISHED' });
        store.doFetchProcedureDataEntry(store.selectDataEntryLastParams());
      } else {
        dispatch({ type: 'PROCEDURE_DATA_ENTRY_DELETE_ERROR', payload: err });
        tError(toastId, `Error deleting procedure datasheet ID: ${id}. Please try again.`);
      }
    });
  },

  doDeleteTelemetryDataEntry: (id) => ({ dispatch, store, apiDelete }) => {
    const toastId = toast.loading(`Deleting telemetry datasheet ID: ${id}...`);

    const url = `/psapi/telemetryDataEntry/${id}`;

    apiDelete(url, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully deleted!');
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_DELETE_FINISHED' });
        store.doFetchTelemetryDataEntry(store.selectDataEntryLastParams());
      } else {
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_DELETE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your entries and please try again.');
      }
    });
  },

  doDeleteTelemetryDataEntry: (id) => ({ dispatch, store, apiDelete }) => {
    const toastId = toast.loading(`Deleting telemetry datasheet ID: ${id}...`);

    const url = `/psapi/telemetryDataEntry/${id}`;

    apiDelete(url, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully deleted!');
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_DELETE_FINISHED' });
        store.doFetchTelemetryDataEntry(store.selectDataEntryLastParams());
      } else {
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_DELETE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your entries and please try again.');
      }
    });
  },

  doDeleteBulk: (data, type, del) => async ({ dispatch, store }) => {
    store.doSetLoadingState(true);
    store.doSetLoadingMessage(`Deleting ${data.length} Fish data entries...`);

    let iDType;
    switch (type) {
      case 'fish':
        iDType = 'fid';
        break;
      default:
        break;
    }

    data.forEach(async item => {
      await item.data.id ? store.doDeleteStaged(item.data.id) : del(item.data[iDType], true);
    });

    setTimeout(() => {
      store.doSetLoadingState(false);
      store.doSetLoadingMessage('Loading...');
      toast.success('Fish data entries were successfully deleted!');
      dispatch({ type: 'BULK_DELETE_SUCCESSFUL' });
    }, '2000');
  },

  doDeleteStaged: (id) => ({ dispatch, store }) => {
    const testArr = [...store.selectStagedData()];
    const index = testArr.findIndex(item => item.id === id);
    testArr.splice(index, 1);
    dispatch({ type: 'UPDATE_STAGED_DATA', payload: testArr });
  },

  // TABS

  doUpdateCurrentTab: (tab) => ({ dispatch }) => {
    dispatch({ type: 'UPDATE_CURRENT_TAB', payload: tab });
  },

  // RESET
  doResetFishDataEntries: () => ({ dispatch }) => {
    dispatch({ type: 'RESET_FISH_DATA_ENTRIES' });
  },

  doResetSupplementalDataEntries: () => ({ dispatch }) => {
    dispatch({ type: 'RESET_SUPP_DATA_ENTRIES' });
  },

  doResetProcedureDataEntries: () => ({ dispatch }) => {
    dispatch({ type: 'RESET_PROCEDURE_DATA_ENTRIES' });
  },

  doResetTelemetryDataEntries: () => ({ dispatch }) => {
    dispatch({ type: 'RESET_TELEMETRY_DATA_ENTRIES' });
  },

  doResetStagedData: () => ({ dispatch }) => {
    dispatch({ type: 'RESET_STAGED_DATA' });
  }
};