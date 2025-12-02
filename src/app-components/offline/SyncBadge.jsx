import { useOnlineStatus } from '@src/offline/online-listener';
import { syncNow } from '@src/offline/sync';
import { db } from '@src/offline/db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function SyncBadge() {
  const online = useOnlineStatus();
  const pending = useLiveQuery(() => db.outbox.count(), [], 0);

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span
        style={{
          padding: '2px 8px',
          borderRadius: 8,
          background: online ? '#e6ffed' : '#ffe6e6',
          border: '1px solid #ccc',
        }}
      >
        {online ? 'Online' : 'Offline'}
      </span>
      <button
        onClick={() => void syncNow()}
        style={{
          padding: '4px 10px',
          borderRadius: 8,
          border: '1px solid #ddd',
          background: '#f7f7f7',
          cursor: 'pointer',
        }}
        disabled={!online && pending === 0}
        title={!online ? 'Will retry when online' : 'Push queued changes now'}
      >
        {`Sync now${pending ? ` (${pending})` : ''}`}
      </button>
    </div>
  );
}
