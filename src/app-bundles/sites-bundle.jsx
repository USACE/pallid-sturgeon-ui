import { queryFromObject } from '@src/utils';
import { db } from '@src/app-pages/data-entry/offline/db';

import { toast } from 'react-toastify';
import { tSuccess, tError } from '@common/toast/toastHelper';
import { ApiStatuses } from '@src/utils/enums';
import { getCurrentFieldStudyYear } from '@src/app-pages/data-entry/offline/lookup-cache';

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
    async ({ dispatch, store }) => {
      dispatch({ type: 'LOADING_SITES_INIT_DATA' });

      if (navigator.onLine) {
        store.doFetchSites();
        return;
      }

      const fieldStudyYear = getCurrentFieldStudyYear();
      const localSites = await db.sites.filter((site) => Number(site.year) === fieldStudyYear).toArray();
      const moriverData = await db.moriver.toArray();
      const searchData = await db.search.toArray();
      const siteHasForms = (site) => {
        const siteKeys = [site?.siteRouteKey ?? site?.siteId ?? site?.site_id ?? site?.siteFid ?? site?.site_fid]
          .filter((value) => value !== undefined && value !== null)
          .map(String);

        const formBelongsToSite = (form) => {
          const formSiteKeys = [form?.siteRouteKey, form?.siteId, form?.site_id, form?.siteFid, form?.site_fid]
            .filter((value) => value !== undefined && value !== null)
            .map(String);

          return formSiteKeys.some((value) => siteKeys.includes(value));
        };
        return moriverData.some(formBelongsToSite) || searchData.some(formBelongsToSite);
      };

      const normalizedSites = localSites.map((site) => {
        const siteId = site?.siteId ?? site?.site_id ?? site?.serverId;
        const siteFid = site?.siteFid ?? site?.site_fid;
        const isExistingSite = siteId !== undefined && siteId !== null && Number(siteId) > 0;
        const siteRouteKey = isExistingSite ? String(siteId) : siteFid;

        return {
          ...site,
          siteId,
          site_id: siteId,
          siteFid,
          site_fid: siteFid,
          siteRouteKey,
          siteDisplayId: isExistingSite ? siteId : String(siteFid ?? '').slice(-3),
          projectId: site?.projectId ?? site?.project_id,
          segmentId: site?.segmentId ?? site?.segment_id,
          sampleUnitType: site?.sampleUnitType ?? site?.sample_unit_type,
          bendRiverMile: site?.bendRiverMile ?? site?.bend_river_mile ?? site?.brm_id,
          editInitials: site?.editInitials ?? site?.edit_initials,
          uploadedBy: site?.uploadedBy ?? site?.uploaded_by,
          bkgColor: siteHasForms(site) ? '#daf2ea' : (site?.bkgColor ?? null),
        };
      });

      // Mirror API default ordering while offline: site_id desc.
      // Draft-only rows without a numeric Site ID are sorted by Site FID desc.
      const sortedSites = [...normalizedSites].sort((a, b) => {
        const aSiteId = Number(a?.siteId ?? a?.site_id ?? a?.serverId);
        const bSiteId = Number(b?.siteId ?? b?.site_id ?? b?.serverId);
        const aHasId = Number.isFinite(aSiteId) && aSiteId > 0;
        const bHasId = Number.isFinite(bSiteId) && bSiteId > 0;

        if (aHasId && bHasId) {
          return bSiteId - aSiteId;
        }
        if (aHasId) return -1;
        if (bHasId) return 1;

        const aSiteFid = String(a?.siteFid ?? a?.site_fid ?? '');
        const bSiteFid = String(b?.siteFid ?? b?.site_fid ?? '');

        return bSiteFid.localeCompare(aSiteFid, undefined, { numeric: true, sensitivity: 'base' });
      });

      dispatch({
        type: 'SITES_UPDATED_ITEMS',
        payload: {
          items: sortedSites,
          totalCount: sortedSites.length,
        },
      });
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
          const siteItems = body?.data?.items ?? [];
          const normalizedSites = siteItems.map((site) => {
            const siteId = site?.siteId ?? site?.site_id;
            const siteFid = site?.siteFid ?? site?.site_fid;
            const isExistingSite = Number(siteId) > 0;

            return {
              ...site,
              siteId,
              site_id: siteId,
              siteFid,
              site_fid: siteFid,
              siteRouteKey: isExistingSite ? String(siteId) : siteFid,
              siteDisplayId: isExistingSite ? siteId : String(siteFid ?? '').slice(-3),
            };
          });
          dispatch({
            type: 'SITES_UPDATED_ITEMS',
            payload: {
              ...body?.data,
              items: normalizedSites,
              totalCount: body?.data?.totalCount ?? normalizedSites.length,
            },
          });
          if (actualSiteId) {
            const selectedSite = normalizedSites[0];
            selectedSite && dispatch({ type: 'UPDATE_BASE_DATA', payload: selectedSite });
          } else {
            dispatch({ type: 'SITES_FETCH_ERROR', payload: err });
          }
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
      if (navigator.onLine) {
        store.doFetchSites();
      }
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
      if (!navigator.onLine) return;
      store.doDomainSeasonsFetch(searchParams?.year);
      store.doFetchSites();
      store.doFetchExportsSites({ ...searchParams, ...paramObj });
    },
};
