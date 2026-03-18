import { queryFromObject } from '@src/utils';

import { toast } from 'react-toastify';
import { tSuccess, tError } from '@common/toast/toastHelper';
import { ApiStatuses } from '@src/utils/enums';

const rootUrl = '/psapi/Sites/';

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

  selectSitesAll: (state) => state.sites,
  selectSitesData: (state) => state.sites.data,
  selectSitesParams: (state) => state.sites.params,
  selectSitesTotalResults: (state) => state.sites.totalResults,
  selectSitesPageSize: (state) => state.sites.pageSize,
  selectSitesPageNumber: (state) => state.sites.pageNumber,

  doSitesLoadData:
    () =>
    ({ dispatch, store }) => {
      dispatch({ type: 'LOADING_SITES_INIT_DATA' });
      store.doFetchSites();
    },

  doFetchSites:
    (siteId) =>
    ({ dispatch, store, apiGet }) => {
      const filterParams = store.selectSitesParams();
      const pageSize = store.selectSitesPageSize();
      const pageNumber = store.selectSitesPageNumber();

      let actualSiteId = null;
      if (siteId) {
        if (typeof siteId === 'object') {
          actualSiteId = Number(siteId.siteId);
        } else {
          actualSiteId = Number(siteId);
        }
      }

      let url = '';

      if (actualSiteId) {
        const queryById = queryFromObject({
          ...filterParams,
          siteId: actualSiteId,
        });
        url = `${rootUrl}getSites${queryById}`;
      } else {
        const queryAllSites = queryFromObject({
          ...filterParams,
          size: pageSize,
          page: pageNumber,
        });
        url = `${rootUrl}getSites${queryAllSites}`;
      }

      store.doSetLoadingState(true);
      store.doSetLoadingMessage('Fetching Sites...');

      apiGet(url, (err, body) => {
        store.doSetLoadingState(false);
        if (!err && body?.status === ApiStatuses.Success) {
          dispatch({ type: 'SITES_UPDATED_ITEMS', payload: body?.data });
          if (actualSiteId) {
            siteId && dispatch({ type: 'UPDATE_BASE_DATA', payload: body?.data?.items?.[0] });
          }
        } else {
          dispatch({ type: 'SITES_FETCH_ERROR', payload: err });
        }
      });
    },

  doAddSite:
    (params, payload) =>
    ({ dispatch, store, apiPost }) => {
      const toastId = toast.loading('Adding site...');

      const url = `${rootUrl}addSite${queryFromObject(params)}`;

      apiPost(url, payload, (err, body) => {
        if (!err && body?.status === ApiStatuses.Success) {
          dispatch({ type: 'SITES_POST_FINISHED' });
          tSuccess(toastId, body?.message);
          store.doFetchSites();
        } else {
          dispatch({ type: 'SITES_POST_ERROR', payload: err });
          tError(toastId, body?.message);
        }
      });
    },

  doUpdateSite:
    (siteData) =>
    ({ dispatch, apiPut, store }) => {
      const toastId = toast.loading('Saving site data...');

      const url = `${rootUrl}updateSite`;

      apiPut(url, siteData, (err, body) => {
        if (!err && body?.status === ApiStatuses.Success) {
          dispatch({ type: 'SITES_UPDATE_FINISHED' });
          tSuccess(toastId, 'Changes successfully saved!');
          store.doFetchSites();
        } else {
          dispatch({ type: 'SITES_UPDATE_ERROR', payload: err });
          tError(toastId, 'Failed to save changes. Please try again.');
        }
      });
    },

  doSetSitesPagination:
    ({ pageSize, pageNumber }) =>
    ({ dispatch, store }) => {
      dispatch({
        type: 'SET_SITES_PAGINATION',
        payload: { pageSize, pageNumber },
      });
      store.doFetchSites();
    },

  doUpdateSiteParams:
    (searchParams) =>
    ({ dispatch, store }) => {
      const paramObj = {
        id: store.selectUserRole()?.id,
        project: store.selectUserRole()?.projectCode,
      };
      dispatch({
        type: 'UPDATE_SITE_PARAMS',
        payload: { ...searchParams, ...paramObj },
      });
      store.doDomainSeasonsFetch(searchParams?.year);
      store.doFetchSites();
      store.doFetchExportsSites({ ...searchParams, ...paramObj });
    },
};
