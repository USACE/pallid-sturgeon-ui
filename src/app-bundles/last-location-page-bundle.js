import { toast } from 'react-toastify';
import { tSuccess, tError } from 'common/toast/toastHelper';
import { queryFromObject } from 'utils';

const lastLocationSummaryBundle = {
  name: 'lastLocationSummary',

  // initial state
  getReducer: () => {
    const initialData = {
      pageSize: 20,
      pageNumber: 0,
      totalResults: 0,
      params: {},
      data: [],
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'UPDATE_LASTLOCATION_PARAMS':
          return {
            ...state,
            params: payload,
          };
        case 'LASTLOCATION_SUMMARY_UPDATED_DATA':
          return {
            ...state,
            data: payload.items,
            totalResults: payload.totalCount,
          };
        default:
          return state;
      }
    };
  },

  // selectors to access the data
  selectLastLocationParams: state => state.lastLocationSummary.params,
  selectLastLocationSummaryData: state => state.lastLocationSummary.data,

  doLastLocationLoadData: () => ({ dispatch, store }) => {
    dispatch({ type: 'LOADING_LASTLOCATION_SUMMARY_INIT_DATA' });
    store.doFetchLastLocationDataSummary();
  },

  // action to fetch data
  doFetchLastLocationDataSummary: () => ({ dispatch, store, apiGet }) => {
    //const toastId = toast.loading('Loading last location summary data...');
    dispatch({ type: 'LASTLOCATION_DATA_SUMMARY_FETCH_START' });

    const { ...params } = store.selectLastLocationParams();
    const query = queryFromObject(params);
    const url = `/psapi/geneticDataSummary${query}`;
    // const url = `/psapi/lastLocationDataSummary${query}`; //TODO: future endpoint
    console.log('the url is: ', url);

    // const query = queryFromObject({
    //   ...params,
    //   size,
    //   page,
    // });

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'LASTLOCATION_SUMMARY_UPDATED_DATA',
          payload: body,
        });
        //(toastId, 'Successfully loaded last location summary data.');
      } else {
        dispatch({ type: 'LASTLOCATION_SUMMARY_FETCH_ERROR' });
        //tError(toastId, 'Failed to fetch last location summary data.');
      }
    });
  },

  doUpdateLastLocationParams: (params) => ({ dispatch, store }) => {
    dispatch({ type: 'UPDATE_LASTLOCATION_PARAMS', payload: params });
    store.doLastLocationLoadData();
  },
};

export default lastLocationSummaryBundle;
