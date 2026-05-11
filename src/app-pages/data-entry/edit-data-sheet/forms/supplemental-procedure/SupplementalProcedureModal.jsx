import { connect } from 'redux-bundler-react';
import ModalContent from '@src/app-components/modal/primary-modal/PrimaryModal.content';
import ModalFooter from '@src/app-components/modal/primary-modal/PrimaryModal.footer';
import Card from '@components/card';
import DataHeader from '@pages/data-entry/datasheets/components/dataHeader';

import {
  Alert,
  Button,
  Grid,
  Table,
  Checkbox,
  Label,
  Textarea,
  GridContainer,
  Fieldset,
  // TextInput,
} from '@trussworks/react-uswds';

// import SupplementalDataEntryForm from './SupplementalDataEntryForm';
import { useCallback, useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import TextInput from '@components/new-inputs/text-input/TextInput';
import TextArea from '@components/new-inputs/text-area/TextArea';
import SelectInput from '@components/new-inputs/select-input/SelectInput';
import PallidIdOverview from './pallidIdOverview';
import classNames from 'classnames';
import { yupResolver } from '@hookform/resolvers/yup';
import { getSuppDefaultValues, supplementalValidationSchema } from './SupplementalProcedureModal.validation';
import { createDropdownOptions, isEmpty } from '@pages/data-entry/dataEntryHelper';
import ErrorSummary from '@components/error-summary/ErrorSummary';
import ModalHeader from '@src/app-components/modal/primary-modal/PrimaryModal.header';

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
      yesNoOptions,
    } = lookupData;

    const methods = useForm({
      defaultValues: {
        ...getSuppDefaultValues({ dataEntryData }),
      },
      resolver: yupResolver(supplementalValidationSchema({ projectId: projectId, species: species })),
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

    const isTouched = Object.keys(touchedFields).length > 0;
    const isShowErrorSummary = !isValid && (isTouched || isDirty || submitCount > 0) && !isEmpty(errors);

    const handleChange = (e) => {
      const name = e?.target?.name;
      const val = e?.target?.value;

      if (name === 'tagNumber') {
        setValue(name, val?.toUpperCase());
      }

      trigger(name);
    };

    const handleGetPallidIdByTagNumber = () => {
      const tagNumber = getValues('tagNumber');
      //TODO load pallid ID data?

      // Format any values need for final payload
      // Filter out any null/empty values for final payload
      // const payload = filterNullEmptyObjects(dataObj);
      // newForm ? doUpdateMoRiverDataEntry(payload) : doAddMoRiverDataEntry(payload);
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
        setIsGeneticsVialReadOnly(false);
        ['PDSG', 'USG'].includes(species) && setIsGeneticsVialRequired(true);
      } else {
        if (geneticVial || geneticVialNum) {
          //TODO use a different confirm method?
          const confirmed = confirm('This will clear the Genetics Vial textbox. Do you want to make this change?');
          if (confirmed) {
            setValue('geneticVial', null);
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
        const suppProcDataObj = {
          ...values,
          // bendrivermile: parseFloat(values?.bendrivermile),
          // temp: parseFloat(values?.temp),
          // u2: String(values?.u2),
        };
        // Filter out any null/empty values for final payload
        // const payload = filterNullEmptyObjects(suppProcDataObj);
        // newForm ? doUpdateSuppProcDataEntry(payload) : doAddSuppProcDataEntry(payload);
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
            {/* <Grid row gap='md' className='padding-bottom-1'>
                  <Grid tablet>
                    <h3>
                      {isEditForm ? '' : 'Create'} Supplemental Data Entry {isEditForm ? `Overview (ID: ${fid})` : ''}
                    </h3>
                  </Grid>
                </Grid> */}
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
              <Grid tablet={{ col: 3 }}>
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
              <Grid tablet={{ col: 3 }}>
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
              <Grid tablet={{ col: 2 }}>
                <SelectInput name='lScute' label='L Scute' onChange={handleChange} readOnly={isErColorNone}>
                  {createDropdownOptions(scuteOptions).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
              <Grid tablet={{ col: 2 }}>
                <SelectInput name='rScute' label='R Scute' onChange={handleChange} readOnly={isErColorNone}>
                  {createDropdownOptions(scuteOptions).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
              <Grid tablet={{ col: 2 }}>
                <SelectInput name='dScute' label='D Scute' onChange={handleChange} readOnly={isErColorNone}>
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
                  label='Genetic Vial #'
                  type='text'
                  readOnly={isGeneticsVialReadOnly}
                  required={isGeneticsVialRequired}
                />
              </Grid>
              -
              <Grid tablet={{ col: 2 }}>
                <TextInput
                  name='geneticVialNum'
                  label=''
                  type='number'
                  readOnly={isGeneticsVialReadOnly}
                  required={isGeneticsVialRequired}
                />
              </Grid>
            </Grid>
            <Grid row gap='md' className='padding-bottom-3'>
              <Grid tablet={{ col: 4 }}>
                <Fieldset>
                  <Label htmlFor='ganCheckboxGroup'>Genetic Analysis Needs</Label>
                  <Checkbox id='gan-broodstock' label='Broodstock' name='ganCheckboxGroup' />
                  <Checkbox id='gan-hatch-vs-wild' label='Hatch vs Wild' name='ganCheckboxGroup' />
                  <Checkbox id='gan-species-id' label='Species ID' name='ganCheckboxGroup' />
                  <Checkbox id='gan-archive' label='Archive' name='ganCheckboxGroup' />
                  <Checkbox id='gan-project-37' label='Project 3.7' name='ganCheckboxGroup' />
                </Fieldset>
              </Grid>
              <Grid tablet={{ col: 8 }}>
                <TextArea name='otherTagInfo' label='Other Tag Info' placeholder='Value'></TextArea>
                <TextArea name='comments' label='Comments' placeholder='Value'></TextArea>
              </Grid>
            </Grid>
          </GridContainer>
        </FormProvider>

        <ModalFooter showCancelButton onSave={() => handleSave()} customClosingLogic />
      </ModalContent>
    );
  }
);

export default SupplementalProcedureModal;
