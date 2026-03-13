import { useEffect, useMemo } from 'react';
import { connect } from 'redux-bundler-react';
import { Alert, Grid } from '@trussworks/react-uswds';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, FormProvider } from 'react-hook-form';

import TextInput from '@components/new-inputs/text-input/TextInput';
import TextArea from '@components/new-inputs/text-area/TextArea';
import SelectInput from '@components/new-inputs/select-input/SelectInput';
import ComboBox from '@components/new-inputs/combo-box/ComboBox';
import Card from '@components/card';
import ErrorSummary from '@components/error-summary/ErrorSummary';
import ModalFooter from '@src/app-components/modal/primary-modal/PrimaryModal.footer';
import ModalContent from '@src/app-components/modal/primary-modal/PrimaryModal.content';

import { createDropdownOptions } from '@pages/data-entry/helpers';
import { dropdownYearsToNow } from '@src/utils';
import { sampleUnitTypeProject1, sitesFormTooltipContent } from './sitesFormModalHelper';
import { ValidationMessages } from '@src/utils/enums';

const SitesFormModal = connect(
  'doDomainBendsFetch',
  'doDomainSegmentsFetch',
  'doPostNewSite',
  'doUpdateSite',
  'selectDomains',
  'selectUserRole',
  'selectUsersData',
  ({
    doDomainBendsFetch,
    doDomainSegmentsFetch,
    doPostNewSite,
    doUpdateSite,
    domains,
    userRole,
    usersData,
    edit,
    data,
  }) => {
    const { fieldOffices, projects, seasons, bends, bendRn, segments, sampleUnitTypes } = domains;

    const user = usersData.find((user) => userRole.id === user.id);
    const currentYear = new Date().getFullYear();

    // Additional fields need to be provided for updating site data
    const additionalValues = {
      approved: data?.approved ?? '',
      bendRiverMile: data?.bendRiverMile ?? '',
      bkgColor: data?.bkgColor ?? '',
      brmId: data?.brmId ?? '',
      complete: data?.complete ?? '',
      lastUpdated: data?.lastUpdated ?? '',
      siteFid: data?.siteFid ?? '',
      siteId: data?.siteId ?? '',
      uploadFilename: data?.uploadFilename ?? '',
      uploadSessionId: data?.uploadSessionId ?? '',
      uploadedBy: data?.uploadedBy ?? '',
    };

    const bendComboOptions = bends
      ? bends.map((item) => ({
          value: item.sampleUnit,
          label: item.description,
        }))
      : [];

    const segmentComboOptions = useMemo(
      () =>
        segments
          ? segments.map((item) => ({
              value: item.code,
              label: item.description,
            }))
          : [],
      [segments]
    );

    const defaultValues = {
      edit: edit ?? false,
      year: data?.year ?? String(currentYear),
      fieldoffice: edit ? data?.fieldoffice : user?.officeCode === 'ZZ' ? '' : user?.officeCode,
      projectId: edit ? data?.projectId : user?.projectCode,
      segmentId: data?.segmentId ? segmentComboOptions.filter((item) => item.value === data.segmentId)?.[0] : '',
      season: data?.season ?? '',
      sampleUnitType: data?.sampleUnitType ?? '',
      bend: data?.bend ? bendComboOptions.filter((item) => item.value === data.bend)?.[0] : '',
      bendrn: data?.bendrn ?? '',
      last_edit_comment: data?.last_edit_comment ?? '',
      editInitials: data?.editInitials ?? '',
    };

    const schema = yup.object().shape({
      edit: yup.boolean(),
      year: yup.string().required(ValidationMessages.FieldRequired),
      fieldoffice: yup.string().required(ValidationMessages.FieldRequired),
      projectId: yup.string().required(ValidationMessages.FieldRequired),
      season: yup.string().required(ValidationMessages.FieldRequired),
      segmentId: yup.object().required(ValidationMessages.FieldRequired),
      sampleUnitType: yup.string().required(ValidationMessages.FieldRequired),
      bend: yup.object().required(ValidationMessages.FieldRequired),
      bendrn: yup.string().required(ValidationMessages.FieldRequired),
      last_edit_comment: yup.string().when('edit', {
        is: true,
        then: (schema) => schema.required(ValidationMessages.FieldRequired),
      }),
      editInitials: yup.string().when('edit', {
        is: true,
        then: (schema) => schema.required(ValidationMessages.FieldRequired),
      }),
    });

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

    const office = watch('fieldoffice');
    const project = watch('projectId');
    const sampleUnitType = watch('sampleUnitType');
    const segment = watch('segmentId');
    const bend = watch('bend');

    const sampleUnitOptions = useMemo(
      () =>
        project === 1
          ? sampleUnitTypeProject1
          : sampleUnitTypes?.map((item) => ({
              value: item.code,
              text: `${item.code} - ${item.description}`,
            })),
      [project, sampleUnitTypes]
    );

    const handleChange = (e) => {
      // If you want to access the event properties in an asynchronous way,
      // you should call event.persist() on the event
      e?.persist();

      const name = e?.target?.name;

      if (name === 'projectId') {
        setValue('segmentId', null);
        setValue('season', null);
        setValue('sampleUnitType', null);
        doDomainSegmentsFetch({ office: getValues('fieldoffice'), project: e?.target?.value });
      }

      if (name === 'fieldoffice') {
        setValue('segmentId', null);
        doDomainSegmentsFetch({ office: e?.target?.value, project: getValues('projectId') });
      }

      if (name === 'segmentId') {
        setValue('bend', null);
        doDomainBendsFetch({
          sampleUnitType: sampleUnitType,
          segment: segment?.value,
        });
      }

      if (name === 'sampleUnitType') {
        setValue('bend', null);
        doDomainBendsFetch({
          sampleUnitType: sampleUnitType,
          segment: segment?.value,
        });
      }
    };

    const handleSave = () => {
      if (isValid) {
        const values = getValues();
        const castedValues = {
          ...values,
          segmentId: values.segmentId.value,
          bend: values.bend.value,
          projectId: Number(values.projectId),
          year: Number(values.year),
        };
        edit
          ? doUpdateSite({ ...castedValues, ...additionalValues })
          : doPostNewSite(
              {
                code: castedValues.bend,
                sampleUnitType: sampleUnitType,
                segment: castedValues.segmentId,
              },
              castedValues
            );
      } else {
        trigger();
      }
    };

    // Update Bend options if segmentId and sampleUnitType values change
    useEffect(() => {
      if (segment && sampleUnitType) {
        doDomainBendsFetch({
          sampleUnitType: sampleUnitType,
          segment: segment?.value,
        });
      }
    }, [segment, sampleUnitType]);

    // Update Segment options if fieldoffice and projectId values change
    useEffect(() => {
      if (office && project) {
        doDomainSegmentsFetch({ office, project });
        setValue('segmentId', null);
        setValue('bend', null);
      }
    }, [office, project]);

    useEffect(() => {
      setFocus(errors?.[Object.keys(errors)[0]]?.['ref']?.['id']);
    }, [errors, setFocus]);

    useEffect(() => {
      edit && trigger();
    }, [edit, trigger]);

    return (
      <ModalContent title={edit ? 'Update Site' : 'Add Site'}>
        <FormProvider {...methods}>
          {errors && <ErrorSummary errors={errors} modalID='siteFormModal' type='modal' />}
          <section className='modal-body' id='siteFormModal'>
            <div className='container-fluid margin-top-1'>
              {user?.role !== 'ADMINISTRATOR' && (
                <Card>
                  <Card.Body>
                    <Grid row>
                      <Grid tablet={{ col: 6 }}>
                        <p className='margin-bottom-0'>
                          <span className='text-bold'>Field Office:</span>{' '}
                          {fieldOffices?.filter((item) => item.code === office)?.[0]?.description}
                        </p>
                      </Grid>
                      <Grid tablet={{ col: 6 }}>
                        <p className='margin-bottom-0'>
                          <span className='text-bold'>Project:</span>{' '}
                          {projects?.filter((item) => item.code === Number(project))?.[0]?.description}
                        </p>
                      </Grid>
                    </Grid>
                  </Card.Body>
                </Card>
              )}
              {!edit && (
                <Alert noIcon slim className='callout'>
                  Please complete the following fields to create a new site.
                  <br></br>
                  <span className='text-bold'>Note:</span> Some dropdown options are dependent from other fields.
                </Alert>
              )}
              <Grid row gap='md'>
                <Grid tablet={{ col: 4 }}>
                  <SelectInput name='year' label='Year' required>
                    {dropdownYearsToNow().map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.value}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                {user?.role === 'ADMINISTRATOR' && (
                  <>
                    <Grid tablet={{ col: 4 }}>
                      <SelectInput name='fieldoffice' label='Field Office' onChange={handleChange} required>
                        {createDropdownOptions(fieldOffices).map((item, index) => (
                          <option key={index + 1} value={item.value}>
                            {item.text}
                          </option>
                        ))}
                      </SelectInput>
                    </Grid>
                    <Grid tablet={{ col: 4 }}>
                      <SelectInput
                        name='projectId'
                        label='Project'
                        defaultOption={user ? user.projectCode : ''}
                        onChange={handleChange}
                        required
                      >
                        {createDropdownOptions(projects).map((item, index) => (
                          <option key={index + 1} value={item.value}>
                            {item.text}
                          </option>
                        ))}
                      </SelectInput>
                    </Grid>
                  </>
                )}
              </Grid>
              <ComboBox
                label='Segment'
                name='segmentId'
                options={segmentComboOptions}
                onChange={handleChange}
                tooltip={sitesFormTooltipContent.segment}
                readOnly={!office || !project}
                closeMenuOnSelect
                required
              />
              <SelectInput
                name='season'
                label='Season'
                onChange={handleChange}
                tooltip={sitesFormTooltipContent.season}
                readOnly={!project}
                required
              >
                {createDropdownOptions(seasons).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </SelectInput>
              <SelectInput
                name='sampleUnitType'
                label='Sample Unit Type'
                onChange={handleChange}
                tooltip={sitesFormTooltipContent.sampleUnitType}
                readOnly={!project}
                required
              >
                {sampleUnitOptions.map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </SelectInput>
              <ComboBox
                label='Sample Unit'
                name='bend'
                options={bendComboOptions}
                tooltip={sitesFormTooltipContent.sampleUnit}
                readOnly={!segment || !sampleUnitType}
                required={bend !== 0}
                closeMenuOnSelect
              />
              <SelectInput name='bendrn' label='Bend R/N' required>
                {createDropdownOptions(bendRn).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </SelectInput>
              <Grid row gap='md'>
                <Grid tablet={{ col: 9 }}>
                  <TextArea name='last_edit_comment' label='Comments' required={edit} />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='editInitials' label='Recorder Initials' required={edit} />
                </Grid>
              </Grid>
            </div>
          </section>
          <ModalFooter
            showCancelButton
            saveIsDisabled={!isValid}
            saveText={edit ? 'Apply Changes' : 'Save'}
            onSave={() => handleSave()}
          />
        </FormProvider>
      </ModalContent>
    );
  }
);

export default SitesFormModal;
