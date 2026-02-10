import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

const nowIso = () => new Date().toISOString();

const toFix = (pos) => ({
  lat: Number(pos?.coords?.latitude),
  lng: Number(pos?.coords?.longitude),
  accuracy: Number(pos?.coords?.accuracy),
  altitude: pos?.coords?.altitude ?? null,
  altitudeAccuracy: pos?.coords?.altitudeAccuracy ?? null,
  heading: pos?.coords?.heading ?? null,
  speed: pos?.coords?.speed ?? null,
  capturedAt: nowIso(),
});

export const useGpsCapture = (customOptions = {}) => {
  const optsRef = useRef({ ...DEFAULT_OPTIONS, ...customOptions });

  const [permission, setPermission] = useState('unknown');
  const [isWatching, setIsWatching] = useState(false);
  const [liveFix, setLiveFix] = useState(null);
  const [lastError, setLastError] = useState(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const checkPerm = async () => {
      if (!navigator?.geolocation) {
        if (isMounted) setPermission('unsupported');
        return;
      }
      if (!navigator?.permissions?.query) {
        if (isMounted) setPermission('unknown');
        return;
      }

      try {
        const p = await navigator.permissions.query({ name: 'geolocation' });
        if (!isMounted) return;
        setPermission(p.state);
        p.onchange = () => {
          if (!isMounted) return;
          setPermission(p.state);
        };
      } catch {
        if (isMounted) setPermission('unknown');
      }
    };

    checkPerm();
    return () => {
      isMounted = false;
    };
  }, []);

  const captureOnce = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator?.geolocation) {
        const e = new Error('Geolocation is not supported by this browser/device.');
        setLastError(e);
        reject(e);
        return;
      }

      setLastError(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(toFix(pos)),
        (err) => {
          const e = new Error(err?.message || 'Failed to capture GPS location');
          e.code = err?.code;
          setLastError(e);
          reject(e);
        },
        optsRef.current
      );
    });
  }, []);

  const captureBestOf = useCallback(
    async (n = 5, intervalMs = 800) => {
      const samples = [];
      for (let i = 0; i < n; i++) {
        const fix = await captureOnce();
        samples.push(fix);

        if (i < n - 1) {
          await new Promise((r) => setTimeout(r, intervalMs));
        }
      }

      samples.sort((a, b) => (a.accuracy ?? 999999) - (b.accuracy ?? 999999));
      return {
        best: samples[0],
        samples,
      };
    },
    [captureOnce]
  );

  const startWatch = useCallback(() => {
    if (!navigator?.geolocation) {
      const e = new Error('Geolocation is not supported by this browser/device.');
      setLastError(e);
      return null;
    }
    if (watchIdRef.current != null) return watchIdRef.current;

    setLastError(null);
    setIsWatching(true);

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setLiveFix(toFix(pos));
      },
      (err) => {
        const e = new Error(err?.message || 'Failed to watch GPS location.');
        e.code = err?.code;
        setLastError(e);
      },
      optsRef.current
    );

    watchIdRef.current = id;
    return id;
  }, []);

  const stopWatch = useCallback(() => {
    const id = watchIdRef.current;
    if (id != null && navigator?.geolocation?.clearWatch) {
      navigator.geolocation.clearWatch(id);
    }
    watchIdRef.current = null;
    setIsWatching(false);
  }, []);

  useEffect(() => {
    return () => stopWatch();
  }, [stopWatch]);

  return {
    permission,
    isWatching,
    liveFix,
    lastError,
    captureOnce,
    captureBestOf,
    startWatch,
    stopWatch,
  };
};
