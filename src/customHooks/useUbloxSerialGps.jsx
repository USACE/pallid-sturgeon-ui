import { useCallback, useRef, useState } from 'react';

const LOG_PREFIX = '[UBLOX_GPS]';

const nmeaToDecimal = (rawValue, direction) => {
  if (!rawValue || !direction) return null;

  const dotIndex = rawValue.indexOf('.');
  const degreeLength = dotIndex > 4 ? 3 : 2;

  const degrees = Number(rawValue.slice(0, degreeLength));
  const minutes = Number(rawValue.slice(degreeLength));

  if (Number.isNaN(degrees) || Number.isNaN(minutes)) return null;

  let decimal = degrees + minutes / 60;

  if (direction === 'S' || direction === 'W') {
    decimal *= -1;
  }
  return decimal;
};

const parseNmeaLine = (line) => {
  const clean = line.trim();

  if (!clean.startsWith('$')) return null;

  const parts = clean.split(',');

  if (parts[0].includes('GGA')) {
    const fixQuality = Number(parts[6]);

    if (!fixQuality) return null;

    return {
      source: 'ublox-serial',
      timeRaw: parts[1] || null,
      lat: nmeaToDecimal(parts[2], parts[3]),
      lng: nmeaToDecimal(parts[4], parts[5]),
      fixQuality,
      satellites: Number(parts[7]) || null,
      hdop: Number(parts[8]) || null,
      altitude: parts[9] ? Number(parts[9]) : null,
      capturedAt: new Date().toISOString(),
      raw: clean,
    };
  }

  if (parts[0].includes('RMC')) {
    const status = parts[2];

    if (status !== 'A') return null;

    return {
      source: 'ublox-serial',
      timeRaw: parts[1] || null,
      lat: nmeaToDecimal(parts[3], parts[4]),
      lng: nmeaToDecimal(parts[5], parts[6]),
      status,
      speedKnots: parts[7] ? Number(parts[7]) : null,
      capturedAt: new Date().toISOString(),
      raw: clean,
    };
  }

  return null;
};

export const useUbloxSerialGps = () => {
  const portRef = useRef(null);
  const readerRef = useRef(null);
  const bufferRef = useRef('');

  const [isSupported, setIsSupported] = useState(() => !!navigator?.serial);
  const [isConnected, setIsConnected] = useState(false);
  const [latestFix, setLatestFix] = useState(null);
  const [lastError, setLastError] = useState(null);
  const [rawLine, setRawLine] = useState('');

  const connect = useCallback(async () => {
    try {
      if (!navigator?.serial) {
        throw new Error('Web Serial is not supported in this browser.');
      }

      console.info(`${LOG_PREFIX} Requesting serial port...`);

      const port = await navigator.serial.requestPort();

      await port.open({ baudRate: 9600 });

      portRef.current = port;
      setIsConnected(true);
      setLastError(null);

      console.info(`${LOG_PREFIX} Serial port opened.`);

      const decoder = new TextDecoderStream();
      port.readable.pipeTo(decoder.writable);
      const reader = decoder.readable.getReader();
      readerRef.current = reader;

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;
        if (!value) continue;

        bufferRef.current += value;

        const lines = bufferRef.current.split(/\r?\n/);
        bufferRef.current = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          console.debug(`${LOG_PREFIX} RAW:`, trimmed);
          setRawLine(trimmed);

          const fix = parseNmeaLine(trimmed);

          if (
            fix &&
            typeof fix.lat === 'number' &&
            typeof fix.lng === 'number' &&
            !Number.isNaN(fix.lat) &&
            !Number.isNaN(fix.lng)
          ) {
            console.info(`${LOG_PREFIX} FIX:`, fix);
            setLatestFix(fix);
          }
        }
      }
    } catch (err) {
      console.error(`${LOG_PREFIX} connect error:`, err);
      setLastError(err);
      setIsConnected(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      console.info(`${LOG_PREFIX} Disconnecting...`);

      if (readerRef.current) {
        await readerRef.current.cancel();
        readerRef.current.releaseLock();
        readerRef.current = null;
      }

      if (portRef.current) {
        await portRef.current.close();
        portRef.current = null;
      }

      setIsConnected(false);
    } catch (err) {
      console.error(`${LOG_PREFIX} disconnect error:`, err);
      setLastError(err);
    }
  }, []);

  const captureOnce = useCallback(async () => {
    if (!latestFix) {
      throw new Error('No u-blox GPS fix available yet.');
    }
    return latestFix;
  }, [latestFix]);

  return {
    isSupported,
    isConnected,
    latestFix,
    rawLine,
    lastError,
    connect,
    disconnect,
    captureOnce,
  };
};
