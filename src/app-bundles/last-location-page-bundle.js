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
        case 'UPDATE_LAST_LOCATION_PARAMS':
          return {
            ...state,
            params: payload,
          };
        case 'LAST_LOCATION_SUMMARY_UPDATED_DATA':
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
    dispatch({ type: 'LOADING_LAST_LOCATION_SUMMARY_INIT_DATA' });
    store.doFetchLastLocationDataSummary();
  },

  // action to fetch data
  doFetchLastLocationDataSummary: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'LAST_LOCATION_DATA_SUMMARY_FETCH_START' });

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
          type: 'LAST_LOCATION_SUMMARY_UPDATED_DATA',
          payload: body,
        });
      } else {
        dispatch({ type: 'LAST_LOCATION_SUMMARY_FETCH_ERROR' });
      }
    });
  },

  // csv file export
  doFetchLastLocationSummaryExport: (filePrefix) => ({ dispatch, store, apiFetch }) => {
    const toastId = toast.loading('Preparing file for download...');

    const { ...params } = store.selectLastLocationParams();
    const query = queryFromObject(params);
    const url = `/psapi/geneticFullDataSummary${query}`;
    //const url = `/psapi/lastLocationFullDataSummary${query}`; //TODO: create endpoint

    apiFetch(url)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filePrefix}-${new Date().toISOString()}.csv`;
        document.body.appendChild(a);
        tSuccess(toastId, 'File Ready!');
        a.click();
        a.remove();
      })
      .catch(err => {
        tError(toastId, 'Failed to generate file.');
        console.error('An error occurred:', err);
      });
    dispatch({ type: 'ALL_LAST_LOCATION_SUMMARY_FETCH_FINISHED' });
  },

  doUpdateLastLocationParams: (params) => ({ dispatch, store }) => {
    dispatch({ type: 'UPDATE_LAST_LOCATION_PARAMS', payload: params });
    store.doLastLocationLoadData();
  },
};

export default lastLocationSummaryBundle;
