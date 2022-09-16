import { toast } from 'react-toastify';
import { tSuccess, tError, tWarning } from 'common/toast/toastHelper';
import { queryFromObject } from 'utils';

export default {
  name: 'dataEntry',
  getReducer: () => {
    const initialData = {
      data: [],
      fishData: {},
      supplementalData: [],
      searchData: [],
      telemetryData: {},
      totalCount: 0,
      activeType: '',
      lastParams: {},
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'MO_RIVER_DATA_ENTRY_FETCH_START':
        case 'SUPPLEMENTAL_DATA_ENTRY_FETCH_START':
        case 'SEARCH_DATA_ENTRY_FETCH_START':
        case 'TELEMETRY_DATA_ENTRY_FETCH_START':
          return {
            ...state,
            lastParams: payload,
          };
        case 'FISH_DATA_ENTRY_FETCH_START':
          return {
            ...state,
            lastParams: payload,
          };

        case 'DATA_ENTRY_UPDATED_DATA':
          return {
            ...state,
            data: payload.data.items,
            totalCount: payload.data.totalCount,
            activeType: payload.type,
          };
        case 'DATA_ENTRY_UPDATE_FISH_DATA':
          return {
            ...state,
            fishData: payload,
          };
        case 'DATA_ENTRY_UPDATE_SUPPLEMENTAL_DATA':
          return {
            ...state,
            supplementalData: payload,
          };
        case 'DATA_ENTRY_UPDATE_SEARCH_DATA':
          return {
            ...state,
            searchData: payload,
          };
        case 'DATA_ENTRY_UPDATE_TELEMETRY_DATA':
          return {
            ...state,
            telemetryData: payload,
          };

        case 'DATA_ENTRY_UPDATE_ACTIVE_TYPE':
          return {
            ...state,
            activeType: payload,
          };
        default:
          return state;
      }
    };
  },

  selectDataEntry: state => state.dataEntry,
  selectDataEntryData: state => state.dataEntry.data.length ? state.dataEntry.data[0] : {},
  selectDataEntryFishData: state => state.dataEntry.fishData,
  selectDataEntryTelemetryData: state => state.dataEntry.telemetryData,
  selectDataEntrySearchData: state => state.dataEntry.searchData,
  selectDataEntryTotalCount: state => state.dataEntry.totalCount,
  selectDataEntryActiveType: state => state.dataEntry.activeType,
  selectDataEntryLastParams: state => state.dataEntry.lastParams,

  doDataEntrySetActiveType: (type) => ({ dispatch }) => {
    dispatch({ type: 'DATA_ENTRY_UPDATE_ACTIVE_TYPE', payload: type });
  },

  doDataEntryLoadData: () => ({ dispatch, store }) => {
    dispatch({ type: 'LOADING_DATA_ENTRY_INIT_DATA' });
    store.doDomainFieldOfficesFetch();
    store.doDomainProjectsFetch();
    store.doDomainSeasonsFetch();
    store.doDomainSegmentsFetch();
    store.doDomainBendsFetch();
    store.doDomainSampleUnitTypesFetch();
  },

  doFetchMoRiverDataEntry: (params, ignoreToast = false) => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'MO_RIVER_DATA_ENTRY_FETCH_START', payload: params });
    const toastId = ignoreToast ? null : toast.loading('Finding datasheet...');

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

        if (store.selectDataEntryTotalCount() === 0 && !ignoreToast) {
          tError(toastId, 'No datasheets found. Please try again.');
        } else {
          if (!ignoreToast) {
            tSuccess(toastId, 'Datasheet found!');
          }
          store.doUpdateUrl('/sites-list/datasheet/missouriRiver-edit');
        }
        dispatch({ type: 'MO_RIVER_DATA_ENTRY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'MO_RIVER_DATA_ENTRY_FETCH_ERROR', payload: err });
        if (!ignoreToast) {
          tError(toastId, 'Error searching for datasheet. Please try again.');
        }
      }

    });
  },

  doFetchSupplementalDataEntry: (params) => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_FETCH_START', payload: params });
    const toastId = toast.loading('Finding datasheet...');

    const url = `/psapi/supplementalDataEntry${queryFromObject(params)}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'DATA_ENTRY_UPDATED_DATA',
          payload: {
            data: body,
            type: 'supplemental',
          },
        });

        if (store.selectDataEntryTotalCount() === 0) {
          tWarning(toastId, 'No supplemental datasheets.');
        } else {
          tSuccess(toastId, 'Datasheet found!');
          store.doUpdateUrl('/sites-list/datasheet/supplemental-edit');
        }
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_FETCH_ERROR', payload: err });
        tError(toastId, 'Error searching for datasheet. Please try again.');
      }
    });
  },


  doFetchFishDataEntry: (params, callback = null) => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'FISH_DATA_ENTRY_FETCH_START', payload: params });
    const toastId = toast.loading('Finding datasheet...');

    const url = `/psapi/fishDataEntry${queryFromObject(params)}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'DATA_ENTRY_UPDATED_DATA',
          payload: {
            data: body,
            type: 'fish',
          },
        });

        if (store.selectDataEntryTotalCount() === 0) {
          tError(toastId, 'No datasheets found. Please try again.');
        } else {
          tSuccess(toastId, 'Datasheet found!');
          if (callback && typeof callback === 'function') {
            callback();
          }
        }
        dispatch({ type: 'FISH_DATA_ENTRY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'FISH_DATA_ENTRY_FETCH_ERROR', payload: err });
        tError(toastId, 'Error searching for datasheet. Please try again.');
      }
    });
  },

  doFetchSearchDataEntry: (params) => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'SEARCH_DATA_ENTRY_FETCH_START', payload: params });
    const toastId = toast.loading('Finding datasheet...');

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
          tError(toastId, 'No datasheets found. Please try again.');
        } else {
          tSuccess(toastId, 'Datasheet found!');
          store.doUpdateUrl('/sites-list/datasheet/searchEffort-edit');
        }
        dispatch({ type: 'SEARCH_DATA_ENTRY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'SEARCH_DATA_ENTRY_FETCH_ERROR', payload: err });
        tError(toastId, 'Error searching for datasheet. Please try again.');
      }
    });
  },

  doFetchTelemetryDataEntry: (params, callback = null) => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'TELEMETRY_DATA_ENTRY_FETCH_START', payload: params });
    const toastId = toast.loading('Finding datasheet...');

    const url = `/psapi/telemetryDataEntry${queryFromObject(params)}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'DATA_ENTRY_UPDATED_DATA',
          payload: {
            data: body,
            type: 'telemetry',
          },
        });

        if (store.selectDataEntryTotalCount() === 0) {
          tError(toastId, 'No datasheets found. Please try again.');
        } else {
          tSuccess(toastId, 'Datasheet found!');
          if (callback && typeof callback === 'function') {
            callback();
          }
        }
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_FETCH_ERROR', payload: err });
        tError(toastId, 'Error searching for datasheet. Please try again.');
      }
    });
  },

  doSaveMoRiverDataEntry: (formData) => ({ dispatch, store, apiPost }) => {
    dispatch({ type: 'MO_RIVER_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving datasheet...');
    // const params = store.selectDataEntryLastParams();

    const url = '/psapi/moriverDataEntry';

    apiPost(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'MO_RIVER_DATA_ENTRY_UPDATE_FINISHED' });
        // store.doFetchMoRiverDataEntry(params, true);
      } else {
        dispatch({ type: 'MO_RIVER_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  doSaveSearchDataEntry: (formData) => ({ dispatch, store, apiPost }) => {
    dispatch({ type: 'SEARCH_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving datasheet...');
    // const params = store.selectDataEntryLastParams();

    const url = '/psapi/searchDataEntry';

    apiPost(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'SEARCH_DATA_ENTRY_UPDATE_FINISHED' });
        // store.doFetchMoRiverDataEntry(params, true);
      } else {
        dispatch({ type: 'SEARCH_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  doSaveTelemetryDataEntry: (formData) => ({ dispatch, store, apiPost }) => {
    dispatch({ type: 'TELEMETRY_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving datasheet...');
    // const params = store.selectDataEntryLastParams();

    const url = '/psapi/telemetryDataEntry';

    apiPost(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_UPDATE_FINISHED' });
        // store.doFetchMoRiverDataEntry(params, true);
      } else {
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  doSaveFishDataEntry: (formData) => ({ dispatch, store, apiPost }) => {
    dispatch({ type: 'FISH_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving datasheet...');
    // const params = store.selectDataEntryLastParams();

    const url = '/psapi/fishDataEntry';

    apiPost(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'FISH_DATA_ENTRY_UPDATE_FINISHED' });
        // store.doFetchMoRiverDataEntry(params, true);
      } else {
        dispatch({ type: 'FISH_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  doUpdateMoRiverDataEntry: (formData) => ({ dispatch, store, apiPut }) => {
    dispatch({ type: 'MO_RIVER_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving datasheet...');
    // const params = store.selectDataEntryLastParams();

    const url = '/psapi/moriverDataEntry';

    apiPut(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'MO_RIVER_DATA_ENTRY_UPDATE_FINISHED' });
        // store.doFetchMoRiverDataEntry(params, true);
      } else {
        dispatch({ type: 'MO_RIVER_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  doUpdateSearchDataEntry: (formData) => ({ dispatch, store, apiPut }) => {
    dispatch({ type: 'SEARCH_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving datasheet...');
    // const params = store.selectDataEntryLastParams();

    const url = '/psapi/searchDataEntry';

    apiPut(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'SEARCH_DATA_ENTRY_UPDATE_FINISHED' });
        // store.doFetchMoRiverDataEntry(params, true);
      } else {
        dispatch({ type: 'SEARCH_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  doUpdateTelemetryDataEntry: (formData) => ({ dispatch, store, apiPut }) => {
    dispatch({ type: 'TELEMETRY_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving datasheet...');
    // const params = store.selectDataEntryLastParams();

    const url = '/psapi/telemetryDataEntry';

    apiPut(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_UPDATE_FINISHED' });
        // store.doFetchMoRiverDataEntry(params, true);
      } else {
        dispatch({ type: 'TELEMETRY_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }
    });
  },

  doUpdateFishDataEntry: (rowData) => ({ dispatch, apiPut }) => {
    dispatch({ type: 'FISH_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving fish datasheet...');

    const url = '/psapi/fishDataEntry';

    apiPut(url, rowData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'FISH_DATA_ENTRY_UPDATE_FINISHED' });
      } else {
        dispatch({ type: 'FISH_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your entries and please try again.');
      }
    });
  },

  // @TODO - create 'update' functions for fish / supp (and possibly 'create' for moRiver, fish and supp)
};
