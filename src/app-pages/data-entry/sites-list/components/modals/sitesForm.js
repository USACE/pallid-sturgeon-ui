import React, { useEffect, useReducer, useState, useRef } from 'react';
import { connect } from 'redux-bundler-react';

import FilterSelect from 'app-components/filter-select/filter-select';
import { ModalContent, ModalFooter, ModalHeader } from 'app-components/modal';
import { Input, Row, SelectCustomLabel, TextArea } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';
import { createDropdownOptions, createBendsDropdownOptions, createCustomCodeDropdownOptions } from 'app-pages/data-entry/helpers';
import { sampleUnitTypeProject1 } from '../_shared/helper';
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
  'doDomainBendsFetch',
  'doDomainBendRnFetch',
  'doDomainFieldOfficesFetch',
  'doDomainSeasonsFetch',
  'doDomainSegmentsFetch',
  'doFetchUsers',
  'doPostNewSite',
  'doUpdateSite',
  'selectDomains',
  'selectSitesData',
  'selectUserRole',
  'selectUsersData',
  ({
    doDomainBendsFetch,
    doDomainBendRnFetch,
    doDomainFieldOfficesFetch,
    doDomainSeasonsFetch,
    doDomainSegmentsFetch,
    doFetchUsers,
    doPostNewSite,
    doUpdateSite,
    domains,
    sitesData,
    userRole,
    usersData,
    edit,
    id
  }) => {
    const { fieldOffices, projects, seasons, bends, bendRn, segments, sampleUnitTypes } = domains;
    const [state, dispatch] = useReducer(reducer, {});

    const user = usersData.find(user => userRole.id === user.id);

    const [office, setOffice] = useState(user ? user.officeCode : '');
    const [project, setProject] = useState(user ? user.projectCode : '');
    const [sampleUnitType, setSampleUnitType] = useState('');

    const [segment, setSegment] = useState(0);
    const segRef = useRef();

    const [bend, setBend] = useState(null);
    const bendRef = useRef();

    const handleChange = e => {
      dispatch({
        type: 'UPDATE_INPUT',
        field: e.target.name,
        payload: e.target.value
      });
    };

    const handleSelect = (field, val) => {
      if (field === 'segmentId') {
        setSegment(val);
      }
      if (field === 'fieldoffice') {
        setOffice(val);
      }
      if (field === 'bend') {
        setBend(val);
      }
      if (field === 'projectId') {
        setProject(val);
      }
      if (field === 'sampleUnitType') {
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

    const clearSegments = () => {
      segRef.current.clear();
    };

    const clearSampleUnit = () => {
      bendRef.current.clear();
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
      doDomainFieldOfficesFetch();
      doDomainBendRnFetch();
      doFetchUsers();
    }, []);

    useEffect(() => {
      clearSampleUnit();
      if (segment && sampleUnitType) {
        doDomainBendsFetch({ sampleUnitType: sampleUnitType, segment: segment });
      }
    }, [segment, sampleUnitType]);

    useEffect(() => {
      clearSegments();
      clearSampleUnit();
      if (office && project) {
        doDomainSegmentsFetch();
      }
    }, [office, project]);

    useEffect(() => {
      doDomainSeasonsFetch();
    }, []);

    return (
      <ModalContent size='lg'>
        <ModalHeader title={edit ? 'Update Site' : 'Create New Site'} />
        <section className='modal-body'>
          <div className='container-fluid'>
            {!edit && (
              <>
                <p>Please complete the following fields to create a new site.</p>
                <p><b>Note:</b> Some dropdown options are dependent from other fields.</p>
              </>
            )}
            <Row>
              <div className='col-md-2 col-xs-12'>
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
              <div className='col-md-4 col-xs-12'>
                <SelectCustomLabel
                  label='Field Office'
                  name='fieldoffice'
                  defaultValue={office === 'ZZ' || office === '' ? '' : office}
                  value={state['fieldoffice']}
                  onChange={val => handleSelect('fieldoffice', val)}
                  options={createDropdownOptions(fieldOffices)}
                  isLoading={fieldOffices && (fieldOffices.length === 0)}
                  isDisabled={user ? (user.role !== 'ADMINISTRATOR') : false}
                  isRequired
                />
              </div>
              <div className='col-md-6 col-xs-12'>
                <SelectCustomLabel
                  label='Project'
                  name='projectId'
                  defaultValue={user ? user.projectCode : ''}
                  onChange={val => handleSelect('projectId', val)}
                  value={Number(state['projectId'])}
                  options={createDropdownOptions(projects)}
                  isLoading={projects && (projects.length === 0)}
                  isDisabled={user ? (user.role !== 'ADMINISTRATOR') : false}
                  isRequired
                />
              </div>
            </Row>
            <Row>
              <div className='col-md-6 col-xs-12'>
                <FilterSelect
                  ref={segRef}
                  label='Segment'
                  labelClassName='mr-2 mb-0 w-25'
                  placeholder='Select segment...'
                  value={state['segmentId']}
                  onChange={(_, __, value) => handleSelect('segmentId', value)}
                  items={createDropdownOptions(segments)}
                  hasHelperIcon
                  helperIconId='segment'
                  helperContent={(
                    <>
                      Must select <b>Field Office</b> and <b>Project</b> to see Segment options. <br></br>
                      Two ways to select option:
                      <ol>
                        <li>Click on input box and select option from dropdown, or </li>
                        <li>Search for option by typing in the box.</li>
                      </ol>
                      Click the 'x' button to clear the input field.
                    </>
                  )}
                  hasClearButton
                  isDisabled={!office}
                  isLoading={segments && (segments.length === 0)}
                  isRequired
                />
              </div>
              <div className='col-md-6 col-xs-12'>
                <SelectCustomLabel
                  label='Season'
                  name='season'
                  onChange={val => handleSelect('season', val)}
                  value={state['season']}
                  options={createDropdownOptions(seasons)}
                  hasHelperIcon
                  helperIconId='season'
                  helperContent={(
                    <>
                      Must select <b>Project</b> to see Season options.
                    </>
                  )}
                  isLoading={seasons && (seasons.length === 0)}
                  isRequired
                />
              </div>
            </Row>
            <Row>
              <div className='col-md-4 col-xs-12'>
                <SelectCustomLabel
                  label='Sample Unit Type'
                  name='sampleUnitType'
                  onChange={val => handleSelect('sampleUnitType', val)}
                  value={state['sampleUnitType']}
                  options={project === 1 ? sampleUnitTypeProject1 : createCustomCodeDropdownOptions(sampleUnitTypes)}
                  hasHelperIcon
                  helperIconId='sampleUnitType'
                  helperContent={(
                    <>
                      Must select <b>Project</b> to see Sample Unit Type options. <br></br>
                    </>
                  )}
                  isRequired
                />
              </div>
              <div className='col-md-8 col-xs-12'>
                <FilterSelect
                  ref={bendRef}
                  label='Sample Unit'
                  placeholder='Select sample unit...'
                  value={state['bend']}
                  onChange={(_, __, value) => handleSelect('bend', value)}
                  items={createBendsDropdownOptions(bends)}
                  hasHelperIcon
                  helperIconId='sampleUnit'
                  helperContent={(
                    <>
                      Must select <b>Segment</b> and <b>Sample Unit Type</b> to see Sample Unit options. <br></br>
                      Two ways to select option:
                      <ol>
                        <li>Click on input box and select option from dropdown, or </li>
                        <li>Search for option by typing in the box.</li>
                      </ol>
                      Click the 'x' button to clear the input field.
                    </>
                  )}
                  hasClearButton
                  isRequired={bend !== 0}
                />
              </div>
            </Row>
            <Row>
              <div className='col-md-6 col-xs-12'>
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
              <div className='col-md-6 col-xs-12'>
                <TextArea name='last_edit_comment' label='Comments' value={state['last_edit_comment']} onChange={handleChange} isRequired={edit} />
              </div>
              <div className='col-md-2 col-xs-12'>
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