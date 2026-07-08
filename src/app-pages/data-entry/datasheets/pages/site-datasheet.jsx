import { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Card from '@components/card';
import TabContainer from '@components/tab/tabContainer';
import DataHeader from '../components/dataHeader';

import MissouriDsTable from '../tables/missouriDsTable';
import SearchDsTable from '../tables/searchDsTable';
import SearchDraftDsTable from '../../edit-data-sheet/forms/search-effort/searchDraftDsTable';
import Breadcrumb from '@src/app-components/breadcrumb';
import { getSiteRouteParams, isOfflineSiteRouteKey } from '../../offline/site-route-key';
import { db } from '../../offline/db';

const SiteDatasheet = connect(
  'doSitesDatasheetLoadData',
  'doUpdateSitesDatasheetParams',
  'selectBaseData',
  'doUpdateBaseData',
  'selectMoriverSitesDatasheetTotalResults',
  'selectSearchEffortSitesDatasheetTotalResults',
  'selectSearchEffortSitesDraftDatasheetTotalResults',
  'selectMoriverSitesDraftDatasheetTotalResults',
  'selectRouteParams',
  ({
    doSitesDatasheetLoadData,
    doUpdateSitesDatasheetParams,
    doUpdateBaseData,
    moriverSitesDatasheetTotalResults,
    searchEffortSitesDatasheetTotalResults,
    searchEffortSitesDraftDatasheetTotalResults,
    moriverSitesDraftDatasheetTotalResults,
    routeParams,
  }) => {
    const [currentTab, setCurrentTab] = useState(0);
    const siteRouteKey = routeParams?.siteId ?? null;
    const isOfflineSite = isOfflineSiteRouteKey(siteRouteKey);

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

    useEffect(() => {
      const params = getSiteRouteParams(siteRouteKey);
      doUpdateSitesDatasheetParams(params);
    }, [siteRouteKey, currentTab, doUpdateSitesDatasheetParams]);

    useEffect(() => {
      if (!navigator.onLine && isOfflineSite) {
        return;
      }

      doSitesDatasheetLoadData();
    }, [siteRouteKey, currentTab]);

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
                  title: `Missouri River (${moriverSitesDatasheetTotalResults})`,
                  content: <MissouriDsTable />,
                },
                {
                  title: `Missouri River Drafts (${moriverSitesDraftDatasheetTotalResults})`,
                  content: <MissouriDsTable isDraft />,
                },
                {
                  title: `Search Effort (${searchEffortSitesDatasheetTotalResults})`,
                  content: <SearchDsTable />,
                },
                {
                  title: `Search Effort Drafts (${searchEffortSitesDraftDatasheetTotalResults})`,
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
