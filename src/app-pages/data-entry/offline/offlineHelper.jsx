export const GPS_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

export const USE_UBLOX_POC = import.meta.env.VITE_USE_UBLOX_POC === 'true';

export const captureGpsBest = async ({ browserGps, ubloxGps }) => {
  if (USE_UBLOX_POC && ubloxGps?.isConnected) {
    if (!ubloxGps?.latestFix) {
      throw new Error('u-blox GPS is connected but a satellite fix is not available yet.');
    }
    console.log('[GPS SOURCE] using u-blox satellite serial GPS');
    return {
      best: ubloxGps?.latestFix,
      samples: [ubloxGps?.latestFix],
    };
  }
  console.log('[GPS SOURCE] using browser geolocation fallback');
  return browserGps?.captureBestOf(5, 700);
};

export const getOfflineDraft = ({ draftKey, fieldIdName, siteId }) => {
  const savedDraft = sessionStorage.getItem(draftKey);
  if (!savedDraft) return null;
  try {
    const draft = JSON.parse(savedDraft);
    if (!draft?.[fieldIdName] || String(draft.siteId) !== String(siteId)) return null;
    return draft;
  } catch (err) {
    console.error('Failed to parse offline draft:', err);
    return null;
  }
};

export const reloadOfflineDraft = ({ defaultValues, newForm, draftKey, fieldIdName, siteId, reset }) => {
  if (!newForm) return;
  const draftParams = { draftKey, fieldIdName, siteId };
  const draft = getOfflineDraft(draftParams);
  if (!draft) return;
  reset({ ...defaultValues, ...draft }, { keepDirty: false, keepTouched: false });
};
