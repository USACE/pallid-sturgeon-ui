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
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
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
  selectDataEntryRowData: state => state.dataEntry.data,
  selectDataEntryRowCount: state => state.dataEntry.totalCount,
  selectDataEntryActiveType: state => state.dataEntry.activeType,

  doDataEntryLoadData: () => ({ dispatch, store }) => {
    dispatch({ type: 'LOADING_DATA_ENTRY_INIT_DATA' });
    store.doDomainFieldOfficesFetch();
    store.doDomainProjectsFetch();
    store.doDomainSeasonsFetch();
    store.doDomainSegmentsFetch();
    store.doDomainBendsFetch();
    store.doDomainSampleUnitTypesFetch();
  },

  doFetchMoRiverDataEntry: (params) => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'MO_RIVER_DATA_ENTRY_FETCH_START' });
    const toastId = toast.loading('Finding datasheet...');

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

        if (store.selectDataEntryRowCount() === 0) {
          tError(toastId, 'No datasheets found. Please try again.');
        } else {
          tSuccess(toastId, 'Datasheet found!');
          store.doUpdateUrl('/edit-data-sheet');
        }
        dispatch({ type: 'MO_RIVER_DATA_ENTRY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_FETCH_ERROR', payload: err });
        tError(toastId, 'Error searching for datasheet. Please try again.');
      }

    });
  },

  doFetchSupplementalDataEntry: (params) => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_FETCH_START' });
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

        if (store.selectDataEntryRowCount() === 0) {
          tError(toastId, 'No datasheets found. Please try again.');
        } else {
          tSuccess(toastId, 'Datasheet found!');
          store.doUpdateUrl('/edit-data-sheet');
        }
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_FETCH_ERROR', payload: err });
        tError(toastId, 'Error searching for datasheet. Please try again.');
      }
    });
  },

  doFetchFishDataEntry: (params) => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'FISH_DATA_ENTRY_FETCH_START' });
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

        if (store.selectDataEntryRowCount() === 0) {
          tError(toastId, 'No datasheets found. Please try again.');
        } else {
          tSuccess(toastId, 'Datasheet found!');
          store.doUpdateUrl('/edit-data-sheet');
        }
        dispatch({ type: 'FISH_DATA_ENTRY_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_FETCH_ERROR', payload: err });
        tError(toastId, 'Error searching for datasheet. Please try again.');
      }      
    });
  },
};
