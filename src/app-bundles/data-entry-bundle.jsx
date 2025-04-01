import { toast } from 'react-toastify';
import { tSuccess, tError, tWarning } from '@common/toast/toastHelper';
import { queryFromObject } from '@src/utils';

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
      lastParams: {},
      currentTab: 0,
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        // Fetch
        case 'DATA_ENTRY_FETCH_START':
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
            },
          };
        case 'DATA_ENTRY_UPDATE_SUPPLEMENTAL_DATA':
          return {
            ...state,
            supplementalData: {
              items: payload.items,
              totalCount: payload.totalCount,
            },
          };
        case 'DATA_ENTRY_UPDATE_PROCEDURE_DATA':
          return {
            ...state,
            procedureData: {
              items: payload.items,
              totalCount: payload.totalCount,
            },
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
            },
          };
        case 'RESET_SUPP_DATA_ENTRIES':
          return {
            ...state,
            supplementalData: {
              items: [],
              totalCount: 0,
            },
          };
        case 'RESET_PROCEDURE_DATA_ENTRIES':
          return {
            ...state,
            procedureData: {
              items: [],
              totalCount: 0,
            },
          };
        case 'RESET_TELEMETRY_DATA_ENTRIES':
          return {
            ...state,
            telemetryData: {
              items: [],
              totalCount: 0,
            },
          };

        default:
          return state;
      }
    };
  },

  selectDataEntry: (state) => state.dataEntry,
  selectDataEntryData: (state) => (state.dataEntry.data.length ? state.dataEntry.data[0] : {}),
  selectDataEntryLastParams: (state) => state.dataEntry.lastParams,
  selectCurrentTab: (state) => state.dataEntry.currentTab,
  selectDataEntryTotalCount: (state) => state.dataEntry.totalCount,

  selectDataEntryFishData: (state) => state.dataEntry.fishData,
  selectDataEntryFishTotalCount: (state) => state.dataEntry.fishData.totalCount,

  selectDataEntrySupplemental: (state) => state.dataEntry.supplementalData,
  selectDataEntrySupplementalTotalCount: (state) => state.dataEntry.supplementalData.totalCount,

  selectDataEntryProcedure: (state) => state.dataEntry.procedureData,
  selectDataEntryProcedureTotalCount: (state) => state.dataEntry.procedureData.totalCount,

  selectDataEntryTelemetryData: (state) => state.dataEntry.telemetryData,
  selectDataEntryTelemetryTotalCount: (state) => state.dataEntry.telemetryData.totalCount,

  doDataEntryLoadData:
    () =>
    ({ store }) => {
      store.doDomainFieldOfficesFetch();
      store.doDomainProjectsFetch();
      store.doDomainSampleUnitTypesFetch();
    },

  doMoRiverDatasheetLoadData:
    (id) =>
    ({ store }) => {
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

  doResetMoRiverDataEntryData:
    () =>
    ({ store }) => {
      store.doResetFishDataEntries();
      store.doResetSupplementalDataEntries();
      store.doResetProcedureDataEntries();
    },

  doSearchEffortDatasheetLoadData:
    (id) =>
    ({ store }) => {
      // Load data
      store.doFetchTelemetryDataEntry({ seId: id, id: store.selectUserRole().id }, null, false);
    },

  // DATA ENTRY FETCHES

  doFetchMoRiverDataEntry:
    (params, ignoreToast = false, loadData = false, callback = false) =>
    ({ dispatch, store, apiGet }) => {
      dispatch({ type: 'DATA_ENTRY_FETCH_START', payload: params });
      const toastId = ignoreToast ? toast.loading('Finding Missouri River datasheet(s)...') : null;

      const url = `/psapi/moriverDataEntry${queryFromObject(params)}`;

      apiGet(url, (err, body) => {
        if (!err) {
          const mrId = body?.items?.[0]?.mrId;
          const mrFid = body?.items?.[0]?.mrFid;
          const siteId = body?.items?.[0]?.siteId;

          store.doSitesFetch({ siteId: siteId });

          dispatch({
            type: 'DATA_ENTRY_UPDATED_DATA',
            payload: {
              data: body,
              type: 'missouriRiver',
            },
          });
          dispatch({
            type: 'UPDATE_BASE_DATA',
            payload: {
              mrId: mrId,
              mrFid: mrFid,
            },
          });

          if (store.selectDataEntryTotalCount() === 0) {
            ignoreToast && tWarning(toastId, 'No Missouri River datasheet(s) found.');
          } else {
            ignoreToast && tSuccess(toastId, 'Missouri River datasheet(s) found!');
            if (callback) {
              store.doUpdateUrl(`/sites-list/${siteId}/missouri-river/${mrId}`);
              store.doUpdateComplexStateField({ name: 'isEditForm', value: true });
              loadData && store.doMoRiverDatasheetLoadData(mrId);
            }
          }
        } else {
          dispatch({ type: 'MO_RIVER_DATA_ENTRY_FETCH_ERROR', payload: err });
          tError(toastId, 'Error searching for Missouri River datasheet(s). Please try again.');
        }
      });
    },

  doFetchFishDataEntry:
    (params, callback = false, ignoreToast = false) =>
    ({ dispatch, store, apiGet }) => {
      dispatch({ type: 'DATA_ENTRY_FETCH_START', payload: params });
      const toastId = ignoreToast ? toast.loading('Finding Fish datasheet(s)...') : null;

      const url = `/psapi/fishDataEntry${queryFromObject(params)}`;

      apiGet(url, (err, body) => {
        if (!err) {
          const mrId = body?.items?.[0]?.mrId;
          const mrFid = body?.items?.[0]?.mrFid;
          const siteId = body?.items?.[0]?.siteId;

          store.doSitesFetch({ siteId: siteId });

          dispatch({
            type: 'DATA_ENTRY_UPDATE_FISH_DATA',
            payload: body,
          });
          dispatch({
            type: 'UPDATE_BASE_DATA',
            payload: {
              mrId: mrId,
              mrFid: mrFid,
            },
          });

          if (store.selectDataEntryFishTotalCount() === 0) {
            ignoreToast && tWarning(toastId, 'No Fish datasheet(s) found.');
          } else {
            ignoreToast && tSuccess(toastId, 'Fish datasheet(s) found!');
            if (callback) {
              store.doUpdateUrl(`/sites-list/${siteId}/missouri-river/${mrId}`);
              store.doUpdateComplexStateField({ name: 'isEditForm', value: true });
              store.doFetchMoRiverDataEntry({ tableId: mrId }, false, false, true);
              store.doMoRiverDatasheetLoadData(mrId);
            }
          }
        } else {
          dispatch({ type: 'FISH_DATA_ENTRY_FETCH_ERROR', payload: err });
          tError(toastId, 'Error searching for Fish datasheet(s). Please try again.');
        }
      });
    },

  doFetchSupplementalDataEntry:
    (params, callback = false, ignoreToast = false) =>
    ({ dispatch, store, apiGet }) => {
      dispatch({
        type: 'DATA_ENTRY_FETCH_START',
        payload: params,
      });
      const toastId = ignoreToast ? toast.loading('Finding Supplemental datasheet(s)...') : null;

      const url = `/psapi/supplementalDataEntry${queryFromObject(params)}`;

      apiGet(url, (err, body) => {
        if (!err) {
          const mrId = body?.items?.[0]?.mrId;
          const mrFid = body?.items?.[0]?.mrFid;
          const siteId = body?.items?.[0]?.siteId;

          store.doSitesFetch({ siteId: siteId });

          dispatch({
            type: 'DATA_ENTRY_UPDATE_SUPPLEMENTAL_DATA',
            payload: body,
          });
          dispatch({
            type: 'UPDATE_BASE_DATA',
            payload: {
              mrId: mrId,
              mrFid: mrFid,
            },
          });

          if (store.selectDataEntrySupplementalTotalCount() === 0) {
            ignoreToast && tWarning(toastId, 'No Supplemental datasheet(s) found.');
          } else {
            ignoreToast && tSuccess(toastId, 'Supplemental datasheet(s) found!');
            if (callback) {
              store.doUpdateUrl(`/sites-list/${siteId}/missouri-river/${mrId}`);
              store.doUpdateComplexStateField({ name: 'isEditForm', value: true });
              store.doFetchMoRiverDataEntry({ tableId: mrId }, false, false, true);
              store.doMoRiverDatasheetLoadData(mrId);
            }
          }
        } else {
          dispatch({
            type: 'SUPPLEMENTAL_DATA_ENTRY_FETCH_ERROR',
            payload: err,
          });
          tError(toastId, 'Error searching for Supplemental datasheet(s). Please try again.');
        }
      });
    },

  doFetchProcedureDataEntry:
    (params, callback = false, ignoreToast = false) =>
    ({ dispatch, store, apiGet }) => {
      dispatch({ type: 'DATA_ENTRY_FETCH_START', payload: params });
      const toastId = ignoreToast ? toast.loading('Finding Procedure datasheet(s)...') : null;

      const url = `/psapi/procedureDataEntry${queryFromObject(params)}`;

      apiGet(url, (err, body) => {
        if (!err) {
          const mrId = body?.items?.[0]?.mrId;
          const mrFid = body?.items?.[0]?.mrFid;
          const siteId = body?.items?.[0]?.siteId;

          store.doSitesFetch({ sitedId: siteId });

          dispatch({
            type: 'DATA_ENTRY_UPDATE_PROCEDURE_DATA',
            payload: body,
          });
          dispatch({
            type: 'UPDATE_BASE_DATA',
            payload: {
              mrId: mrId,
              mrFid: mrFid,
            },
          });

          if (store.selectDataEntryProcedureTotalCount() === 0) {
            ignoreToast && tWarning(toastId, 'No Procedure datasheet(s) found.');
          } else {
            ignoreToast && tSuccess(toastId, 'Procedure datasheet(s) found!');
            if (callback) {
              store.doUpdateUrl(`/sites-list/${siteId}/missouri-river/${mrId}`);
              store.doUpdateComplexStateField({ name: 'isEditForm', value: true });
              store.doFetchMoRiverDataEntry({ tableId: mrId }, false, false, true);
              store.doMoRiverDatasheetLoadData(mrId);
            }
          }
        } else {
          dispatch({ type: 'PROCEDURE_DATA_ENTRY_FETCH_ERROR', payload: err });
          tError(toastId, 'Error searching for Procedure datasheet(s). Please try again.');
        }
      });
    },

  doFetchSearchDataEntry:
    (params, ignoreToast = false, loadData = false, callback = false) =>
    ({ dispatch, store, apiGet }) => {
      dispatch({ type: 'DATA_ENTRY_FETCH_START', payload: params });
      const toastId = ignoreToast ? toast.loading('Finding Search Effort datasheet(s)...') : null;

      const url = `/psapi/searchDataEntry${queryFromObject(params)}`;

      apiGet(url, (err, body) => {
        if (!err) {
          const seId = body?.items?.[0]?.seId;
          const siteId = body?.items?.[0]?.siteId;

          store.doSitesFetch({ siteId: siteId });

          dispatch({
            type: 'DATA_ENTRY_UPDATED_DATA',
            payload: {
              data: body,
              type: 'searchEffort',
            },
          });
          dispatch({
            type: 'UPDATE_BASE_DATA',
            payload: {
              seId: seId,
            },
          });

          if (store.selectDataEntryTotalCount() === 0) {
            ignoreToast && tWarning(toastId, 'No Search Effort datasheet(s) found');
          } else {
            ignoreToast && tSuccess(toastId, 'Search Effort datasheet(s) found!');
            if (callback) {
              store.doUpdateUrl(`/sites-list/${siteId}/search-effort/${seId}`);
              store.doUpdateComplexStateField({ name: 'isEditForm', value: true });
              loadData && store.doSearchEffortDatasheetLoadData(seId);
            }
          }
        } else {
          dispatch({ type: 'SEARCH_DATA_ENTRY_FETCH_ERROR', payload: err });
          tError(toastId, 'Error searching for Search Effort datasheet(s). Please try again.');
        }
      });
    },

  doFetchTelemetryDataEntry:
    (params, callback = false, ignoreToast = false) =>
    ({ dispatch, store, apiGet }) => {
      dispatch({ type: 'DATA_ENTRY_FETCH_START', payload: params });
      const toastId = ignoreToast ? toast.loading('Finding Telemetry datasheet(s)...') : null;

      const url = `/psapi/telemetryDataEntry${queryFromObject(params)}`;

      apiGet(url, (err, body) => {
        if (!err) {
          const seId = body?.items?.[0]?.seId;
          const siteId = body?.items?.[0]?.siteId;

          store.doSitesFetch({ siteId: siteId });

          dispatch({
            type: 'DATA_ENTRY_UPDATE_TELEMETRY_DATA',
            payload: body,
          });
          dispatch({
            type: 'UPDATE_BASE_DATA',
            payload: {
              seId: seId,
            },
          });

          if (store.selectDataEntryTelemetryTotalCount() === 0) {
            ignoreToast && tWarning(toastId, 'No Telemetry datasheet(s) found.');
          } else {
            ignoreToast && tSuccess(toastId, 'Telemetry datasheet(s) found!');
            if (callback) {
              store.doUpdateUrl(`/sites-list/${siteId}/search-effort/${seId}`);
              store.doUpdateComplexStateField({ name: 'isEditForm', value: true });
              store.doFetchSearchDataEntry({ tableId: seId }, false, false, true);
              store.doSearchEffortDatasheetLoadData(seId);
            }
          }
        } else {
          dispatch({ type: 'TELEMETRY_DATA_ENTRY_FETCH_ERROR', payload: err });
          tError(toastId, 'Error searching for Telemetry datasheet(s). Please try again.');
        }
      });
    },

  // DATA ENTRY INSERTS

  doSaveMoRiverDataEntry:
    (formData) =>
    ({ dispatch, store, apiPost }) => {
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

  doSaveFishDataEntry:
    (formData, params) =>
    ({ dispatch, store, apiPost }) => {
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

  doSaveSupplementalDataEntry:
    (formData, params) =>
    ({ dispatch, store, apiPost }) => {
      const toastId = toast.loading('Saving datasheet...');

      const url = '/psapi/supplementalDataEntry';

      apiPost(url, formData, (err, _body) => {
        if (!err) {
          tSuccess(toastId, 'Datasheet successfully updated!');
          dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_UPDATE_FINISHED' });
          store.doFetchSupplementalDataEntry(params);
        } else {
          dispatch({
            type: 'SUPPLEMENTAL_DATA_ENTRY_UPDATE_ERROR',
            payload: err,
          });
          tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
        }
      });
    },

  doSaveProcedureDataEntry:
    (formData, params) =>
    ({ dispatch, store, apiPost }) => {
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

  doSaveSearchDataEntry:
    (formData) =>
    ({ dispatch, store, apiPost }) => {
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

  doSaveTelemetryDataEntry:
    (formData, params) =>
    ({ dispatch, store, apiPost }) => {
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

  doUpdateMoRiverDataEntry:
    (formData) =>
    ({ dispatch, store, apiPut }) => {
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

  doUpdateFishDataEntry:
    (rowData, params) =>
    ({ dispatch, store, apiPut }) => {
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

  doUpdateSupplementalDataEntry:
    (rowData, params) =>
    ({ dispatch, store, apiPut }) => {
      const toastId = toast.loading('Saving supplemental datasheet...');

      const url = '/psapi/supplementalDataEntry';

      apiPut(url, rowData, (err, _body) => {
        if (!err) {
          tSuccess(toastId, 'Datasheet successfully updated!');
          dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_UPDATE_FINISHED' });
          store.doFetchSupplementalDataEntry(params);
        } else {
          dispatch({
            type: 'SUPPLEMENTAL_DATA_ENTRY_UPDATE_ERROR',
            payload: err,
          });
          tError(toastId, 'Error saving datasheet. Check your entries and please try again.');
        }
      });
    },

  doUpdateProcedureDataEntry:
    (rowData, params) =>
    ({ dispatch, store, apiPut }) => {
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

  doUpdateSearchDataEntry:
    (formData) =>
    ({ dispatch, apiPut }) => {
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

  doUpdateTelemetryDataEntry:
    (formData, params) =>
    ({ dispatch, store, apiPut }) => {
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

  doDeleteFishDataEntry:
    (id) =>
    ({ dispatch, store, apiDelete }) => {
      const toastId = toast.loading(`Deleting fish datasheet ID: ${id}...`);

      const url = `/psapi/fishDataEntry/${id}`;

      apiDelete(url, (err, _body) => {
        if (!err) {
          tSuccess(toastId, `Fish datasheet ID: ${id} successfully deleted!`);
          dispatch({ type: 'FISH_DATA_ENTRY_DELETE_FINISHED' });
          store.doFetchFishDataEntry(store.selectDataEntryLastParams());
        } else {
          dispatch({ type: 'FISH_DATA_ENTRY_DELETE_ERROR', payload: err });
          tError(toastId, `Error deleting fish datasheet ID: ${id}. Please try again.`);
        }
      });
    },

  doDeleteSupplementalDataEntry:
    (id) =>
    ({ dispatch, store, apiDelete }) => {
      const toastId = toast.loading(`Deleting supplemental datasheet ID: ${id}...`);

      const url = `/psapi/supplementalDataEntry/${id}`;

      apiDelete(url, (err, _body) => {
        if (!err) {
          tSuccess(toastId, `Supplemental datasheet ID: ${id} successfully deleted!`);
          dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_DELETE_FINISHED' });
          store.doFetchSupplementalDataEntry(store.selectDataEntryLastParams());
        } else {
          dispatch({
            type: 'SUPPLEMENTAL_DATA_ENTRY_DELETE_ERROR',
            payload: err,
          });
          tError(toastId, `Error deleting supplemental datasheet ID: ${id}. Please try again.`);
        }
      });
    },

  doDeleteProcedureDataEntry:
    (id) =>
    ({ dispatch, store, apiDelete }) => {
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

  doDeleteTelemetryDataEntry:
    (id) =>
    ({ dispatch, store, apiDelete }) => {
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

  // TABS

  doUpdateCurrentTab:
    (tab) =>
    ({ dispatch }) => {
      dispatch({ type: 'UPDATE_CURRENT_TAB', payload: tab });
    },

  // RESET
  doResetFishDataEntries:
    () =>
    ({ dispatch }) => {
      dispatch({ type: 'RESET_FISH_DATA_ENTRIES' });
    },

  doResetSupplementalDataEntries:
    () =>
    ({ dispatch }) => {
      dispatch({ type: 'RESET_SUPP_DATA_ENTRIES' });
    },

  doResetProcedureDataEntries:
    () =>
    ({ dispatch }) => {
      dispatch({ type: 'RESET_PROCEDURE_DATA_ENTRIES' });
    },

  doResetTelemetryDataEntries:
    () =>
    ({ dispatch }) => {
      dispatch({ type: 'RESET_TELEMETRY_DATA_ENTRIES' });
    },
};
