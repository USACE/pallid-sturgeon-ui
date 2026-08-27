import { toast } from 'react-toastify';
import { tSuccess, tError, tWarning } from '@common/toast/toastHelper';
import { queryFromObject } from '@src/utils';
import { ApiStatuses } from '@src/utils/enums';
import { db } from '@src/app-pages/data-entry/offline/db';
import { isOnline } from '@src/app-pages/data-entry/offline/api';

const rootUrl = '/psapi/DataEntry/';

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

        case 'RESET_FORM_DATA_ENTRY':
          return {
            ...state,
            data: [],
            totalCount: 0,
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
    async ({ dispatch, store }) => {
      if (isOnline()) {
        // Load data
        store.doFetchFishDataEntry({ mrId: id, id: store.selectUserRole().id }, null, false);
        store.doFetchSupplementalDataEntry({ mrId: id, id: store.selectUserRole().id }, null, false);
        store.doFetchProcedureDataEntry({ mrId: id, id: store.selectUserRole().id }, null, false);
        // Load supporting data
        store.doDomainsFtPrefixesFetch();
        store.doDomainsMrFetch();
        store.doDomainsOtolithFetch();
        store.doDomainsSpeciesFetch();
        return;
      }
      const matchMr = (row) => {
        const possibleMrId = [row?.mrId, row?.mr_id, row?.mrFid, row?.mr_fid];
        return possibleMrId.some((value) => value !== undefined && value !== null && String(value) === String(id));
      };
      const fishData = await db.fish.toArray();
      const suppData = await db.supplemental.toArray();
      const procData = await db.procedure.toArray();
      const fishRecords = fishData.filter(matchMr);
      const suppRecords = suppData.filter(matchMr);
      // const procRecords = procData.filter(matchMr);
      const fishIdForMr = new Set(
        fishRecords
          .map((fish) => fish?.fid ?? fish?.fId ?? fish?.f_id)
          .filter((fishId) => fishId !== undefined && fishId !== null)
          .map(String)
      );
      const fishFidForMr = new Set(
        fishRecords
          .map((fish) => fish?.fFid ?? fish?.f_fid ?? fish?.ffid)
          .filter(Boolean)
          .map(String)
      );
      const procRecords = procData.filter((proc) => {
        const procFishId = proc?.fid ?? proc?.fId ?? proc?.f_id;
        const procFishFid = proc?.fFid ?? proc?.f_fid ?? proc?.ffid;

        return (
          (procFishId !== undefined && procFishId !== null && fishIdForMr.has(String(procFishId))) ||
          (procFishFid && fishFidForMr.has(String(procFishFid)))
        );
      });

      dispatch({
        type: 'DATA_ENTRY_UPDATE_FISH_DATA',
        payload: {
          items: fishRecords,
          totalCount: fishRecords.length,
        },
      });

      dispatch({
        type: 'DATA_ENTRY_UPDATE_SUPPLEMENTAL_DATA',
        payload: {
          items: suppRecords,
          totalCount: suppRecords.length,
        },
      });

      dispatch({
        type: 'DATA_ENTRY_UPDATE_PROCEDURE_DATA',
        payload: {
          items: procRecords,
          totalCount: procRecords.length,
        },
      });
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
    async ({ dispatch, store }) => {
      dispatch({ type: 'RESET_TELEMETRY_DATA_ENTRIES' });

      if (!id) return;
      if (isOnline()) {
        // Load data
        store.doFetchTelemetryDataEntry({ seId: id, id: store.selectUserRole().id }, null, false);
        return;
      }
      const telemetryRecords = await db.telemetry
        .filter((row) => {
          const rowSearchId = [row?.seId, row?.se_id, row?.seFid, row?.se_fid];
          return rowSearchId.some(
            (value) => value !== undefined && value !== null && value !== '' && String(value) === String(id)
          );
        })
        .toArray();

      dispatch({
        type: 'DATA_ENTRY_UPDATE_TELEMETRY_DATA',
        payload: {
          items: telemetryRecords,
          totalCount: telemetryRecords.length,
        },
      });
    },

  // DATA ENTRY FETCHES

  doFetchMoRiverDataEntry:
    (params, ignoreToast = false, loadData = false, callback = false) =>
    async ({ dispatch, store, apiGet }) => {
      dispatch({ type: 'DATA_ENTRY_FETCH_START', payload: params });
      const moriverId = params?.tableId ?? params?.mrId ?? params?.mrFid;

      if (!isOnline()) {
        const moriverRecord = await db.moriver
          .filter((row) => {
            const possibleId = [row?.mrId, row?.mr_id, row?.mrFid, row?.mr_fid];
            return possibleId.some(
              (value) => value !== undefined && value !== null && String(value) === String(moriverId)
            );
          })
          .first();

        const moriverRouteId =
          moriverRecord?.mrId ?? moriverRecord?.mr_id ?? moriverRecord?.mrFid ?? moriverRecord?.mr_fid;
        const siteRouteId =
          moriverRecord?.siteRouteKey ??
          moriverRecord?.siteFid ??
          moriverRecord?.site_fid ??
          moriverRecord?.siteId ??
          moriverRecord?.site_id;

        dispatch({
          type: 'DATA_ENTRY_UPDATED_DATA',
          payload: {
            data: {
              items: [moriverRecord],
              totalCount: 1,
            },
            type: 'missouriRiver',
          },
        });

        dispatch({
          type: 'UPDATE_BASE_DATA',
          payload: {
            mrId: moriverRecord?.mrId ?? moriverRecord?.mr_id,
            mrFid: moriverRecord?.mrFid ?? moriverRecord?.mr_fid,
            siteId: moriverRecord?.siteId ?? moriverRecord?.site_id,
            siteFid: moriverRecord?.siteFid ?? moriverRecord?.site_fid ?? moriverRecord?.siteRouteKey,
          },
        });

        if (callback) {
          store.doUpdateUrl(`/sites-list/${siteRouteId}/missouri-river/${moriverRouteId}`);
          store.doUpdateComplexStateField({ name: 'isEditForm', value: true });
          loadData && (await store.doMoRiverDatasheetLoadData(moriverRouteId));
        }
        return;
      }

      const toastId = ignoreToast ? toast.loading('Finding Missouri River datasheet(s)...') : null;

      const url = `${rootUrl}getMoriverDataEntry${queryFromObject(params)}`;

      apiGet(url, (err, body) => {
        if (!err && body?.status === ApiStatuses.Success) {
          const mrId = body?.data?.items?.[0]?.mrId;
          const mrFid = body?.data?.items?.[0]?.mrFid;
          const siteId = body?.data?.items?.[0]?.siteId;
          store.doFetchSites({ siteId: siteId });

          dispatch({
            type: 'DATA_ENTRY_UPDATED_DATA',
            payload: {
              data: body?.data,
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
        if (!err && body?.status === ApiStatuses.Success) {
          const mrId = body?.data?.items?.[0]?.mrId;
          const mrFid = body?.data?.items?.[0]?.mrFid;
          const siteId = body?.data?.items?.[0]?.siteId;
          store.doFetchSites({ siteId: siteId });

          dispatch({
            type: 'DATA_ENTRY_UPDATE_FISH_DATA',
            payload: body?.data,
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
        if (!err && body?.status === ApiStatuses.Success) {
          const mrId = body?.data?.items?.[0]?.mrId;
          const mrFid = body?.data?.items?.[0]?.mrFid;
          const siteId = body?.data?.items?.[0]?.siteId;
          store.doFetchSites({ siteId: siteId });

          dispatch({
            type: 'DATA_ENTRY_UPDATE_SUPPLEMENTAL_DATA',
            payload: body?.data,
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
        if (!err && body?.status === ApiStatuses.Success) {
          const mrId = body?.data?.items?.[0]?.mrId;
          const mrFid = body?.data?.items?.[0]?.mrFid;
          const siteId = body?.data?.items?.[0]?.siteId;
          store.doFetchSites({ siteId: siteId });

          dispatch({
            type: 'DATA_ENTRY_UPDATE_PROCEDURE_DATA',
            payload: body?.data,
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
    async ({ dispatch, store, apiGet }) => {
      dispatch({ type: 'DATA_ENTRY_FETCH_START', payload: params });
      dispatch({ type: 'RESET_TELEMETRY_DATA_ENTRIES' });
      const searchId = params?.tableId ?? params?.seId ?? params?.seFid;

      if (!isOnline()) {
        const searchRecord = await db.search
          .filter((row) => {
            const rowSearchId = [row?.seId, row?.se_id, row?.seFid, row?.se_fid];
            return rowSearchId.some(
              (value) => value !== undefined && value !== null && value !== '' && String(value) === String(searchId)
            );
          })
          .first();
        if (!searchRecord) {
          console.error('Offline Search Effort record not found:', searchId);
          return;
        }
        const searchRouteId = searchRecord?.seId ?? searchRecord?.se_id ?? searchRecord?.seFid ?? searchRecord?.se_fid;
        const siteRouteId =
          searchRecord?.siteId ??
          searchRecord?.site_id ??
          searchRecord?.siteFid ??
          searchRecord?.site_fid ??
          searchRecord?.siteRouteKey;

        dispatch({
          type: 'DATA_ENTRY_UPDATED_DATA',
          payload: {
            data: {
              items: [searchRecord],
              totalCount: 1,
            },
            type: 'searchEffort',
          },
        });
        dispatch({
          type: 'UPDATE_BASE_DATA',
          payload: {
            seId: searchRecord?.seId ?? searchRecord?.se_id,
            seFid: searchRecord?.seFid ?? searchRecord?.se_fid,
          },
        });
        if (callback) {
          store.doUpdateUrl(`/sites-list/${siteRouteId}/search-effort/${searchRouteId}`);
          store.doUpdateComplexStateField({
            name: 'isEditForm',
            value: true,
          });
          if (loadData) {
            await store.doSearchEffortDatasheetLoadData(searchRouteId);
          }
        }
        return;
      }
      const toastId = ignoreToast ? toast.loading('Finding Search Effort datasheet(s)...') : null;

      const url = `/psapi/searchDataEntry${queryFromObject(params)}`;

      apiGet(url, (err, body) => {
        if (!err && body?.status === ApiStatuses.Success) {
          const seId = body?.data?.items?.[0]?.seId;
          const siteId = body?.data?.items?.[0]?.siteId;
          store.doFetchSites({ siteId: siteId });

          dispatch({
            type: 'DATA_ENTRY_UPDATED_DATA',
            payload: {
              data: body?.data,
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
          }
          if (callback) {
            store.doUpdateUrl(`/sites-list/${siteId}/search-effort/${seId}`);
            store.doUpdateComplexStateField({ name: 'isEditForm', value: true });
            loadData && store.doSearchEffortDatasheetLoadData(seId);
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
        if (!err && body?.status === ApiStatuses.Success) {
          const seId = body?.data?.items?.[0]?.seId;
          const siteId = body?.data?.items?.[0]?.siteId;
          store.doFetchSites({ siteId: siteId });

          dispatch({
            type: 'DATA_ENTRY_UPDATE_TELEMETRY_DATA',
            payload: body?.data,
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
              store.doSearchEffortDatasheetLoadData({ seId });
            }
          }
        } else {
          dispatch({ type: 'TELEMETRY_DATA_ENTRY_FETCH_ERROR', payload: err });
          tError(toastId, 'Error searching for Telemetry datasheet(s). Please try again.');
        }
      });
    },

  // DATA ENTRY INSERTS

  doAddMoRiverDataEntry:
    (formData) =>
    ({ dispatch, apiPost }) => {
      const toastId = toast.loading('Saving datasheet...');

      const url = `${rootUrl}addMoriverDataEntry`;

      apiPost(url, formData, (err, body) => {
        if (!err && body?.status === ApiStatuses.Success) {
          tSuccess(toastId, 'Datasheet successfully updated!');
          dispatch({ type: 'MO_RIVER_DATA_ENTRY_UPDATE_FINISHED' });
        } else {
          dispatch({ type: 'MO_RIVER_DATA_ENTRY_UPDATE_ERROR', payload: err });
          tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
        }
      });
    },

  doSaveFishDataEntry:
    (formData) =>
    ({ dispatch, store, apiPost }) => {
      const toastId = toast.loading('Saving datasheet...');

      const url = '/psapi/fishDataEntry';

      apiPost(url, formData, (err, _body) => {
        if (!err) {
          tSuccess(toastId, 'Datasheet successfully updated!');
          dispatch({ type: 'FISH_DATA_ENTRY_UPDATE_FINISHED' });
          store.doFetchFishDataEntry({ mrId: formData?.mrId, id: store.selectUserRole()?.id });
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
    ({ dispatch, store, apiPost }) =>
      new Promise((resolve, reject) => {
        const toastId = toast.loading('Saving datasheet...');

        const url = '/psapi/searchDataEntry';

        apiPost(url, formData, (err, _body) => {
          if (!err && _body?.status === ApiStatuses.Success) {
            tSuccess(toastId, 'Datasheet successfully updated!');
            dispatch({ type: 'SEARCH_DATA_ENTRY_UPDATE_FINISHED' });
            dispatch({
              type: 'DATA_ENTRY_FETCH_START',
              payload: { ...store.selectDataEntryLastParams(), seId: _body.data },
            });
            store.doFetchSearchDataEntry();
            resolve(_body);
          } else {
            dispatch({ type: 'SEARCH_DATA_ENTRY_UPDATE_ERROR', payload: err });
            tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
            reject(err || _body);
          }
        });
      }),

  doSaveTelemetryDataEntry:
    (formData) =>
    ({ dispatch, store, apiPost }) =>
      new Promise((resolve, reject) => {
        const toastId = toast.loading('Saving datasheet...');

        const url = '/psapi/telemetryDataEntry';

        apiPost(url, formData, (err, _body) => {
          console.log('apiPost err:', err);
          console.log('apiPost body:', _body);

          const apiError = err || _body?.status === 'error';

          if (!apiError) {
            tSuccess(toastId, 'Datasheet successfully updated!');
            dispatch({ type: 'TELEMETRY_DATA_ENTRY_UPDATE_FINISHED' });
            store.doFetchTelemetryDataEntry({ seId: formData?.seId, id: store.selectUserRole()?.id });
            resolve(_body);
          } else {
            dispatch({ type: 'TELEMETRY_DATA_ENTRY_UPDATE_ERROR', payload: err || _body });
            tError(toastId, _body?.message || 'Error saving datasheet. Check your field entries and please try again.');
            reject(err || _body);
          }
        });
      }),

  // DATA ENTRY UPDATES

  doUpdateMoRiverDataEntry:
    (formData) =>
    ({ dispatch, store, apiPut }) => {
      const toastId = toast.loading('Saving datasheet...');

      const url = `${rootUrl}updateMoriverDataEntry`;

      apiPut(url, formData, (err, body) => {
        if (!err && body?.status === ApiStatuses.Success) {
          tSuccess(toastId, 'Datasheet successfully updated!');
          dispatch({ type: 'MO_RIVER_DATA_ENTRY_UPDATE_FINISHED' });
        } else {
          dispatch({ type: 'MO_RIVER_DATA_ENTRY_UPDATE_ERROR', payload: err });
          tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
        }
      });
    },

  doUpdateFishDataEntry:
    (formData) =>
    ({ dispatch, store, apiPut }) => {
      const toastId = toast.loading('Saving fish datasheet...');

      const url = '/psapi/fishDataEntry';

      apiPut(url, formData, (err, _body) => {
        if (!err) {
          tSuccess(toastId, 'Datasheet successfully updated!');
          dispatch({ type: 'FISH_DATA_ENTRY_UPDATE_FINISHED' });
          store.doFetchFishDataEntry({ mrId: formData?.mrId, id: store.selectUserRole()?.id });
        } else {
          dispatch({ type: 'FISH_DATA_ENTRY_UPDATE_ERROR', payload: err });
          tError(toastId, 'Error saving datasheet. Check your entries and please try again.');
        }
      });
    },

  doUpdateSupplementalDataEntry:
    (formData, params) =>
    ({ dispatch, store, apiPut }) => {
      const toastId = toast.loading('Saving supplemental datasheet...');

      const url = '/psapi/supplementalDataEntry';

      apiPut(url, formData, (err, _body) => {
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
    (formData, params) =>
    ({ dispatch, store, apiPut }) => {
      const toastId = toast.loading('Saving procedure datasheet...');

      const url = '/psapi/procedureDataEntry';

      apiPut(url, formData, (err, _body) => {
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
    (formData) =>
    ({ dispatch, store, apiPut }) => {
      const toastId = toast.loading('Saving datasheet...');

      const url = '/psapi/telemetryDataEntry';

      apiPut(url, formData, (err, _body) => {
        const apiError = err || _body?.status === 'error';

        if (!apiError) {
          tSuccess(toastId, 'Datasheet successfully updated!');
          dispatch({ type: 'TELEMETRY_DATA_ENTRY_UPDATE_FINISHED' });
          store.doFetchTelemetryDataEntry({ seId: formData?.seId, id: store.selectUserRole()?.id });
        } else {
          dispatch({ type: 'TELEMETRY_DATA_ENTRY_UPDATE_ERROR', payload: err });
          tError(toastId, _body?.message || 'Error saving datasheet. Check your field entries and please try again.');
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
  doResetFormData:
    () =>
    ({ dispatch }) => {
      dispatch({ type: 'RESET_FORM_DATA_ENTRY' });
    },

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
