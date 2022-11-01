import { queryFromObject } from 'utils';

import { toast } from 'react-toastify';
import { tSuccess, tError } from 'common/toast/toastHelper';

export default {
  name: 'sites',
  getReducer: () => {
    const initialData = {
      pageSize: 20,
      pageNumber: 0,
      totalResults: 0,
      data: [],
      params: {},
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'UPDATE_SITE_PARAMS':
          return {
            ...state,
            params: payload,
          };
        case 'SET_SITES_PAGINATION':
          return {
            ...state,
            pageNumber: payload.pageNumber,
            pageSize: payload.pageSize,
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
  selectSitesParams: state => state.sites.params,
  selectSitesTotalResults: state => state.sites.totalResults,
  selectSitesPageSize: state => state.sites.pageSize,
  selectSitesPageNumber: state => state.sites.pageNumber,

  doSitesLoadData: () => ({ dispatch, store }) => {
    dispatch({ type: 'LOADING_SITES_INIT_DATA' });
    store.doSitesFetch();
  },

  // @TODO: Potentially remove this
  doNewSiteLoadData: () => ({ dispatch, store }) => {
    dispatch({ type: 'LOADING_NEW_SITE_INIT_DATA' });
    store.doDomainBendRnFetch();
  },

  doSitesFetch: (data) => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'SITES_FETCH_START' });
    const params = store.selectSitesParams();
    const pageSize = store.selectSitesPageSize();
    const pageNumber = store.selectSitesPageNumber();

    const query = queryFromObject({
      ...params,
      size: pageSize,
      page: pageNumber,
    });

    const queryById = queryFromObject({
      ...data,
    });

    const url = `/psapi/siteDataEntry${data ? queryById : query}`;

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

  doPostNewSite: (params, payload) => ({ dispatch, store, apiPost }) => {
    dispatch({ type: 'SITES_POST_START' });
    const toastId = toast.loading('Saving new site...');

    const url = `/psapi/siteDataEntry${queryFromObject(params)}`;

    apiPost(url, payload, (err, _body) => {
      if (!err) {
        dispatch({ type: 'SITES_POST_FINISHED' });
        tSuccess(toastId, 'New site created!');
        store.doSitesFetch();
      } else {
        dispatch({ type: 'SITES_POST_ERROR', payload: err });
        tError(toastId, 'Failed to create site. Please try again.');
      }
    });
  },

  doUpdateSite: (siteData) => ({ dispatch, apiPut, store }) => {
    dispatch({ type: 'SITES_UPDATE_START' });
    const toastId = toast.loading('Saving site data...');

    const url = '/psapi/siteDataEntry';

    apiPut(url, siteData, (err, _body) => {
      if (!err) {
        dispatch({ type: 'SITES_UPDATE_FINISHED' });
        tSuccess(toastId, 'Changes successfully saved!');
        store.doSitesFetch();
      } else {
        dispatch({ type: 'SITES_UPDATE_ERROR', payload: err });
        tError(toastId, 'Failed to save changes. Please try again.');
      }
    });
  },

  doSetSitesPagination: ({ pageSize, pageNumber }) => ({ dispatch, store }) => {
    dispatch({ type: 'SET_SITES_PAGINATION', payload: { pageSize, pageNumber }});
    store.doSitesFetch();
  },

  doUpdateSiteParams: (params) => ({ dispatch, store }) => {
    dispatch({ type: 'UPDATE_SITE_PARAMS', payload: params });
    store.doSitesFetch();
  },
};