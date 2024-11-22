import { useEffect, useMemo } from 'react';
import { connect } from 'redux-bundler-react';
import { Grid } from '@trussworks/react-uswds';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, FormProvider } from 'react-hook-form';

import { ModalContent, ModalFooter, ModalHeader } from '@components/modal';
import TextInput from '@components/new-inputs/text-input/TextInput';
import TextArea from '@components/new-inputs/text-area/TextArea';
import SelectInput from '@components/new-inputs/select-input/SelectInput';
import ComboBox from '@components/new-inputs/combo-box/ComboBox';

import {
  createDropdownOptions,
  createCustomCodeDropdownOptions,
} from '@pages/data-entry/helpers';
import { dropdownYearsToNow } from '@src/utils';
import {
  sampleUnitTypeProject1,
  sitesFormTooltipContent,
} from './sitesFormModalHelper';

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
    const {
      fieldOffices,
      projects,
      seasons,
      bends,
      bendRn,
      segments,
      sampleUnitTypes,
    } = domains;

    const user = usersData.find((user) => userRole.id === user.id);

    const bendComboOptions = useMemo(
      () =>
        bends
          ? bends.map((item) => ({
              value: item.sampleUnit,
              label: item.description,
            }))
          : [],
      []
    );

    const segmentComboOptions = useMemo(
      () =>
        segments
          ? segments.map((item) => ({
              value: item.code,
              label: item.description,
            }))
          : [],
      []
    );

    const defaultValues = {
      year: data?.year ?? null,
      fieldoffice: data?.fieldoffice ?? null, // @TODO: double check logic for user's field office
      projectId: data?.projectId ?? null, // @TODO: double check logic for user's field office
      segmentId: data?.segmentId
        ? segmentComboOptions.filter(
            (item) => item.value === data.segmentId
          )?.[0]
        : null,
      season: data?.season ?? null,
      sampleUnitType: data?.sampleUnitType ?? null,
      bend: data?.bend
        ? bendComboOptions.filter((item) => item.value === data.bend)?.[0]
        : null,
      bendrn: data?.bendrn ?? null,
      last_edit_comment: data?.last_edit_comment ?? null,
      editInitials: data?.editInitials ?? null,
    };

    const schema = yup.object().shape({
      year: yup.string().required('Value is required'),
      fieldoffice: yup.string().required('Value is required'),
      projectId: yup.string().required('Value is required'),
      season: yup.string().required('Value is required'),
      segmentId: yup.object().required('Value is required'),
      sampleUnitType: yup.string().required('Value is required'),
      bend: yup.object().required('Value is required'),
      bendrn: yup.string().required('Value is required'),
      last_edit_comment: yup.string().required('Value is required'),
      editInitials: yup.string().required('Value is required'),
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
    } = methods;

    const office = watch('fieldoffice');
    const project = watch('projectId');
    const sampleUnitType = watch('sampleUnitType');
    const segment = watch('segmentId');
    const bend = watch('bend');

    const sampleUnitOptions =
      project === 1
        ? sampleUnitTypeProject1
        : createCustomCodeDropdownOptions(sampleUnitTypes);

    const handleSave = () => {
      if (isValid) {
        const values = getValues();
        edit
          ? doUpdateSite(values)
          : doPostNewSite(
              { code: bend, sampleUnitType: sampleUnitType, segment: segment },
              values
            );
      } else {
        trigger();
      }
    };

    // Update Bend options if segmentId and sampleUnitType values change
    useEffect(() => {
      if (segment && sampleUnitType) {
        // setValue('bend', null);
        doDomainBendsFetch({
          sampleUnitType: sampleUnitType,
          segment: segment?.value,
        });
      }
    }, [segment, sampleUnitType]);

    // Update Segment options if fieldoffice and projectId values change
    useEffect(() => {
      // Clear Segment and Bend values
      if (office && project) {
        // setValue('segmentId', null);
        // setValue('bend', null);
        doDomainSegmentsFetch();
      }
    }, [office, project]);

    useEffect(() => {
      setFocus(errors?.[Object.keys(errors)[0]]?.['ref']?.['id']);
    }, [errors, setFocus]);

    useEffect(() => {
      edit && trigger();
    }, [edit, trigger]);

    return (
      <ModalContent size='lg'>
        <FormProvider {...methods}>
          <ModalHeader title={edit ? 'Update Site' : 'Create New Site'} />
          <section className='modal-body'>
            <div className='container-fluid'>
              {!edit && (
                <>
                  <p>
                    Please complete the following fields to create a new site.
                  </p>
                  <p>
                    <span className='text-bold'>Note:</span> Some dropdown
                    options are dependent from other fields.
                  </p>
                </>
              )}
              <Grid row gap='md'>
                <Grid tablet={{ col: 4 }}>
                  <SelectInput
                    name='year'
                    label='Year'
                    defaultOption={new Date().getFullYear()}
                    required
                  >
                    {dropdownYearsToNow().map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.value}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 4 }}>
                  <SelectInput
                    name='fieldoffice'
                    label='Field Office'
                    defaultOption={
                      office === 'ZZ' || office === '' ? '' : office
                    }
                    readOnly={user ? user.role !== 'ADMINISTRATOR' : false}
                    required
                  >
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
                    readOnly={user ? user.role !== 'ADMINISTRATOR' : false}
                    required
                  >
                    {createDropdownOptions(projects).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
              </Grid>
              <ComboBox
                label='Segment'
                name='segmentId'
                options={segmentComboOptions}
                tooltip={sitesFormTooltipContent.segment}
                readOnly={!office}
                required
              />
              <SelectInput
                name='season'
                label='Season'
                tooltip={sitesFormTooltipContent.season}
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
                tooltip={sitesFormTooltipContent.sampleUnitType}
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
                placeholder='Select sample unit...'
                options={bendComboOptions}
                defaultValue={bend}
                tooltip={sitesFormTooltipContent.sampleUnit}
                required={bend !== 0}
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
                  <TextArea
                    name='last_edit_comment'
                    label='Comments'
                    required
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='editInitials'
                    label='Recorder Initials'
                    required
                  />
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
