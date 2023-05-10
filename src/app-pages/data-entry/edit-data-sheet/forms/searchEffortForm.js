import React, { useEffect, useReducer } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import DataHeader from 'app-pages/data-entry/datasheets/components/dataHeader';
import Approval from 'app-pages/data-entry/datasheets/components/approval';
import TabContainer from 'app-components/tab/tabContainer';
import TelemetryDsTable from 'app-pages/data-entry/datasheets/tables/telemetryDsTable';

import { Input, Row, SelectCustomLabel, TextArea } from './_shared/helper';
import { searchTypeOptions } from './_shared/selectHelper';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_INPUT':
      return {
        ...state,
        [action.field]: action.value,
      };
    case 'INITIALIZE_FORM':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

const SearchEffortForm = connect(
  'doSearchEffortDatasheetLoadData',
  'doFetchSearchDataEntry',
  'doSaveSearchDataEntry',
  'doUpdateSearchDataEntry',
  'doUpdateCurrentTab',
  'selectDataEntryData',
  'selectSitesData',
  'selectDataEntryTelemetryTotalCount',
  'selectCurrentTab',
  'selectUserRole',
  ({
    doSearchEffortDatasheetLoadData,
    doSaveSearchDataEntry,
    doUpdateSearchDataEntry,
    doUpdateCurrentTab,
    dataEntryData,
    sitesData,
    dataEntryTelemetryTotalCount,
    currentTab,
    userRole,
    edit
  }) => {
    const initialState = {};
    const [state, dispatch] = useReducer(reducer, initialState);
    const siteId = edit ? state['siteId'] : sitesData[0].siteId;

    const handleChange = e => {
      dispatch({
        type: 'UPDATE_INPUT',
        field: e.target.name,
        value: e.target.value
      });
    };

    const handleSelect = (field, val) => {
      dispatch({
        type: 'UPDATE_INPUT',
        field: field,
        value: val
      });
    };

    const handleFloat = e => {
      dispatch({
        type: 'UPDATE_INPUT',
        field: e.target.name,
        value: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
      });
    };

    const handleNumber = e => {
      dispatch({
        type: 'UPDATE_INPUT',
        field: e.target.name,
        value: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
      });
    };

    const doSave = () => {
      if (edit) {
        doUpdateSearchDataEntry(state);
      } else {
        doSaveSearchDataEntry(state);
      }
    };

    useEffect(() => {
      if (dataEntryData.seId) {
        doSearchEffortDatasheetLoadData(dataEntryData.seId);
      }
    }, [dataEntryData.seId]);

    const saveIsDisabled = !(
      !!state['searchDate'] &&
      !!state['recorder'] &&
      !!state['searchTypeCode'] &&
      !!state['startTime'] &&
      !!state['startLatitude'] &&
      !!state['startLongitude'] &&
      !!state['stopTime'] &&
      !!state['stopLatitude'] &&
      !!state['stopLongitude'] &&
      (edit ? !!state['editInitials'] && !!state['lastEditComment'] : true)
    );

    const formatDate = dateStr => {
      const subStr = 'T';
      if (dateStr.includes(subStr)) {
        return dateStr.split('T')[0];
      }
      return dateStr;
    };

    useEffect(() => {
      if (edit) {
        dispatch({
          type: 'INITIALIZE_FORM',
          payload: dataEntryData,
        });

        // Format Date
        if (dataEntryData.searchDate) {
          handleSelect('searchDate', formatDate(dataEntryData.searchDate));
        }
      } else {
        handleSelect('siteId', siteId);
        handleSelect('dsId', 1);
      }
    }, [edit, dataEntryData]);

    return (
      <>
        <Row>
          <div className='col-9'>
            <h4>{edit ? '' : 'Create'} Search Effort Datasheet {edit ? `Overview (ID: ${dataEntryData['seId']})` : ''}</h4>
          </div>
        </Row>
        {/* Top Level Info */}
        <DataHeader id={siteId} />
        {/* Approval */}
        {/* @TODO: include component props */}
        <Approval />
        {/* Form Fields */}
        <Card className='mt-3'>
          <Card.Header text='Search Effort and Related Data' />
          <Card.Body>
            <p>Select any tab to view Search Effort and Telemetry datasheet data for Search Effort ID: {dataEntryData.seId} </p>
            <TabContainer
              tabs={[
                {
                  title: 'Search Effort',
                  content: (
                    <>
                      <Row>
                        <div className='col-md-2 col-xs-12'>
                          <Input name='searchDate' label='Search Date' type='date' value={state['searchDate'] ? state['searchDate'].split('T')[0] : ''}  onChange={handleChange} isRequired />
                        </div>
                        <div className='col-md-2 col-xs-12'>
                          <Input name='recorder' label='Recorder Initials' value={state['recorder']} onChange={handleChange} isRequired />
                        </div>
                        <div className='col-md-2 col-xs-12'>
                          <SelectCustomLabel
                            name='searchTypeCode'
                            label='Search Type'
                            options={searchTypeOptions}
                            value={state['searchTypeCode']}
                            onChange={val => handleSelect('searchTypeCode', val)}
                            isRequired
                          />
                        </div>
                        <div className='col-md-2 col-xs-12'>
                          <Input name='temp' label='Temp (c)' type='number' value={state['temp'] || ''} onChange={handleFloat} />
                        </div>
                        <div className='col-md-2 col-xs-12'>
                          <Input name='conductivity' label='Conductivity' type='number' value={state['conductivity'] || ''} onChange={handleNumber} />
                        </div>
                      </Row>
                      <Row>
                        <div className='col-md-2 col-xs-12'>
                          <Input name='startTime' label='Start Time (hh:mm:ss)' value={state['startTime']} onChange={handleChange} isRequired />
                        </div>
                        <div className='col-md-2 col-xs-12'>
                          <Input name='startLatitude' type='number' label='Start Latitude' value={state['startLatitude'] || ''} placeholder='ex: 12.34567' onChange={handleFloat} isRequired />
                        </div>
                        <div className='col-md-2 col-xs-12'>
                          <Input name='startLongitude' type='number' label='Start Longitude' value={state['startLongitude'] || ''} placeholder='ex: 12.34567' onChange={handleFloat} isRequired />
                        </div>
                        <div className='col-md-2 col-xs-12'>
                          <Input name='stopTime' label='Stop Time (hh:mm:ss)' value={state['stopTime']} onChange={handleChange} isRequired />
                        </div>
                        <div className='col-md-2 col-xs-12'>
                          <Input name='stopLatitude' type='number' label='Stop Latitude' value={state['stopLatitude'] || ''} placeholder='ex: 12.34567' onChange={handleFloat} isRequired />
                        </div>
                        <div className='col-md-2 col-xs-12'>
                          <Input name='stopLongitude' type='number' label='Stop Longitude' value={state['stopLongitude'] || ''} placeholder='ex: 12.34567' onChange={handleFloat} isRequired />
                        </div>
                      </Row>
                      {edit && (<Row>
                        <div className='col-md-5 col-xs-12'>
                          <TextArea name='lastEditComment' label='Edit Comments' value={state['lastEditComment']} onChange={handleChange} isRequired={edit} />
                        </div>
                        <div className='col-md-2 col-xs-12'>
                          <Input name='editInitials' label='Edit Initials' value={state['editInitials']} onChange={handleChange} isRequired={edit} />
                        </div>
                      </Row>)}
                      <Row>
                        <div className='col-md-2 col-xs-12 offset-10'>
                          <div className='float-right'>
                            <Button
                              size='small'
                              variant='success'
                              text={edit ? 'Apply Changes' : 'Save'}
                              className='btn-width'
                              handleClick={() => doSave()}
                              isDisabled={saveIsDisabled}
                            />
                          </div>
                        </div>
                      </Row>
                    </>
                  ),
                },
                {
                  title: `Telemetry (${dataEntryTelemetryTotalCount})`,
                  content: (<><TelemetryDsTable /></>)
                }
              ]}
              onTabChange={(_str, ind) => doUpdateCurrentTab(ind)}
              defaultTab={currentTab}
            />
          </Card.Body>
        </Card>
      </>
    );
  }
);

export default SearchEffortForm;