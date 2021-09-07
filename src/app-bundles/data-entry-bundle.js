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

  selectDataEntryRowData: state => state.dataEntry.data,
  selectDataEntryRowCount: state => state.dataEntry.totalCount,
  selectDataEntryActiveType: state => state.dataEntry.activeType,

  doDataEntryLoadData: () => ({ dispatch, store }) => {
    dispatch({ type: 'LOADING_DATA_ENTRY_INIT_DATA' });
    store.doDomainProjectsFetch();
    store.doDomainSeasonsFetch();
    store.doDomainSegmentsFetch();
    store.doDomainBendsFetch();
  },

  doFetchMoRiverDataEntry: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'MO_RIVER_DATA_ENTRY_FETCH_START' });

    const url = `/psapi/moriverDataEntry${queryFromObject(params)}`;

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'DATA_ENTRY_UPDATED_DATA',
        payload: {
          data: body,
          type: 'missouriRiver',
        },
      });
      dispatch({ type: 'MO_RIVER_DATA_ENTRY_FETCH_FINISHED' });
    });
  },

  doFetchSupplementalDataEntry: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_FETCH_START' });

    const url = `/psapi/supplementalDataEntry${queryFromObject(params)}`;

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'DATA_ENTRY_UPDATED_DATA',
        payload: {
          data: body,
          type: 'supplemental',
        },
      });
      dispatch({ type: 'SUPPLEMENTAL_DATA_ENTRY_FETCH_FINISHED' });
    });
  },

  doFetchFishDataEntry: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'FISH_DATA_ENTRY_FETCH_START' });

    const url = `/psapi/fishDataEntry${queryFromObject(params)}`;

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'DATA_ENTRY_UPDATED_DATA',
        payload: {
          data: body,
          type: 'fish',
        },
      });
      dispatch({ type: 'FISH_DATA_ENTRY_FETCH_FINISHED' });
    });
  },
};
