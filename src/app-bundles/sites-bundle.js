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

  doNewSiteLoadData: () => ({ dispatch, store }) => {
    dispatch({ type: 'LOADING_NEW_SITE_INIT_DATA' });

    store.doDomainProjectsFetch();
    store.doDomainSeasonsFetch();
    store.doDomainSegmentsFetch();
    store.doDomainBendsFetch();
    store.doDomainFieldOfficesFetch();
    store.doDomainSampleUnitTypesFetch();
  },

  doSitesFetch: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'SITES_FETCH_START' });
    const params = store.selectSitesParams();
    const pageSize = store.selectSitesPageSize();
    const pageNumber = store.selectSitesPageNumber();

    const query = queryFromObject({
      ...params,
      size: pageSize,
      page: pageNumber,
    });
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

  doPostNewSite: (payload) => ({ dispatch, store, apiPost }) => {
    dispatch({ type: 'SITES_POST_START' });
    const toastId = toast.loading('Saving new site...');

    const url = '/psapi/siteDataEntry';

    apiPost(url, payload, (err, _body) => {
      if (!err) {
        dispatch({ type: 'SITES_POST_FINISHED' });
        tSuccess(toastId, 'New site created!');
        store.doUpdateUrl('/sites-list');
      } else {
        dispatch({ type: 'SITES_POST_ERROR', payload: err });
        tError(toastId, 'Failed to create site. Please try again.');
      }
    });
  },

  doUpdateSite: (siteData) => ({ dispatch, apiPut }) => {
    dispatch({ type: 'SITES_UPDATE_START' });
    const toastId = toast.loading('Saving site data...');

    const { siteId, siteFid, siteYear, fieldOffice, project, segment, season, sampleUnitTypeCode, bendrn, editInitials, comments, ...rest} = siteData;

    const url = '/psapi/siteDataEntry';
    const payload = { siteId, siteFid, siteYear, fieldOffice, project, segment, season, sampleUnitTypeCode, bendrn, editInitials, comments };

    apiPut(url, payload, (err, _body) => {
      if (!err) {
        dispatch({ type: 'SITES_UPDATE_FINISHED' });
        tSuccess(toastId, 'Changes successfully saved!');
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