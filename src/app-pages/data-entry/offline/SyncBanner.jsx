import { useState } from 'react';
import { useOnlineStatus } from './online-listener';
import { syncNow } from './sync';
import { db } from './db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function SyncBanner() {
  const online = useOnlineStatus();
  const pending = useLiveQuery(() => db.outbox.count(), [], 0);

  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSync = async () => {
    try {
      setSyncing(true);
      setMessage('');

      await syncNow();

      setMessage('Synced successfully');
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        padding: '6px 10px',
        borderBottom: '1px solid #eee',
        background: '#fafafa',
      }}
    >
      <span
        style={{
          padding: '3px 10px',
          borderRadius: 10,
          background: online ? '#e6ffed' : '#ffe6e6',
          border: '1px solid #ccc',
          fontWeight: 500,
        }}
      >
        {online ? 'Online' : 'Offline'}
      </span>
      <button
        onClick={handleSync}
        disabled={!online || syncing || pending === 0}
        style={{
          padding: '5px 12px',
          borderRadius: 10,
          border: '1px solid #ddd',
          background: syncing ? '#ddd' : '#f7f7f7',
          cursor: syncing ? 'not-allowed' : 'pointer',
        }}
        title={!online ? 'Will sync when back online' : pending === 0 ? 'Nothing to sync' : 'Push queued changes'}
      >
        {syncing ? 'Syncing...' : `Sync${pending ? ` (${pending})` : ''}`}
      </button>
      {message && <span style={{ fontSize: 12, color: '#555' }}>{message}</span>}
    </div>
  );
}
