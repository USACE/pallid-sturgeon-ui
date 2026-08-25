import { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { Alert, Button } from '@trussworks/react-uswds';
import { mdiCellphoneCog, mdiDownload, mdiEarth } from '@mdi/js';

import LoaderButton from '@src/app-components/loader/LoaderButton';
import Icon from '@src/app-components/icon/icon';
import { downloadLookupsForOffline, downloadSitesForOffline, downloadDatasheetsForOffline } from '../lookup-cache';
import { useUbloxSerialGps } from '@src/customHooks/useUbloxSerialGps';
import { usePwaMode } from '../pwa-mode';
import { getOfflineAuthSession, isOfflineAuthSessionValid } from '../offline-auth';

const OFFLINE_SETUP_READY_KEY = 'offlineSetupReady';

const OfflineSetupButton = connect(
  'selectAuth',
  'selectUserRole',
  'doUpdateUrl',
  'doEnableOfflineAuth',
  ({ auth, userRole, doUpdateUrl, doEnableOfflineAuth }) => {
    const ubloxGps = useUbloxSerialGps();
    const pwaMode = usePwaMode();

    const [lookupDownloadStatus, setLookupDownloadStatus] = useState(null);
    const [lookupDownloading, setLookupDownloading] = useState(false);
    const [offlineSetupReady, setOfflineSetupReady] = useState(
      () => sessionStorage.getItem(OFFLINE_SETUP_READY_KEY) === 'true'
    );

    useEffect(() => {
      if (!auth?.token && navigator.onLine) {
        sessionStorage.removeItem(OFFLINE_SETUP_READY_KEY);
        setOfflineSetupReady(false);
      }
    }, [auth?.token]);

    const handleOnClick = async () => {
      setLookupDownloading(true);
      setLookupDownloadStatus(null);

      // Connect ublox satellite GPS
      ubloxGps?.connect();

      // Download Offline lookups
      try {
        const lookupResult = await downloadLookupsForOffline(auth?.token);
        const siteResult = await downloadSitesForOffline(auth?.token, userRole?.id);
        const datasheetResult = await downloadDatasheetsForOffline(auth?.token, userRole?.id);
        await doEnableOfflineAuth();

        sessionStorage.setItem(OFFLINE_SETUP_READY_KEY, 'true');
        setOfflineSetupReady(true);

        setLookupDownloadStatus({
          type: 'success',
          message: `Offline sites & lookups downloaded successfully. Saved ${siteResult.count ?? 0} sites for ${siteResult.year}, ${datasheetResult.count} datasheets, & ${lookupResult.count ?? 0} lookup rows.`,
        });
      } catch (error) {
        console.error('Lookup download failed:', error);

        setLookupDownloadStatus({
          type: 'error',
          message:
            'Lookup API worked, but saving to IndexedDB failed. Check db.ts schema/version and IndexedDB stores.',
        });
      } finally {
        setLookupDownloading(false);
      }
    };

    useEffect(() => {
      let cancelled = false;

      const restoreOfflineReady = async () => {
        if (sessionStorage.getItem(OFFLINE_SETUP_READY_KEY) === 'true') {
          setOfflineSetupReady(true);
          return;
        }

        if (!pwaMode) return;

        const session = await getOfflineAuthSession();

        if (!cancelled && isOfflineAuthSessionValid(session)) {
          setOfflineSetupReady(true);
          sessionStorage.setItem(OFFLINE_SETUP_READY_KEY, 'true');
        }
      };
      restoreOfflineReady();

      return () => {
        cancelled = true;
      };
    }, [pwaMode]);

    return (
      <>
        <LoaderButton
          className='margin-left-2 primary-btn'
          disabled={lookupDownloading}
          isLoading={lookupDownloading}
          onClick={handleOnClick}
          type='button'
        >
          <span>
            <Icon path={mdiCellphoneCog} focusable={false} />
          </span>
          <span className='text-bold'>Initiate Offline Setup</span>
        </LoaderButton>
        {lookupDownloading && (
          <Alert type='info' headingLevel='h4' slim>
            This may take a few minutes...
          </Alert>
        )}
        {lookupDownloadStatus && (
          <div className='margin-top-1'>
            <Alert type='info' headingLevel='h4' slim noIcon>
              <span>
                <Icon path={mdiDownload} focusable={false} />
              </span>
              {lookupDownloadStatus.message} <br></br>
              <Icon path={mdiEarth} focusable={false} />
              <span>GPS Source: {ubloxGps?.isConnected ? 'u-blox serial connected' : 'browser fallback'}</span>
              {ubloxGps?.latestFix && <span> - Satellites: {ubloxGps?.latestFix?.satellites ?? 'unknown'}</span>}
              {ubloxGps?.lastError && <span> - GPS Error: {ubloxGps?.lastError?.message}</span>}
            </Alert>
          </div>
        )}
        {pwaMode && offlineSetupReady && (
          <div className='margin-top-2'>
            <Button
              type='button'
              className='primary-btn'
              onClick={() => doUpdateUrl('/sites-list')}
              style={{ minWidth: '280px', minHeight: '64px', fontSize: '1.25rem', fontWeight: 'bold' }}
            >
              Go to Sites List
            </Button>
          </div>
        )}
      </>
    );
  }
);

export default OfflineSetupButton;
