import { queryFromObject } from 'utils';

export default {
  name: 'searchReports',
  getReducer: () => {
    const initialData = {
      data: [],
      filter: '',
      totalResults: 0,
      pageSize: 20,
      pageNumber: 0,
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'SET_SEARCH_REPORTS_FILTER':
          return {
            ...state,
            filter: payload,
          };
        case 'SET_SEARCH_REPORTS_PAGINATION':
          return {
            ...state,
            pageNumber: payload.pageNumber,
            pageSize: payload.pageSize,
          };
        case 'SEARCH_REPORTS_UPDATED_ITEMS':
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

  selectSearchReports: state => state.searchReports,
  selectSearchReportsData: state => state.searchReports.data,
  selectSearchReportsFilter: state => state.searchReports.filter,
  selectSearchReportsPageSize: state => state.searchReports.pageSize,
  selectSearchReportsPageNumber: state => state.searchReports.pageNumber,
  selectSearchReportsTotalResults: state => state.searchReports.totalResults,

  doSearchReportsLoadData: () => ({ dispatch, store }) => {
    dispatch({ type: 'LOADING_SEARCH_REPORTS_INIT_DATA' });
    store.doSearchReportsFetch();
  },

  doSearchReportsFetch: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'SEARCH_REPORTS_FETCH_START' });
    const page = store.selectSearchReportsPageNumber();
    const size = store.selectSearchReportsPageSize();
    const filter = store.selectSearchReportsFilter();

    const query = queryFromObject({ page, size, filter });

    const url = `/psapi/searchDataSummary${query}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'SEARCH_REPORTS_UPDATED_ITEMS',
          payload: body,
        });
        dispatch({ type: 'SEARCH_REPORTS_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'SEARCH_REPORTS_FETCH_ERROR', payload: err });
      }
    });
  },

  doSetFilter: (filter = '') => ({ dispatch, store }) => {
    dispatch({ type: 'SET_SEARCH_REPORTS_FILTER', payload: filter});
    store.doSearchReportsFetch();
  },

  doSetSearchReportsPagination: ({ pageSize, pageNumber }) => ({ dispatch, store }) => {
    dispatch({ type: 'SET_SEARCH_REPORTS_PAGINATION', payload: { pageSize, pageNumber }});
    store.doSearchReportsFetch();
  },
};