import { useState } from 'react';
import { useOnlineStatus } from '../online-listener';
import { connect } from 'redux-bundler-react';
import { getPendingCount, syncNow } from '../sync';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { usePwaMode } from '../pwa-mode';
import { getEntityLabel, getRecoveryTarget } from '../offline-recovery';

import OfflineSetupButton from '../initiate-offline-setup/OfflineSetupButton';
import Button from '@src/app-components/button';

import './syncBanner.scss';

const SyncBanner = connect(
  'selectAuth',
  'doRefreshOfflineAuth',
  'doFetchSearchDataEntry',
  'doFetchMoRiverDataEntry',
  'doUpdateCurrentTab',
  'doUpdateComplexStateField',
  'doUpdateUrl',
  ({
    auth,
    doRefreshOfflineAuth,
    doFetchSearchDataEntry,
    doFetchMoRiverDataEntry,
    doUpdateCurrentTab,
    doUpdateComplexStateField,
    doUpdateUrl,
  }) => {
    const online = useOnlineStatus();
    const pending = useLiveQuery(() => db.outbox.count(), [], 0);
    const failedItems = useLiveQuery(() => db.outbox.filter((item) => Boolean(item.syncError)).toArray(), [], []) ?? [];
    const pwaMode = usePwaMode();

    const [syncing, setSyncing] = useState(false);
    const [message, setMessage] = useState('');
    const [showErrors, setShowErrors] = useState(false);
    const [messageType, setMessageType] = useState('');

    const handleSync = async () => {
      try {
        setSyncing(true);
        setMessage('');
        setMessageType('');

        const refreshAuth = await doRefreshOfflineAuth();
        const syncToken = refreshAuth?.token ?? auth?.token;

        if (!syncToken) {
          throw new Error('Authentication is required before syncing.');
        }

        const result = await syncNow(syncToken);
        const remaining = await getPendingCount();
        const failed = await db.outbox.filter((item) => Boolean(item.syncError)).count();

        if (remaining === 0 && result.errors === 0 && result.conflicts === 0) {
          setMessage('Offline data synced successfully');
          setMessageType('success');
        } else {
          setMessage(
            failed > 0
              ? `Sync incomplete. ${failed} record(s) need attention and ${remaining} item(s) remain pending.`
              : `Sync incomplete. ${remaining} item(s) still pending.`
          );
          setMessageType('error');
        }
      } catch (err) {
        console.error('Sync failed:', err);
        setMessage('Sync could not complete. Review the sync problems below.');
        setMessageType('error');
      } finally {
        setSyncing(false);
      }
    };

    const handleOpenProblem = async (item) => {
      try {
        const target = await getRecoveryTarget(item);
        if (!target) {
          setMessage('Unable to locate the form automatically. Open the Sites List and locate the record manually.');
          setMessageType('error');
          return;
        }
        if (target.type === 'site') {
          doUpdateUrl(`/sites-list/${target.siteKey}`);
          return;
        }
        if (target.type === 'search') {
          if (item.tableName === 'ds_telemetry_fish' && item._id != null) {
            sessionStorage.setItem('syncRecoveryOutboxId', String(item._id));
          }
          doUpdateCurrentTab(target.tab);
          doUpdateComplexStateField({
            name: 'isEditForm',
            value: true,
          });
          doUpdateUrl(`/sites-list/${target.siteKey}/search-effort/${target.formKey}`);
          doFetchSearchDataEntry(
            {
              tableId: target.formKey,
            },
            false,
            true,
            true
          );
          return;
        }
        if (target.type === 'moriver') {
          doUpdateCurrentTab(target.tab);
          doUpdateComplexStateField({
            name: 'isEditForm',
            value: true,
          });
          doUpdateCurrentTab(`/sites-list/${target.siteKey}/missouri-river/${target.formKey}`);
          doFetchMoRiverDataEntry(
            {
              tableId: target.formkey,
            },
            false,
            true,
            true
          );
        }
      } catch (err) {
        console.error('Unable to open sync recovery record:', err);
        setMessage('Unable to open the records automatically. Your offline data is still saved.');
        setMessageType('error');
      }
    };

    return (
      <div className='sync-bar'>
        <span className={`sync-status ${online ? 'online' : 'offline'}`}>{online ? 'Online' : 'Offline'}</span>
        <button
          onClick={handleSync}
          disabled={!online || syncing || pending === 0}
          className={`sync-button ${syncing ? 'syncing' : ''}`}
          title={!online ? 'Will sync when back online' : pending === 0 ? 'Nothing to sync' : 'Push queued changes'}
        >
          {syncing ? 'Syncing...' : `Sync${pending ? ` (${pending})` : ''}`}
        </button>
        {message && (
          <span className={`sync-message ${messageType}`} role='status' aria-live='polite'>
            {messageType === 'success' ? '\u2713' : messageType === 'error' ? '\u26A0' : ''}
            {message}
          </span>
        )}
        {failedItems.length > 0 && (
          <div className='sync-recovery'>
            <Button
              size='small'
              variant='danger'
              isOutline
              text={`${'\u26A0'} ${failedItems.length} records${failedItems.length !== 1 ? 's' : ''} need attention`}
              handleClick={() => setShowErrors((current) => !current)}
            />
            {showErrors && (
              <div className='sync-error-list'>
                {failedItems.map((item) => (
                  <div key={item._id} className='sync-error-item'>
                    <strong>{getEntityLabel(item.tableName)}</strong>
                    <div>{item.syncError ?? 'Sync failed.'}</div>
                    {item.syncHttp && <small>Server status: {item.syncHttp}</small>}
                    <div>
                      <Button
                        size='small'
                        variant='info'
                        isOutline
                        text='Open Record'
                        handleClick={() => handleOpenProblem(item)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {!pwaMode && <OfflineSetupButton />}
      </div>
    );
  }
);

export default SyncBanner;
