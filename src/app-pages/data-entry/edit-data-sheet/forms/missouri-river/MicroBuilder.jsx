import { connect } from 'redux-bundler-react';
import { Grid } from '@trussworks/react-uswds';
import { useFormContext } from 'react-hook-form';

import SelectInput from '@src/app-components/new-inputs/select-input/SelectInput';
import TextInput from '@src/app-components/new-inputs/text-input/TextInput';
import { microSegmentRequired } from './MissouriRiverDataEntryForm.validation';
import { createDropdownOptions, removeDuplicates } from '@src/app-pages/data-entry/dataEntryHelper';
import { useEffect, useState } from 'react';
import { getLookupOptions } from '@src/app-pages/data-entry/offline/lookup-cache';

const EMPTY_DIGITS = ['', '', '', '', '', ''];

const digitFieldMapping = {
  0: 'microStructure',
  1: 'structureFlow',
  2: 'structureMod',
  3: 'setSite1',
  4: 'setSite2',
  5: 'setSite3',
};

const lookupTableNames = [
  'microHabitats',
  'microStructures',
  'microSetSite',
  'setSite1Options',
  'setSite2Options',
  'setSite3Options',
  'structureFlows',
  'structureMods',
];

const digitWarningMsg = 'Entered digit does not exist for this field, please enter a new digit or select from dropdown';

const MicroBuilder = connect(
  'selectBaseData',
  'selectLookupData',
  'selectDataEntryData',
  'selectCurrentTab',
  ({ baseData, lookupData, dataEntryData, currentTab, shouldAutoValidate }) => {
    const isOnline = navigator.onLine;
    const { projectId, segmentId } = baseData;
    // Default lookups to online data, otherwise will be overwritten by offline cached lookup data if network status = offline
    const [lookups, setLookups] = useState(
      lookupTableNames.reduce((accumulator, currentKey) => {
        accumulator[currentKey] = lookupData?.[currentKey] ?? [];
        return accumulator;
      }, {})
    );

    const [microWarning, setMicroWarning] = useState(false);
    const [digitWarnings, setDigitWarnings] = useState(Array(6).fill(null));

    const [structureFlowOptions, setStructureFlowOptions] = useState([]);
    const [structureModOptions, setStructureModOptions] = useState([]);
    const [ss1Options, setSs1Options] = useState([]);
    const [ss2Options, setSs2Options] = useState([]);

    const ss3Options = removeDuplicates(
      lookups?.setSite3Options?.map((item) => ({
        code: item.code,
        description: item.description,
      }))
    );

    const getStructureFlowOptions = (microStructure) => {
      // When 0 is entered, the tables are no longer used to limit options
      if (microStructure == null || microStructure == '') return [];
      if (Number(microStructure) === 0) {
        return lookups?.structureFlows;
      } else {
        const options = lookups?.microHabitats?.filter(
          (item) => Number(item.microStructureCode) === Number(microStructure)
        );
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
        return lookups?.structureMods;
      } else {
        const options = lookups?.microHabitats?.filter(
          (item) => Number(item.structureFlowCode) === Number(structureFlow)
        );
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
        return lookups?.setSite1Options;
      } else {
        const options = lookups?.microSetSite?.filter(
          (item) => Number(item.microStructureCode) === Number(microStructure)
        );
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
        return lookups?.setSite2Options;
      } else {
        const options = lookups?.microSetSite?.filter((item) => Number(item.ss1Code) === Number(setSite1));
        const filteredOptions = options.map((item) => ({
          code: item.ss2Code,
          description: item.ss2Description,
        }));
        return [{ code: 0, description: 'NOT DESCRIBED' }, ...removeDuplicates(filteredOptions)];
      }
    };

    const { watch, setValue, trigger } = useFormContext();
    const micro = watch('micro');
    const microStructure = watch('microStructure');
    const structureFlow = watch('structureFlow');
    const structureMod = watch('structureMod');
    const setSite1 = watch('setSite1');
    const setSite2 = watch('setSite2');
    const setSite3 = watch('setSite3');

    const validateDigit = (val, index) => {
      const digit = index;
      if (val === '') return true;

      // digit 0: Micro Structure
      if (
        digit === 0 &&
        createDropdownOptions(lookups?.microStructures)?.filter((item) => String(item.value) === String(val))
          ?.length === 0
      ) {
        return false;
      }

      // digit 1: Structure Flow
      if (
        digit === 1 &&
        createDropdownOptions(structureFlowOptions)?.filter((item) => String(item.value) === String(val))?.length === 0
      ) {
        return false;
      }

      // digit 2: Structure Mod
      if (
        digit === 2 &&
        createDropdownOptions(structureModOptions)?.filter((item) => String(item.value) === String(val))?.length === 0
      ) {
        return false;
      }

      // digit 3: Set Site 1
      if (
        digit === 3 &&
        createDropdownOptions(ss1Options)?.filter((item) => String(item.value) === String(val))?.length === 0
      ) {
        return false;
      }

      // digit 4: Set Site 2
      if (
        digit === 4 &&
        createDropdownOptions(ss2Options)?.filter((item) => String(item.value) === String(val))?.length === 0
      ) {
        return false;
      }

      // digit 5: Set Site 3
      if (
        digit === 5 &&
        createDropdownOptions(ss3Options)?.filter((item) => String(item.value) === String(val))?.length === 0
      ) {
        return false;
      }

      return true;
    };

    // Validate Micro Code
    const validateMicroCode = (digits) => {
      const allSelected = digits.every((item) => item !== '');

      if (allSelected) {
        // digit 0: Micro Structure
        if (
          createDropdownOptions(lookups?.microStructures)?.filter((item) => String(item.value) === String(digits[0]))
            ?.length === 0
        ) {
          return false;
        }

        // digit 1: Structure Flow
        if (
          createDropdownOptions(structureFlowOptions)?.filter((item) => String(item.value) === String(digits[1]))
            ?.length === 0
        ) {
          return false;
        }

        // digit 2: Structure Mod
        if (
          createDropdownOptions(structureModOptions)?.filter((item) => String(item.value) === String(digits[2]))
            ?.length === 0
        ) {
          return false;
        }

        // digit 3: Set Site 1
        if (
          createDropdownOptions(ss1Options)?.filter((item) => String(item.value) === String(digits[3]))?.length === 0
        ) {
          return false;
        }

        // digit 4: Set Site 2
        if (
          createDropdownOptions(ss2Options)?.filter((item) => String(item.value) === String(digits[4]))?.length === 0
        ) {
          return false;
        }

        // digit 5: Set Site 3
        if (
          createDropdownOptions(ss3Options)?.filter((item) => String(item.value) === String(digits[5]))?.length === 0
        ) {
          return false;
        }
      }
      return true;
    };

    // Micro Code -> Dropdown Digits
    const handleMicroChange = (e) => {
      // Only allow digits and max 6 characters
      const val = e?.target?.value.replace(/\D/g, '').slice(0, 6);
      const newDigits = [...EMPTY_DIGITS];

      // Update newDigits array
      val.split('').forEach((digit, index) => {
        newDigits[index] = digit;
      });
      // Set Micro
      setValue('micro', val);
      // Set dropdowns
      newDigits.forEach((digit, index) => {
        setValue(digitFieldMapping[index], digit);
      });

      // Validate Digits
      const validArr = newDigits.map((item, i) => validateDigit(item, i));
      setDigitWarnings(validArr);

      // Clear remaining dropdowns
      for (let i = newDigits.length; i < 6; i++) {
        setValue(digitFieldMapping[i], '');
      }
      if (newDigits?.length === 6) setMicroWarning(!validateMicroCode(newDigits) ? true : false);
    };

    // Dropdown Digits -> Micro Code
    const handleDropdownChange = (index, value) => {
      const newDigits = [microStructure, structureFlow, structureMod, setSite1, setSite2, setSite3];
      newDigits[index] = value;
      // Only populate code when ALL dropdowns have a value.
      const allSelected = newDigits.every((item) => item !== '');
      // At least one dropdown is empty, so clear micro
      setValue('micro', allSelected ? newDigits.join('') : '');
      if (newDigits?.length === 6) setMicroWarning(!validateMicroCode(newDigits) ? true : false);

      // Reset digit if it was previously invalid
      setDigitWarnings((prev) => prev.map((item, i) => (i === index ? true : item)));
    };

    // Set Structure Flow and SetSite1 options and reset values when necessary
    useEffect(() => {
      setStructureFlowOptions(getStructureFlowOptions(microStructure));
      setSs1Options(getSs1Options(microStructure));
    }, [microStructure]);

    // Set Structure Mod options and reset Structure Mod value when necessary
    useEffect(() => {
      setStructureModOptions(getStructureModOptions(structureFlow));
    }, [structureFlow]);

    // Set SetSite1 options and reset SetSite1 value when necessary
    useEffect(() => {
      setSs2Options(getSs2Options(setSite1));
    }, [setSite1]);

    // Set SetSite1 options and reset SetSite1 value when necessary
    useEffect(() => {
      setSs2Options(getSs2Options(setSite1));
    }, [setSite1]);

    // Populate Structure Flow Dropdown Value from Existing API Data
    useEffect(() => {
      if (structureFlowOptions.length > 0) {
        if (dataEntryData?.structureFlow) {
          setValue('structureFlow', dataEntryData?.structureFlow);
          shouldAutoValidate && trigger('structureFlow');
        }
      }
    }, [dataEntryData, structureFlowOptions, shouldAutoValidate, trigger, currentTab]);

    // Populate Structure Mod Dropdown Value from Existing API Data
    useEffect(() => {
      if (structureModOptions.length > 0) {
        if (dataEntryData?.structureMod) {
          setValue('structureMod', dataEntryData?.structureMod);
          shouldAutoValidate && trigger('structureMod');
        }
      }
    }, [dataEntryData, structureModOptions, shouldAutoValidate, trigger, currentTab]);

    // Populate Set Site 1 Dropdown Value from Existing API Data
    useEffect(() => {
      if (ss1Options.length > 0) {
        if (dataEntryData?.setSite1) {
          setValue('setSite1', dataEntryData?.setSite1);
          shouldAutoValidate && trigger('setSite1');
        }
      }
    }, [dataEntryData, ss1Options, shouldAutoValidate, trigger, currentTab]);

    // Populate Set Site 2 Dropdown Value from Existing API Data
    useEffect(() => {
      if (ss2Options.length > 0) {
        if (dataEntryData?.setSite2) {
          setValue('setSite2', dataEntryData?.setSite2);
          shouldAutoValidate && trigger('setSite2');
        }
      }
    }, [dataEntryData, ss2Options, shouldAutoValidate, trigger, currentTab]);

    // Load offline lookups
    useEffect(() => {
      const loadOfflineLookups = async () => {
        const entries = await Promise.all(lookupTableNames.map(async (name) => [name, await getLookupOptions(name)]));
        setLookups(Object.fromEntries(entries));
      };
      !isOnline && loadOfflineLookups();
    }, [isOnline]);

    return (
      <Grid tablet={{ col: 8 }}>
        <Grid row gap='md'>
          <Grid tablet={{ col: 3 }}>
            <TextInput
              name='micro'
              label='Micro'
              onChange={handleMicroChange}
              required={Number(projectId) === 1 && microSegmentRequired.includes(Number(segmentId))}
              warning={microWarning ? 'Invalid Micro Code' : null}
              maxLength={6}
            />
          </Grid>
          <Grid tablet={{ col: 3 }}>
            <SelectInput
              name='microStructure'
              label='Micro Structure'
              onChange={(e) => handleDropdownChange(0, e?.target?.value)}
              warning={micro && !digitWarnings[0] && digitWarnings[0] !== null ? digitWarningMsg : null}
            >
              {createDropdownOptions(lookups?.microStructures).map((item, index) => (
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
              onChange={(e) => handleDropdownChange(1, e?.target?.value)}
              required={microStructure}
              warning={micro && !digitWarnings[1] && digitWarnings[1] !== null ? digitWarningMsg : null}
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
              onChange={(e) => handleDropdownChange(2, e?.target?.value)}
              required={structureFlow}
              warning={micro && !digitWarnings[2] && digitWarnings[2] !== null ? digitWarningMsg : null}
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
            <SelectInput
              name='setSite1'
              label='Set Site 1'
              onChange={(e) => handleDropdownChange(3, e?.target?.value)}
              required={structureMod}
              warning={micro && !digitWarnings[3] && digitWarnings[3] !== null ? digitWarningMsg : null}
            >
              {createDropdownOptions(ss1Options).map((item, index) => (
                <option key={index + 1} value={item.value}>
                  {item.text}
                </option>
              ))}
            </SelectInput>
          </Grid>
          <Grid tablet={{ col: 3 }}>
            <SelectInput
              name='setSite2'
              label='Set Site 2'
              onChange={(e) => handleDropdownChange(4, e?.target?.value)}
              required={setSite1}
              warning={micro && !digitWarnings[4] && digitWarnings[4] !== null ? digitWarningMsg : null}
            >
              {createDropdownOptions(ss2Options).map((item, index) => (
                <option key={index + 1} value={item.value}>
                  {item.text}
                </option>
              ))}
            </SelectInput>
          </Grid>
          <Grid tablet={{ col: 3 }}>
            <SelectInput
              name='setSite3'
              label='Set Site 3'
              onChange={(e) => handleDropdownChange(5, e?.target?.value)}
              required={setSite2}
              warning={micro && !digitWarnings[5] && digitWarnings[5] !== null ? digitWarningMsg : null}
            >
              {createDropdownOptions(ss3Options).map((item, index) => (
                <option key={index + 1} value={item.value}>
                  {item.text}
                </option>
              ))}
            </SelectInput>
          </Grid>
        </Grid>
      </Grid>
    );
  }
);

export default MicroBuilder;
