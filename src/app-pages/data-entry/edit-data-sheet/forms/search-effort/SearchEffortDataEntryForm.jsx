import { useEffect, useMemo, useRef } from 'react';
import { connect } from 'redux-bundler-react';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import TextInput from '@src/app-components/new-inputs/text-input/TextInput';
import SelectInput from '@src/app-components/new-inputs/select-input/SelectInput';
import { Button, Alert, Grid } from '@trussworks/react-uswds';

import { searchTypeOptions } from '../_shared/selectHelper';
import ErrorSummary from '@src/app-components/error-summary/ErrorSummary';

import { getSearchEffortSchema, getSearchEffortDefaultValues } from './SearchEffortDataEntryForm.validation';
import classNames from 'classnames';

const saveBtnClasses = classNames('button-small', 'text-normal', 'save-btn');

const SearchEffortDataEntryForm = connect(
  'doSaveSearchDataEntry',
  'doUpdateSearchDataEntry',
  'doUpdateCurrentTab',
  'doResetTelemetryDataEntries',
  'selectDataEntryData',
  'selectDataEntryTelemetryTotalCount',
  'selectRouteParams',
  'selectIsEditForm',
  ({
    doSaveSearchDataEntry,
    doUpdateSearchDataEntry,
    doUpdateCurrentTab,
    doResetTelemetryDataEntries,
    dataEntryData,
    dataEntryTelemetryTotalCount,
    routeParams,
    isEditForm,
  }) => {
    const siteId = routeParams?.siteId;
    const defaultValues = useMemo(() => getSearchEffortDefaultValues({ dataEntryData }), [dataEntryData?.siteId]);
    const schema = getSearchEffortSchema();

    const methods = useForm({
      defaultValues,
      resolver: yupResolver(schema),
      mode: 'onBlur',
    });

    const {
      formState: { errors, isValid },
      setFocus,
      watch,
      getValues,
      trigger,
      reset,
    } = methods;

    const searchTypeCode = watch('searchTypeCode');
    // const stopTime = watch('stopTime');
    // const stopLatitude = watch('stopLatitude');
    // const stopLongitude = watch('stopLongitude');

    // const getTelemetryWarning = (val) => {
    //   if (Number(dataEntryTelemetryTotalCount) > 0 && !value) {
    //     return 'Telemetry fish has a value';
    //   }
    //   return;
    // };

    useEffect(() => {
      reset(defaultValues);
    }, [reset, defaultValues]);

    const prevIsEditFormRef = useRef(isEditForm);

    useEffect(() => {
      const prevIsEditForm = prevIsEditFormRef.current;

      if (!isEditForm && prevIsEditForm !== false) {
        doResetTelemetryDataEntries();
      }

      prevIsEditFormRef.current = isEditForm;
    }, [isEditForm, doResetTelemetryDataEntries]);

    // useEffect(() => {
    //   const firstKey = Object.keys(errors || {})[0];
    //   if (firstKey) setFocus(firstKey);
    // }, [errors, setFocus]);

    useEffect(() => {
      setFocus(errors?.[Object.keys(errors)[0]]?.['ref']?.['id']);
    }, [errors, setFocus]);

    const doSave = () => {
      if (isValid) {
        const values = getValues();

        const castedValues = {
          ...values,
          startLatitude: values.startLatitude !== '' ? Number(values.startLatitude) : values.startLatitude,
          startLongitude: values.startLongitude !== '' ? Number(values.startLongitude) : values.startLongitude,
          stopLatitude: values.stopLatitude !== '' ? Number(values.stopLatitude) : values.stopLatitude,
          stopLongitude: values.stopLongitude !== '' ? Number(values.stopLongitude) : values.stopLongitude,

          siteId: values.siteId ?? siteId,
          dsId: values.dsId ?? 1,
        };

        isEditForm ? doUpdateSearchDataEntry(castedValues) : doSaveSearchDataEntry(castedValues);
        doUpdateCurrentTab(1);
      } else {
        trigger();
      }
    };

    const showStopWarning = Number(dataEntryTelemetryTotalCount || 0) > 0;

    return (
      <FormProvider {...methods}>
        {errors && <ErrorSummary errors={errors} />}
        <>
          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 2 }}>
              <TextInput name='searchDate' label='Search Date' type='date' required />
            </Grid>

            <Grid tablet={{ col: 2 }}>
              <TextInput name='recorder' label='Recorder Initials' required />
            </Grid>

            <Grid tablet={{ col: 2 }}>
              <SelectInput name='searchTypeCode' label='Search Type' required>
                <option value=''>-- Select --</option>
                {(typeof searchTypeOptions === 'function' ? searchTypeOptions(searchTypeCode) : searchTypeOptions).map(
                  (opt, idx) => (
                    <option key={idx + 1} value={opt.value}>
                      {opt.text}
                    </option>
                  )
                )}
              </SelectInput>
              {searchTypeCode === 'RS' && (
                <Grid tablet={{ col: 12 }}>
                  <TextInput name='day' label='Day' type='date' required />
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
              <TextInput
                name='startLatitude'
                type='number'
                label='Start Latitude'
                placeholder='ex: 12.34567'
                required
              />
            </Grid>

            <Grid tablet={{ col: 2 }}>
              <TextInput
                name='startLongitude'
                type='number'
                label='Start Longitude'
                placeholder='ex: 12.34567'
                required
              />
            </Grid>

            <Grid tablet={{ col: 2 }}>
              <TextInput
                name='stopTime'
                label='Stop Time (hh:mm:ss)'
                required
                // warning={getTelemetryWarning(stopTime)}
              />
            </Grid>

            <Grid tablet={{ col: 2 }}>
              <TextInput
                name='stopLatitude'
                type='number'
                label='Stop Latitude'
                placeholder='ex: 12.34567'
                required
                // warning={getTelemetryWarning(stopLatitude)}
              />
            </Grid>

            <Grid tablet={{ col: 2 }}>
              <TextInput
                name='stopLongitude'
                type='number'
                label='Stop Longitude'
                placeholder='ex: 12.34567'
                required
                // warning={getTelemetryWarning(stopLongitude)}
              />
            </Grid>
          </Grid>
          {/* Warning */}
          {showStopWarning && (
            <Grid row className='margin-top-2'>
              <Grid tablet={{ col: 12 }}>
                <Alert type='warning' heading='Warning'>
                  Telemetry fish has a value.
                </Alert>
              </Grid>
            </Grid>
          )}

          <Grid tablet={{ col: 2 }}>
            <Grid row gap='md'>
              <Grid tablet={{ col: 12 }}>
                <Button className={saveBtnClasses} onClick={() => doSave()} type='button'>
                  {isEditForm ? 'Apply Changes' : 'Save Data Entry'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </>
      </FormProvider>
    );
  }
);

export default SearchEffortDataEntryForm;
