import React, { createContext, useContext } from 'react';
import { useUbloxSerialGps } from '@src/customHooks/useUbloxSerialGps';

const UbloxGpsContext = createContext(null);

export const UbloxGpsProvider = ({ children }) => {
  const ubloxGps = useUbloxSerialGps();

  return <UbloxGpsContext.Provider value={ubloxGps}>{children}</UbloxGpsContext.Provider>;
};

export const useSharedUbloxGps = () => {
  const context = useContext(UbloxGpsContext);

  if (!context) {
    throw new Error('useSharedUblox must be used inside UbloxGpsProvider.');
  }
  return context;
};
