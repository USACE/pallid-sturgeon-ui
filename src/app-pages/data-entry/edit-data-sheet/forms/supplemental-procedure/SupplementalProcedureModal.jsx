import { connect } from 'redux-bundler-react';
import ModalContent from '@src/app-components/modal/primary-modal/PrimaryModal.content';
import ModalFooter from '@src/app-components/modal/primary-modal/PrimaryModal.footer';
import Card from '@components/card';
import DataHeader from '@pages/data-entry/datasheets/components/dataHeader';

import { Button, Grid, Label, GridContainer, Fieldset } from '@trussworks/react-uswds';

import { useCallback, useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import TextInput from '@components/new-inputs/text-input/TextInput';
import TextArea from '@components/new-inputs/text-area/TextArea';
import SelectInput from '@components/new-inputs/select-input/SelectInput';
import PallidIdOverview from './pallidIdOverview';
import classNames from 'classnames';
import { yupResolver } from '@hookform/resolvers/yup';
import { getSuppDefaultValues, supplementalValidationSchema } from './SupplementalProcedureModal.validation';
import { createDropdownOptions, isEmpty, fmtTimeHHMMSS } from '@pages/data-entry/dataEntryHelper';
import ErrorSummary from '@components/error-summary/ErrorSummary';
import Icon from '@components/icon/icon';
import { mdiMinus, mdiPlus } from '@mdi/js';
import Checkbox from '@src/app-components/check-box/Checkbox';

const SupplementalProcedureModal = connect(
  'selectDataEntryData',
  'selectRouteParams',
  'selectIsEditForm',
  'selectBaseData',
  'selectLookupData',
  'doModalClose',
  ({ dataEntryData, routeParams, isEditForm, baseData, lookupData, doModalClose }) => {
    const siteId = routeParams?.siteId;
    const seId = routeParams?.seId;

    const { fid, bend, fieldoffice, season, projectId, segmentId, species } = baseData;

    const saveBtnClasses = classNames('button-small', 'text-normal', 'save-btn');

    const {
      pitRnzOptions,
      elastomerColorOptions,
      elastomerHvxOptions,
      pallidLocationStatusOptions,
      hatcheryOriginOptions,
      purposeOptions,
      evalLocationOptions,
      sexOptions,
      reproductiveStatusOptions,
      frequencyId,
      spawnBehavior,
      yesNoOptions,
    } = lookupData;

    const procedureDataExists = false; //TODO set based on existing procedure data.
    const [showProcedureSection, setShowProcedureSection] = useState(procedureDataExists);

    const methods = useForm({
      defaultValues: {
        ...getSuppDefaultValues({ dataEntryData, showProcedureSection: showProcedureSection }),
      },
      resolver: yupResolver(
        supplementalValidationSchema({
          projectId: projectId,
          species: species,
          // showProcedureSection: showProcedureSection,
        })
      ),
      // context: { showProcedureSection: showProcedureSection },
      mode: 'onSubmit',
      reValidateMode: 'onChange',
      stateOptions: [],
      // shouldUnregister: true,
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

    console.warn('VALUES: ', getValues());
    //console.log('errors', errors);
    // const toggleProcedureSection = () => setShowProcedureSection(!showProcedureSection);
    const toggleProcedureSection = () => {
      setShowProcedureSection(!showProcedureSection);
      setValue('showProcedureSection', !showProcedureSection, { shouldValidate: true });
      clearErrors();
    };

    const isTouched = Object.keys(touchedFields).length > 0;
    const isShowErrorSummary = !isValid && (isTouched || isDirty || submitCount > 0) && !isEmpty(errors);

    const geneticVialPrefixDefault = projectId === 1 ? 'STURG' : 'BLAHH';

    const fmtGeneticsVial = (val) => {
      setValue('geneticsVial', geneticVialPrefixDefault.length ? geneticVialPrefixDefault : val?.toUpperCase());
    };

    const handleChange = (e) => {
      console.warn('e: ', e);
      const name = e?.target?.name;
      const val = e?.target?.value;

      if (name === 'tagNumber') {
        setValue(name, val?.toUpperCase());
      } else if (name === 'geneticVial' && geneticVialPrefixDefault.length) {
        fmtGeneticsVial(geneticVialPrefixDefault || val?.toUpperCase());
      }

      trigger(name);
    };

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

    const handleGetPallidIdByTagNumber = () => {
      const tagNumber = getValues('tagNumber');
      //TODO load pallid ID data?

      // Format any values need for final payload
      // Filter out any null/empty values for final payload
      // const payload = filterNullEmptyObjects(dataObj);
      // newForm ? doUpdateMoRiverDataEntry(payload) : doAddMoRiverDataEntry(payload);
    };

    // Set Procedure Date to current date.
    const fillCurrentDate = () => {
      const today = new Date().toISOString().slice(0, 10);
      setValue('procedureDate', today, { shouldValidate: true });
    };
    // Set target field to current time.
    const fillCurrentTime = (field) => {
      const time = fmtTimeHHMMSS();
      setValue(field, time, { shouldValidate: true });
    };

    const [isElColorNone, setIsElColorNone] = useState(false);
    const [isErColorNone, setIsErColorNone] = useState(false);

    const elColor = watch('elColor');
    const erColor = watch('erColor');
    const genetics = watch('genetics');
    const geneticVial = watch('geneticVial');
    const geneticVialNum = watch('geneticVialNum');

    // The system shall reset the EL H/V/X field to null if the user selects None as a value for EL Color
    useEffect(() => {
      if (elColor == 'N') {
        setValue('elHvx', '', { shouldValidate: true });
        setIsElColorNone(true);
      } else {
        setIsElColorNone(false);
      }
    }, [elColor]);

    // The system shall reset the ER H/V/X field to null if the user selects None as a value for ER Color
    useEffect(() => {
      if (erColor == 'N') {
        setValue('elHvx', '', { shouldValidate: true });
        setIsErColorNone(true);
      } else {
        setIsErColorNone(false);
      }
    }, [erColor]);

    // The Genetic Y/N field shall be required where species = USG and project = 2
    const isGeneticsRequired = Number(projectId) === 2 && species == 'USG';
    const [isGeneticsVialRequired, setIsGeneticsVialRequired] = useState(
      ['PDSG', 'USG'].includes(species) && genetics == 'Y'
    );

    // The system shall ensure the user cannot edit the Genetics Vial # unless Genetic Y/N = Y
    const [isGeneticsVialReadOnly, setIsGeneticsVialReadOnly] = useState(true);
    useEffect(() => {
      if (genetics == 'Y') {
        setIsGeneticsVialReadOnly(geneticVialPrefixDefault.length === 0);
        ['PDSG', 'USG'].includes(species) && setIsGeneticsVialRequired(true);
      } else {
        if (geneticVial || geneticVialNum) {
          //TODO use a different confirm method?
          const confirmed = confirm('This will clear the Genetics Vial textbox. Do you want to make this change?');
          if (confirmed) {
            setValue('geneticVial', geneticVialPrefixDefault);
            setValue('geneticVialNum', null);
            setIsGeneticsVialReadOnly(true);
            ['PDSG', 'USG'].includes(species) && setIsGeneticsVialRequired(false);
          } else {
            setValue('genetics', 'Y');
          }
        } else {
          setIsGeneticsVialReadOnly(true);
        }
      }
    }, [genetics]);

    // The Pallid Fate field shall be required where project is not equal to 2
    const isPallidFateRequired = Number(projectId) !== 2;

    // The Hatchery Origin field shall be required where project is not equal to 2
    const isHatcheryOriginRequired = Number(projectId) !== 2;

    const handleSave = () => {
      if (isValid) {
        const values = getValues();
        // Format any values need for final payload
        const suppDataObj = {
          // Checkbox fields
          broodstock: values?.broodstock === true ? 1 : 0,
          hatchWild: values?.hatchWild === true ? 1 : 0,
          speciesId: values?.speciesId === true ? 1 : 0,
          archive: values?.archive === true ? 1 : 0,
          project37: values?.project37 === true ? 1 : 0,
        };
        const procDataObj = {};
        // Filter out any null/empty values for final payload
        // const payload = filterNullEmptyObjects(suppProcDataObj);
        // newForm ? doUpdateSuppProcDataEntry(payload) : doAddSuppProcDataEntry(payload);
        if (showProcedureSection) {
          console.warn('Submitted SUPP & PROC data: ', { ...values, ...suppDataObj, ...procDataObj });
        } else {
          console.warn('Submitted SUPP data: ', { ...values, ...suppDataObj, ...procDataObj });
        }
      } else {
        trigger();
      }
    };

    const allowedScuteValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const scuteOptions = allowedScuteValues.map((val) => ({
      code: val,
      description: val,
    }));

    return (
      <ModalContent size='lg' title='Supplemental & Procedure Data Entry'>
        {isShowErrorSummary && (
          <ErrorSummary
            errors={errors}
            // modalID='suppProcFormModal'
            type='modal'
            isValid={isValid}
            isExpandedInitially={false}
          />
        )}
        {/* may need to add to DataHeader */}
        <section className='modal-body' id='suppProcFormModal'>
          <Card>
            <Card.Body>
              <Grid row>
                <Grid tablet={{ col: 6 }}>
                  <p className='margin-bottom-0'>
                    <span className='text-bold'>MR FID:</span> -TODO-
                  </p>
                </Grid>
                <Grid tablet={{ col: 6 }}>
                  <p className='margin-bottom-0'>
                    <span className='text-bold'>F FID:</span> -TODO-
                  </p>
                </Grid>
              </Grid>
              <hr></hr>
              <DataHeader />
            </Card.Body>
          </Card>
        </section>

        {/* <SupplementalDataEntryForm /> */}
        <FormProvider {...methods}>
          <GridContainer>
            <Grid row gap='md' className='padding-bottom-1'>
              <Grid tablet>
                <h3>
                  {isEditForm ? '' : 'Create'} Supplemental Data Entry {isEditForm ? `Overview (ID: ${fid})` : ''}
                </h3>
              </Grid>
            </Grid>
            <Grid row gap='md' className='padding-bottom-3'>
              <Grid tablet={{ col: 4 }}>
                <SelectInput name='pitRnz' label='PIT R/N/Z' onChange={handleChange}>
                  {createDropdownOptions(pitRnzOptions).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
              <Grid tablet={{ col: 3 }}>
                <TextInput name='tagNumber' label='Tag Number' onChange={handleChange} />
              </Grid>
              <Grid tablet={{ col: 2 }}>
                <Button className={saveBtnClasses} onClick={handleGetPallidIdByTagNumber} type='button'>
                  Pallid ID
                </Button>
              </Grid>
            </Grid>
          </GridContainer>

          {/* Pallid ID Data - Readonly */}
          <PallidIdOverview />

          {/* Form continues */}
          <GridContainer>
            <Grid row gap='md' className='padding-bottom-3'>
              <Grid tablet={{ col: 3 }}>
                <SelectInput name='elColor' label='EL Color' onChange={handleChange} required>
                  {createDropdownOptions(elastomerColorOptions).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
              <Grid tablet={{ col: 4 }}>
                <SelectInput name='elHvx' label='EL H/V/X' onChange={handleChange} readOnly={isElColorNone}>
                  {createDropdownOptions(elastomerHvxOptions).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
            </Grid>
            <Grid row gap='md' className='padding-bottom-3'>
              <Grid tablet={{ col: 3 }}>
                <SelectInput name='erColor' label='ER Color' onChange={handleChange} required>
                  {createDropdownOptions(elastomerColorOptions).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
              <Grid tablet={{ col: 4 }}>
                <SelectInput name='erHvx' label='ER H/V/X' onChange={handleChange} readOnly={isErColorNone}>
                  {createDropdownOptions(elastomerHvxOptions).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
            </Grid>
            <Grid row gap='md' className='padding-bottom-3'>
              <Grid tablet={{ col: 3 }}>
                <SelectInput name='lScute' label='L Scute' onChange={handleChange}>
                  {createDropdownOptions(scuteOptions).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
              <Grid tablet={{ col: 3 }}>
                <SelectInput name='rScute' label='R Scute' onChange={handleChange}>
                  {createDropdownOptions(scuteOptions).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
              <Grid tablet={{ col: 3 }}>
                <SelectInput name='dScute' label='D Scute' onChange={handleChange}>
                  {createDropdownOptions(scuteOptions).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
            </Grid>
            <Grid row gap='md' className='padding-bottom-3'>
              <Grid tablet={{ col: 3 }}>
                <SelectInput name='cwt' label='CWT' onChange={handleChange} required>
                  {createDropdownOptions(yesNoOptions).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
              <Grid tablet={{ col: 3 }}>
                <SelectInput name='dangler' label='Dangler' onChange={handleChange} required>
                  {createDropdownOptions(yesNoOptions).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
              <Grid tablet={{ col: 3 }}>
                <SelectInput
                  name='pallidFate'
                  label='Pallid Fate'
                  onChange={handleChange}
                  required={isPallidFateRequired}
                >
                  {createDropdownOptions(pallidLocationStatusOptions).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
              <Grid tablet={{ col: 3 }}>
                <SelectInput
                  name='hatcheryOrigin'
                  label='Hatchery Origin'
                  onChange={handleChange}
                  required={isHatcheryOriginRequired}
                >
                  {createDropdownOptions(hatcheryOriginOptions).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
            </Grid>
            <Grid row gap='md' className='padding-bottom-3'>
              <Grid tablet={{ col: 3 }}>
                <SelectInput name='genetics' label='Genetics Y/N' onChange={handleChange} required={isGeneticsRequired}>
                  {createDropdownOptions(yesNoOptions).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
              <Grid tablet={{ col: 2 }}>
                <TextInput
                  name='geneticVial'
                  label='Genetics Vial #'
                  type='text'
                  readOnly={isGeneticsVialReadOnly}
                  required={isGeneticsVialRequired}
                />
              </Grid>
              <Grid tablet={{ col: 2 }}>
                <TextInput
                  name='geneticVialNum'
                  label='-'
                  type='number'
                  readOnly={isGeneticsVialReadOnly}
                  required={isGeneticsVialRequired}
                />
              </Grid>
            </Grid>
            <Grid row gap='md' className='padding-bottom-3'>
              <Grid tablet={{ col: 4 }}>
                <Label>Genetic Analysis Needs</Label>
                <Checkbox id='check-broodstock' name='broodstock' label='Broodstock' onChange={handleChange} />
                <Checkbox id='check-hatch-wild' name='hatchWild' label='Hatch vs Wild' onChange={handleChange} />
                <Checkbox id='check-species-id' name='speciesId' label='Species ID' onChange={handleChange} />
                <Checkbox id='check-archive' name='archive' label='Archive' onChange={handleChange} />
                <Checkbox id='check-project-37' name='project37' label='Project 3.7' onChange={handleChange} />
              </Grid>
              <Grid tablet={{ col: 8 }}>
                <TextArea name='otherTagInfo' label='Other Tag Info' placeholder='Value'></TextArea>
                <TextArea name='suppComments' label='Comments' placeholder='Value'></TextArea>
              </Grid>
            </Grid>
          </GridContainer>
          <GridContainer>
            <Grid row gap='md' className='padding-bottom-1'>
              <Grid tablet>
                <h3>Procedure Data</h3>
              </Grid>
              <Grid tablet={{ col: 3 }}>
                <Button
                  onClick={() => toggleProcedureSection()}
                  type='button'
                  accentStyle={showProcedureSection ? 'warm' : ''}
                >
                  <Icon
                    focusable={false}
                    className='margin-right-1'
                    path={showProcedureSection ? mdiMinus : mdiPlus}
                    size={'16px'}
                  />
                  {showProcedureSection ? 'Remove' : 'Add'} Procedure Data
                </Button>
              </Grid>
            </Grid>
          </GridContainer>
          {showProcedureSection && (
            <GridContainer>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='procedureDate' label='Procedure Date' type='date' onChange={handleChange} required />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='startTime' label='Start Time' onChange={handleChange} required />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='endTime' label='End Time' onChange={handleChange} required />
                </Grid>
              </Grid>
              <Grid row gap='md' className='padding-top-0'>
                <Grid tablet={{ col: 3 }}>
                  <Button onClick={() => fillCurrentDate()} type='button'>
                    Set to Current Date
                  </Button>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <Button onClick={() => fillCurrentTime('startTime')} type='button'>
                    Set Start Time to Current Time
                  </Button>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <Button onClick={() => fillCurrentTime('endTime')} type='button'>
                    Set End Time to Current Time
                  </Button>
                </Grid>
              </Grid>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 6 }}>
                  <SelectInput name='purpose' label='Purpose' onChange={handleChange} required>
                    {createDropdownOptions(purposeOptions).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 2 }}>
                  <TextInput name='procedureBy' label='Procedure By' onChange={handleChange} required />
                </Grid>
              </Grid>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 6 }}>
                  <TextArea name='fishHealthComments' label='Fish Health Comments' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 4 }}>
                  <Checkbox
                    id='antibiotic-injections'
                    label='Antibiotic Injections'
                    name='antibioticCheckbox'
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 4 }}>
                  <Fieldset>
                    <Label htmlFor='procPhotosCheckboxGroup'>Photographs</Label>
                    <Checkbox name='photo-ventral' label='Head (Ventral)' onChange={handleChange} />
                    <Checkbox name='photo-dorsal' label='Head (Dorsal)' onChange={handleChange} />
                    <Checkbox name='photo-left-side' label='Head (Left Side)' onChange={handleChange} />
                  </Fieldset>
                </Grid>
              </Grid>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='oldFrequencyId' label='Old Frequency ID' onChange={handleChange}>
                    {createDropdownOptions(frequencyId).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='newFrequencyId' label='New/Current Frequency ID' onChange={handleChange}>
                    {createDropdownOptions(frequencyId).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
              </Grid>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='oldRadioTag' label='Old Radio Tag #' type='text' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='oldRtSerial' label='Old RT Serial #' type='text' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='newRadioTag' label='New/Current Radio Tag #' type='text' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='newRtSerial' label='New/Current RT Serial #' type='text' onChange={handleChange} />
                </Grid>
              </Grid>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 2 }}>
                  <TextInput name='oldDstSerial' label='Old DST Serial #' type='text' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 2 }}>
                  <TextInput name='dstSerial' label='New/Current DST Serial #' type='text' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='dstStartDate' label='DST Start Date' type='date' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 2 }}>
                  <TextInput name='dstStartTime' label='DST Start Time' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <Fieldset>
                    {/* <Label htmlFor='drCheckboxGroup'>???</Label> */}
                    <Checkbox name='dst-reimplanted' label='DST Reimplanted' onChange={handleChange} />
                  </Fieldset>
                </Grid>
              </Grid>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='sex' label='Sex' onChange={handleChange}>
                    {createDropdownOptions(sexOptions).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <Fieldset>
                    <Checkbox name='pi' label='PI' onChange={handleChange} />
                  </Fieldset>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <Fieldset>
                    <Checkbox name='blood-sample' label='Blood Sample' onChange={handleChange} />
                  </Fieldset>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <Fieldset>
                    <Checkbox name='egg-sample' label='Egg Sample' onChange={handleChange} />
                  </Fieldset>
                </Grid>
              </Grid>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 8 }}>
                  <TextArea name='procComments' label='Comments' placeholder='Value'></TextArea>
                </Grid>
              </Grid>
              <h3>Spawned Evaluation</h3>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 4 }}>
                  <SelectInput
                    name='spawnEval'
                    label='Spawn Evaluation'
                    onChange={handleChange}
                    readOnly={isElColorNone}
                  >
                    {createDropdownOptions(spawnBehavior).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 4 }}>
                  <SelectInput name='evalForLocation' label='Evaluation for Location' onChange={handleChange}>
                    {createDropdownOptions(evalLocationOptions).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
              </Grid>
              <h3>Reproductive Status</h3>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 6 }}>
                  <SelectInput name='visualAssessment' label='Visual Assessment' onChange={handleChange}>
                    {createDropdownOptions(reproductiveStatusOptions).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
              </Grid>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 6 }}>
                  <SelectInput name='ultrasoundAssessment' label='Ultrasound Assessment' onChange={handleChange}>
                    {createDropdownOptions(reproductiveStatusOptions).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
              </Grid>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='expectedSpawnYear' label='Expected Spawn Year' />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='ultrasoundGonadLength' label='Ultrasound Gonad Length' />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='gonadCondition' label='Gonad Condition' />
                </Grid>
              </Grid>
            </GridContainer>
          )}
        </FormProvider>

        <ModalFooter showCancelButton onSave={() => handleSave()} customClosingLogic />
      </ModalContent>
    );
  }
);

export default SupplementalProcedureModal;
