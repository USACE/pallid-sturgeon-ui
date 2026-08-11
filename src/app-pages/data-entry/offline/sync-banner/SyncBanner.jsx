import { useState } from 'react';
import { useOnlineStatus } from '../online-listener';
import { connect } from 'redux-bundler-react';
import { getPendingCount, syncNow } from '../sync';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

import OfflineSetupButton from '../initiate-offline-setup/OfflineSetupButton';

import './syncBanner.scss';

const SyncBanner = connect('selectAuth', ({ auth }) => {
  const online = useOnlineStatus();
  const pending = useLiveQuery(() => db.outbox.count(), [], 0);

  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSync = async () => {
    try {
      setSyncing(true);
      setMessage('');

      const result = await syncNow(auth?.token);
      const remaining = await getPendingCount();

      if (remaining === 0 && result.errors === 0 && result.conflicts === 0) {
        setMessage('Synced successfully');
      } else {
        setMessage(`Sync incomplete. ${remaining} item(s) still pending.`);
      }
    } catch (err) {
      console.error('Sync failed:', err);
      setMessage('Sync failed. Check console.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className='sync-bar'>
      <span className={`sync-status ${online ? 'online' : 'offline'}`}>{online ? 'Online' : 'Offline'}</span>
      <button
        onClick={handleSync}
        disabled={!online || syncing || pending === 0}
        className={`sync-button ${syncing ? 'synching' : ''}`}
        title={!online ? 'Will sync when back online' : pending === 0 ? 'Nothing to sync' : 'Push queued changes'}
      >
        {syncing ? 'Syncing...' : `Sync${pending ? ` (${pending})` : ''}`}
      </button>
      {message && <span className='sync-message'>{message}</span>}
      <OfflineSetupButton />
    </div>
  );
});

export default SyncBanner;
