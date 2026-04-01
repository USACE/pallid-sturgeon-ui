import { useEffect, useMemo, useRef } from 'react';
import { connect } from 'redux-bundler-react';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import TextInput from '@src/app-components/new-inputs/text-input/TextInput';
import SelectInput from '@src/app-components/new-inputs/select-input/SelectInput';
import { Button, Grid } from '@trussworks/react-uswds';
import ErrorSummary from '@src/app-components/error-summary/ErrorSummary';

import { getSearchEffortSchema, getSearchEffortDefaultValues } from './SearchEffortDataEntryForm.validation';
import classNames from 'classnames';
import { filterNullEmptyObjects } from '@src/utils/helpers';
import { useGpsCapture } from '@src/app-components/gps/gpsCapture';
import { createDropdownOptions, fmtTimeHHMMSS, generateFieldId } from '../../../dataEntryHelper';

const saveBtnClasses = classNames('button-small', 'text-normal', 'save-btn');

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
  'selectDataEntryData',
  'selectDataEntryTelemetryTotalCount',
  'selectRouteParams',
  'selectIsEditForm',
  'selectLookupData',
  ({
    doSaveSearchDataEntry,
    doUpdateSearchDataEntry,
    doResetTelemetryDataEntries,
    dataEntryData,
    dataEntryTelemetryTotalCount,
    routeParams,
    isEditForm,
    lookupData,
  }) => {
    const prevIsEditFormRef = useRef(isEditForm);
    const siteId = routeParams?.siteId;
    const { searchTypes } = lookupData;

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
      formState: { errors, isValid, touchedFields, submitCount, isDirty },
      setFocus,
      watch,
      getValues,
      setValue,
      trigger,
      reset,
      handleSubmit,
      clearErrors,
    } = methods;

    const { permission, lastError, captureBestOf } = useGpsCapture(GPS_OPTIONS);

    console.warn('values: ', getValues());

    const searchTypeCode = watch('searchTypeCode');
    const telemetryCount = watch(Number(watch('telemetryCount') || 0));
    const hasTelemetry = telemetryCount > 0;

    const isShowErrorSummary = submitCount > 0 && !isEmpty(errors);

    const getTelemetryWarning = () => {
      if (Number(dataEntryTelemetryTotalCount || 0) === 0) {
        return 'Telemetry fish must have a value';
      }
      return;
    };

    // Capture Start and Stop Lat, Long, Time
    const handleCapture = async (type) => {
      try {
        const { best } = await captureBestOf(5, 700);

        setValue('startLatitude', best.lat, { shouldValidate: true });
        setValue('startLongitude', best.lng, { shouldValidate: true });
        setValue('startTime', fmtTimeHHMMSS(best.capturedAt), { shouldValidate: true });

        window.alert(
          `Captured ${type === 'start' ? 'START' : 'STOP'}\nlat=${best.lat}\nlng=${best.lng}\nacc=${Math.round(best.accuracy)}m`
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

      return {
        ...values,
        searchDay: values.searchDay !== '' ? Number(values.searchDay) : values.searchDay,
        startLatitude: values.startLatitude !== '' ? Number(values.startLatitude) : values.startLatitude,
        startLongitude: values.startLongitude !== '' ? Number(values.startLongitude) : values.startLongitude,
        stopLatitude: values.stopLatitude !== '' ? Number(values.stopLatitude) : values.stopLatitude,
        stopLongitude: values.stopLongitude !== '' ? Number(values.stopLongitude) : values.stopLongitude,
        temp: values.temp !== '' ? Number(values.temp) : values.temp,
        conductivity: values.conductivity !== '' ? Number(values.conductivity) : values.conductivity,

        siteId: values.siteId !== undefined && values.siteId !== '' ? Number(values.siteId) : Number(siteId),
        dsId: values.dsId ?? 1,
      };
    };

    const doSaveDraft = async () => {
      const valid = await trigger();
      if (!valid) return;

      const payload = filterNullEmptyObjects({
        ...getCastedValues(),
        status: 1,
      });

      if (isEditForm) {
        doUpdateSearchDataEntry(payload, () => {});
      } else {
        doSaveSearchDataEntry(payload, (val) => {
          if (val) setValue('seId', val);
        });
      }
    };

    const doSubmit = async () => {
      setValue('status', 2);
      const valid = await trigger();
      if (!valid) return;

      const payload = filterNullEmptyObjects({
        ...getCastedValues(),
        status: 2,
      });

      if (isEditForm) {
        doUpdateSearchDataEntry(payload);
      } else {
        doSaveSearchDataEntry(payload);
      }
    };

    useEffect(() => {
      const count = Number(dataEntryTelemetryTotalCount || 0);

      setValue('telemetryCount', count, { shouldValidate: true, shouldDirty: false, shouldTouch: false });
      if (count > 0) {
        clearErrors(['stopTime', 'stopLatitude', 'stopLongitude']);

        setTimeout(() => {
          trigger(['stopTime', 'stopLatitude', 'stopLongitude']);
        }, 0);
      }
    }, [dataEntryTelemetryTotalCount, setValue, trigger, clearErrors]);

    useEffect(() => {
      reset(defaultValues);
    }, [reset, defaultValues]);

    // Reset form
    useEffect(() => {
      const prevIsEditForm = prevIsEditFormRef.current;

      if (!isEditForm && prevIsEditForm !== false) {
        doResetTelemetryDataEntries();
      }

      prevIsEditFormRef.current = isEditForm;
    }, [isEditForm, doResetTelemetryDataEntries]);

    // Set IDs
    useEffect(() => {
      if (!isEditForm) {
        const queueLength = 0; // replace with outbox length later

        const seFid = generateFieldId(queueLength);
        setValue('seFid', seFid);
      } else if (isEditForm && dataEntryData) {
        setValue('seId', dataEntryData.seId);
        setValue('seFid', dataEntryData.seFid);
      }
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

    // const confirmLeave = () => {
    //   if (isDirty) {
    //     const confirm = window.confirm('You have unsaved changes. Data will not be saved. Continue?');
    //     return confirm;
    //   }
    //   return true;
    // };

    // const showStopWarning = Number(dataEntryTelemetryTotalCount || 0) > 0;

    return (
      <FormProvider {...methods}>
        {isShowErrorSummary && <ErrorSummary errors={errors} type='form' isValid={isValid} />}
        <>
          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 3 }}>
              <TextInput name='seId' label='SE ID' readOnly />
            </Grid>
            <Grid tablet={{ col: 3 }}>
              <TextInput name='seFid' label='SE Field ID (Date-Time-SE#)' readOnly />
            </Grid>
            {!hasTelemetry && (
              <Grid tablet={{ col: 2 }}>
                <Button className={saveBtnClasses} onClick={handleSubmit(doSaveDraft)} type='button'>
                  Save as Draft
                </Button>
              </Grid>
            )}
            {hasTelemetry && (
              <Grid tablet={{ col: 2 }}>
                <Button className={saveBtnClasses} onClick={doSubmit} type='button'>
                  Submit
                </Button>
              </Grid>
            )}
          </Grid>
          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 2 }}>
              <TextInput name='searchDate' label='Search Date' type='date' required />
            </Grid>

            <Grid tablet={{ col: 2 }}>
              <TextInput
                name='recorder'
                label='Recorder Initials'
                style={{ textTransform: 'uppercase' }}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid tablet={{ col: 2 }}>
              <SelectInput name='searchTypeCode' label='Search Type' required>
                {createDropdownOptions(searchTypes).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </SelectInput>
              {searchTypeCode === 'RS' && (
                <Grid tablet={{ col: 12 }}>
                  <TextInput name='searchDay' label='Search Day' type='number' required />
                </Grid>
              )}
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
            <Grid row gap='sm' table={{ col: 3 }}>
              <Button onClick={() => handleCapture('start')} type='button'>
                Capture Start GPS
              </Button>
            </Grid>
            <Grid row gap='md' table={{ col: 3 }}>
              <Button onClick={() => handleCapture('stop')} type='button'>
                Capture Stop GPS
              </Button>
            </Grid>
          </Grid>
          {/* Warning */}

          {/* <Grid tablet={{ col: 2 }}>
            <Grid row gap='md'>
              <Grid tablet={{ col: 12 }}>
                <Button className={saveBtnClasses} onClick={() => doSave()} type='button'>
                  {isEditForm ? 'Apply Changes' : 'Save as Draft'}
                </Button>
              </Grid>
            </Grid>
          </Grid> */}
        </>
      </FormProvider>
    );
  }
);

export default SearchEffortDataEntryForm;
