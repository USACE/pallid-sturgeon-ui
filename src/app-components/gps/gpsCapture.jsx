import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_OPTIONS = {
  enableHighAccuracy: true, //attempt GPS
  timeout: 15000, // fail is no fix in 15 sec
  maximumAge: 0, // don't reuse cached location
};

const dateTime = () => new Date().toISOString();

// convert browser obj to format fields
const formatObj = (pos) => ({
  lat: Number(pos?.coords?.latitude),
  lng: Number(pos?.coords?.longitude),
  accuracy: Number(pos?.coords?.accuracy),
  altitude: pos?.coords?.altitude ?? null,
  altitudeAccuracy: pos?.coords?.altitudeAccuracy ?? null,
  heading: pos?.coords?.heading ?? null,
  speed: pos?.coords?.speed ?? null,
  capturedAt: dateTime,
});

export const useGpsCapture = (customOptions = {}) => {
  const optsRef = useRef({ ...DEFAULT_OPTIONS, ...customOptions });

  // API permissions: 'unknown', 'unsupported', 'prompt', 'granted', 'denied'
  const [permission, setPermission] = useState('unknown');
  const [isWatching, setIsWatching] = useState(false);
  const [liveFix, setLiveFix] = useState(null); // update on every watch
  const [lastError, setLastError] = useState(null);
  const watchIdRef = useRef(null); // stores geolocation watch id

  // permissions will be asked before any geolocation tracking
  useEffect(() => {
    let isMounted = true; // prevents updating state after unmount

    const checkPerm = async () => {
      if (!navigator?.geolocation) {
        if (isMounted) setPermission('unsupported');
        console.warn('Geolocation is not supported on this browser/device.');
        return;
      }
      if (!navigator?.permissions?.query) {
        if (isMounted) setPermission('unknown');
        console.info('Permissions API is not available, permission will remain unknown');
        return;
      }

      try {
        const p = await navigator.permissions.query({ name: 'geolocation' });
        if (!isMounted) return;
        setPermission(p.state);
        console.info('Permission state:', p.state);
        p.onchange = () => {
          if (!isMounted) return;
          setPermission(p.state);
          console.info('Permission state change:', p.state);
        };
      } catch {
        if (isMounted) setPermission('unknown');
        console.warn('Could not query geolocation permission', err);
      }
    };

    checkPerm();
    return () => {
      isMounted = false;
    };
  }, []);

  // return singe gps fix
  const captureOnce = useCallback(() => {
    console.info('captureOnce func called, options:', optsRef.current);
    return new Promise((resolve, reject) => {
      if (!navigator?.geolocation) {
        const e = new Error('Geolocation is not supported by this browser/device.');
        setLastError(e);
        console.error('captureOnce func fail: geolocation unsupported');
        reject(e);
        return;
      }

      setLastError(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const fix = formatObj(pos);
          console.info('captureOnce func success, fix:', fix);
          resolve(fix);
        },
        (err) => {
          const e = new Error(err?.message || 'Failed to capture GPS location');
          e.code = err?.code;
          setLastError(e);
          console.error('captureOnce func error, code:', err?.code, 'message:', err?.message);
          reject(e);
        },
        optsRef.current
      );
    });
  }, []);

  // collects n sampes and returns best (lowest accuracy value)
  const captureBestOf = useCallback(
    async (n = 5, intervalMs = 800) => {
      console.info(`captureBestOf func starts, n=${n}, intervalMs=${intervalMs}`);
      const samples = [];
      for (let i = 0; i < n; i++) {
        console.info(`captureBestOf sample ${i + 1}/${n}`);
        const fix = await captureOnce();
        samples.push(fix);

        if (i < n - 1) {
          await new Promise((r) => setTimeout(r, intervalMs));
        }
      }

      const result = {
        best: samples[0], // lowest accuracy value
        samples, // all readings
      };
      samples.sort((a, b) => (a.accuracy ?? 999999) - (b.accuracy ?? 999999));
      console.info('captureBestOf func finish, best:', result?.best);
      return result;
    },
    [captureOnce]
  );

  // begin location updates
  const startWatch = useCallback(() => {
    console.info('startWatch func begin, options:', optsRef.current);
    if (!navigator?.geolocation) {
      const e = new Error('Geolocation is not supported by this browser/device.');
      setLastError(e);
      console.error('startWatch func fail, geolocation unsupported');
      return null;
    }

    // prevents multiple watches (user may click start multiple times)
    if (watchIdRef.current != null) {
      console.info('startWatch func ignored (alreading watching), id:', watchIdRef.current);
      return watchIdRef.current;
    }

    setLastError(null);
    setIsWatching(true);

    // sets live fix as new positions come in
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const fix = formatObj(pos);
        setLiveFix(fix);
        console.debug('watchPosition update, fix:', fix);
      },
      (err) => {
        const e = new Error(err?.message || 'Failed to watch GPS location.');
        e.code = err?.code;
        setLastError(e);
        console.error('watchPosition error, code:', err?.code, 'message:', err?.message);
      },
      optsRef.current
    );

    // stores watch id so stopWatch can cancel it
    watchIdRef.current = id;
    console.info('startWatch started, id:', id);
    return id;
  }, []);

  // stops live location updates
  const stopWatch = useCallback(() => {
    const id = watchIdRef.current;
    console.info('stopWatch func called, id:', id);
    if (id != null && navigator?.geolocation?.clearWatch) {
      navigator.geolocation.clearWatch(id);
      console.info('stopWatch successfully cleared');
    }
    watchIdRef.current = null;
    setIsWatching(false);
  }, []);

  // clean up unmounts, stop watch
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
