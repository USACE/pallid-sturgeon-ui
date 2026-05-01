import { useEffect, useState } from 'react';
import { syncNow, scheduleAutoSync } from './sync';

let onlineState = typeof navigator !== 'undefined' ? navigator.onLine : true;

const subscribers = new Set<(online: boolean) => void>();

const notifySubscribers = () => {
  subscribers.forEach((callback) => {
    try {
      callback(onlineState);
    } catch {
      // ignore subscriber errors
    }
  });
};

const setOnlineState = (value: boolean) => {
  if (onlineState === value) return;

  onlineState = value;
  notifySubscribers();
};

export function getOnlineStatus(): boolean {
  return onlineState;
}

export function onOnlineChange(callback: (online: boolean) => void): () => void {
  subscribers.add(callback);

  try {
    callback(onlineState);
  } catch {
    // ignore initial callback error
  }

  return () => {
    subscribers.delete(callback);
  };
}

const autoSync = scheduleAutoSync(15000);

const handleOnline = async () => {
  setOnlineState(true);
  async;
  try {
    await syncNow();
  } catch (err) {
    console.error('Auto-sync failed after coming online:', err);
  }
};

const handleOffline = () => {
  setOnlineState(false);
};

async function handleVisibilityChange() {
  if (document.visibilityState !== 'visible') return;
  if (!navigator.onLine) return;

  setOnlineState(true);

  try {
    await syncNow();
  } catch (err) {
    console.error('Auto-sync failed after tab became visible:', err);
  }
}

let initialized = false;

export function initOnlineListener(): () => void {
  if (initialized) return () => {};

  initialized = true;

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  window.addEventListener('visibilitychange', handleVisibilityChange);

  autoSync.start();
  notifySubscribers();

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
    window.removeEventListener('visibilitychange', handleVisibilityChange);

    autoSync.stop();
    initialized = false;
  };
}

export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState<boolean>(onlineState);

  useEffect(() => {
    return onOnlineChange(setOnline);
  }, []);

  return online;
}
