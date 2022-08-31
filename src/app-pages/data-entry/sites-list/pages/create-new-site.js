import React, { useEffect, useReducer } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import FilterSelect from 'app-components/filter-select';
import { Input, Row, SelectCustomLabel, FilterSelectCustomLabel } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';
import { createDropdownOptions, createBendsDropdownOptions } from '../../helpers';
import { dropdownYearsToNow } from 'utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_INPUT':
      return {
        ...state,
        [action.field]: action.payload
      };
    case 'INITIALIZE_FORM':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

const CreateNewSite = connect(
  'doPostNewSite',
  'doNewSiteLoadData',
  'selectDomains',
  ({
    doPostNewSite,
    doNewSiteLoadData,
    domains,
  }) => {
    const { fieldOffices, projects, seasons, bends, bendRn, segments, sampleUnitTypes } = domains;
    const [state, dispatch] = useReducer(reducer, {});


    const handleChange = e => {
      dispatch({
        type: 'UPDATE_INPUT',
        field: e.target.name,
        payload: e.target.value
      });
    };

    const handleSelect = (field, val) => {
      dispatch({
        type: 'UPDATE_INPUT',
        field: field,
        payload: val
      });
    };

    const saveIsDisabled = !(
      !!state['year'] &&
      !!state['fieldoffice'] &&
      !!state['editInitials'] &&
      !!state['projectId'] &&
      !!state['segmentId'] &&
      !!state['sampleUnitType'] &&
      !!state['season'] &&
      !!state['bendrn']
    );

    useEffect(() => {
      doNewSiteLoadData();
    }, [doNewSiteLoadData]);

    return (
      <div className='container-fluid w-75'>
        <Card>
          <Card.Header text='Create New Site' />
          <Card.Body>
            <Row>
              <div className='col-2'>
                <SelectCustomLabel
                  label='Year'
                  name='year'
                  value={Number(state['year'])}
                  onChange={val => handleSelect('year', val)}
                  options={dropdownYearsToNow()}
                  isRequired
                />
              </div>
              <div className='col-4'>
                <SelectCustomLabel
                  label='Field Office'
                  name='fieldoffice'
                  value={state['fieldoffice']}
                  onChange={val => handleSelect('fieldoffice', val)}
                  options={createDropdownOptions(fieldOffices)}
                  isRequired
                />
              </div>
              <div className='col-2'>
                <Input 
                  label='Recorder' 
                  name='editInitials'
                  value={state['editInitials']}
                  onChange={handleChange}
                  isRequired
                />
              </div>
            </Row>
            <Row>
              <div className='col-3'>
                <SelectCustomLabel
                  label='Project'
                  name='projectId'
                  onChange={val => handleSelect('projectId', val)}
                  value={Number(state['projectId'])}
                  options={createDropdownOptions(projects)}
                  isRequired
                />
              </div>
              <div className='col-3'>
                <SelectCustomLabel
                  label='Season'
                  name='season'
                  onChange={val=> handleSelect('season', val)}
                  value={state['season']}
                  options={createDropdownOptions(seasons)}
                  isRequired
                />
              </div>
              <div className='col-3'>
                <SelectCustomLabel
                  label='Sample Unit Type'
                  name='sampleUnitType'
                  onChange={val => handleSelect('sampleUnitType', val)}
                  value={state['sampleUnitType']}
                  options={createDropdownOptions(sampleUnitTypes)}
                  isRequired
                />
              </div>
              <div className='col-3'>
                <FilterSelectCustomLabel
                  label='Sample Unit'
                  name='bend'
                  placeholder='Select bend...'
                  value={Number(state['bend'])}
                  onChange={(_, __, value) => handleSelect('bend', value)}
                  items={createBendsDropdownOptions(bends)}
                  isRequired
                />
              </div>
            </Row>
            <Row>
              <div className='col-6'>
                <FilterSelectCustomLabel
                  label='Segment'
                  name='segmentId'
                  placeholder='Select segment...'
                  value={state['segmentId']}
                  onChange={(_, __, value) => handleSelect('segmentId', value)}
                  items={createDropdownOptions(segments)}
                  isRequired
                />
              </div>
              <div className='col-6'>
                <SelectCustomLabel
                  label='Bend R/N'
                  name='bendrn'
                  onChange={val => handleSelect('bendrn', val)}
                  value={state['bendrn']}
                  options={createDropdownOptions(bendRn)}
                  isRequired
                />
              </div>
            </Row>
            <hr />
            <div className='d-flex justify-content-end'>
              <Button
                variant='secondary'
                text='Cancel'
                href='/sites-list'
              />
              <Button
                className='ml-2'
                variant='success'
                text='Create'
                handleClick={() => doPostNewSite(state)}
                isDisabled={saveIsDisabled}
              />
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }
);

export default CreateNewSite;
