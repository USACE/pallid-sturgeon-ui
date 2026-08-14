import { useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Alert, Button } from '@trussworks/react-uswds';
import { mdiCellphoneCog, mdiDownload, mdiEarth } from '@mdi/js';

import LoaderButton from '@src/app-components/loader/LoaderButton';
import Icon from '@src/app-components/icon/icon';
import { downloadLookupsForOffline, downloadSitesForOffline, downloadDatasheetsForOffline } from '../lookup-cache';
import { useUbloxSerialGps } from '@src/customHooks/useUbloxSerialGps';

const OfflineSetupButton = connect('selectAuth', 'selectUserRole', 'doUpdateUrl', ({ auth, userRole, doUpdateUrl }) => {
  const ubloxGps = useUbloxSerialGps();

  const [lookupDownloadStatus, setLookupDownloadStatus] = useState(null);
  const [lookupDownloading, setLookupDownloading] = useState(false);

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

      setLookupDownloadStatus({
        type: 'success',
        message: `Offline sites & lookups downloaded successfully. Saved ${siteResult.count ?? 0} sites for ${siteResult.year}, ${datasheetResult.count} datasheets, & ${lookupResult.count ?? 0} lookup rows.`,
      });
    } catch (error) {
      console.error('Lookup download failed:', error);

      setLookupDownloadStatus({
        type: 'error',
        message: 'Lookup API worked, but saving to IndexedDB failed. Check db.ts schema/version and IndexedDB stores.',
      });
    } finally {
      setLookupDownloading(false);
    }
  };

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
      {lookupDownloadStatus?.type === 'success' && (
        <div className='margin-top-2'>
          <Button type='button' className='primary-btn' onClick={() => doUpdateUrl('/sites-list')}>
            Go to Sites List
          </Button>
        </div>
      )}
    </>
  );
});

export default OfflineSetupButton;
