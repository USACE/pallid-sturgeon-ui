import { queryFromObject } from '../utils';

export default {
  name: 'sites',
  getReducer: () => {
    const initialData = {
      totalResults: 0,
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

  selectSitesAll: state => state.sites,
  selectSitesData: state => state.sites.data,
  selectSitesTotalResults: state => state.sites.totalResults,

  doSitesLoadData: () => ({ dispatch, store }) => {
    dispatch({ type: 'LOADING_SITES_INIT_DATA' });
    store.doSitesFetch();
  },

  doNewSiteLoadData: () => ({ dispatch, store }) => {
    dispatch({ type: 'LOADING_NEW_SITE_INIT_DATA' });

    store.doDomainProjectsFetch();
    store.doDomainSeasonsFetch();
    store.doDomainSegmentsFetch();
    store.doDomainBendsFetch();
    store.doDomainFieldOfficesFetch();
    store.doDomainSampleUnitTypesFetch();
  },

  doSitesFetch: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'SITES_FETCH_START' });
    const query = queryFromObject(params);
    const url = `/psapi/siteDataEntry${query}`;

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

  doPostNewSite: (payload) => ({ dispatch, apiPost }) => {
    dispatch({ type: 'SITES_POST_START' });

    const url = '/psapi/siteDataEntry';

    apiPost(url, payload, (err, _body) => {
      if (!err) {
        dispatch({ type: 'SITES_POST_FINISHED' });
      } else {
        dispatch({ type: 'SITES_POST_ERROR', payload: err });
      }
    });
  },

  doUpdateSite: () => ({ dispatch, apiPut }) => {
    dispatch({ type: 'SITES_UPDATE_START' });

    const url = '/psapi/siteDataEntry';
    const payload = {};

    apiPut(url, payload, (err, _body) => {
      if (!err) {
        dispatch({ type: 'SITES_UPDATE_FINISHED' });
      } else {
        dispatch({ type: 'SITES_UPDATE_ERROR', payload: err });
      }
    });
  },
};