import { useCallback, useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import classNames from 'classnames';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, Grid } from '@trussworks/react-uswds';

import ErrorSummary from '@src/app-components/error-summary/ErrorSummary';
import SelectInput from '@src/app-components/new-inputs/select-input/SelectInput';
import TextInput from '@src/app-components/new-inputs/text-input/TextInput';
import TextArea from '@src/app-components/new-inputs/text-area/TextArea';

import {
  getMissouriRiverDefaultValues,
  getMissouriRiverSchema,
  microSegmentRequired,
  gearReqFields,
} from './MissouriRiverDataEntryForm.validation';
import { filterNullEmptyObjects, formatCoordFlt } from '@src/utils/helpers';
import Checkbox from '@src/app-components/check-box/Checkbox';

import '../../../dataentry.scss';

const saveBtnClasses = classNames('button-small', 'text-normal', 'save-btn');

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

const isEmpty = (obj) => Object.keys(obj).length === 0;

const removeDuplicates = (arr) => {
  const serializedArray = arr.map(JSON.stringify);
  const uniqueSet = new Set(serializedArray);
  const uniqueArray = Array.from(uniqueSet).map(JSON.parse);
  return uniqueArray.sort((a, b) => a.code - b.code);
};

const MissouriRiverDataEntryForm = connect(
  'doUpdateBaseData',
  'doAddMoRiverDataEntry',
  'doUpdateMoRiverDataEntry',
  'selectBaseData',
  'selectDataEntryData',
  'selectLookupData',
  ({ doUpdateBaseData, doAddMoRiverDataEntry, doUpdateMoRiverDataEntry, baseData, dataEntryData, lookupData }) => {
    const {
      bendRiverMile,
      bendSelections,
      gearCodes,
      filteredGearCodes,
      gearTypes,
      macros,
      mesos,
      macroMesos,
      microHabitats,
      microStructures,
      u6Options,
      u7Options,
      microSetSite,
      setSite1Options,
      setSite2Options,
      setSite3Options,
      structureFlows,
      structureMods,
      subsampleTypes,
    } = lookupData;
    const { bend, fieldoffice, season, projectId, segmentId } = baseData;
    const [gearCodeOptions, setGearCodeOptions] = useState(gearCodes);
    const [mesoOptions, setMesoOptions] = useState(mesos);
    const [structureFlowOptions, setStructureFlowOptions] = useState([]);
    const [structureModOptions, setStructureModOptions] = useState([]);
    const [ss1Options, setSs1Options] = useState([]);
    const [ss2Options, setSs2Options] = useState([]);

    const newForm = dataEntryData?.mrId ? true : false;

    const ss3Options = removeDuplicates(
      setSite3Options?.map((item) => ({
        code: item.code,
        description: item.description,
      }))
    );

    const getUpperLowerRiverMile = (bend, segment) =>
      bendRiverMile?.filter((item) => item.bend === bend && item.segment === segment)?.[0];

    const getSeasonGearOfficeOptions = (season, fieldOffice, project) => {
      const options = filteredGearCodes.filter(
        (item) => item.fieldOfficeCode === fieldOffice && item.seasonCode === season && item.projectCode === project
      );
      return options.map((item) => ({
        code: item.gearCode,
        description: item.gear,
      }));
    };

    const getMacroMesoOptions = (macro) => {
      const options = macroMesos.filter((item) => item.macroHabitatCode === macro);
      return options.map((item) => ({ code: item.mesoHabitatCode }));
    };

    const getStructureFlowOptions = (microStructure) => {
      // When 0 is entered, the tables are no longer used to limit options
      if (microStructure == null || microStructure == '') return [];
      if (Number(microStructure) === 0) {
        return structureFlows;
      } else {
        const options = microHabitats.filter((item) => Number(item.microStructureCode) === Number(microStructure));
        const filteredOptions = options.map((item) => ({
          code: item.structureFlowCode,
          description: item.structureFlow,
        }));
        return [{ code: 0, description: 'NOT DESCRIBED' }, ...removeDuplicates(filteredOptions)];
      }
    };

    const getStructureModOptions = (structureFlow) => {
      // When 0 is entered, the tables are no longer used to limit options
      if (structureFlow == null || structureFlow == '') return [];
      if (Number(structureFlow) === 0) {
        return structureMods;
      } else {
        const options = microHabitats.filter((item) => Number(item.structureFlowCode) === Number(structureFlow));
        const filteredOptions = options.map((item) => ({
          code: item.structureModCode,
          description: item.structureMod,
        }));
        return [{ code: 0, description: 'NOT DESCRIBED' }, ...removeDuplicates(filteredOptions)];
      }
    };

    const getSs1Options = (microStructure) => {
      // When 0 is entered, the tables are no longer used to limit options
      if (microStructure == null || microStructure == '') return [];
      if (Number(microStructure) === 0) {
        return setSite1Options;
      } else {
        const options = microSetSite.filter((item) => Number(item.microStructureCode) === Number(microStructure));
        const filteredOptions = options.map((item) => ({
          code: item.ss1Code,
          description: item.ss1Description,
        }));
        return [{ code: 0, description: 'NOT DESCRIBED' }, ...removeDuplicates(filteredOptions)];
      }
    };

    const getSs2Options = (setSite1) => {
      // When 0 is entered, the tables are no longer used to limit options
      if (setSite1 == null || setSite1 == '') return [];
      if (Number(setSite1) === 0) {
        return setSite2Options;
      } else {
        const options = microSetSite.filter((item) => Number(item.ss1Code) === Number(setSite1));
        const filteredOptions = options.map((item) => ({
          code: item.ss2Code,
          description: item.ss2Description,
        }));
        return [{ code: 0, description: 'NOT DESCRIBED' }, ...removeDuplicates(filteredOptions)];
      }
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
      defaultValues: getMissouriRiverDefaultValues({ baseData, dataEntryData }),
      resolver: yupResolver(getMissouriRiverSchema({ riverMile: getUpperLowerRiverMile(bend, segmentId) })),
      mode: 'all',
      stateOptions: [],
    });
    const {
      formState: { errors, isValid, touchedFields, submitCount, isDirty },
      setFocus,
      watch,
      getValues,
      trigger,
      setValue,
      handleSubmit,
    } = methods;

    const isTouched = Object.keys(touchedFields).length > 0;
    const isShowErrorSummary = !isValid && (isTouched || isDirty || submitCount > 0) && !isEmpty(errors);

    const deploymentType = watch('deploymentType');
    const macro = watch('macro');
    const meso = watch('meso');
    const gearCode = watch('gear');
    const gearType = watch('gearType');
    const subsamplepass = watch('subsamplepass');
    const microStructure = watch('microStructure');
    const netrivermile = watch('netrivermile');
    const structureFlow = watch('structureFlow');
    const structureMod = watch('structureMod');
    const setSite1 = watch('setSite1');
    const setSite2 = watch('setSite2');
    const setSite3 = watch('setSite3');
    const stopTime = watch('stopTime');
    const temp = watch('temp');
    const depth1 = watch('depth1');
    const depth2 = watch('depth2');
    const depth3 = watch('depth3');
    const velocitybot1 = watch('velocitybot1');
    const velocity081 = watch('velocity081');
    const u2 = watch('u2');
    const u7 = watch('u7');

    const isStartTimeDisabled =
      gearCode.startsWith('LDN') &&
      (velocitybot1 === null || velocitybot1 === '' || velocity081 === null || velocity081 === '');

    const getTempWarning = () => {
      if (temp > 30) {
        return 'Temp is greater than 30';
      } else if (temp >= 12.8 && gearCode.startsWith('GN')) {
        return 'Temp >= 12.8 for a gill net gear code';
      } else {
        return;
      }
    };

    const getDepthWarning = (depth) => {
      if (depth > 10) {
        return 'Depth is greater than 10';
      }
      return;
    };

    const handleChange = (e) => {
      const name = e?.target?.name;
      trigger(name);

      if (name === 'distance') {
        trigger('u2');
      }
    };

    const handleSave = () => {
      if (isValid) {
        const values = getValues();
        // Format any values need for final payload
        const dataObj = {
          ...values,
          bendrivermile: parseFloat(values?.bendrivermile),
          depth1: parseFloat(values?.depth1),
          depth2: parseFloat(values?.depth2),
          depth3: parseFloat(values?.depth3),
          startLatitude: formatCoordFlt(values.startLatitude) ?? '',
          startLongitude: formatCoordFlt(values.startLongitude) ?? '',
          stopLatitude: formatCoordFlt(values.stopLatitude) ?? '',
          stopLongitude: formatCoordFlt(values.stopLongitude) ?? '',
          temp: parseFloat(values?.temp),
          velocitybot1: parseFloat(values?.velocitybot1),
          velocity081: parseFloat(values?.velocity081),
          velocity02or061: parseFloat(values?.velocity02or061),
          velocitybot2: parseFloat(values?.velocitybot2),
          velocity082: parseFloat(values?.velocity082),
          velocity02or062: parseFloat(values?.velocity02or062),
        };
        // Filter out any null/empty values for final payload
        const payload = filterNullEmptyObjects(dataObj);
        dataEntryData?.mrId ? doUpdateMoRiverDataEntry(payload) : doAddMoRiverDataEntry(payload);
      } else {
        trigger();
      }
    };

    // Set R/N value
    useEffect(() => {
      setValue('subsamplen', subsamplepass > 1 || u7 === 'BS' ? 'N' : 'R');
    }, [subsamplepass]);

    // Set Gear Code options and reset Gear Code value when necessary
    useEffect(() => {
      setValue('gear', '');
      setGearCodeOptions(gearType === 'S' ? getSeasonGearOfficeOptions(season, fieldoffice, projectId) : gearCodes);
    }, [gearType]);

    // Set Meso options and reset Meso value when necessary
    useEffect(() => {
      setValue('meso', '');
      handleMesoOptions(mesos, gearType, gearCode, macro, season);
    }, [mesos, gearType, gearCode, macro, season]);

    // Populate Micro using the following six fields; Micro Structure, Structure flow, structure mod, set site 1, set site 2, set site 3
    useEffect(() => {
      if (microStructure || structureFlow || structureMod || setSite1 || setSite2 || setSite3) {
        const str =
          String(microStructure || 0) +
          String(structureFlow || 0) +
          String(structureMod || 0) +
          String(setSite1 || 0) +
          String(setSite2 || 0) +
          String(setSite3 || 0);
        setValue('micro', str, { shouldValidate: true });
      }
    }, [microStructure, structureFlow, structureMod, setSite1, setSite2, setSite3]);

    // Set Structure Flow and SetSite1 options and reset values when necessary
    useEffect(() => {
      setValue('setSite1', '', { shouldValidate: true });
      setValue('structureFlow', '', { shouldValidate: true });
      setSs1Options(getSs1Options(microStructure));
      setStructureFlowOptions(getStructureFlowOptions(microStructure));
    }, [microStructure]);

    // Set Structure Mod options and reset Structure Mod value when necessary
    useEffect(() => {
      setValue('structureMod', '', { shouldValidate: true });
      setStructureModOptions(getStructureModOptions(structureFlow));
    }, [structureFlow]);

    // Set SetSite1 options and reset SetSite1 value when necessary
    useEffect(() => {
      setValue('setSite2', '', { shouldValidate: true });
      setSs2Options(getSs2Options(setSite1));
    }, [setSite1]);

    // Both Velocity (bot) 1 and Velocity (0.8 or 0.5) 1 must be filled out before setting the start time when using a Larval Drift Net gear.
    useEffect(() => {
      if (gearCode.startsWith('LDN') && velocitybot1 === null && velocity081 === null) {
        // Reset start time under these conditions
        setValue('startTime', '', { shouldValidate: true });
      }
    }, [gearCode, velocitybot1, velocity081]);

    useEffect(() => {
      if (gearCode) {
        setValue('deploymentType', gearCodes.filter((gear) => gear.code === gearCode)?.[0]?.deploymentType);
        if (gearCode === 'TLC1') {
          setValue('distance', 20, { shouldValidate: true });
        }
        if (gearCode === 'TLC2') {
          setValue('distance', 40, { shouldValidate: true });
        }
      }
    }, [gearCode]);

    // Populate Gear Code Dropdown Value from Existing API Data
    useEffect(() => {
      if (gearCodeOptions.length > 0) {
        if (dataEntryData?.gear) {
          setValue('gear', dataEntryData?.gear);
        }
      }
    }, [dataEntryData, gearCodeOptions]);

    // Populate Meso Dropdown Value from Existing API Data
    useEffect(() => {
      if (mesoOptions.length > 0) {
        if (dataEntryData?.meso) {
          setValue('meso', dataEntryData?.meso);
        }
      }
    }, [dataEntryData, mesoOptions]);

    // Populate Structure Flow Dropdown Value from Existing API Data
    useEffect(() => {
      if (structureFlowOptions.length > 0) {
        if (dataEntryData?.structureFlow) {
          setValue('structureFlow', dataEntryData?.structureFlow);
          trigger('structureFlow');
        }
      }
    }, [dataEntryData, structureFlowOptions]);

    // Populate Structure Mod Dropdown Value from Existing API Data
    useEffect(() => {
      if (structureModOptions.length > 0) {
        if (dataEntryData?.structureMod) {
          setValue('structureMod', dataEntryData?.structureMod);
          trigger('structureMod');
        }
      }
    }, [dataEntryData, structureModOptions]);

    // Populate Set Site 1 Dropdown Value from Existing API Data
    useEffect(() => {
      if (ss1Options.length > 0) {
        if (dataEntryData?.setSite1) {
          setValue('setSite1', dataEntryData?.setSite1);
          trigger('setSite1');
        }
      }
    }, [dataEntryData, ss1Options]);

    // Populate Set Site 2 Dropdown Value from Existing API Data
    useEffect(() => {
      if (ss2Options.length > 0) {
        if (dataEntryData?.setSite2) {
          setValue('setSite2', dataEntryData?.setSite2);
          trigger('setSite2');
        }
      }
    }, [dataEntryData, ss2Options]);

    useEffect(() => {
      trigger('distance');
    }, [u2]);

    useEffect(() => {
      trigger('depth1');
      trigger('depth2');
      trigger('depth3');
    }, [meso]);

    // netrivermile in baseData
    useEffect(() => {
      doUpdateBaseData('netrivermile', netrivermile);
    }, [netrivermile]);

    useEffect(() => {
      setFocus(errors?.[Object.keys(errors)[0]]?.['ref']?.['id']);
    }, [errors, setFocus]);

    return (
      <FormProvider {...methods}>
        {isShowErrorSummary && <ErrorSummary errors={errors} type='form' isValid={isValid} />}
        <div className='container-fluid margin-top-1'>
          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 2 }}>
              <TextInput name='mrFid' label='MR Field ID (Date-Time-MR#)' readOnly />
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <TextInput name='seFid' label='SE Field ID (Date-Time-SE#)' readOnly />
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <Button className={saveBtnClasses} onClick={handleSubmit(handleSave)} type='button'>
                Save
              </Button>
            </Grid>
          </Grid>

          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 2 }}>
              <TextInput name='setdate' label='Set Date' type='date' onChange={handleChange} required />
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <TextInput name='subsample' label='Subsample' type='number' onChange={handleChange} required />
              {/* @TODO: "Next Subsample" button counts up by 1 */}
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <TextInput name='subsamplepass' label='Pass' type='number' onChange={handleChange} required />
              {/* @TODO: "Next Pass" button counts up by 1 */}
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <SelectInput name='subsamplen' label='Subsample R/N' onChange={handleChange} required>
                {createDropdownOptions(bendSelections).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </SelectInput>
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <SelectInput name='subsampleType' label='Subsample Type' onChange={handleChange} required>
                {createDropdownOptions(subsampleTypes).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </SelectInput>
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <SelectInput name='gearType' label='Gear Type' onChange={handleChange} required>
                {createDropdownOptions(gearTypes).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </SelectInput>
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <SelectInput name='gear' label='Gear Code' onChange={handleChange} required>
                {createDropdownOptions(gearCodeOptions).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.value}
                  </option>
                ))}
              </SelectInput>
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <TextInput name='recorder' label='Recorder' maxLength={3} onChange={handleChange} required />
            </Grid>
          </Grid>

          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 4 }} className='border-right'>
              <Grid row gap='md'>
                <Grid tablet={{ col: 6 }}>
                  <SelectInput name='macro' label='Macro' onChange={handleChange} required>
                    {createDropdownOptions(macros).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.value}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 6 }}>
                  <SelectInput name='meso' label='Meso' onChange={handleChange} required>
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
                    onChange={handleChange}
                    required
                    warning={getTempWarning()}
                  />
                </Grid>
                <Grid tablet={{ col: 6 }}>
                  <TextInput
                    name='width'
                    label='Width'
                    type='number'
                    onChange={handleChange}
                    readOnly={gearType === 'S'}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid tablet={{ col: 8 }}>
              <Grid row gap='md'>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='micro'
                    label='Micro'
                    onChange={handleChange}
                    required={Number(projectId) === 1 && microSegmentRequired.includes(segmentId)}
                    type='number'
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='microStructure' label='Micro Structure' onChange={handleChange}>
                    {createDropdownOptions(microStructures).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput
                    name='structureFlow'
                    label='Structure Flow'
                    onChange={handleChange}
                    required={microStructure}
                  >
                    {createDropdownOptions(structureFlowOptions).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput
                    name='structureMod'
                    label='Structure Mod'
                    onChange={handleChange}
                    required={structureFlow}
                  >
                    {createDropdownOptions(structureModOptions).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 3 }} offset={3}>
                  <SelectInput name='setSite1' label='Set Site 1' onChange={handleChange} required={structureMod}>
                    {createDropdownOptions(ss1Options).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='setSite2' label='Set Site 2' onChange={handleChange} required={setSite1}>
                    {createDropdownOptions(ss2Options).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='setSite3' label='Set Site 3' onChange={handleChange} required={setSite2}>
                    {createDropdownOptions(ss3Options).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 5 }} className='border-right'>
              <Grid row gap='md'>
                <Grid tablet={{ col: 4 }}>
                  <TextInput
                    name='startTime'
                    label='Start Time'
                    onChange={handleChange}
                    required={!isStartTimeDisabled}
                    readOnly={isStartTimeDisabled}
                  />
                </Grid>
                <Grid tablet={{ col: 4 }}>
                  <TextInput
                    name='startLatitude'
                    label='Start Latitude'
                    type='number'
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid tablet={{ col: 4 }}>
                  <TextInput
                    name='startLongitude'
                    label='Start Longitude'
                    type='number'
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='distance'
                    label='Distance'
                    type='number'
                    onChange={handleChange}
                    required={gearReqFields.distance.includes(gearCode)}
                    readOnly={gearType === 'S' && !gearReqFields.distance.includes(gearCode)}
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='depth1'
                    label='1-Depth'
                    onChange={handleChange}
                    required={gearReqFields.depth1.includes(gearCode)}
                    readOnly={gearType === 'S' && !gearReqFields.depth1.includes(gearCode)}
                    type='number'
                    warning={getDepthWarning(depth1)}
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='depth2'
                    label='2-Depth'
                    onChange={handleChange}
                    required={gearReqFields.depth2.includes(gearCode)}
                    readOnly={gearType === 'S' && !gearReqFields.depth2.includes(gearCode)}
                    type='number'
                    warning={getDepthWarning(depth2)}
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='depth3'
                    label='3-Depth'
                    onChange={handleChange}
                    required={gearReqFields.depth3.includes(gearCode)}
                    readOnly={gearType === 'S' && !gearReqFields.depth3.includes(gearCode)}
                    type='number'
                    warning={getDepthWarning(depth3)}
                  />
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 4 }}>
                  <TextInput
                    name='stopTime'
                    label='Stop Time'
                    onChange={handleChange}
                    warning={
                      deploymentType === 'p' && (stopTime === null || stopTime === '')
                        ? 'Deployment type = p but the stop time is not filled in'
                        : null
                    }
                  />
                </Grid>
                <Grid tablet={{ col: 4 }}>
                  <TextInput
                    name='stopLatitude'
                    label='Stop Latitude'
                    onChange={handleChange}
                    required={deploymentType === 'a' && gearCode.startsWith('LDN')}
                  />
                </Grid>
                <Grid tablet={{ col: 4 }}>
                  <TextInput
                    name='stopLongitude'
                    label='Stop Longitude'
                    onChange={handleChange}
                    required={deploymentType === 'a' && gearCode.startsWith('LDN')}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid tablet={{ col: 7 }}>
              <Grid row gap='md'>
                <Grid tablet={{ col: 1 }}>
                  <TextInput name='u1' label='U1' required={Number(projectId) === 3} onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 1 }}>
                  <TextInput
                    name='u2'
                    label='U2'
                    onChange={handleChange}
                    required={Number(projectId) === 1 && gearCode.startsWith('TL')}
                    type={gearCode.startsWith('TL') ? 'number' : 'text'}
                  />
                </Grid>
                <Grid tablet={{ col: 1 }}>
                  <TextInput name='u3' label='U3' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 1 }}>
                  <TextInput name='u4' label='U4' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 2 }}>
                  <TextInput name='u5' label='U5' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='u6' label='U6' onChange={handleChange}>
                    {u6Options.map((item, index) => (
                      <option key={index + 1} value={item.code}>
                        {item.description}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='u7' label='U7' onChange={handleChange}>
                    {createDropdownOptions(u7Options).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='structurenumber'
                    label='Structure Number'
                    onChange={handleChange}
                    required={Number(projectId) === 2 && season === 'HS'}
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='netrivermile' label='Net River Mile' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='conductivity' label='Conductivity' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='dissolvedOxygen' label='Dissolved Oxygen (D.O.)' onChange={handleChange} />
                </Grid>
              </Grid>
              {/* @TODO: Hide USGS, River Stage, Discharge, and Habitat R/N fields in Offline Mode */}
              <Grid row gap='md'>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='usgs' label='USGS' readOnly />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='riverstage' label='River Stage' readOnly />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='discharge' label='Discharge' readOnly />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='habitatrn' label='Habitat R/N' readOnly />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 2 }}>
              <Grid row gap='md'>
                <Grid tablet={{ col: 6 }}>
                  <TextInput name='turbidity' label='Turbidity' type='number' onChange={handleChange} />
                </Grid>
              </Grid>
              {/* @TODO: Hide No Turbidity and No Velocity fields in Offline Mode */}
              <Grid row gap='md' className='margin-top-2'>
                <Grid tablet={{ col: 12 }}>
                  <Checkbox disabled id='no-turbidity' label='No Turbidity' name='noTurbidity' tile value='Y' />
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 12 }}>
                  <Checkbox disabled id='no-velocity' label='No Velocity' name='noVelocity' tile value='Y' />
                </Grid>
              </Grid>
            </Grid>
            <Grid tablet={{ col: 4 }} className='border-right'>
              <Grid row gap='md'>
                <Grid tablet={{ col: 5 }} offset={1}>
                  <TextInput name='cobble' label='Cobble' readOnly />
                </Grid>
                <Grid tablet={{ col: 5 }}>
                  <TextInput name='silt' label='Silt' readOnly />
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 5 }} offset={1}>
                  <TextInput name='organic' label='Organic' readOnly />
                </Grid>
                <Grid tablet={{ col: 5 }}>
                  <TextInput name='sand' label='Sand' readOnly />
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 5 }} offset={6}>
                  <TextInput name='gravel' label='Gravel' readOnly />
                </Grid>
              </Grid>
            </Grid>
            <Grid tablet={{ col: 6 }}>
              <Grid row gap='md'>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='velocitybot1'
                    label='1-Velocity (bot)'
                    onChange={handleChange}
                    required={gearReqFields.velocitybot1.includes(gearCode)}
                    readOnly={gearType === 'S' && !gearReqFields.velocitybot1.includes(gearCode)}
                    type='number'
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='velocity081'
                    label='1-Velocity (0.8 or 0.5)'
                    onChange={handleChange}
                    required={gearReqFields.velocity081.includes(gearCode) || depth2 >= 1.2}
                    readOnly={
                      gearType === 'S' &&
                      !gearReqFields.velocity081.includes(gearCode) &&
                      (depth2 !== null || depth2 !== '' || depth2 < 1.2)
                    }
                    type='number'
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='velocity02or061'
                    label='1-Velocity (0.2 or 0.6)'
                    type='number'
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='velocitybot2'
                    label='2-Velocity (bot)'
                    onChange={handleChange}
                    required={gearReqFields.velocitybot2.includes(gearCode)}
                    readOnly={gearType === 'S' && !gearReqFields.velocitybot2.includes(gearCode)}
                    type='number'
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='velocity082'
                    label='2-Velocity (0.8 or 0.5)'
                    onChange={handleChange}
                    required={gearReqFields.velocity082.includes(gearCode) || depth2 >= 1.2}
                    readOnly={
                      gearType === 'S' &&
                      !gearReqFields.velocity082.includes(gearCode) &&
                      (depth2 !== null || depth2 !== '' || depth2 < 1.2)
                    }
                    type='number'
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='velocity02or062'
                    label='2-Velocity (0.2 or 0.6)'
                    onChange={handleChange}
                    required={gearReqFields.velocity02or062.includes(gearCode)}
                    readOnly={gearType === 'S' && !gearReqFields.velocity02or062.includes(gearCode)}
                    type='number'
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 4 }} offset={6}>
              <Grid row gap='md'>
                <Grid tablet={{ col: 12 }}>
                  <TextArea name='comments' label='Comments' onChange={handleChange} />
                </Grid>
              </Grid>
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <Grid row gap='md'>
                <Grid tablet={{ col: 12 }}>
                  <TextInput name='editInitials' label='Edit Initials' maxLength={3} onChange={handleChange} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </FormProvider>
    );
  }
);

export default MissouriRiverDataEntryForm;
