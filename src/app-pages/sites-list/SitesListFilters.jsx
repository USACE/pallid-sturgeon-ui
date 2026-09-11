import { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Grid } from '@trussworks/react-uswds';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, FormProvider } from 'react-hook-form';

import SelectInput from '@components/new-inputs/select-input/SelectInput';
import Card from '@src/app-components/card';

import { getLookupOptions } from '../data-entry/offline/lookup-cache';
import { createDropdownOptions } from '../data-entry/helpers';
import { dropdownYearsToNow } from '@src/utils';

import './sitesList.scss';

const schema = yup.object().shape({});

const lookupTableNames = ['fieldOffices', 'fieldOfficeSegments', 'projects', 'seasons', 'segments'];

const SitesListFilter = connect(
  'doUpdateSiteParams',
  'selectLookupData',
  'selectUserRole',
  ({ doUpdateSiteParams, lookupData, userRole }) => {
    const userProject = Number(userRole?.projectCode);
    const isUserAdmin = userRole?.role === 'ADMINISTRATOR';

    const isOnline = navigator.onLine;
    const [lookups, setLookups] = useState(
      lookupTableNames.reduce((accumulator, currentKey) => {
        accumulator[currentKey] = lookupData?.[currentKey] ?? [];
        return accumulator;
      }, {})
    );
    const [segmentOptions, setSegmentOptions] = useState(lookups?.segments ?? []);

    const fieldOfficeOptions = lookups?.fieldOffices?.filter((item) => item.code !== 'ZZ');
    const project1Options = lookups?.projects?.filter((item) => Number(item.code) !== 2);
    const project2Options = lookups?.projects?.filter((item) => Number(item.code) === 2);
    const projectOptions = userProject === 1 ? project1Options : project2Options;

    const defaultValues = {
      year: new Date().getFullYear(),
      project: userProject ?? '',
      fieldoffice: !isUserAdmin ? userRole?.officeCode : '',
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
    const { watch, getValues } = methods;

    const year = watch('year');
    const seasonCode = watch('seasonCode');
    const segmentCode = watch('segmentCode');
    const project = watch('project');
    const office = watch('fieldoffice');

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
        code: item.code,
        description: `${item.code} - ${item.description}`,
      }));
      return formattedOptions;
    };

    // Update data based on filters
    useEffect(() => {
      if (!isOnline) return;
      const searchParams = getValues();
      doUpdateSiteParams(searchParams);
    }, [year, seasonCode, segmentCode, office]);

    // Update Segment options if Field Office and/or Project values change
    useEffect(() => {
      office && project && setSegmentOptions(buildSegmentsOptions());
    }, [office, project]);

    // Load offline lookups
    useEffect(() => {
      const loadOfflineLookups = async () => {
        const options = await Promise.all(lookupTableNames.map(async (name) => [name, await getLookupOptions(name)]));
        setLookups(Object.fromEntries(options));
      };
      !isOnline && loadOfflineLookups();
    }, [isOnline]);

    return (
      <Card className='margin-bottom-1'>
        <Card.Header text='Site Search Filter' />
        <Card.Body>
          <FormProvider {...methods}>
            <Grid row gap='md'>
              <Grid desktop={{ col: 1 }} tablet={{ col: 3 }}>
                <SelectInput label='Year' name='year' showOptionalText={false}>
                  {dropdownYearsToNow(2011).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.value}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
              <Grid desktop={{ col: 3 }} tablet={{ col: 4 }}>
                <SelectInput name='project' label='Project' readOnly={userProject === 2} showOptionalText={false}>
                  {createDropdownOptions(projectOptions).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
              {userRole?.role === 'ADMINISTRATOR' && (
                <Grid desktop={{ col: 2 }} tablet={{ col: 5 }}>
                  <SelectInput name='fieldoffice' label='Field Office' showOptionalText={false}>
                    {createDropdownOptions(fieldOfficeOptions).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
              )}
              <Grid desktop={{ col: 4 }} tablet={{ col: 5 }}>
                <SelectInput name='segmentCode' label='Segment' showOptionalText={false}>
                  {createDropdownOptions(segmentOptions).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
              <Grid desktop={{ col: 2 }} tablet={{ col: 4 }}>
                <SelectInput name='seasonCode' label='Season' showOptionalText={false}>
                  {createDropdownOptions(lookups?.seasons).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
            </Grid>
          </FormProvider>
        </Card.Body>
      </Card>
    );
  }
);

export default SitesListFilter;
