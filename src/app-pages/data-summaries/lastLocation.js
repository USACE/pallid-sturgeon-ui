import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import Card from 'app-components/card';
import Icon from 'app-components/icon';
import Button from 'app-components/button';
import { dropdownYearsToNow } from 'utils';
import { SelectCustomLabel, Input, Row } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';

//TODO:
export default connect(
  'doUpdateDatasheetParams',
  ({

    doUpdateDatasheetParams,
    lastLocationData,
  }) => {
    const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

    useEffect(() => {
      const params = {
        year: yearFilter,
      };
      doUpdateDatasheetParams(params);
    }, [yearFilter]);
    // TODO:
    // useEffect(() => {
    //   doDatasheetLoadData();
    //   doDataSummaryLoadData();
    // }, [doDatasheetLoadData, doDataSummaryLoadData]);

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
                  // TODO:onChange={val => setApprovalFilter(val)}
                  // TODO:value={approvalFilter}
                  options={[
                    { value: 0, text: 'All' },
                  ]}
                  defaultValue={'All'}
                //TODO:options={createFieldOfficeIdDropdownOptions(domainsFieldOffices)}                  
                />
              </div>
              <div className='col-md-3 col-xs-12'>
                <SelectCustomLabel
                  label='Select Segment'
                  className='d-block mt-1 mb-2'
                  // TODO:onChange={}
                  // TODO:value={}
                  options={[
                  ]}
                  defaultValue={''}
                //TODO:options={}                  
                />
              </div>
              <div className='col-md-3 col-xs-12'>
                <Row>
                  <span className='d-inline-block mr-1'> &lt; </span>
                  <div className='d-block mt-1 mb-2'>
                    <div className='form-group'>
                      <Input
                        label='Days to Replace'
                        type='text'
                        className='form-control'
                        placeholder=''
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
              //TODO:handleClick={() => clearAllFilters()}
              />
            </div>
          </Card.Body>
        </Card>
        {/* Last Location Report */}
        <Card className='mt-3'>
          <Card.Header text='Last Location Report' />
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