import React, { useEffect, useReducer } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import { Input, Row, SelectCustomLabel, TextArea } from './_shared/helper';
import { searchTypeOptions } from './_shared/selectHelper';
import DataHeader from 'app-pages/data-entry/datasheets/components/dataHeader';
import Approval from 'app-pages/data-entry/datasheets/components/approval';

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

// 1046 for testing

const SearchEffortForm = connect(
  'doSaveSearchDataEntry',
  'doUpdateSearchDataEntry',
  'selectDataEntryData',
  'selectSitesData',
  ({
    doSaveSearchDataEntry,
    doUpdateSearchDataEntry,
    dataEntryData,
    sitesData,
    edit
  }) => {
    const initialState = {
      dsId: 123123
    };
    const [state, dispatch] = useReducer(reducer, initialState);
    const data = sitesData[0];

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

    const doSave = () => {
      if (edit) {
        doUpdateSearchDataEntry(state);
      } else {
        doSaveSearchDataEntry(state);
      }
    };

    const saveIsDisabled = !(
      // !!state['searchDate'] &&
      !!state['recorder'] &&
      !!state['searchTypeCode'] &&
      !!state['startTime'] &&
      !!state['startLatitude'] &&
      !!state['startLongitude'] &&
      !!state['stopTime'] &&
      !!state['stopLatitude'] &&
      !!state['stopLongitude'] 
    );

    useEffect(() => {
      if (edit) {
        dispatch({
          type: 'INITIALIZE_FORM',
          payload: dataEntryData,
        });
      }
    }, [edit, dataEntryData]);

    return (
      <>
        <Row>
          <div className='col-9'>
            <h4>{edit ? 'Edit' : 'Create'} Search Effort Datasheet</h4>
          </div>
        </Row>
        {/* Top Level Info */}
        {/* TO DO: include component props */}
        <DataHeader 
          type='Site'
          id={data ? data.siteId : state['siteId']}
        />
        {/* Approval */}
        {/* TO DO: include component props */}
        <Approval />
        {/* Form Fields */}
        <Card className='mt-3'>
          <Card.Header text='Search Effort Datasheet Form' />
          <Card.Body>
            <Row>
              <div className='col-2'>
                <Input name='searchDate' label='Search Date' type='date' value={state['searchDate'] ? state['searchDate'].split('T')[0] : ''}  onChange={handleChange} isRequired isDisabled />
              </div>
              <div className='col-2'>
                <Input name='recorder' label='Recorder Initials' value={state['recorder']} onChange={handleChange} isRequired />
              </div>
              <div className='col-2'>
                <SelectCustomLabel
                  name='searchTypeCode'
                  label='Search Type'
                  options={searchTypeOptions}
                  value={state['searchTypeCode']}
                  onChange={val => handleSelect('searchTypeCode', val)}
                  isRequired
                />
              </div>
              <div className='col-2'>
                <Input name='temp' label='Temp (C)' value={state['temp']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='conductivity' label='Conductivity' value={state['conductivity']} onChange={handleChange} />
              </div>
            </Row>
            <Row>
              <div className='col-2'>
                <Input name='startTime' label='Start Time' value={state['startTime']} onChange={handleChange} isRequired />
              </div>
              <div className='col-2'>
                <Input name='startLatitude' type='number' label='Start Latitude' value={state['startLatitude'] || ''} onChange={handleFloat} isRequired />
              </div>
              <div className='col-2'>
                <Input name='startLongitude' type='number' label='Start Longitude' value={state['startLongitude'] || ''} onChange={handleFloat} isRequired />
              </div>
              <div className='col-2'>
                <Input name='stopTime' label='Stop Time' value={state['stopTime']} onChange={handleChange} isRequired />
              </div>
              <div className='col-2'>
                <Input name='stopLatitude' type='number' label='Stop Latitude' value={state['stopLatitude'] || ''} onChange={handleFloat} isRequired />
              </div>
              <div className='col-2'>
                <Input name='stopLongitude' type='number' label='Stop Longitude' value={state['stopLongitude'] || ''} onChange={handleFloat} isRequired />
              </div>
            </Row>
            {edit && (<Row>
              <div className='col-5'>
                <TextArea name='editComments' label='Edit Comments' value={state['lastEditComment']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='editInitials' label='Edit Initials' value={state['editInitials']} onChange={handleChange} />
              </div>
            </Row>)}
            <Row>
              <div className='col-2 offset-10'>
                <div className='float-right'>
                  <Button
                    isOutline
                    size='small'
                    className='mr-2'
                    variant='secondary'
                    text='Cancel'
                  // href='/find-data-sheet'
                  />
                  <Button
                    size='small'
                    variant='success'
                    text={edit ? 'Apply Changes' : 'Save'}
                    handleClick={() => doSave()}
                    isDisabled={saveIsDisabled}
                  />
                </div>
              </div>
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  }
);

export default SearchEffortForm;