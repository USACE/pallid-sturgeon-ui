import { toast } from 'react-toastify';
import { tSuccess, tError } from 'common/toast/toastHelper';
import { queryFromObject } from 'utils';

export default {
  name: 'dataEntry',
  getReducer: () => {
    const initialData = {
      data: [],
      totalCount: 0,
      activeType: '',
      lastParams: {},
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'MO_RIVER_DATA_ENTRY_FETCH_START':
        case 'SUPPLEMENTAL_DATA_ENTRY_FETCH_START':
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
        default:
          return state;
      }
    };
  },

  selectDataEntry: state => state.dataEntry,
  selectDataEntryData: state => state.dataEntry.data.length ? state.dataEntry.data[0] : {},
  selectDataEntryTotalCount: state => state.dataEntry.totalCount,
  selectDataEntryActiveType: state => state.dataEntry.activeType,
  selectDataEntryLastParams: state => state.dataEntry.lastParams,

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
          store.doUpdateUrl('/find-data-sheet/edit-data-sheet');
        }
        dispatch({ type: 'MO_RIVER_DATA_ENTRY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_FETCH_ERROR', payload: err });
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
          tError(toastId, 'No datasheets found. Please try again.');
        } else {
          tSuccess(toastId, 'Datasheet found!');
          store.doUpdateUrl('/find-data-sheet/edit-data-sheet');
        }
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_FETCH_ERROR', payload: err });
        tError(toastId, 'Error searching for datasheet. Please try again.');
      }
    });
  },

  doFetchFishDataEntry: (params) => ({ dispatch, store, apiGet }) => {
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
          store.doUpdateUrl('/find-data-sheet/edit-data-sheet');
        }
        dispatch({ type: 'FISH_DATA_ENTRY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_FETCH_ERROR', payload: err });
        tError(toastId, 'Error searching for datasheet. Please try again.');
      }      
    });
  },

  doUpdateMoRiverDataEntry: (formData) => ({ dispatch, store, apiPut }) => {
    dispatch({ type: 'MO_RIVER_DATA_ENTRY_UPDATE_START' });
    const toastId = toast.loading('Saving datasheet...');
    const params = store.selectDataEntryLastParams();

    const url = '/psapi/moriverDataEntry';

    apiPut(url, formData, (err, _body) => {
      if (!err) {
        tSuccess(toastId, 'Datasheet successfully updated!');
        dispatch({ type: 'MO_RIVER_DATA_ENTRY_UPDATE_FINISHED' });
        store.doFetchMoRiverDataEntry(params, true);
      } else {
        dispatch({ type: 'MO_RIVER_DATA_ENTRY_UPDATE_ERROR', payload: err });
        tError(toastId, 'Error saving datasheet. Check your field entries and please try again.');
      }      
    });
  },

  // @TODO - create 'update' functions for fish / supp (and possibly 'create' for moRiver, fish and supp)
};
