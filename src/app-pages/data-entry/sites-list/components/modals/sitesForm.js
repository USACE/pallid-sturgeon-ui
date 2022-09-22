import React, { useEffect, useReducer } from 'react';
import { connect } from 'redux-bundler-react';
import { ModalContent, ModalFooter, ModalHeader } from 'app-components/modal';

import { Input, Row, SelectCustomLabel, FilterSelectCustomLabel, TextArea } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';
import { createDropdownOptions, createBendsDropdownOptions } from 'app-pages/data-entry/helpers';
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

const SitesFormModal = connect(
  'doPostNewSite',
  'doNewSiteLoadData',
  'doUpdateSite',
  'selectDomains',
  'selectSitesData',
  ({
    doPostNewSite,
    doNewSiteLoadData,
    doUpdateSite,
    domains,
    sitesData,
    edit,
    id
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
      !!state['projectId'] &&
      !!state['segmentId'] &&
      !!state['sampleUnitType'] &&
      !!state['season'] &&
      !!state['bendrn'] &&
      (edit ? !!state['editInitials'] && !!state['last_edit_comment'] : true)
    );

    const doSave = () => {
      if (edit) {
        doUpdateSite(state);
      } else {
        doPostNewSite(state);
      }
    };

    useEffect(() => {
      doNewSiteLoadData();
    }, [doNewSiteLoadData]);

    useEffect(() => {
      if (edit) {
        const filteredData = sitesData.filter(item => item.siteId === id);
        dispatch({
          type: 'INITIALIZE_FORM',
          payload: filteredData[0],
        });
      }
    }, [edit]);

    return (
      <ModalContent size='lg'>
        <ModalHeader title={edit ? 'Update Site' : 'Create New Site'} />
        <section className='modal-body'>
          <div className='container-fluid'>
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
                  onChange={val => handleSelect('season', val)}
                  value={state['season']}
                  options={createDropdownOptions(seasons)}
                  isRequired
                />
              </div>
            </Row>
            <Row>
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
              <div className='col-9'>
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
            <Row>
              <div className='col-6'>
                <TextArea name='last_edit_comment' label='Comments' value={state['last_edit_comment']} onChange={handleChange} isRequired={edit} />
              </div>
              <div className='col-2'>
                <Input name='editInitials' label='Recorder' value={state['editInitials']} onChange={handleChange} isRequired={edit} />
              </div>
            </Row>
          </div>
        </section>
        <ModalFooter
          showCancelButton
          saveIsDisabled={saveIsDisabled}
          saveText={edit ? 'Apply Changes' : 'Save'}
          onSave={doSave}
        />
      </ModalContent>
    );
  }
);

export default SitesFormModal;
