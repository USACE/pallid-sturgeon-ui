import { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Card from '@components/card';
import TabContainer from '@components/tab/tabContainer';
import DataHeader from '../components/data-header/dataHeader';

import MissouriDsTable from '../tables/missouriDsTable';
import SearchDsTable from '../tables/searchDsTable';
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
    const isOnline = navigator.onLine;

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
      const populateOfflineSiteBaseData = async (id) => {
        const cachedData = await db.sites.toArray();
        // Determine whether to search via Table ID or Field ID
        const keyString = Number(id) > 0 ? 'siteId' : 'siteFid';
        // const filteredCachedData = await db.sites.where(keyString).equals(id).first();
        const filteredCachedData = cachedData.filter((item) => String(item?.[keyString]) === String(id))?.[0];
        if (filteredCachedData?.length < 1) return;
        // Update Base Data
        Object.entries(filteredCachedData).forEach(([name, value]) => {
          doUpdateBaseData(name, value);
        });
      };
      // Only run when offline in offline status
      !isOnline && populateOfflineSiteBaseData(siteRouteKey);
    }, [siteRouteKey, , isOnline]);

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
                  content: <SearchDsTable isDraft />,
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
