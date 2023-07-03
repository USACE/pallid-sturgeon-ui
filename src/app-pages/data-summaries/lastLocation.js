import React, { useState, useEffect, useRef, useReducer } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import Button from 'app-components/button';
import Card from 'app-components/card';
import FilterSelect from 'app-components/filter-select/filter-select';
import Icon from 'app-components/icon';
import { dropdownYearsToNow } from 'utils';
import { fieldOfficeList } from '../../app-pages/admin/helper';
import { createDropdownOptions } from 'app-pages/data-entry/helpers';
import { SelectCustomLabel, Input, Row } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';

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

//TODO:
export default connect(
  'doUpdateDatasheetParams',
  'doDomainSegmentsFetch',
  'selectDomains',
  'selectUserRole',
  'selectUsersData',
  ({

    doUpdateDatasheetParams,
    doDomainSegmentsFetch,
    domains,
    userRole,
    usersData,
    lastLocationData,
  }) => {
    const { segments } = domains;
    console.log('dom:::', domains);
    const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

    const [fieldOffice, setFieldOffice] = useState('');

    const user = usersData.find(user => userRole.id === user.id);
    const [office, setOffice] = useState(user ? user.officeCode : '');
    const [segment, setSegment] = useState(0);
    const segRef = useRef();

    const [daysToReaplce, setDaysToReaplce] = useState('');
    const [state, dispatch] = useReducer(reducer, {});

    useEffect(() => {
      const params = {
        year: yearFilter,
        segmentCode: segment,
      };
      doUpdateDatasheetParams(params);
    }, [yearFilter, segment]);
    // TODO:
    // useEffect(() => {
    //   doDatasheetLoadData();
    //   doDataSummaryLoadData();
    // }, [doDatasheetLoadData, doDataSummaryLoadData]);

    const fieldOfficeOptions = Object.values(fieldOfficeList).map(value => ({
      value
    }));

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

    const clearAllFilters = () => {
      setYearFilter('');
      setFieldOffice('');
      setDaysToReaplce('');
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
                <SelectCustomLabel
                  label='Select Field Office'
                  className='d-block mt-1 mb-2'
                  value={fieldOffice}
                  onChange={val => setFieldOffice(val)}
                  defaultValue={'ALL'}
                  options={fieldOfficeOptions}
                />
              </div>
              <div className='col-md-3 col-xs-12'>
                {/* <SelectCustomLabel
                  label='Select Segment'
                  className='d-block mt-1 mb-2'
                  // TODO:
                  // onChange={}
                  // value={}
                  defaultValue={'ALL'}
                  options={[{ value: 'ALL' }]}
                /> */}
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
              //TODO:handleClick={() => doDataSummaryLoadData()}
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
            // TODO:handleClick={() => doFetchAllGeneticCardSummary('genetic-card-summary')}
            />
            <Button
              isOutline
              size='small'
              variant='info'
              className='mr-2'
              text='Export Spatial File'
              icon={<Icon icon='download' />}
            // TODO:handleClick={() => doFetchAllGeneticCardSummary('genetic-card-summary')}
            />
            <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
              <AgGridReact
                // TODO:
                rowData={lastLocationData}
                defaultColDef={{
                  width: 150,
                }}
              >
                <AgGridColumn field='year' />
                <AgGridColumn field='fieldOffice' sortable unSortIcon />
                <AgGridColumn field='radioTag #' />
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