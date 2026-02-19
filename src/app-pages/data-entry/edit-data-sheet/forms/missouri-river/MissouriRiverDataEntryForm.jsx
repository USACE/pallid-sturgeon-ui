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
import { missouriRiverTooltip, siltSandGravelReadOnly, u6Options } from './MissouriRiverDataEntryForm.helper';
import { filterNullEmptyObjects, formatCoordFlt } from '@src/utils/helpers';

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

const removeDuplicates = (arr) => {
  const serializedArray = arr.map(JSON.stringify);
  const uniqueSet = new Set(serializedArray);
  const uniqueArray = Array.from(uniqueSet).map(JSON.parse);
  return uniqueArray;
};

const MissouriRiverDataEntryForm = connect(
  'doAddMoRiverDataEntry',
  'doUpdateMoRiverDataEntry',
  'selectBaseData',
  'selectDataEntryData',
  'selectLookupData',
  ({ doAddMoRiverDataEntry, doUpdateMoRiverDataEntry, baseData, dataEntryData, lookupData }) => {
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
      estimations,
      u7Options,
      microSetSite,
      setSite3Options,
    } = lookupData;
    const { bend, fieldoffice, season, projectId, segmentId } = baseData;
    const [gearCodeOptions, setGearCodeOptions] = useState(gearCodes);
    const [mesoOptions, setMesoOptions] = useState(mesos);
    const [structureFlowOptions, setStructureFlowOptions] = useState([]);
    const [structureModOptions, setStructureModOptions] = useState([]);
    const [ss1Options, setSs1Options] = useState([]);
    const [ss2Options, setSs2Options] = useState([]);

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
      const options = microHabitats.filter((item) => Number(item.microStructureCode) === Number(microStructure));
      const filteredOptions = options.map((item) => ({
        code: item.structureFlowCode,
        description: item.structureFlow,
      }));
      return removeDuplicates(filteredOptions);
    };

    const getStructureModOptions = (structureFlow) => {
      const options = microHabitats.filter((item) => Number(item.structureFlowCode) === Number(structureFlow));
      const filteredOptions = options.map((item) => ({
        code: item.structureModCode,
        description: item.structureMod,
      }));
      return removeDuplicates(filteredOptions);
    };

    const getSs1Options = (microStructure) => {
      const options = microSetSite.filter((item) => Number(item.microStructureCode) === Number(microStructure));
      const filteredOptions = options.map((item) => ({ code: item.ss1Code, description: item.ss1Description }));
      return removeDuplicates(filteredOptions);
    };

    const getSs2Options = (setSite1) => {
      const options = microSetSite.filter((item) => Number(item.ss1Code) === Number(setSite1));
      const filteredOptions = options.map((item) => ({ code: item.ss2Code, description: item.ss2Description }));
      return removeDuplicates(filteredOptions);
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

    const cobble = watch('cobble');
    const deploymentType = watch('deploymentType');
    const macro = watch('macro');
    const gearCode = watch('gear');
    const gearType = watch('gearType');
    const subsamplepass = watch('subsamplepass');
    const microStructure = watch('microStructure');
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
    const u6 = watch('u6');
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

    const handleSave = () => {
      const values = getValues();
      // Format any values need for final payload
      const dataObj = {
        ...values,
        bendrivermile: parseFloat(values?.bendrivermile),
        startLatitude: formatCoordFlt(values.startLatitude) ?? '',
        startLongitude: formatCoordFlt(values.startLongitude) ?? '',
        stopLatitude: formatCoordFlt(values.stopLatitude) ?? '',
        stopLongitude: formatCoordFlt(values.stopLongitude) ?? '',
      };
      // Filter out any null/empty values for final payload
      const payload = filterNullEmptyObjects(dataObj);
      dataEntryData?.mrId ? doUpdateMoRiverDataEntry(payload) : doAddMoRiverDataEntry(payload);
    };

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

    // Both Velocity (bot) 1 and Velocity (o.8 or 0.5) 1 must be filled out before setting the start time when using a Larval Drift Net gear.
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

    useEffect(() => {
      if (Number(cobble) === 3) {
        setValue('silt', 0, { shouldValidate: true });
        setValue('sand', 0, { shouldValidate: true });
        setValue('gravel', 0, { shouldValidate: true });
      }
    }, [cobble]);

    useEffect(() => {
      setFocus(errors?.[Object.keys(errors)[0]]?.['ref']?.['id']);
    }, [errors, setFocus]);

    // useEffect(() => {
    //   // netrivermile in baseData
    //   doUpdateBaseData('netrivermile', state['netrivermile']);
    // }, [state['netrivermile']]);

    return (
      <FormProvider {...methods}>
        {errors && <ErrorSummary errors={errors} />}
        <div className='container-fluid margin-top-1'>
          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 2 }}>
              <TextInput name='setdate' label='Set Date' type='date' required />
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <TextInput name='subsample' label='Subsample' type='number' required />
              {/* @TODO: "Next Subsample" button counts up by 1 */}
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <TextInput name='subsamplepass' label='Pass' type='number' required />
              {/* @TODO: "Next Pass" button counts up by 1 */}
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <SelectInput name='subsamplen' label='Subsample R/N' required>
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
              <TextInput name='recorder' label='Recorder' maxLength={3} required />
            </Grid>
          </Grid>

          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 4 }} className='border-right'>
              <Grid row gap='md'>
                <Grid tablet={{ col: 6 }}>
                  <SelectInput name='macro' label='Macro' required>
                    {createDropdownOptions(macros).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.value}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 6 }}>
                  <SelectInput name='meso' label='Meso' required>
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
                  <TextInput name='temp' label='Temp (c)' type='number' required warning={getTempWarning()} />
                </Grid>
                <Grid tablet={{ col: 6 }}>
                  <TextInput name='width' label='Width' type='number' readOnly />
                </Grid>
              </Grid>
            </Grid>

            <Grid tablet={{ col: 8 }}>
              <Grid row gap='md'>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='micro'
                    label='Micro'
                    required={Number(projectId) === 1 && microSegmentRequired.includes(segmentId)}
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='microStructure' label='Micro Structure'>
                    {createDropdownOptions(microStructures).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='structureFlow' label='Structure Flow' required={microStructure}>
                    {createDropdownOptions(structureFlowOptions).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='structureMod' label='Structure Mod' required={structureFlow}>
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
                  <SelectInput name='setSite1' label='Set Site 1' required={structureMod}>
                    {createDropdownOptions(ss1Options).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='setSite2' label='Set Site 2' required={setSite1}>
                    {createDropdownOptions(ss2Options).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='setSite3' label='Set Site 3' required={setSite2}>
                    {createDropdownOptions(setSite3Options).map((item, index) => (
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
                    required={isStartTimeDisabled}
                    readOnly={isStartTimeDisabled}
                    tooltip={isStartTimeDisabled ? missouriRiverTooltip.startTimeTooltip : null}
                  />
                </Grid>
                <Grid tablet={{ col: 4 }}>
                  <TextInput name='startLatitude' label='Start Latitude' type='number' required />
                </Grid>
                <Grid tablet={{ col: 4 }}>
                  <TextInput name='startLongitude' label='Start Longitude' type='number' required />
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='distance'
                    label='Distance'
                    type='number'
                    required={gearReqFields.distance.includes(gearCode)}
                    readOnly={!gearReqFields.distance.includes(gearCode)}
                    tooltip={!gearReqFields.distance.includes(gearCode) ? missouriRiverTooltip.distanceTooltip : null}
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='depth1'
                    label='1-Depth'
                    required={gearReqFields.depth1.includes(gearCode)}
                    readOnly={!gearReqFields.depth1.includes(gearCode)}
                    type='number'
                    warning={getDepthWarning(depth1)}
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='depth2'
                    label='2-Depth'
                    required={gearReqFields.depth2.includes(gearCode)}
                    readOnly={!gearReqFields.depth2.includes(gearCode)}
                    type='number'
                    warning={getDepthWarning(depth2)}
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='depth3'
                    label='3-Depth'
                    required={gearReqFields.depth3.includes(gearCode)}
                    readOnly={!gearReqFields.depth3.includes(gearCode)}
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
                    required={deploymentType === 'a' && gearCode.startsWith('LDN')}
                  />
                </Grid>
                <Grid tablet={{ col: 4 }}>
                  <TextInput
                    name='stopLongitude'
                    label='Stop Longitude'
                    required={deploymentType === 'a' && gearCode.startsWith('LDN')}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid tablet={{ col: 7 }}>
              <Grid row gap='md'>
                <Grid tablet={{ col: 1 }}>
                  <TextInput name='u1' label='U1' required={Number(projectId) === 3} />
                </Grid>
                <Grid tablet={{ col: 1 }}>
                  <TextInput
                    name='u2'
                    label='U2'
                    required={Number(projectId) === 1 && gearCode.startsWith('TL')}
                    type={gearCode.startsWith('TL') ? 'number' : 'text'}
                  />
                </Grid>
                <Grid tablet={{ col: 1 }}>
                  <TextInput name='u3' label='U3' />
                </Grid>
                <Grid tablet={{ col: 1 }}>
                  <TextInput name='u4' label='U4' />
                </Grid>
                <Grid tablet={{ col: 2 }}>
                  <TextInput name='u5' label='U5' />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='u6' label='U6'>
                    {u6Options.map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.value}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='u7' label='U7'>
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
                    required={Number(projectId) === 2 && season === 'HS'}
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='netrivermile' label='Net River Mile' />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='conductivity' label='Conductivity' />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='dissolvedOxygen' label='D.O' />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 1 }}>
              <TextInput name='turbidity' label='Turbidity' type='number' />
            </Grid>
            <Grid tablet={{ col: 4 }} className='border-right'>
              <Grid row gap='md'>
                <Grid tablet={{ col: 5 }} offset={2}>
                  <SelectInput name='cobble' label='Cobble'>
                    {createDropdownOptions(estimations).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 5 }}>
                  <TextInput
                    name='silt'
                    label='Silt'
                    type='number'
                    readOnly={siltSandGravelReadOnly.includes(fieldoffice)}
                  />
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 5 }} offset={2}>
                  <SelectInput name='organic' label='Organic'>
                    {createDropdownOptions(estimations).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 5 }}>
                  <TextInput
                    name='sand'
                    label='Sand'
                    type='number'
                    readOnly={siltSandGravelReadOnly.includes(fieldoffice)}
                  />
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 5 }} offset={7}>
                  <TextInput
                    name='gravel'
                    label='Gravel'
                    type='number'
                    readOnly={siltSandGravelReadOnly.includes(fieldoffice)}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid tablet={{ col: 7 }}>
              <Grid row gap='md'>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='velocitybot1'
                    label='1-Velocity (bot)'
                    required={gearReqFields.velocitybot1.includes(gearCode)}
                    readOnly={!gearReqFields.velocitybot1.includes(gearCode)}
                    type='number'
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='velocity081'
                    label='1-Velocity (0.8 or 0.5)'
                    required={gearReqFields.velocity081.includes(gearCode) || depth2 >= 1.2}
                    readOnly={!gearReqFields.velocity081.includes(gearCode) || depth2 < 1.2}
                    type='number'
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='velocity02or061' label='1-Velocity (0.2 or 0.6)' type='number' />
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='velocitybot2'
                    label='2-Velocity (bot)'
                    required={gearReqFields.velocitybot2.includes(gearCode)}
                    readOnly={!gearReqFields.velocitybot2.includes(gearCode)}
                    type='number'
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='velocity082'
                    label='2-Velocity (0.8 or 0.5)'
                    required={gearReqFields.velocity082.includes(gearCode) || depth2 >= 1.2}
                    readOnly={!gearReqFields.velocity082.includes(gearCode) || depth2 < 1.2}
                    type='number'
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='velocity02or062'
                    label='2-Velocity (0.2 or 0.6)'
                    required={gearReqFields.velocity02or062.includes(gearCode)}
                    readOnly={!gearReqFields.velocity02or062.includes(gearCode)}
                    type='number'
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 4 }} offset={5}>
              <Grid row gap='md'>
                <Grid tablet={{ col: 12 }}>
                  <TextArea name='comments' label='Comments' />
                </Grid>
              </Grid>
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <Grid row gap='md'>
                <Grid tablet={{ col: 12 }}>
                  <TextInput name='editInitials' label='Edit Initials' maxLength={3} />
                </Grid>
              </Grid>
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <Grid row gap='md'>
                <Grid tablet={{ col: 12 }}>
                  <Button className={saveBtnClasses} onClick={() => handleSave()} type='button'>
                    Save Data Entry
                  </Button>
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
