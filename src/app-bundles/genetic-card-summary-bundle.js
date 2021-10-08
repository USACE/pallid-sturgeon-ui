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

  doFetchGeneticCardSummary: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'GENETIC_CARD_SUMMARY_FETCH_START' });

    const params = store.selectGeneticCardSummaryParams();
    const query = queryFromObject(params);
    const url = `/psapi/geneticDataSummary${query}`;

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'GENETIC_CARD_SUMMARY_UPDATED_DATA',
        payload: body,
      });
      dispatch({ type: 'GENETIC_CARD_SUMMARY_FETCH_FINISHED' });
    });
  },

  doUpdateGeneticCardSummaryParams: (params) => ({ dispatch }) => {
    dispatch({ type: 'UPDATE_GENETIC_CARD_SUMMARY_PARAMS', payload: params });
  },
};

export default geneticCardSummaryBundle;
