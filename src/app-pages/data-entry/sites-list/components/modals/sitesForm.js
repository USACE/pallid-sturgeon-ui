import React, { useEffect, useReducer, useState } from 'react';
import { connect } from 'redux-bundler-react';
import ReactTooltip from 'react-tooltip';

import { ModalContent, ModalFooter, ModalHeader } from 'app-components/modal';
import { Input, Row, SelectCustomLabel, FilterSelectCustomLabel, TextArea } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';
import { createDropdownOptions, createBendsDropdownOptions, createCustomCodeDropdownOptions } from 'app-pages/data-entry/helpers';
import { fieldOfficeOptions, sampleUnitTypeProject1 } from '../_shared/helper';
import { dropdownYearsToNow } from 'utils';
import Icon from 'app-components/icon';

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
  'doDomainBendsFetch',
  'doDomainSeasonsFetch',
  'doDomainSegmentsFetch',
  'doPostNewSite',
  'doNewSiteLoadData',
  'doUpdateSite',
  'selectDomains',
  'selectSitesData',
  'selectUserRole',
  ({
    doDomainBendsFetch,
    doDomainSeasonsFetch,
    doDomainSegmentsFetch,
    doPostNewSite,
    doNewSiteLoadData,
    doUpdateSite,
    domains,
    sitesData,
    userRole,
    edit,
    id
  }) => {
    const { projects, seasons, bends, bendRn, segments, sampleUnitTypes } = domains;
    const [state, dispatch] = useReducer(reducer, {});

    const [office, setOffice] = useState(userRole ? userRole.officeCode : '');
    const [project, setProject] = useState(0);
    const [segment, setSegment] = useState(0);
    const [bend, setBend] = useState(null);
    const [sampleUnitType, setSampleUnitType] = useState('');

    const handleChange = e => {
      dispatch({
        type: 'UPDATE_INPUT',
        field: e.target.name,
        payload: e.target.value
      });
    };

    const handleSelect = (field, val) => {
      if (field==='segmentId') {
        setSegment(val);
      }
      if (field==='fieldoffice') {
        setOffice(val);
      }
      if (field==='bend') {
        setBend(val);
      }
      if (field==='projectId') {
        setProject(val);
      }
      if (field==='sampleUnitType') {
        setSampleUnitType(val);
      }
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
        doPostNewSite({ code: bend, sampleUnitType: sampleUnitType, segment: segment }, state);
      }
    };

    useEffect(() => {
      if (edit) {
        const filteredData = sitesData.filter(item => item.siteId === id);
        dispatch({
          type: 'INITIALIZE_FORM',
          payload: filteredData[0],
        });
      }
    }, [edit]);

    useEffect(() => {
      doNewSiteLoadData();
    }, [doNewSiteLoadData]);

    useEffect(() => {
      if (sampleUnitType !== 'S') {
        doDomainBendsFetch({ sampleUnitType: sampleUnitType, segment: segment });
      } else {
        handleSelect('bend', 0);
      }
    }, [sampleUnitType]);

    useEffect(() => {
      doDomainSegmentsFetch({ office: office });
    }, [office]);

    useEffect(() => {
      doDomainSeasonsFetch({ project: project });
    }, [project]);
    
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
                  defaultValue={new Date().getFullYear()}
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
                  defaultValue={office === 'ZZ' || office === '' ? '' : office}
                  value={state['fieldoffice']}
                  onChange={val => handleSelect('fieldoffice', val)}
                  options={fieldOfficeOptions}
                  isDisabled={userRole ? (userRole.role !== 'ADMINISTRATOR') : false}
                  isRequired
                />
              </div>
              <div className='col-6'>
                <SelectCustomLabel
                  label='Project'
                  name='projectId'
                  defaultValue={userRole ? (userRole.role === 'ADMINISTRATOR' ? '' : userRole.projectCode) : ''}
                  onChange={val => handleSelect('projectId', val)}
                  value={Number(state['projectId'])}
                  options={createDropdownOptions(projects)}
                  isDisabled={userRole ? (userRole.role !== 'ADMINISTRATOR') : false}
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
                  // handleInputChange={value => setSegmentFilter(value)}
                  onChange={(_, __, value) => handleSelect('segmentId', value)}
                  items={createDropdownOptions(segments)}
                  isRequired
                  helpIcon={(
                    <>
                      Two ways to select option:
                      <ol>
                        <li>Click on input box and select option from dropdown, or </li>
                        <li>Search for option by typing in the box.</li>
                      </ol>
                    </>
                  )}
                />
                
              </div>
              <div className='col-6'>
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
              <div className='col-4'>
                <SelectCustomLabel
                  label='Sample Unit Type'
                  name='sampleUnitType'
                  onChange={val => handleSelect('sampleUnitType', val)}
                  value={state['sampleUnitType']}
                  options={project === 1 ? sampleUnitTypeProject1 : createCustomCodeDropdownOptions(sampleUnitTypes)}
                  isRequired
                />
              </div>
              <div className='col-8'>
                <FilterSelectCustomLabel
                  label='Sample Unit'
                  name='bend'
                  placeholder='Select bend...'
                  value={(Number(state['bend']) || '')}
                  // handleInputChange={value => setBendFilter(value)}
                  onChange={(_, __, value) => handleSelect('bend', value)}
                  items={createBendsDropdownOptions(bends)}
                  isRequired={sampleUnitType !== 'S'}
                  isDisabled={sampleUnitType === 'S'}
                  helpIcon={(
                    <>
                      Two ways to select option:
                      <ol>
                        <li>Click on input box and select option from dropdown, or </li>
                        <li>Search for option by typing in the box.</li>
                      </ol>
                    </>
                  )}
                />
              </div>
            </Row>
            <Row>
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
                <Input name='editInitials' label='Recorder Initials' value={state['editInitials']} onChange={handleChange} isRequired={edit} />
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
