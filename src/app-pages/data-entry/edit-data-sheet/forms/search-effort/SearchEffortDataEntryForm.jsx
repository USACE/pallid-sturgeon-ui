import { useEffect, useMemo, useState } from 'react';
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
import { fmtTimeHHMMSS, generateFieldId } from '../../../dataEntryHelper';
import { getLookupOptions } from '@src/app-pages/data-entry/offline/lookup-cache';
import { createData, updateData } from '@src/app-pages/data-entry/offline/api';
import { db } from '@src/app-pages/data-entry/offline/db';
import { refreshSiteDatasheet } from '@src/app-pages/data-entry/offline/datasheet-refresh';
import { mdiCrosshairsGps } from '@mdi/js';
import Icon from '@src/app-components/icon/icon';
import NavigateWarningModal from '@src/common/modals/NavigateWarningModal';
import { captureGpsBest, GPS_OPTIONS, USE_UBLOX_POC } from '@src/app-pages/data-entry/offline/offlineHelper';

const isEmpty = (obj) => Object.keys(obj).length === 0;

const getTelemetryWarning = (telemetryCount) => {
  const warningMsg = 'Telemetry fish must have a value';
  return Number(telemetryCount || 0) === 0 ? warningMsg : null;
};

const SearchEffortDataEntryForm = connect(
  'doModalOpen',
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
    doModalOpen,
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
    // Initialize GPS
    const browserGps = useGpsCapture(GPS_OPTIONS);
    const ubloxGps = useUbloxSerialGps();
    const siteRouteKey = routeParams?.siteId;
    const [searchTypeCodes, setSearchTypeCodes] = useState(lookupData?.searchTypeCodes);
    const [submitMessage, setSubmitMessage] = useState(null);
    const searchDraftKey = `currentSearchEffortDraft:${siteRouteKey}`;
    const isOfflineSite = String(siteRouteKey).startsWith('SITE-');
    const isOnline = navigator.onLine;

    const defaultValues = getSearchEffortDefaultValues({
      dataEntryData,
      telemetryCount: Number(dataEntryTelemetryTotalCount || 0),
    });
    const schema = getSearchEffortSchema();

    const methods = useForm({
      defaultValues: defaultValues,
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

    const seId = watch('seId');
    const seFid = watch('seFid');
    const searchTypeCode = watch('searchTypeCode');
    const telemetryCount = Number(watch('telemetryCount') || 0);
    const hasTelemetry = telemetryCount >= 1;
    const isShowErrorSummary = submitCount > 0 && !isEmpty(errors);

    // Capture Start Lat, Long, Time
    const handleCaptureStart = async () => {
      try {
        const { best } = await captureGpsBest({ browserGps, ubloxGps });

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

    // Capture Stop Lat, Long, Time
    const handleCaptureStop = async () => {
      try {
        const { best } = await captureGpsBest({ browserGps, ubloxGps });

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
        if (isOnline) {
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
      } catch (error) {
        console.error('Save draft failed:', error);

        if (!isOnline) {
          await db.search.put(payload);
          sessionStorage.setItem(searchDraftKey, JSON.stringify(payload));
          doResetTelemetryDataEntries();
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
        if (isOnline) {
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

        setSubmitMessage({
          type: 'success',
          text: isOnline
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

    const handleSaveAndClose = (isSubmit = false) => {
      // Save/Submit Form
      isSubmit ? doSubmit() : doSaveDraft();
      // Navigate to Fish Data Entry Form Tab
      doUpdateUrl(`/sites-list/${siteRouteKey}`);
    };

    const handleSaveAndFish = (isSubmit = false) => {
      // Save/Submit Form
      isSubmit ? doSubmit() : doSaveDraft();
      // Navigate to Fish Data Entry Form Tab
      doUpdateCurrentTab(1);
    };

    const handleClose = () => doModalOpen(NavigateWarningModal, { url: `/sites-list/${siteRouteKey}` });

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

    // Load offline lookups
    useEffect(() => {
      const loadOfflineLookups = async () => {
        const options = await getLookupOptions('searchTypeCodes');
        setSearchTypeCodes(options);
      };
      !isOnline && loadOfflineLookups();
    }, [isOnline]);

    useEffect(() => {
      const count = Number(dataEntryTelemetryTotalCount || 0);

      setValue('telemetryCount', count, { shouldValidate: true, shouldDirty: false, shouldTouch: false });
    }, [dataEntryTelemetryTotalCount, setValue]);

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
          <Grid row gap='md'>
            <Grid tablet={{ col: 1 }}>
              <p>
                SE ID:<br></br>
                <span className='text-bold'>{seId !== '' ? seId : '--'}</span>
              </p>
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <p>
                SE Field ID (Date-Time-SE#):<br></br>
                <span className='text-bold'>{seFid !== '' ? seFid : '--'}</span>
              </p>
            </Grid>
            <Grid tablet={{ col: 8 }}>
              {!hasTelemetry ? (
                <Button className='add-btn save-btn' onClick={handleSubmit(doSaveDraft)} type='button'>
                  Save as Draft
                </Button>
              ) : (
                <Button className='add-btn save-btn' onClick={handleSubmit(doSubmit)} type='button'>
                  Submit
                </Button>
              )}
              <Button
                className='add-btn save-btn'
                onClick={handleSubmit(() => handleSaveAndClose(hasTelemetry))}
                type='button'
              >
                Save & Close
              </Button>
              <Button
                className='add-btn save-btn'
                onClick={handleSubmit(() => handleSaveAndFish(hasTelemetry))}
                type='button'
              >
                Save & Open Telemetry
              </Button>
              <Button className='close-btn save-btn' onClick={handleClose} type='button'>
                Close
              </Button>
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
                {searchTypeCodes.map((opt, idx) => (
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
                warning={!hasTelemetry ? getTelemetryWarning(dataEntryTelemetryTotalCount) : ''}
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
                warning={!hasTelemetry ? getTelemetryWarning(dataEntryTelemetryTotalCount) : ''}
              />
            </Grid>

            <Grid tablet={{ col: 2 }}>
              <TextInput
                name='stopLongitude'
                type='number'
                label='Stop Longitude'
                required={hasTelemetry}
                disabled={!hasTelemetry}
                warning={!hasTelemetry ? getTelemetryWarning(dataEntryTelemetryTotalCount) : ''}
              />
            </Grid>
          </Grid>
        </>
      </FormProvider>
    );
  }
);

export default SearchEffortDataEntryForm;
