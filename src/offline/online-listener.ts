// connectivity listeners + tiny pub/sub + React hook
// when the app goes online (or becomes visible while online), we trigger a sync

import { syncNow, scheduleAutoSync } from './sync';
import { useEffect, useState } from 'react';

// --- internal state + pub/sub ---
let _online = typeof navigator !== 'undefined' ? navigator.onLine : true;
const _subs = new Set<(online: boolean) => void>();

function _notify() {
  for (const cb of _subs) {
    try {
      cb(_online);
    } catch {
      /* noop*/
    }
  }
}

export function getOnlineStatus(): boolean {
  return _online;
}

/** subscribe to online status changes, returns an unsubscribe fn */
export function onOnlineChange(cb: (online: boolean) => void): () => void {
  _subs.add(cb);
  // call immediately with current state
  try {
    cb(_online);
  } catch {
    /* noop */
  }
  return () => {
    _subs.delete(cb);
  };
}

// --- handlers ---
let _autoSync = scheduleAutoSync(15000);

function _setOnline(val: boolean) {
  if (_online === val) return;
  _online = val;
  _notify();
}

async function _handleOnline() {
  _setOnline(true);
  // kick a sync immediately
  try {
    await syncNow();
  } catch {
    /* keep quiet; will retry via auto sync */
  }
}

function _handleOffline() {
  _setOnline(false);
}

// if the tab becomes visible & we are online, attempt a sync
async function _handleVisibilityChange() {
  if (document.visibilityState === 'visible' && navigator.onLine) {
    _setOnline(true);
    try {
      await syncNow();
    } catch {
      /* noop */
    }
  }
}

// --- init / teardown ---
let _initialized = false;

/**
 * call once to wire listeners
 * returns a cleanup function (usually not needed for the whole app)
 */
export function initOnlineListener() {
  if (_initialized) return () => {};
  _initialized = true;

  window.addEventListener('online', _handleOnline);
  window.addEventListener('offline', _handleOffline);
  document.addEventListener('visibilitychange', _handleVisibilityChange);

  // start periodic auto-sync when online
  _autoSync.start();

  // initial state notify
  _notify();

  return () => {
    window.removeEventListener('online', _handleOnline);
    window.removeEventListener('offline', _handleOffline);
    window.removeEventListener('visibilitychange', _handleVisibilityChange);
    _autoSync.stop();
    _initialized = false;
  };
}

// --- react hook ---
/** react-friendly way to read connectivity in components */
export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState<boolean>(_online);
  useEffect(() => onOnlineChange(setOnline), []);
  return online;
}
