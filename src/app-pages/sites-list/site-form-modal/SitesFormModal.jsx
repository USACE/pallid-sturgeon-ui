import { useCallback, useEffect, useMemo, useState } from 'react';
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

import { createData, updateData } from '@src/app-pages/data-entry/offline/api';

import { fieldOfficeTypes } from '@src/utils/enums';
import { getSitesDefaultValues, sitesValidationSchema } from './SitesFormModal.validation';
import { filterNullEmptyObjects } from '@src/utils/helpers';
import { getLookupOptions } from '@src/app-pages/data-entry/offline/lookup-cache';
import { createDropdownOptions } from '@src/app-pages/data-entry/dataEntryHelper';

import '../sitesList.scss';

const lookupTableNames = [
  'bendRiverMile',
  'bendSelections',
  'chutes',
  'fieldOffices',
  'fieldOfficeSegments',
  'projects',
  'reach',
  'sampleUnitTypes',
  'seasons',
  'segments',
  'years',
];

const SitesFormModal = connect(
  'doModalClose',
  'doAddSite',
  'doUpdateSite',
  'doUpdateUrl',
  'selectLookupData',
  'selectUserRole',
  'selectUsersData',
  ({ doModalClose, doAddSite, doUpdateSite, doUpdateUrl, lookupData, userRole, usersData, edit, data }) => {
    // Default lookups to online data, otherwise will be overwritten by offline cached lookup data if network status = offline
    const isOnline = navigator.onLine;
    const [lookups, setLookups] = useState(
      lookupTableNames.reduce((accumulator, currentKey) => {
        accumulator[currentKey] = lookupData?.[currentKey] ?? [];
        return accumulator;
      }, {})
    );
    const [bendOptions, setBendOptions] = useState([]);
    const [segmentOptions, setSegmentOptions] = useState([]);

    const bendDataMapping = {
      B: lookups?.bendRiverMile,
      S: lookups?.bendRiverMile,
      C: lookups?.chutes,
      A: lookups?.reachData,
      R: lookups?.reachData,
    };

    const user = usersData?.find((user) => userRole.id === user.id);
    const yearsOptions = useMemo(() => lookups?.years?.map((item) => ({ value: item.year })), [lookups?.years]);
    const fieldOfficeOptions = lookups?.fieldOffices?.filter((item) => item.code !== 'ZZ');
    const projectsOptions =
      Number(user?.projectCode) === 1
        ? lookups?.projects?.filter((item) => Number(item.code) !== 2)
        : lookups?.projects?.filter((item) => Number(item.code) === 2);

    const methods = useForm({
      defaultValues: getSitesDefaultValues({ edit, data, user }),
      resolver: yupResolver(sitesValidationSchema),
      mode: 'all',
      stateOptions: [],
    });
    const {
      formState: { errors, isValid, isDirty },
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
    const comments = watch('last_edit_comment');
    const editInitials = watch('editInitials');

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

    const buildSegmentsOptions = () => {
      // Filter by office
      const fieldOfficeFilteredOptions = lookups?.fieldOfficeSegments?.filter(
        (item) => item.fieldOfficeCode === office
      );

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
        (item) => lookups?.segments?.filter((segment) => Number(segment.code) === Number(item.segmentCode))?.[0]
      );
      const formattedOptions = filteredOptions?.map((item) => ({
        value: item.code,
        label: `${item.code} - ${item.description}`,
      }));
      return formattedOptions;
    };

    const buildSegmentDescription = useCallback(() => {
      return lookups?.segments?.filter((item) => Number(item.code) === Number(data?.segmentId))?.[0]?.description;
    }, [data]);

    const buildBendDescription = useCallback(() => {
      const type = data?.sampleUnitType;
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
      return filteredOptions?.filter((item) => Number(item.value) === Number(data?.bend))?.[0]?.label;
    }, [data, segmentValue]);

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

    const handleSave = async () => {
      const valid = await trigger();
      if (!valid) return;

      const values = getValues();
      const clientId = values.clientId ?? data?.clientId ?? crypto.randomUUID();
      const generateSiteFid = `SITE-${clientId.slice(0, 8)}`;

      const finalSiteFid = values.siteFid || values.site_fid || data?.siteFid || data?.site_fid || generateSiteFid;

      // Need params obj for online save/update
      const paramsObj = {
        code: values?.bend?.value,
        sampleUnitType: values?.sampleUnitType,
        segment: values?.segmentId?.value,
        season: values?.segmentId,
      };

      const dataObj = {
        ...values,
        clientId,
        siteFid: finalSiteFid,
        site_fid: finalSiteFid,
        segmentId: values.segmentId?.value,
        bend: values.bend.value,
        projectId: Number(values.projectId),
        year: Number(values.year),
        siteId: Number(values.siteId),
        bendRiverMile: String(values?.bendRiverMile),
        _status: 'queued',
        version: values.version ?? 0,
        updatedAt: new Date().toISOString(),
      };

      const payload = filterNullEmptyObjects(dataObj);

      try {
        if (isOnline) {
          data?.siteId || data?.site_id ? doUpdateSite(payload) : doAddSite(paramsObj, payload);
        } else {
          data?.siteId || data?.site_id
            ? await updateData('sites', clientId, payload)
            : await createData('sites', payload);
        }
      } catch (error) {
        console.error('Site save failed, queuing offline:', error);

        data?.siteId || data?.site_id
          ? await updateData('sites', clientId, payload)
          : await createData('sites', payload);
      }
      !edit && doUpdateUrl(`/sites-list/${finalSiteFid}`);
      doModalClose();
    };

    const handleClose = () => {
      if (isDirty) {
        const confirmed = confirm('Any changes will not be saved. Is this okay?');
        if (confirmed) {
          doModalClose();
        }
      } else {
        doModalClose();
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
          label: buildSegmentDescription(),
        });
      }
      if (data?.bend || data?.bend === 0) {
        setValue('bend', {
          value: data?.bend,
          label: buildBendDescription(),
        });
      }
    }, [data?.segmentId, data?.bend, buildSegmentDescription, buildBendDescription]);

    useEffect(() => {
      setFocus(errors?.[Object.keys(errors)[0]]?.['ref']?.['id']);
    }, [errors, setFocus]);

    useEffect(() => {
      edit && trigger();
    }, [edit, trigger]);

    // Load offline lookups
    useEffect(() => {
      const loadOfflineLookups = async () => {
        const options = await Promise.all(lookupTableNames.map(async (name) => [name, await getLookupOptions(name)]));
        setLookups(Object.fromEntries(options));
      };
      !isOnline && loadOfflineLookups();
    }, [isOnline]);

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
                  </>
                )}
                <Grid tablet={{ col: 4 }}>
                  <SelectInput name='projectId' label='Project' onChange={handleChange} required>
                    {createDropdownOptions(projectsOptions).map((item, index) => (
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
                options={segmentOptions}
                onChange={handleChange}
                readOnly={!office || !project}
                closeMenuOnSelect
                required
              />
              <SelectInput name='season' label='Season' onChange={handleChange} readOnly={!project} required>
                {createDropdownOptions(lookups?.seasons).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </SelectInput>
              <SelectInput name='sampleUnitType' label='Sample Unit Type' required>
                {createDropdownOptions(lookups?.sampleUnitTypes).map((item, index) => (
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
                menuPlacement='auto'
                required
              />
              <SelectInput name='bendrn' label='Bend R/N' required>
                {createDropdownOptions(lookups?.bendSelections).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </SelectInput>
              <p className='margin-top-2'>Bend River Mile: {getUpperRiverMile(sampleUnitType) ?? '--'}</p>
              {edit && (comments || editInitials) && (
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
            onCancel={() => handleClose()}
          />
        </FormProvider>
      </ModalContent>
    );
  }
);

export default SitesFormModal;
