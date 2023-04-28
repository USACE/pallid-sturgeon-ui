import { toast } from 'react-toastify';
import { tSuccess, tError } from 'common/toast/toastHelper';
import { queryFromObject } from 'utils';

const geneticCardSummaryBundle = {
  name: 'geneticCardSummary',

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
        case 'UPDATE_GENETIC_CARD_SUMMARY_PARAMS':
          return {
            ...state,
            params: {
              ...state.params,
              ...payload,
            },
          };
        case 'UPDATE_GENETIC_CARD_SUMMARY_PAGINATION':
          return {
            ...state,
            pageSize: payload.pageSize,
            pageNumber: payload.pageNumber,
          };
        case 'GENETIC_CARD_SUMMARY_UPDATED_DATA':
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

  selectGeneticCardSummary: state => state.geneticCardSummary,
  selectGeneticCardSummaryData: state => state.geneticCardSummary.data,
  selectGeneticCardSummaryParams: state => state.geneticCardSummary.params,
  selectGeneticCardSummaryPagination: state => ({
    pageSize: state.geneticCardSummary.pageSize,
    pageNumber: state.geneticCardSummary.pageNumber,
    totalResults: state.geneticCardSummary.totalResults,
  }),

  doFetchGeneticCardSummary: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'GENETIC_CARD_SUMMARY_FETCH_START' });
    const toastId = toast.loading('Loading genetic card summary data...');

    const params = store.selectGeneticCardSummaryParams();
    params['id'] = store.selectUserRole().id;
    const query = queryFromObject(params);
    const url = `/psapi/geneticDataSummary${query}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'GENETIC_CARD_SUMMARY_UPDATED_DATA',
          payload: body,
        });
        dispatch({ type: 'GENETIC_CARD_SUMMARY_FETCH_FINISHED' });
        tSuccess(toastId, 'Successfully loaded genetic card summary data.');
      } else {
        dispatch({ type: 'GENETIC_CARD_SUMMARY_FETCH_ERROR' });
        tError(toastId, 'Failed to fetch genetic card summary data.');
      }
    });
  },

  doFetchAllGeneticCardSummary: (filePrefix) => ({ dispatch, store, apiFetch }) => {
    dispatch({ type: 'ALL_GENETIC_CARD_SUMMARY_FETCH_START' });
    const toastId = toast.loading('Preparing file for download...');

    const params = store.selectGeneticCardSummaryParams();
    const query = queryFromObject(params);
    const url = `/psapi/geneticFullDataSummary${query}`;

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
      });
    dispatch({ type: 'ALL_GENETIC_CARD_SUMMARY_FETCH_FINISHED' });
  },

  doUpdateGeneticCardSummaryParams: (params) => ({ dispatch }) => {
    dispatch({ type: 'UPDATE_GENETIC_CARD_SUMMARY_PARAMS', payload: params });
  },

  doUpdateGeneticCardSummaryPagination: ({ pageNumber, pageSize }) => ({ dispatch, store }) => {
    dispatch({ type: 'UPDATE_GENETIC_CARD_SUMMARY_PAGINATION', payload: { pageNumber, pageSize } });
    store.doFetchGeneticCardSummary();
  },
};

export default geneticCardSummaryBundle;
