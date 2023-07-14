import React, { useState, useEffect, useReducer, useRef } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import Card from 'app-components/card';
import Icon from 'app-components/icon';
import Button from 'app-components/button';
import { dropdownYearsToNow } from 'utils';
import { SelectCustomLabel, Input, Row } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';
import FilterSelect from 'app-components/filter-select/filter-select';
import { createDropdownOptions } from 'app-pages/data-entry/helpers';
import { officeGroups } from './helper';

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

export default connect(
  'doFetchLastLocationDataSummary',
  'doFetchLastLocationSummaryExport',
  'doLastLocationLoadData',
  'doUpdateLastLocationParams',
  'doDomainFieldOfficesFetch',
  'doDomainSegmentsFetch',
  'doFetchUsers',
  'selectDomains',
  'selectUserRole',
  'selectUsersData',
  'selectLastLocationSummaryData',
  ({
    doFetchLastLocationDataSummary,
    doFetchLastLocationSummaryExport,
    doLastLocationLoadData,
    doUpdateLastLocationParams,
    doDomainFieldOfficesFetch,
    doDomainSegmentsFetch,
    doFetchUsers,
    domains,
    userRole,
    usersData,
    lastLocationSummaryData,
  }) => {
    const { fieldOffices, segments } = domains;
    const [state, dispatch] = useReducer(reducer, {});
    const user = usersData.find(user => userRole.id === user.id);
    const [office, setOffice] = useState(user ? user.officeCode : '');
    const [project, setProject] = useState(user ? user.projectCode : '');

    const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
    const [daysToReaplce, setDaysToReaplce] = useState('');

    const [segment, setSegment] = useState(0);
    const segRef = useRef();
    const officeRef = useRef();

    const handleSelect = (field, val) => {
      if (field === 'segmentId') {
        setSegment(val);
      }
      if (field === 'fieldoffice') {
        setOffice(val);
      }
      dispatch({
        type: 'UPDATE_INPUT',
        field: field,
        payload: val
      });
    };

    useEffect(() => {
      const params = {
        // TODO: get the query params values from API?
        year: yearFilter,
        office: office,
        segment: segment,
        // TODO: daysToReplace
      };
      doUpdateLastLocationParams(params);
    }, [yearFilter, office, segment, doUpdateLastLocationParams]);

    useEffect(() => {
      doDomainFieldOfficesFetch();
      doFetchUsers();
      doDomainSegmentsFetch();
    }, []);

    useEffect(() => {
      if (office) {
        doDomainSegmentsFetch({ office: office, project: project });
      }
    }, [office]);

    useEffect(() => {
      doFetchLastLocationDataSummary();
    }, [yearFilter, office, segment, daysToReaplce]);

    useEffect(() => {
      doLastLocationLoadData();
    }, [doLastLocationLoadData]);

    const clearAllFilters = () => {
      setYearFilter('');
      officeRef.current.clear();
      segRef.current.clear();
      setDaysToReaplce('');
    };

    const filterSegment = () => {
      if (officeGroups.group1.includes(office)) {
        return segments.filter(object => object.code <= 4);
      } else if (officeGroups.group2.includes(office)) {
        return segments.filter(object => object.code >= 7);
      }
      else if (officeGroups.group1.includes(office)) {
        return segments;
      }
      return segments;
    };

    return (
      <div className='container-fluid'>
        <Card className='mb-3' >
          <Card.Header text='Location Filters' />
          <Card.Body>
            <div className='row'>
              <div className='col-md-3 col-xs-12'>
                <SelectCustomLabel
                  label='Select a Year'
                  placeholderText='Select a Year...'
                  className='d-block mt-1 mb-2'
                  onChange={val => setYearFilter(val)}
                  value={yearFilter}
                  options={dropdownYearsToNow(2002)}
                  defaultValue={new Date().getFullYear()}
                />
              </div>
              <div className='col-md-3 col-xs-12'>
                <FilterSelect
                  ref={officeRef}
                  label='Field Office'
                  name='fieldoffice'
                  defaultValue={office === 'ZZ' || office === '' ? '' : office}
                  value={state['fieldoffice']}
                  onChange={(_, __, value) => handleSelect('fieldoffice', value)}
                  items={createDropdownOptions(fieldOffices)}
                  hasClearButton
                />
              </div>
              <div className='col-md-3 col-xs-12'>
                <FilterSelect
                  ref={segRef}
                  label='Segment'
                  labelClassName='mr-2 mb-0 w-25'
                  placeholder='Select segment...'
                  value={state['segmentId']}
                  onChange={(_, __, value) => handleSelect('segmentId', value)}
                  items={createDropdownOptions(filterSegment(fieldOffices))}
                  hasClearButton
                />
              </div>
              <div className='col-md-3 col-xs-12'>
                <Row>
                  <span className='d-inline-block mr-1'> &lt; </span>
                  <div className='d-block mt-1 mb-2'>
                    <div className='form-group'>
                      <Input
                        label='Days to Replace'
                        type='number'
                        className='form-control'
                        value={daysToReaplce}
                        onChange={e => setDaysToReaplce(e.target.value)}
                      />
                    </div>
                  </div>
                </Row>
              </div>
            </div>
            <div className='mt-2'>
              <Button
                isOutline
                variant='info'
                size='small'
                className='mr-2'
                text='Apply Filters'
                handleClick={() => doLastLocationLoadData()}
              />
              <Button
                isOutline
                variant='secondary'
                size='small'
                text='Clear All Filters'
                handleClick={() => clearAllFilters()}
              />
            </div>
          </Card.Body>
        </Card>
        {/* Last Location Report */}
        <Card className='mt-3'>
          <Card.Header text='Last Location' />
          <Card.Body>
            <Button
              isOutline
              size='small'
              variant='info'
              className='mr-2'
              text='Export as CSV'
              icon={<Icon icon='download' />}
              handleClick={() => doFetchLastLocationSummaryExport('last-location-summary')}
              isDisabled={true}
            />
            <Button
              isOutline
              size='small'
              variant='info'
              className='mr-2'
              text='Export Spatial File'
              icon={<Icon icon='download' />}
              // TODO:handleClick={}
              isDisabled={true}
            />
            <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
              <AgGridReact
                // TODO:
                rowData={lastLocationSummaryData}
                defaultColDef={{
                  width: 150,
                }}
              >
                <AgGridColumn field='year' />
                <AgGridColumn field='fieldOffice' sortable unSortIcon />
                <AgGridColumn field='radioTagNum' headerName='Radio Tag #' />
                <AgGridColumn field='segment' />
                <AgGridColumn field='bend' />
                <AgGridColumn field='captureLatitude' />
                <AgGridColumn field='captureLongtitude' />
                <AgGridColumn field='searchDate' />
                <AgGridColumn field='captureTime' />
                <AgGridColumn field='captureDate' />
                <AgGridColumn field='daysToReplace' />
              </AgGridReact>
            </div>
          </Card.Body>
        </Card>
      </div >
    );
  }
);