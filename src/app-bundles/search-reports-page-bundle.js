export default {
  name: 'searchReports',
  getReducer: () => {
    const initialData = {
      totalResults: 0,
      resultsPerPage: 20,
      pageNumber: 0,
      data: [],
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'SEARCH_REPORTS_UPDATE_PAGINATION':
          return {
            ...state,
            pageNumber: payload.pageNumber,
            resultsPerPage: payload.resultsPerPage,
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

  selectSearchReportsResultsPerPage: state => state.searchReports.resultsPerPage,
  selectSearchReportsPageNumber: state => state.searchReports.pageNumber,
  selectSearchReportsData: state => state.searchReports.data,
  selectSearchReportsTotalResults: state => state.searchReports.totalResults,

  doSearchReportsLoadData: () => ({ dispatch, store }) => {
    dispatch({ type: 'LOADING_SEARCH_REPORTS_INIT_DATA' });
    store.doSearchReportsFetch();
  },

  doSearchReportsFetch: (pageNumber = null, numberPerPage = null, searchString = '') => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'SEARCH_REPORTS_FETCH_START' });
    const page = pageNumber !== null ? pageNumber : store.selectSearchReportsPageNumber();
    const size = numberPerPage !== null ? numberPerPage : store.selectSearchReportsResultsPerPage();

    const url = `/psapi/searchDataSummary?page=${page}&size=${size}&filter=${searchString}`;

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
};