import { useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Alert } from '@trussworks/react-uswds';
import { mdiCellphoneCog, mdiDownload, mdiEarth } from '@mdi/js';

import LoaderButton from '@src/app-components/loader/LoaderButton';
import Icon from '@src/app-components/icon/icon';
import { downloadLookupsForOffline } from '../lookup-cache';
import { useUbloxSerialGps } from '@src/customHooks/useUbloxSerialGps';

const OfflineSetupButton = connect('selectAuth', ({ auth }) => {
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
      const result = await downloadLookupsForOffline(auth?.token);

      setLookupDownloadStatus({
        type: 'success',
        message: `Offline lookups downloaded successfully. Saved ${result.count ?? 0} lookup rows.`,
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
    </>
  );
});

export default OfflineSetupButton;
