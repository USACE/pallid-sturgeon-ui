import React, { useEffect, useReducer } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import { Input, Row, SelectCustomLabel, TextArea } from './_shared/helper';
import { frequencyIdOptions, macroOptions, mesoOptions, positionConfidenceOptions } from './_shared/selectHelper';
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

const TelemetryForm = connect(
  'doFetchTelemetryDataEntry',
  'doSaveTelemetryDataEntry',
  'doUpdateTelemetryDataEntry',
  'doUpdateUrl',
  'selectDataEntryData',
  'selectDataEntryLastParams',
  'selectSitesData',
  ({
    doFetchTelemetryDataEntry,
    doSaveTelemetryDataEntry,
    doUpdateTelemetryDataEntry,
    doUpdateUrl,
    dataEntryData,
    dataEntryLastParams,
    sitesData,
    edit
  }) => {
    const initialState = {
      seId: dataEntryLastParams.seId
    };
    const [state, dispatch] = useReducer(reducer, initialState);
    const siteId = edit ? state['siteId'] : sitesData[0].siteId;

    const handleChange = (e) => {
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

    const handleNumber = e => {
      dispatch({
        type: 'UPDATE_INPUT',
        field: e.target.name,
        value: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
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
        doUpdateTelemetryDataEntry(state, doFetchTelemetryDataEntry({ seId: state['seId'] }, doUpdateUrl('/sites-list/datasheet/telemetry')));
      } else {
        doSaveTelemetryDataEntry(state, doFetchTelemetryDataEntry({ seId: state['seId'] }, doUpdateUrl('/sites-list/datasheet/telemetry')));
      }
    };

    const saveIsDisabled = !(
      !!state['radioTagNum'] &&
      !!state['frequencyIdCode'] &&
      !!state['captureDate'] &&
      !!state['captureLatitude'] &&
      !!state['captureLongitude'] &&
      !!state['positionConfidence'] &&
      (edit ? !!state['editInitials'] && !!state['lastEditComment'] : true)
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
            <h4>{edit ? 'Edit' : 'Create'} Telemetry Datasheet</h4>
          </div>
        </Row>
        {/* Top Level Info */}
        <DataHeader id={siteId} />
        {/* Approval */}
        {/* @TODO: include component props */}
        <Approval />
        {/* Form Fields */}
        <Card className='mt-3'>
          <Card.Header text='Telemetry Datasheet Form' />
          <Card.Body>
            <Row>
              <div className='col-2'>
                <Input name='bend' label='Bend' type='number' value={state['bend'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <Input name='radioTagNum' label='Radio Tag Number' type='number' value={state['radioTagNum'] || ''} onChange={handleNumber} isRequired />
              </div>
              <div className='col-2'>
                <SelectCustomLabel
                  name='frequencyIdCode'
                  label='Frequency ID'
                  value={Number(state['frequencyIdCode'])}
                  options={frequencyIdOptions}
                  onChange={val => handleSelect('frequencyIdCode', val)}
                  isRequired
                />
              </div>
              <div className='col-2'>
                <Input name='captureDate' label='Capture Time (hh:mm:ss)' value={state['captureDate']} onChange={handleChange} isRequired />
              </div>
              <div className='col-2'>
                <Input name='captureLatitude' label='Capture Latitude' type='number' value={state['captureLatitude'] || ''} placeholder='ex: 12.34567' onChange={handleFloat} isRequired />
              </div>
              <div className='col-2'>
                <Input name='captureLongitude' label='Capture Longitude' type='number' value={state['captureLongitude'] || ''} placeholder='ex: 12.34567' onChange={handleFloat} isRequired />
              </div>
            </Row>
            <Row>
              <div className='col-2'>
                <SelectCustomLabel
                  name='positionConfidence'
                  label='Position Confidence'
                  value={Number(state['positionConfidence'])}
                  options={positionConfidenceOptions}
                  onChange={val => handleSelect('positionConfidence', val)}
                  isRequired
                />
              </div>
              <div className='col-2'>
                <SelectCustomLabel
                  name='mesoId'
                  label='Meso'
                  value={state['mesoId']}
                  options={mesoOptions}
                  onChange={val => handleSelect('mesoId', val)}
                />
              </div>
              <div className='col-2'>
                <Input name='depth' label='Depth (m)' />
              </div>
              <div className='col-2'>
                <SelectCustomLabel
                  name='macroId'
                  label='Macro'
                  value={state['macroId']}
                  options={macroOptions}
                  onChange={val => handleSelect('macroId', val)}
                />
              </div>
              <div className='col-2'>
                <Input name='temp' label='Temp (c)' type='number' value={state['temp'] || ''} placeholder='ex: 12.1' onChange={handleFloat} />
              </div>
              <div className='col-2'>
                <Input name='conductivity' label='Conductivity' type='number' value={state['conductivity'] || ''} placeholder='max 4 digits' onChange={handleNumber} />
              </div>
            </Row>
            <Row>
              <div className='col-2'>
                <Input name='turbidity' label='Turbidity' type='number' value={state['turbidity'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <Input name='silt' label='Silt' type='number' value={state['silt'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <Input name='sand' label='Sand' type='number' value={state['sand'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <Input name='gravel' label='Gravel' type='number' value={state['gravel'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-4'>
                <TextArea name='comments' label='Comments' value={state['comments']} onChange={handleChange} />
              </div>
            </Row>
            <Row>
              <div className='col-5'>
                <TextArea name='lastEditComment' label='Edit Comments' value={state['lastEditComment']} onChange={handleChange} isRequired={edit} />
              </div>
              <div className='col-2'>
                <Input name='editInitials' label='Edit Initials' value={state['editInitials']} onChange={handleChange} isRequired={edit} />
              </div>
            </Row>
            <div className='row'>
              <div className='col-2 offset-10'>
                <div className='float-right'>
                  <Button
                    size='small'
                    variant='success'
                    text={edit ? 'Apply Changes' : 'Save'}
                    handleClick={() => doSave()}
                    isDisabled={saveIsDisabled}
                  />
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </>
    );
  }
);

export default TelemetryForm;