import { connect } from 'redux-bundler-react';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, FormProvider } from 'react-hook-form';
import ErrorSummary from '@src/app-components/error-summary/ErrorSummary';
import { Grid } from '@trussworks/react-uswds';
import { formatDate } from '@src/utils/helpers';
import { ValidationMessages } from '@src/utils/enums';
import SelectInput from '@src/app-components/new-inputs/select-input/SelectInput';
import { useCallback, useEffect, useState } from 'react';
import TextInput from '@src/app-components/new-inputs/text-input/TextInput';

const microSegmentRequired = [8, 9, 10, 11, 13, 14];

const createDropdownOptions = (data) => {
  if (!data) return [];

  return data.map((item) => {
    const { code, description } = item;

    return {
      value: code,
      text: description,
    };
  });
};

const schema = yup.object().shape({
  setdate: yup.string().required(ValidationMessages.FieldRequired),
  // Cannot have duplicate subsample numbers with same site_id and pass
  subsample: yup.number().required(ValidationMessages.FieldRequired).moreThan(0, 'Value cannot be zero'),
  subsamplepass: yup
    .number()
    .required(ValidationMessages.FieldRequired)
    .moreThan(0, 'Value cannot be zero')
    .max(9, 'The value cannot be greater than 9'),
  subsamplen: yup.string().required(ValidationMessages.FieldRequired),
  gearType: yup.string().required(ValidationMessages.FieldRequired),
  gear: yup.string().required(ValidationMessages.FieldRequired),
  recorder: yup.string().required(ValidationMessages.FieldRequired),
  macro: yup.string().required(ValidationMessages.FieldRequired),
  meso: yup.string().required(ValidationMessages.FieldRequired),
  micro: yup.number().nullable(),
  microStructure: yup.string().nullable(),
  structureFlow: yup.string().nullable(),
  structureMod: yup.string().nullable(),
  temp: yup.number().required(ValidationMessages.FieldRequired),
  width: yup.number().nullable(),
  setSite1: yup.string().nullable(),
  setSite2: yup.string().nullable(),
  setSite3: yup.string().nullable(),
  startTime: yup.string().required(ValidationMessages.FieldRequired),
  startlatitude: yup.number().required(ValidationMessages.FieldRequired),
  startlongitude: yup.number().required(ValidationMessages.FieldRequired),
  u1: yup.string().nullable(),
  u2: yup.string().nullable(),
  u3: yup.string().nullable(),
  u4: yup.string().nullable(),
  u5: yup.string().nullable(),
  u6: yup.string().nullable(),
  u7: yup.string().nullable(),
});

const MissouriRiverDataEntryForm = connect(
  'selectBaseData',
  'selectDataEntryData',
  'selectDomains',
  'selectLookupData',
  ({ baseData, dataEntryData, domains, lookupData }) => {
    const { bendSelections, gearCodes, filteredGearCodes, gearTypes, macros, mesos, macroMesos } = lookupData;
    const { fieldoffice, season, projectId, segmentId } = baseData;
    const [gearCodeOptions, setGearCodeOptions] = useState(gearCodes);
    const [mesoOptions, setMesoOptions] = useState(mesos);

    console.warn('baseData: ', baseData);

    const getSeasonGearOfficeOptions = (season, fieldOffice, project) => {
      const options = filteredGearCodes.filter(
        (item) => item.fieldOfficeCode === fieldOffice && item.seasonCode === season && item.projectCode === project
      );
      return options.map((item) => ({ code: item.gearCode }));
    };

    const getMacroMesoOptions = (macro) => {
      const options = macroMesos.filter((item) => item.macroHabitatCode === macro);
      return options.map((item) => ({ code: item.mesoHabitatCode }));
    };

    const handleMesoOptions = useCallback(
      (mesosData, gearType, gearCode, macro) => {
        let options = gearType === 'S' ? getMacroMesoOptions(macro) : mesosData;
        if (gearCode === 'TN') {
          options = options.filter((item) => item.code !== 'POOL');
        }
        if (gearCode.startsWith('GN')) {
          options = options.filter((item) => item.code !== 'BARS');
        }
        if (gearCode !== 'HW') {
          options = options.filter((item) => item.code !== 'FMCD');
        }
        setMesoOptions(options);
      },
      [getMacroMesoOptions, setMesoOptions]
    );

    const defaultValues = {
      setdate: dataEntryData?.setdate ? formatDate(dataEntryData?.setdate) : '',
      subsample: dataEntryData?.setdate ?? 1,
      subsamplepass: dataEntryData?.subsamplepass ?? '',
      subsamplen: dataEntryData?.subsamplen ?? 'R',
      gearType: dataEntryData?.gearType ?? '',
      gear: dataEntryData?.gear ?? '',
      recorder: dataEntryData?.recorder ?? '',
      macro: dataEntryData?.macro ?? '',
      meso: dataEntryData?.meso ?? '',
      micro: dataEntryData?.micro ?? '',
      microStructure: dataEntryData?.microStructure ?? '',
      structureFlow: dataEntryData?.structureFlow ?? '',
      structureMod: dataEntryData?.structureMod ?? '',
      temp: dataEntryData?.temp ?? '',
      width: dataEntryData?.width ?? '',
      setSite1: dataEntryData?.setSite1 ?? '',
      setSite2: dataEntryData?.setSite2 ?? '',
      setSite3: dataEntryData?.setSite3 ?? '',
      startTime: dataEntryData?.startTime ?? '',
      startlatitude: dataEntryData?.startlatitude ?? '',
      startlongitude: dataEntryData?.startlongitude ?? '',
      u1: dataEntryData?.u1 ?? '',
      u2: dataEntryData?.u2 ?? '',
      u3: dataEntryData?.u3 ?? '',
      u4: dataEntryData?.u4 ?? '',
      u5: dataEntryData?.u5 ?? '',
      u6: dataEntryData?.u6 ?? '',
      u7: dataEntryData?.u7 ?? '',
    };

    const methods = useForm({
      defaultValues: defaultValues,
      resolver: yupResolver(schema),
      mode: 'onBlur',
      stateOptions: [],
    });
    const {
      formState: { errors, isValid },
      setFocus,
      watch,
      getValues,
      trigger,
      setValue,
    } = methods;

    const macro = watch('macro');
    const gearCode = watch('gear');
    const gearType = watch('gearType');
    const subsamplepass = watch('subsamplepass');
    const u6 = watch('u6');
    const u7 = watch('u7');

    // Set R/N value
    useEffect(() => {
      setValue('subsamplen', subsamplepass > 1 || u7 === 'BS' ? 'N' : 'R');
    }, [subsamplepass]);

    // Set Gear Code options and reset Gear Code value when necessary
    useEffect(() => {
      setValue('gear', '', { shouldValidate: true });
      setGearCodeOptions(gearType === 'S' ? getSeasonGearOfficeOptions(season, fieldoffice, projectId) : gearCodes);
    }, [gearType]);

    // Set Meso options and reset Meso value when necessary
    useEffect(() => {
      setValue('meso', '', { shouldValidate: true });
      handleMesoOptions(mesos, gearType, gearCode, macro);
    }, [mesos, gearType, gearCode, macro]);

    useEffect(() => {
      setFocus(errors?.[Object.keys(errors)[0]]?.['ref']?.['id']);
    }, [errors, setFocus]);

    return (
      <FormProvider {...methods}>
        {errors && <ErrorSummary errors={errors} />}
        <div className='container-fluid margin-top-1'>
          <Grid row gap='md'>
            <Grid tablet={{ col: 2 }}>
              <TextInput name='setdate' label='Setdate' type='date' required />
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <TextInput name='subsample' label='Subsample' type='number' required />
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <TextInput name='subsamplepass' label='Pass' type='number' required />
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <SelectInput name='subsamplen' label='R/N' required>
                {createDropdownOptions(bendSelections).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </SelectInput>
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <SelectInput name='gearType' label='Gear Type' required>
                {createDropdownOptions(gearTypes).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </SelectInput>
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <SelectInput name='gear' label='Gear Code' required>
                {createDropdownOptions(gearCodeOptions).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.value}
                  </option>
                ))}
              </SelectInput>
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <TextInput name='recorder' label='Recorder Initials' required />
            </Grid>
          </Grid>
          <Grid row gap='md'>
            <Grid tablet={{ col: 2 }}>
              <SelectInput name='macro' label='Macro' required={u6 === 'NSTS'}>
                {createDropdownOptions(macros).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.value}
                  </option>
                ))}
              </SelectInput>
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <SelectInput name='meso' label='Meso' required={u6 === 'NSTS'}>
                {createDropdownOptions(mesoOptions).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.value}
                  </option>
                ))}
              </SelectInput>
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <TextInput type='number' name='micro' label='Micro' />
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <SelectInput
                name='microStructure'
                label='Micro Structure'
                required={(microSegmentRequired.includes(segmentId) && projectId === 2) || u6 === 'NSTS'}
              ></SelectInput>
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <SelectInput
                name='structureFlow'
                label='Structure Flow'
                required={microSegmentRequired.includes(segmentId)}
              ></SelectInput>
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <SelectInput
                name='structureMod'
                label='Structure Mod'
                required={projectId === 1 ? microSegmentRequired.includes(segmentId) : season === 'IRC'}
              ></SelectInput>
            </Grid>
          </Grid>
          <Grid row gap='md'>
            <Grid tablet={{ col: 2 }}>
              <TextInput name='temp' label='Temp (c)' type='number' required />
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <TextInput name='width' label='Width' type='number' />
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <SelectInput name='setSite1' label='Set Site 1'></SelectInput>
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <SelectInput name='setSite2' label='Set Site 2'></SelectInput>
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <SelectInput name='setSite3' label='Set Site 3'></SelectInput>
            </Grid>
          </Grid>
          <Grid row gap='md'>
            <Grid tablet={{ col: 1 }}>
              <TextInput name='startTime' label='Start Time' required />
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <TextInput name='startlatitude' label='Start Latitude' type='number' required />
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <TextInput name='startlongitude' label='Start Longitude' type='number' required />
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <TextInput name='u1' label='U1' />
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <TextInput name='u2' label='U2' />
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <TextInput name='u3' label='U3' />
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <TextInput name='u4' label='U4' />
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <TextInput name='u5' label='U5' />
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <SelectInput name='u6' label='U6'></SelectInput>
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <SelectInput name='u7' label='U7'></SelectInput>
            </Grid>
          </Grid>
        </div>
      </FormProvider>
    );
  }
);

export default MissouriRiverDataEntryForm;
