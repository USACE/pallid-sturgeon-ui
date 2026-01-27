import { connect } from 'redux-bundler-react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import ErrorSummary from '@src/app-components/error-summary/ErrorSummary';
import { Grid } from '@trussworks/react-uswds';
import SelectInput from '@src/app-components/new-inputs/select-input/SelectInput';
import { useCallback, useEffect, useState } from 'react';
import TextInput from '@src/app-components/new-inputs/text-input/TextInput';
import { getMissouriRiverDefaultValues, getMissouriRiverSchema } from './MissouriRiverDataEntryForm.validation';

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

const MissouriRiverDataEntryForm = connect(
  'selectBaseData',
  'selectDataEntryData',
  'selectDomains',
  'selectLookupData',
  ({ baseData, dataEntryData, domains, lookupData }) => {
    const {
      bendSelections,
      gearCodes,
      filteredGearCodes,
      gearTypes,
      macros,
      mesos,
      macroMesos,
      microHabitats,
      microStructures,
    } = lookupData;
    const { fieldoffice, season, projectId, segmentId } = baseData;
    const [gearCodeOptions, setGearCodeOptions] = useState(gearCodes);
    const [mesoOptions, setMesoOptions] = useState(mesos);

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

    const getMicroStructureFlowOptions = (microStructure) => {
      const options = microHabitats.filter((item) => item.microStructureCode === microStructure);
      return options.map((item) => ({ code: item.structureFlowCode, description: item.structureFlow }));
    };

    const handleMesoOptions = useCallback(
      (mesosData, gearType, gearCode, macro, season) => {
        let options = gearType === 'S' ? getMacroMesoOptions(macro) : mesosData;
        if (gearCode === 'TN') {
          options = options.filter((item) => item.code !== 'POOL');
        }
        if (gearCode.startsWith('GN')) {
          options = options.filter((item) => item.code !== 'BARS');
        }
        if (season !== 'HW') {
          options = options.filter((item) => item.code !== 'FMCD');
        }
        setMesoOptions(options);
      },
      [getMacroMesoOptions, setMesoOptions]
    );

    const methods = useForm({
      defaultValues: getMissouriRiverDefaultValues({ dataEntryData }),
      resolver: yupResolver(getMissouriRiverSchema({ microSegmentRequired, segmentId, projectId })),
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
    const micro = watch('micro');
    const microStructure = watch('microStructure');
    const structureFlow = watch('structureFlow');
    const structureMod = watch('structureMod');
    const u6 = watch('u6');
    const u7 = watch('u7');

    const isNsts = u6 === 'NSTS';
    const isMicroRequired = microSegmentRequired.includes(segmentId);

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
      handleMesoOptions(mesos, gearType, gearCode, macro, season);
    }, [mesos, gearType, gearCode, macro, season]);

    useEffect(() => {
      setFocus(errors?.[Object.keys(errors)[0]]?.['ref']?.['id']);
    }, [errors, setFocus]);

    return (
      <FormProvider {...methods}>
        {errors && <ErrorSummary errors={errors} />}
        <div className='container-fluid margin-top-1'>
          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 2 }}>
              <TextInput name='setdate' label='Setdate' type='date' required />
              {/* @TODO: Add a button to autocomplete field with current date */}
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
              <TextInput name='recorder' label='Recorder Initials' maxLength={3} required />
            </Grid>
          </Grid>

          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 4 }} className='border-right'>
              <Grid row gap='md'>
                <Grid tablet={{ col: 6 }}>
                  <SelectInput name='macro' label='Macro' required={isNsts} readOnly={!isNsts}>
                    {createDropdownOptions(macros).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.value}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 6 }}>
                  <SelectInput name='meso' label='Meso' required={isNsts} readOnly={!isNsts}>
                    {createDropdownOptions(mesoOptions).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.value}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 6 }}>
                  <TextInput
                    name='temp'
                    label='Temp (c)'
                    type='number'
                    required={projectId === 1 || projectId === 2 || isNsts}
                  />
                </Grid>
                <Grid tablet={{ col: 6 }}>
                  <TextInput name='width' label='Width' type='number' />
                </Grid>
              </Grid>
            </Grid>

            <Grid tablet={{ col: 8 }}>
              <Grid row gap='md'>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    type='number'
                    name='micro'
                    label='Micro'
                    required={isMicroRequired || projectId === 2}
                    readOnly={microStructure || structureFlow || structureMod}
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput
                    name='microStructure'
                    label='Micro Structure'
                    required={
                      (!micro ? isMicroRequired : false) ||
                      projectId === 1 ||
                      projectId == 2 ||
                      isNsts ||
                      season === 'IRC'
                    }
                  >
                    {createDropdownOptions(microStructures).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='structureFlow' label='Structure Flow' required={!micro ? isMicroRequired : false}>
                    {createDropdownOptions(getMicroStructureFlowOptions(microStructure)).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.value}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput
                    name='structureMod'
                    label='Structure Mod'
                    required={
                      (!micro ? isMicroRequired : false) ||
                      projectId === 1 ||
                      projectId == 2 ||
                      isNsts ||
                      season === 'IRC'
                    }
                  ></SelectInput>
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 3 }} offset={3}>
                  <SelectInput name='setSite1' label='Set Site 1'></SelectInput>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='setSite2' label='Set Site 2'></SelectInput>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='setSite3' label='Set Site 3'></SelectInput>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 5 }} className='border-right'>
              <Grid row gap='md'></Grid>
            </Grid>
          </Grid>

          {/* <Grid row gap='md'>
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
          </Grid> */}
        </div>
      </FormProvider>
    );
  }
);

export default MissouriRiverDataEntryForm;
