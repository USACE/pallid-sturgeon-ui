import { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'redux-bundler-react';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import TextInput from '@src/app-components/new-inputs/text-input/TextInput';
import SelectInput from '@src/app-components/new-inputs/select-input/SelectInput';
import { Button, Grid } from '@trussworks/react-uswds';
import ErrorSummary from '@src/app-components/error-summary/ErrorSummary';

import { getSearchEffortSchema, getSearchEffortDefaultValues } from './SearchEffortDataEntryForm.validation';
import { filterNullEmptyObjects } from '@src/utils/helpers';
import { useGpsCapture } from '@src/app-components/gps/gpsCapture';
import { useUbloxSerialGps } from '@src/customHooks/useUbloxSerialGps';
import { generateFieldId } from '../../../dataEntryHelper';
import { getLookupOptions } from '@src/app-pages/data-entry/offline/lookup-cache';
import { createData, updateData, isOnline } from '@src/app-pages/data-entry/offline/api';
import { db } from '@src/app-pages/data-entry/offline/db';
import { refreshSiteDatasheet } from '@src/app-pages/data-entry/offline/datasheet-refresh';
import { mdiCrosshairsGps } from '@mdi/js';
import Icon from '@src/app-components/icon/icon';

const USE_UBLOX_POC = import.meta.env.VITE_USE_UBLOX_POC === 'true';

const isEmpty = (obj) => Object.keys(obj).length === 0;

const GPS_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

const SearchEffortDataEntryForm = connect(
  'doSaveSearchDataEntry',
  'doUpdateSearchDataEntry',
  'doResetTelemetryDataEntries',
  'doUpdateUrl',
  'selectDataEntryData',
  'selectDataEntryTelemetryTotalCount',
  'selectRouteParams',
  'selectIsEditForm',
  'selectLookupData',
  'doUpdateCurrentTab',
  ({
    doSaveSearchDataEntry,
    doUpdateSearchDataEntry,
    doResetTelemetryDataEntries,
    doUpdateUrl,
    dataEntryData,
    dataEntryTelemetryTotalCount,
    routeParams,
    isEditForm,
    lookupData,
    doUpdateCurrentTab,
  }) => {
    // const prevIsEditFormRef = useRef(isEditForm);
    const siteRouteKey = routeParams?.siteId;
    const siteId = siteRouteKey;
    const { searchTypeCodes } = lookupData;
    const [offlineSearchTypeCodes, setOfflineSearchTypeCodes] = useState([]);
    const [submitMessage, setSubmitMessage] = useState(null);
    const searchDraftKey = `currentSearchEffortDraft:${siteId}`;
    const isOfflineSite = String(siteId).startsWith('SITE-');

    const defaultValues = useMemo(
      () => getSearchEffortDefaultValues({ dataEntryData, telemetryCount: dataEntryTelemetryTotalCount }),
      [dataEntryData?.siteId, dataEntryTelemetryTotalCount]
    );
    const schema = getSearchEffortSchema();

    const methods = useForm({
      defaultValues: {
        ...getSearchEffortDefaultValues({ dataEntryData }),
        telemetryCount: Number(dataEntryTelemetryTotalCount || 0),
      },
      resolver: yupResolver(schema),
      mode: 'onSubmit',
      reValidateMode: 'onChange',
      stateOptions: [],
    });

    const {
      formState: { errors, isValid, submitCount, isDirty },
      setFocus,
      watch,
      getValues,
      setValue,
      trigger,
      reset,
      handleSubmit,
    } = methods;

    const browserGps = useGpsCapture(GPS_OPTIONS);
    const ubloxGps = useUbloxSerialGps();

    const captureGpsBest = async () => {
      if (USE_UBLOX_POC && ubloxGps.isConnected && ubloxGps.latestFix) {
        console.log('[GPS SOURCE] using u-blox satellite serial GPS');
        return {
          best: ubloxGps.latestFix,
          samples: [ubloxGps.latestFix],
        };
      }

      console.log('[GPS SOURCE] using browser geolocation fallback');
      return browserGps.captureBestOf(5, 700);
    };

    console.warn('VALUES: ', getValues());

    const fmtTimeHHMMSS = (val) => {
      const d = val ? new Date(val) : new Date();

      if (Number.isNaN(d.getTime())) {
        console.error('Invalid date:', val);
        return '';
      }

      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      return `${hh}:${mm}:${ss}`;
    };

    const handleCaptureStart = async () => {
      try {
        const { best } = await captureGpsBest();

        setValue('startLatitude', Number(best.lat), { shouldValidate: true });
        setValue('startLongitude', Number(best.lng), { shouldValidate: true });
        setValue('startTime', fmtTimeHHMMSS(), { shouldValidate: true });

        window.alert(
          `Captured START\nsource=${best.source || 'browser'}\nlat=${best.lat}\nlng=${best.lng}\nacc=${Math.round(best.accuracy)}m`
        );
      } catch (e) {
        console.error(e);
        window.alert(`GPS capture failed: ${e?.message || e}`);
      }
    };

    const handleCaptureStop = async () => {
      try {
        const { best } = await captureGpsBest();

        setValue('stopLatitude', Number(best.lat), { shouldValidate: true });
        setValue('stopLongitude', Number(best.lng), { shouldValidate: true });
        setValue('stopTime', fmtTimeHHMMSS(), { shouldValidate: true });

        window.alert(
          `Captured STOP\nsource=${best.source}\nlat=${best.lat}\nlng=${best.lng}\nacc=${Math.round(best.accuracy)}m`
        );
      } catch (e) {
        console.error(e);
        window.alert(`GPS capture failed: ${e?.message || e}`);
      }
    };

    const searchTypeCode = watch('searchTypeCode');
    const telemetryCount = Number(watch('telemetryCount') || 0);
    const hasTelemetry = telemetryCount >= 1;
    const isShowErrorSummary = submitCount > 0 && !isEmpty(errors);

    const getTelemetryWarning = () => {
      if (Number(dataEntryTelemetryTotalCount || 0) === 0) {
        return 'Telemetry fish must have a value';
      }
      return;
    };

    const handleChange = (e) => {
      const name = e?.target?.name;
      const val = e?.target?.value;
      if (name === 'recorder') {
        setValue('recorder', val?.toUpperCase());
      }
    };

    const getCastedValues = () => {
      const values = getValues();

      const casted = {
        ...values,
        searchDay: values.searchDay !== '' ? Number(values.searchDay) : values.searchDay,
        startLatitude: values.startLatitude !== '' ? Number(values.startLatitude) : values.startLatitude,
        startLongitude: values.startLongitude !== '' ? Number(values.startLongitude) : values.startLongitude,
        stopLatitude: values.stopLatitude !== '' ? Number(values.stopLatitude) : values.stopLatitude,
        stopLongitude: values.stopLongitude !== '' ? Number(values.stopLongitude) : values.stopLongitude,
        temp: values.temp !== '' ? Number(values.temp) : values.temp,
        conductivity: values.conductivity !== '' ? Number(values.conductivity) : values.conductivity,

        siteId: isOfflineSite ? undefined : Number(values.siteId || siteRouteKey),
        site_id: isOfflineSite ? undefined : Number(values.site_id || values.siteId || siteRouteKey),

        siteFid: isOfflineSite ? siteRouteKey : values.siteFid,
        site_fid: isOfflineSite ? siteRouteKey : values.site_fid,

        siteRouteKey,
        dsId: values.dsId ?? 1,
      };

      delete casted.checkby;
      delete casted.uploadedBy;

      return casted;
    };

    const doSaveDraft = async () => {
      const valid = await trigger();
      if (!valid) return;

      const values = getCastedValues();

      const clientId = values.clientId ?? dataEntryData?.clientId ?? crypto.randomUUID();

      const payload = filterNullEmptyObjects({
        ...values,
        clientId,
        siteId: isOfflineSite ? undefined : Number(siteRouteKey),
        site_id: isOfflineSite ? undefined : Number(siteRouteKey),
        siteFid: isOfflineSite ? siteRouteKey : values.siteFid,
        site_fid: isOfflineSite ? siteRouteKey : values.site_fid,
        siteRouteKey,
        status: 1,
        _status: 'draft',
        version: values.version ?? 0,
        updatedAt: new Date().toISOString(),
      });

      const draftSeId = payload?.seId ?? payload?.se_id;
      const draftSeFid = payload?.seFid ?? payload?.se_fid;

      if (!draftSeId && !draftSeFid) {
        console.error('Missing Search Effort ID. Cannot save draft offline.');
        return;
      }

      try {
        if (isOnline()) {
          if (isEditForm) {
            doUpdateSearchDataEntry(payload);
          } else {
            const response = await doSaveSearchDataEntry(payload);
            const savedSeId = response?.data;
            if (savedSeId) {
              payload.seId = savedSeId;
              payload.se_id = savedSeId;
              setValue('seId', savedSeId);
            }
          }
        } else {
          await db.search.put(payload);
        }
        sessionStorage.setItem(searchDraftKey, JSON.stringify(payload));

        setValue('clientId', clientId);
        setValue('seFid', payload.seFid);
        setValue('status', 1);

        doResetTelemetryDataEntries();
        doUpdateCurrentTab(1);
      } catch (error) {
        console.error('Save draft failed:', error);

        if (!isOnline()) {
          await db.search.put(payload);
          sessionStorage.setItem(searchDraftKey, JSON.stringify(payload));
          doResetTelemetryDataEntries();
          doUpdateCurrentTab(1);
        }
      }
    };

    const doSubmit = async () => {
      setValue('status', 2);

      const values = getCastedValues();
      const draft = getOfflineSearchEffortDraft();

      const clientId = values.clientId ?? draft?.clientId ?? dataEntryData?.clientId ?? crypto.randomUUID();

      const payload = filterNullEmptyObjects({
        ...draft,
        ...values,
        clientId,
        siteId: isOfflineSite ? undefined : Number(siteRouteKey),
        site_id: isOfflineSite ? undefined : Number(siteRouteKey),
        siteFid: isOfflineSite ? siteRouteKey : (values.siteFid ?? draft?.siteFid),
        site_fid: isOfflineSite ? siteRouteKey : (values.site_fid ?? draft?.site_fid),
        siteRouteKey,
        status: 2,
        _status: 'queued',
        version: values.version ?? draft?.version ?? 0,
        updatedAt: new Date().toISOString(),
      });

      try {
        if (isOnline()) {
          if (isEditForm || payload.seId || payload.se_id) {
            await doUpdateSearchDataEntry(payload);
          } else {
            await doSaveSearchDataEntry(payload);
          }
        } else {
          const serverSeId = Number(payload?.seId ?? payload?.se_id) > 0;
          if (serverSeId) {
            await updateData('search', clientId, payload);
          } else {
            await createData('search', payload);
          }
        }

        setValue('clientId', clientId);
        setValue('status', 2);

        sessionStorage.removeItem(searchDraftKey);
        refreshSiteDatasheet();
        doUpdateUrl(`/sites-list/${siteRouteKey}`);

        setSubmitMessage({
          type: 'success',
          text: isOnline()
            ? 'Search Effort form submitted successfully.'
            : 'Search Effort form saved offline successfully. It will sync when you are back online.',
        });
      } catch (error) {
        console.error('Search submit failed, queueing offline:', error);

        const serverSeId = Number(payload?.seId ?? payload?.se_id) > 0;
        if (serverSeId) {
          await updateData('search', clientId, payload);
        } else {
          await createData('search', payload);
        }

        setValue('clientId', clientId);
        setValue('status', 2);
        sessionStorage.setItem(searchDraftKey, JSON.stringify(payload));

        setSubmitMessage({
          type: 'success',
          text: 'Search Effort form saved offline successfully. It will sync when you are back online.',
        });
      }
    };

    const getOfflineSearchEffortDraft = () => {
      const savedDraft = sessionStorage.getItem(searchDraftKey);

      if (!savedDraft) return null;

      try {
        const draft = JSON.parse(savedDraft);
        const draftSeId = draft?.seId ?? draft?.se_id;
        const draftSeFid = draft?.seFid ?? draft?.se_fid;

        if (!draftSeId && !draftSeFid) return null;

        if (String(draft.siteRouteKey || draft.siteFid || draft.site_fid || draft.siteId) !== String(siteRouteKey)) {
          return null;
        }
        return draft;
      } catch (err) {
        console.error('Failed to parse offline Search Effort draft:', err);
        return null;
      }
    };

    const reloadOfflineSearchEffortDraft = () => {
      if (isEditForm) return false;

      const draft = getOfflineSearchEffortDraft();

      if (!draft) return false;

      reset(
        {
          ...getSearchEffortDefaultValues({ dataEntryData }),
          ...draft,
          telemetryCount: Number(draft.telemetryCount || dataEntryTelemetryTotalCount || 0),
        },
        {
          keepDirty: false,
          keepTouched: false,
        }
      );
      return true;
    };

    useEffect(() => {
      reloadOfflineSearchEffortDraft();
    }, [isEditForm, dataEntryTelemetryTotalCount]);

    useEffect(() => {
      async function loadCachedLookups() {
        const options = await getLookupOptions('searchTypeCodes');
        setOfflineSearchTypeCodes(options);
      }
      loadCachedLookups();
    }, []);

    const searchTypeOptions = searchTypeCodes?.length > 0 ? searchTypeCodes : offlineSearchTypeCodes;

    useEffect(() => {
      const count = Number(dataEntryTelemetryTotalCount || 0);

      setValue('telemetryCount', count, { shouldValidate: true, shouldDirty: false, shouldTouch: false });
    }, [dataEntryTelemetryTotalCount, setValue]);

    useEffect(() => {
      const draft = getOfflineSearchEffortDraft();

      if (!isEditForm && draft) {
        reset(
          {
            ...defaultValues,
            ...draft,
            telemetryCount: Number(draft.telemetryCount || dataEntryTelemetryTotalCount || 0),
          },
          {
            keepDirty: false,
            keepTouched: false,
          }
        );
        return;
      }
      reset(defaultValues);
    }, [reset, defaultValues, isEditForm, dataEntryTelemetryTotalCount]);

    // Reset form
    // useEffect(() => {
    //   const prevIsEditForm = prevIsEditFormRef.current;

    //   if (!isEditForm && prevIsEditForm !== false) {
    //     doResetTelemetryDataEntries();
    //   }

    //   prevIsEditFormRef.current = isEditForm;
    // }, [isEditForm, doResetTelemetryDataEntries]);

    // Set IDs
    useEffect(() => {
      async function setSearchEffortFid() {
        if (!isEditForm) {
          const savedDraft = sessionStorage.getItem(searchDraftKey);
          const draft = savedDraft ? JSON.parse(savedDraft) : null;

          if (draft?.seFid) {
            reloadOfflineSearchEffortDraft();
            return;
          }

          const queueLength = await db.outbox.where('tableName').equals('ds_search').count();

          const seFid = generateFieldId(queueLength);
          setValue('seFid', seFid);
        } else if (isEditForm && dataEntryData) {
          setValue('seId', dataEntryData.seId);
          setValue('seFid', dataEntryData.seFid);
        }
      }
      setSearchEffortFid();
    }, [isEditForm, dataEntryData, setValue]);

    useEffect(() => {
      if (Object.keys(errors).length > 0) {
        setFocus(Object.keys(errors)[0]);
      }
    }, [errors, setFocus]);

    useEffect(() => {
      const handleBeforeUnload = (e) => {
        if (isDirty) {
          e.preventDefault();
          e.returnValue = '';
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, [isDirty]);

    return (
      <FormProvider {...methods}>
        {isShowErrorSummary && <ErrorSummary errors={errors} type='form' isValid={isValid} />}
        {submitMessage && (
          <div className={`usa-alert usa-alert--${submitMessage.type}`} role='status'>
            <div className='usa-alert__body'>
              <p className='usa-alert__text'>{submitMessage.text}</p>
            </div>
          </div>
        )}
        <>
          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 3 }}>
              <TextInput name='seId' label='SE ID' readOnly />
            </Grid>
            <Grid tablet={{ col: 3 }}>
              <TextInput name='seFid' label='SE Field ID (Date-Time-SE#)' readOnly />
            </Grid>
            <Grid tablet={{ col: 6 }}>
              {!hasTelemetry ? (
                <Button className='add-btn save-btn' onClick={handleSubmit(doSaveDraft)} type='button'>
                  Save as Draft
                </Button>
              ) : (
                <Button className='add-btn save-btn' onClick={handleSubmit(doSubmit)} type='button'>
                  Submit
                </Button>
              )}
            </Grid>
          </Grid>
          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 2 }}>
              <TextInput name='searchDate' label='Search Date' type='date' required />
            </Grid>

            <Grid tablet={{ col: 2 }}>
              <TextInput
                name='recorder'
                label='Recorder Initials'
                maxLength={3}
                style={{ textTransform: 'uppercase' }}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid tablet={{ col: 2 }}>
              <SelectInput name='searchTypeCode' label='Search Type' onChange={handleChange} required>
                {searchTypeOptions.map((opt, idx) => (
                  <option key={idx + 1} value={opt.code}>
                    {`${opt.code} - ${opt.description}`}
                  </option>
                ))}
              </SelectInput>
            </Grid>

            <Grid tablet={{ col: 2 }}>
              <Grid tablet={{ col: 12 }}>
                <TextInput name='searchDay' label='Search Day' type='number' required={searchTypeCode === 'RS'} />
              </Grid>
            </Grid>

            <Grid tablet={{ col: 2 }}>
              <TextInput name='temp' label='Temp (C)' type='number' />
            </Grid>

            <Grid tablet={{ col: 2 }}>
              <TextInput name='conductivity' label='Conductivity' type='number' />
            </Grid>
          </Grid>

          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 2 }}>
              <TextInput name='startTime' label='Start Time (hh:mm:ss)' required />
              <Button
                onClick={handleCaptureStart}
                type='button'
                disabled={USE_UBLOX_POC && ubloxGps.isConnected && !ubloxGps.latestFix}
                className='primary-btn margin-top-1'
              >
                <Icon path={mdiCrosshairsGps} className='margin-right-1' />
                {USE_UBLOX_POC && ubloxGps.isConnected && !ubloxGps.latestFix
                  ? 'Waiting for Satellite Fix...'
                  : 'Capture Start GPS'}
              </Button>
            </Grid>

            <Grid tablet={{ col: 2 }}>
              <TextInput name='startLatitude' type='number' label='Start Latitude' required />
            </Grid>

            <Grid tablet={{ col: 2 }}>
              <TextInput name='startLongitude' type='number' label='Start Longitude' required />
            </Grid>

            <Grid tablet={{ col: 2 }}>
              <TextInput
                name='stopTime'
                label='Stop Time (hh:mm:ss)'
                required={hasTelemetry}
                disabled={!hasTelemetry}
                warning={!hasTelemetry ? getTelemetryWarning() : ''}
              />
              {hasTelemetry && (
                <Button onClick={handleCaptureStop} type='button' className='primary-btn margin-top-1'>
                  <Icon path={mdiCrosshairsGps} className='margin-right-1' />
                  Capture Stop GPS
                </Button>
              )}
            </Grid>

            <Grid tablet={{ col: 2 }}>
              <TextInput
                name='stopLatitude'
                type='number'
                label='Stop Latitude'
                required={hasTelemetry}
                disabled={!hasTelemetry}
                warning={!hasTelemetry ? getTelemetryWarning() : ''}
              />
            </Grid>

            <Grid tablet={{ col: 2 }}>
              <TextInput
                name='stopLongitude'
                type='number'
                label='Stop Longitude'
                required={hasTelemetry}
                disabled={!hasTelemetry}
                warning={!hasTelemetry ? getTelemetryWarning() : ''}
              />
            </Grid>
          </Grid>
        </>
      </FormProvider>
    );
  }
);

export default SearchEffortDataEntryForm;
