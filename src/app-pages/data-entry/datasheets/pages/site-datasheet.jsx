import { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Card from '@components/card';
import TabContainer from '@components/tab/tabContainer';
import DataHeader from '../components/data-header/dataHeader';

import MissouriDsTable from '../tables/missouriDsTable';
import SearchDsTable from '../tables/searchDsTable';
import SearchDraftDsTable from '../../edit-data-sheet/forms/search-effort/searchDraftDsTable';
import Breadcrumb from '@src/app-components/breadcrumb';
import { getSiteRouteParams, isOfflineSiteRouteKey } from '../../offline/site-route-key';
import { siteDatasheetUpdated } from '../../offline/datasheet-refresh';
import { db } from '../../offline/db';

import '../../dataentry.scss';

const SiteDatasheet = connect(
  'doSitesDatasheetLoadData',
  'doUpdateSitesDatasheetParams',
  'selectBaseData',
  'doUpdateBaseData',
  'selectMoriverSitesDatasheetData',
  'selectMoriverDraftSitesDatasheetData',
  'selectSearchEffortSitesDatasheetData',
  'selectSearchEffortSitesDraftDatasheetData',
  'selectRouteParams',
  ({
    doSitesDatasheetLoadData,
    doUpdateSitesDatasheetParams,
    doUpdateBaseData,
    moriverSitesDatasheetData,
    moriverDraftSitesDatasheetData,
    searchEffortSitesDatasheetData,
    searchEffortSitesDraftDatasheetData,
    routeParams,
  }) => {
    const [currentTab, setCurrentTab] = useState(0);
    const siteRouteKey = routeParams?.siteId ?? null;
    const isOfflineSite = isOfflineSiteRouteKey(siteRouteKey);
    const moriverCompletedCount = Array.isArray(moriverSitesDatasheetData) ? moriverSitesDatasheetData.length : 0;
    const moriverDraftCount = Array.isArray(moriverDraftSitesDatasheetData) ? moriverDraftSitesDatasheetData.length : 0;
    const searchEffortCompletedCount = Array.isArray(searchEffortSitesDatasheetData)
      ? searchEffortSitesDatasheetData.length
      : 0;
    const searchEffortDraftCount = Array.isArray(searchEffortSitesDraftDatasheetData)
      ? searchEffortSitesDraftDatasheetData.length
      : 0;

    const breadcrumbLinks = [
      {
        text: 'Sites List',
        href: '/sites-list',
        current: false,
      },
      {
        text: siteRouteKey,
        href: `/sites-list/${siteRouteKey}`,
        current: false,
      },
    ];

    // useEffect(() => {
    //   const params = getSiteRouteParams(siteRouteKey);
    //   doUpdateSitesDatasheetParams(params);
    // }, [siteRouteKey, currentTab, doUpdateSitesDatasheetParams]);

    // useEffect(() => {
    //   if (!navigator.onLine && isOfflineSite) {
    //     return;
    //   }

    //   doSitesDatasheetLoadData();
    // }, [siteRouteKey, currentTab]);

    useEffect(() => {
      if (!siteRouteKey) {
        return;
      }
      const loadSiteDatasheet = async () => {
        const params = getSiteRouteParams(siteRouteKey);
        doUpdateSitesDatasheetParams(params);

        try {
          await doSitesDatasheetLoadData(siteRouteKey);
        } catch (error) {
          console.error('Unable to load Site Datasheet data:', error);
        }
      };
      loadSiteDatasheet();

      const handleSiteDatasheetUpdated = () => {
        loadSiteDatasheet();
      };

      const handleBackOnline = () => {
        loadSiteDatasheet();
      };

      const handleWindowFocus = () => {
        loadSiteDatasheet();
      };
      window.addEventListener(siteDatasheetUpdated, handleSiteDatasheetUpdated);

      window.addEventListener('online', handleBackOnline);
      window.addEventListener('focus', handleWindowFocus);
      window.addEventListener('pageshow', handleWindowFocus);

      return () => {
        window.removeEventListener(siteDatasheetUpdated, handleSiteDatasheetUpdated);
        window.removeEventListener('online', handleBackOnline);
        window.removeEventListener('focus', handleWindowFocus);
        window.removeEventListener('pageshow', handleWindowFocus);
      };
    }, [siteRouteKey, doUpdateSitesDatasheetParams, doSitesDatasheetLoadData]);

    useEffect(() => {
      async function loadOfflineSiteBaseData() {
        if (!String(siteRouteKey).startsWith('SITE-')) return;

        const localSite = await db.sites.where('site_fid').equals(siteRouteKey).first();

        if (!localSite) {
          console.warn('No offline site found for site_fid:', siteRouteKey);
          return;
        }

        const normalizedSite = {
          ...localSite,
          siteId: localSite.siteId ?? localSite.site_id,
          siteFid: localSite.siteFid ?? localSite.site_fid,
          projectId: localSite.projectId ?? localSite.project_id,
          segmentId: localSite.segmentId ?? localSite.segment_id,
          sampleUnitType: localSite.sampleUnitType ?? localSite.sample_unit_type,
          bendRiverMile: localSite.bendRiverMile ?? localSite.bend_river_mile ?? localSite.brm_id,
        };

        Object.entries(normalizedSite).forEach(([name, value]) => {
          doUpdateBaseData(name, value);
        });
      }

      loadOfflineSiteBaseData();
    }, [siteRouteKey, doUpdateBaseData]);

    return (
      <div className='container-fluid'>
        <Breadcrumb paths={breadcrumbLinks} />
        <div className='row'>
          <div className='col'>
            <h4>
              Datasheets for {isOfflineSite ? 'Site Field ID' : 'Site ID'}: {siteRouteKey}
            </h4>
          </div>
        </div>
        {/* Top Level Info */}
        <DataHeader />
        {/* Tab Container */}
        <Card>
          <Card.Header text='Datasheet Workflows' />
          <Card.Body>
            <p>
              Select any tab to view Missouri River or Search Effort datasheet data for{' '}
              {isOfflineSite ? 'Site Field ID' : 'Site ID'}: {siteRouteKey}. Click on the datasheet ID number to
              view/edit data and any related data.
            </p>
            <TabContainer
              tabs={[
                {
                  title: `Missouri River (${moriverCompletedCount})`,
                  content: <MissouriDsTable />,
                },
                {
                  title: `Missouri River Drafts (${moriverDraftCount})`,
                  content: <MissouriDsTable isDraft />,
                },
                {
                  title: `Search Effort (${searchEffortCompletedCount})`,
                  content: <SearchDsTable />,
                },
                {
                  title: `Search Effort Drafts (${searchEffortDraftCount})`,
                  content: <SearchDraftDsTable />,
                },
              ]}
              onTabChange={(_str, ind) => setCurrentTab(ind)}
            />
          </Card.Body>
        </Card>
      </div>
    );
  }
);

export default SiteDatasheet;
