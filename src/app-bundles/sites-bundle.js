export default {
  name: 'sites',
  getReducer: () => {
    const initialData = {
      totalResults: 0,
      resultsPerPage: 20,
      pageNumber: 0,
      data: [],
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'SITES_UPDATE_PAGINATION':
          return {
            ...state,
            pageNumber: payload.pageNumber,
            resultsPerPage: payload.resultsPerPage,
          };
        case 'SITES_UPDATED_ITEMS':
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

  selectSitesResultsPerPage: state => state.sites.resultsPerPage,
  selectSitesPageNumber: state => state.sites.pageNumber,
  selectSitesData: state => state.sites.data,
  selectSitesTotalResults: state => state.sites.totalResults,

  doSitesLoadData: () => ({ dispatch, store }) => {
    dispatch({ type: 'LOADING_SITES_INIT_DATA' });
    store.doSitesFetch();
  },

  doSitesFetch: (pageNumber = null, numberPerPage = null) => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'SITES_FETCH_START' });
    const page = pageNumber !== null ? pageNumber : store.selectSitesPageNumber();
    const size = numberPerPage !== null ? numberPerPage : store.selectSitesResultsPerPage();

    const url = `/psapi/sites?page=${page}&size=${size}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'SITES_UPDATED_ITEMS',
          payload: body,
        });
        dispatch({ type: 'SITES_FETCH_FINISHED' });
      } else {
        dispatch({ type: 'SITES_FETCH_ERROR', payload: err });
      }
    });
  },
};