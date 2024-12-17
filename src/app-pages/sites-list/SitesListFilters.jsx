import { useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { Alert, Button, Grid } from '@trussworks/react-uswds';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, FormProvider } from 'react-hook-form';

import SelectInput from '@components/new-inputs/select-input/SelectInput';
// import ComboBox from '@components/new-inputs/combo-box/ComboBox';
import Card from '@src/app-components/card';

import { createDropdownOptions } from '../data-entry/helpers';
import { dropdownYearsToNow } from '@src/utils';

import './sitesList.scss';

const schema = yup.object().shape({});

const SitesListFilter = connect(
  'doDomainBendsFetch',
  'doDataEntryLoadData',
  'doDomainSeasonsFetch',
  'doDomainSegmentsFetch',
  'doUpdateSiteParams',
  'selectDomains',
  'selectUserRole',
  ({
    doDomainBendsFetch,
    doDataEntryLoadData,
    doDomainSeasonsFetch,
    doDomainSegmentsFetch,
    doUpdateSiteParams,
    domains,
    userRole,
  }) => {
    const { projects, seasons, bends, segments } = domains;

    // const bendComboOptions = useMemo(
    //   () =>
    //     bends
    //       ? bends.map((item) => ({
    //           value: item.sampleUnit,
    //           label: item.description,
    //         }))
    //       : [],
    //   []
    // );

    const defaultValues = {
      year: new Date().getFullYear(),
      project: userRole?.projectCode,
      seasonCode: '',
      bend: '',
      segmentCode: '',
    };

    const methods = useForm({
      defaultValues: defaultValues,
      resolver: yupResolver(schema),
      mode: 'onBlur',
      stateOptions: [],
    });
    const { watch, getValues, setValue } = methods;

    const year = watch('year');
    const seasonCode = watch('seasonCode');
    const bend = watch('bend');
    const segmentCode = watch('segmentCode');

    const clearFilters = () => {
      setValue('year', '');
      setValue('seasonCode', '');
      setValue('bend', '');
      setValue('segmentCode', '');
    };

    // Update data based on filters
    useEffect(() => {
      const searchParams = getValues();
      doUpdateSiteParams(searchParams);
    }, [year, bend, seasonCode, segmentCode]);

    // Load data
    useEffect(() => {
      doDataEntryLoadData();
      doDomainSegmentsFetch();
      doDomainSeasonsFetch();
      doDomainBendsFetch();
    }, []);

    return (
      <Card className='margin-bottom-1'>
        <Card.Header text='Site Search Filter' />
        <Card.Body>
          <FormProvider {...methods}>
            <Alert noIcon slim className='callout'>
              Make selections from the drop down lists to go to the datasheets associated with your selection.
            </Alert>
            <Grid row gap='md'>
              <Grid tablet={{ col: 1 }}>
                <SelectInput label='Year' name='year' showOptionalText={false}>
                  {dropdownYearsToNow(2011).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.value}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
              <Grid tablet={{ col: 3 }}>
                <SelectInput
                  name='project'
                  label='Project'
                  defaultOption={userRole?.projectCode ?? ''}
                  readOnly={userRole?.projectCode === '2'}
                  showOptionalText={false}
                >
                  {createDropdownOptions(projects).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
              <Grid tablet={{ col: 4 }}>
                <SelectInput name='segmentCode' label='Segment' showOptionalText={false}>
                  {createDropdownOptions(segments).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
              <Grid tablet={{ col: 2 }}>
                <SelectInput name='seasonCode' label='Season' readOnly={!year} showOptionalText={false}>
                  {createDropdownOptions(seasons).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
              {/* <Grid tablet={{ col: 4 }}>
                <ComboBox
                  label='Select Sample Unit'
                  name='bend'
                  options={bendComboOptions}
                  readOnly
                  showOptionalText={false}
                />
              </Grid> */}
              <Grid tablet={{ col: 2 }} className='filter-btn-container'>
                <div>
                  <Button onClick={clearFilters} className='clear-btn' outline title='Clear Filters'>
                    Clear All Filters
                  </Button>
                </div>
              </Grid>
            </Grid>
          </FormProvider>
        </Card.Body>
      </Card>
    );
  }
);

export default SitesListFilter;
