import { useEffect, useMemo, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Alert, Grid } from '@trussworks/react-uswds';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';

import TextInput from '@components/new-inputs/text-input/TextInput';
import TextArea from '@components/new-inputs/text-area/TextArea';
import SelectInput from '@components/new-inputs/select-input/SelectInput';
import ComboBox from '@components/new-inputs/combo-box/ComboBox';
import Card from '@components/card';
import ErrorSummary from '@components/error-summary/ErrorSummary';
import ModalFooter from '@src/app-components/modal/primary-modal/PrimaryModal.footer';
import ModalContent from '@src/app-components/modal/primary-modal/PrimaryModal.content';

import { fieldOfficeTypes, projectTypes } from '@src/utils/enums';
import { getSitesDefaultValues, sitesValidationSchema } from './SitesFormModal.validation';
import { filterNullEmptyObjects } from '@src/utils/helpers';

import '../sitesList.scss';

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

const SitesFormModal = connect(
  'doAddSite',
  'doUpdateSite',
  'selectLookupData',
  'selectUserRole',
  'selectUsersData',
  ({ doAddSite, doUpdateSite, lookupData, userRole, usersData, edit, data }) => {
    const {
      bendRiverMile: bendRiverMileData,
      bendSelections: bends,
      chutes,
      fieldOffices,
      fieldOfficeSegments,
      projects,
      reach: reachData,
      sampleUnitTypes,
      seasons,
      segments,
      years,
    } = lookupData;
    const [bendOptions, setBendOptions] = useState([]);
    const [segmentOptions, setSegmentOptions] = useState([]);

    const bendDataMapping = {
      B: bendRiverMileData,
      S: bendRiverMileData,
      C: chutes,
      A: reachData,
      R: reachData,
    };

    const user = usersData?.find((user) => userRole.id === user.id);
    const yearsOptions = useMemo(() => years?.map((item) => ({ value: item.year })), [years]);
    const fieldOfficeOptions = fieldOffices.filter((item) => item.code !== 'ZZ');
    const projectsOptions =
      Number(user?.projectCode) === 1
        ? projects.filter((item) => Number(item.code) !== 2)
        : projects.filter((item) => Number(item.code) === 2);

    const methods = useForm({
      defaultValues: getSitesDefaultValues({ edit, data, user }),
      resolver: yupResolver(sitesValidationSchema),
      mode: 'all',
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

    const siteId = watch('siteId');
    const siteFid = watch('siteFid');
    const office = watch('fieldoffice');
    const project = watch('projectId');
    const segment = watch('segmentId');
    const bend = watch('bend');
    const bendRiverMile = watch('bendRiverMile');
    const sampleUnitType = watch('sampleUnitType');

    const segmentValue = segment?.value;
    const bendValue = bend?.value;

    const buildBendOptions = (type) => {
      if (!type) return;

      const options = bendDataMapping[type]?.filter((item) => Number(item.segment) === Number(segmentValue));
      const filteredOptions = options?.map((item) => ({
        value: type === 'B' || type === 'S' ? item.bend : item.code,
        label:
          type === 'B' || type === 'S'
            ? item.bendDescription
              ? `${item.bend} - ${item.bendDescription}`
              : item.bend
            : item.description,
      }));
      return filteredOptions;
    };

    const buildDescription = (type, value) => {
      if (type === 'segment') {
        return segments?.filter((item) => Number(item.code) === Number(value))?.[0]?.description;
      }
      if (type === 'bend') {
        bendRiverMileData?.filter((item) => Number(item.bend) === Number(value))?.[0]?.bendDescription;
      }
    };

    const buildSegmentsOptions = () => {
      // Filter by office
      const fieldOfficeFilteredOptions = fieldOfficeSegments?.filter((item) => item.fieldOfficeCode === office);

      // Filter by PSPA vs HAMP projects
      const projectFilteredOptions =
        Number(project) !== 2
          ? fieldOfficeFilteredOptions?.filter(
              (item) => item.fieldOfficeCode === office && Number(item.projectCode) !== 2
            )
          : fieldOfficeFilteredOptions?.filter(
              (item) => item.fieldOfficeCode === office && Number(item.projectCode) === 2
            );

      const filteredOptions = projectFilteredOptions?.map(
        (item) => segments?.filter((segment) => Number(segment.code) === Number(item.segmentCode))?.[0]
      );
      const formattedOptions = filteredOptions?.map((item) => ({
        value: item.code,
        label: `${item.code} - ${item.description}`,
      }));
      return formattedOptions;
    };

    const getBendRiverMileId = (type) => {
      if (!type) return;
      return bendDataMapping[type]?.filter(
        (item) => (type === 'B' || type === 'S' ? item.bend : item.code) === bendValue
      )?.[0]?.id;
    };

    const getUpperRiverMile = (type) => {
      if (!type) return;
      return bendDataMapping[type]?.filter((item) => item.id === bendRiverMile)?.[0]?.upperRiverMile;
    };

    const handleChange = (e) => {
      // If you want to access the event properties in an asynchronous way,
      // you should call event.persist() on the event
      e?.persist();

      const name = e?.target?.name;

      if (name === 'projectId') {
        setValue('segmentId', null);
        setValue('season', null);
        setValue('sampleUnitType', null);
        setValue('bend', null);
      }

      if (name === 'fieldoffice') {
        setValue('segmentId', null);
        setValue('bend', null);
      }

      if (name === 'segmentId') {
        setValue('bend', null);
      }

      if (name === 'sampleUnitType') {
        setValue('bend', null);
      }
    };

    const handleSave = () => {
      if (isValid) {
        const values = getValues();
        const dataObj = {
          ...values,
          segmentId: values.segmentId.value,
          bend: values.bend.value,
          projectId: Number(values.projectId),
          year: Number(values.year),
          siteId: Number(values.siteId),
        };
        // Filter out any null/empty values for final payload
        const payload = filterNullEmptyObjects(dataObj);
        data?.siteId ? doUpdateSite(payload) : doAddSite(payload);
      } else {
        trigger();
      }
    };

    // Update Bend options if Segment values change
    useEffect(() => {
      segmentValue && sampleUnitType && setBendOptions(buildBendOptions(sampleUnitType));
    }, [segmentValue, sampleUnitType]);

    // Update Segment options if Field Office and/or Project values change
    useEffect(() => {
      office && project && setSegmentOptions(buildSegmentsOptions());
    }, [office, project]);

    // Set Bend River Mile ID - dependent on Bend, Sample Unit Type, and Segment values
    useEffect(() => {
      bendValue && segmentValue && sampleUnitType && setValue('bendRiverMile', getBendRiverMileId(sampleUnitType));
    }, [bendValue, segmentValue, sampleUnitType]);

    // Populate Segment & Bend Combobox Dropdown Values from Existing API Data
    useEffect(() => {
      if (data?.segmentId) {
        setValue('segmentId', {
          value: data?.segmentId,
          label: buildDescription('segment', data?.segmentId),
        });
      }
      if (data?.bend) {
        setValue('bend', {
          value: data?.bend,
          label: buildDescription('bend', data?.bend),
        });
      }
    }, [data?.segmentId, data?.bend]);

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
              {(edit || user?.role !== 'ADMINISTRATOR') && (
                <Card>
                  <Card.Body>
                    {edit && (
                      <Grid row>
                        <Grid tablet={{ col: 6 }}>
                          <p className='margin-bottom-0'>
                            <span className='text-bold'>Site ID:</span> {siteId ? siteId : '-'}
                          </p>
                        </Grid>
                        <Grid tablet={{ col: 6 }}>
                          <p className='margin-bottom-0'>
                            <span className='text-bold'>Site Field ID:</span> {siteFid ? siteFid : '-'}
                          </p>
                        </Grid>
                      </Grid>
                    )}
                    {user?.role !== 'ADMINISTRATOR' && (
                      <Grid row>
                        <Grid tablet={{ col: 6 }}>
                          <p className='margin-bottom-0'>
                            <span className='text-bold'>Field Office:</span> {fieldOfficeTypes[office]}
                          </p>
                        </Grid>
                        <Grid tablet={{ col: 6 }}>
                          <p className='margin-bottom-0'>
                            <span className='text-bold'>Project:</span> {projectTypes[project]}
                          </p>
                        </Grid>
                      </Grid>
                    )}
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
                    {yearsOptions.map((item, index) => (
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
                        {createDropdownOptions(fieldOfficeOptions).map((item, index) => (
                          <option key={index + 1} value={item.value}>
                            {item.text}
                          </option>
                        ))}
                      </SelectInput>
                    </Grid>
                    <Grid tablet={{ col: 4 }}>
                      <SelectInput name='projectId' label='Project' onChange={handleChange} required>
                        {createDropdownOptions(projectsOptions).map((item, index) => (
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
                options={segmentOptions}
                onChange={handleChange}
                readOnly={!office || !project}
                closeMenuOnSelect
                required
              />
              <SelectInput name='season' label='Season' onChange={handleChange} readOnly={!project} required>
                {createDropdownOptions(seasons).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </SelectInput>
              <SelectInput name='sampleUnitType' label='Sample Unit Type' required>
                {createDropdownOptions(sampleUnitTypes).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </SelectInput>
              <ComboBox
                label='Sample Unit (Bend)'
                name='bend'
                options={bendOptions}
                readOnly={!segment}
                closeMenuOnSelect
                required
              />
              <SelectInput name='bendrn' label='Bend R/N' required>
                {createDropdownOptions(bends).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </SelectInput>
              <p className='margin-top-2'>Bend River Mile: {getUpperRiverMile(sampleUnitType) ?? '--'}</p>
              {edit && (
                <Grid row gap='md'>
                  <Grid tablet={{ col: 9 }}>
                    <TextArea name='last_edit_comment' label='Comments' readOnly />
                  </Grid>
                  <Grid tablet={{ col: 3 }}>
                    <TextInput name='editInitials' label='Recorder Initials' readOnly />
                  </Grid>
                </Grid>
              )}
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
