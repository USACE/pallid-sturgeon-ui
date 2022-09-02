import React, { useEffect, useReducer, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import DataHeader from 'app-pages/data-entry/datasheets/components/dataHeader';
import { gearCodeOptions, macroOptions, mesoOptions, microStructureOptions, setSite_1_2Options, setSite_3Options, u7Options } from './_shared/selectHelper';
import { Input, Row, SelectCustomLabel, TextArea } from './_shared/helper';
import Approval from 'app-pages/data-entry/datasheets/components/approval';

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

// 11847 for testing

const MissouriRiverForm = connect(
  'doSaveMoRiverDataEntry',
  'doUpdateMoRiverDataEntry',
  // 'doDataEntrySetActiveType',
  'selectDataEntryData',
  ({
    doSaveMoRiverDataEntry,
    doUpdateMoRiverDataEntry,
    // doDataEntrySetActiveType,
    dataEntryData,
    edit,
  }) => {
    const [isNoTurbidity, setIsNoTurbidity] = useState(false);
    const [isNoVelocity, setIsNoVelocity] = useState(false);
    const initialState = { 
      noTurbidity: 'N', noVelocity: 'N'
    };
    const [state, dispatch] = useReducer(reducer, initialState);
    const formComplete = true;

    const handleChange = e => {
      dispatch({
        type: 'UPDATE_INPUT',
        field: e.target.name,
        payload: e.target.value
      });
    };

    const handleNumber = e => {
      dispatch({
        type: 'UPDATE_INPUT',
        field: e.target.name,
        payload: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
      });
    };

    const handleFloat = e => {
      dispatch({
        type: 'UPDATE_INPUT',
        field: e.target.name,
        payload: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
      });
    };

    const handleSelect = (field, val) => {
      if (field === 'noTurbidity') {
        setIsNoTurbidity(val);
      }
      if (field === 'noVelocity') {
        setIsNoVelocity(val);
      }
      dispatch({
        type: 'UPDATE_INPUT',
        field: field,
        payload: field === 'noTurbidity' || field === 'noVelocity' ? (val === true ? 'Y' : 'N') : val
      });
    };

    const doSave = () => {
      if (edit) {
        doUpdateMoRiverDataEntry(state);
      } else {
        doSaveMoRiverDataEntry(state);
      }
    };

    const saveIsDisabled = !(
      // !!state['setdate'] &&
      !!state['subsample'] &&
      !!state['subsamplepass'] &&
      !!state['subsamplen'] &&
      !!state['gearType'] &&
      !!state['recorder'] &&
      !!state['macro'] &&
      !!state['meso'] &&
      !!state['temp'] &&
      !!state['startTime'] &&
      !!state['startLatitude'] &&
      !!state['startLongitude']
    );

    useEffect(() => {
      if (edit) {
        dispatch({
          type: 'INITIALIZE_FORM',
          payload: dataEntryData,
        });
        if (dataEntryData['noTurbidity']) {
          setIsNoTurbidity(dataEntryData['noTurbidity']);
        }
        if (dataEntryData['noVelocity']) {
          setIsNoVelocity(dataEntryData['noVelocity']);
        } 
      }
    }, [edit, dataEntryData]);

    return (
      <>
        <div className='row'>
          <div className='col-9'>
            <h4>{edit ? 'Edit' : 'Create'} Missouri River Datasheet</h4>
          </div>
        </div>
        {/* Top Level Info */}
        {/* TO DO: where is the data derived from? From the associated site? */}
        <DataHeader />
        {/* Approval */}
        {/* TO DO: include component props */}
        <Approval />
        {/* Form Fields */}
        <Card className='mt-3'>
          <Card.Header text='Missouri River Datasheet Form' />
          <Card.Body>
            <Row>
              <div className='col-2'>
                <Input label='Setdate' name='setdate' type='date' value={state['setdate'] ? state['setdate'].split('T')[0] : ''} onChange={handleChange} isDisabled={!formComplete}  isRequired />
              </div>
              <div className='col-1'>
                <Input label='Subsample' name='subsample' type='number' value={state['subsample'] || ''} onChange={handleNumber} isDisabled={!formComplete} maxlength='3' isRequired />
              </div>
              <div className='col-1'>
                <Input label='Pass' name='subsamplepass' type='number' value={state['subsamplepass'] || ''} onChange={handleNumber} isDisabled={!formComplete} isRequired  />
              </div>
              <div className='col-2'>
                <SelectCustomLabel
                  label='R/N'
                  name='subsamplen'
                  value={state['subsamplen']}
                  onChange={val => handleSelect('subsamplen', val)}
                  options={[
                    { value: 'R' },
                    { value: 'N' },
                  ]}
                  isDisabled={!formComplete}
                  isRequired
                />
              </div>
              <div className='col-2'>
                <SelectCustomLabel
                  label='Gear Type'
                  name='gearType'
                  value={state['gearType']}
                  defaultValue='S'
                  onChange={val => handleSelect('gearType', val)}
                  options={[
                    { value: 'E' },
                    { value: 'S' },
                    { value: 'W' },
                  ]}
                  isDisabled={!formComplete}
                  isRequired
                />
              </div>
              <div className='col-2'>
                <SelectCustomLabel
                  label='Gear Code'
                  name='gearCode'
                  value={state['gearCode']}
                  onChange={val => handleSelect('gearCode', val)}
                  options={gearCodeOptions}
                  isDisabled={!formComplete}
                />
              </div>
              <div className='col-1'>
                <Input label='Recorder' name='recorder' value={state['recorder']} onChange={handleChange} isDisabled={!formComplete} isRequired />
              </div>
            </Row>
            <Row>
              <div className='col-4 pb-3' style={{ borderRight: '1px solid lightgray' }}>
                <Row>
                  <div className='col-6'>
                    <SelectCustomLabel
                      label='Macro'
                      name='macro'
                      value={state['macro']}
                      onChange={val => handleSelect('macro', val)}
                      options={macroOptions}
                      isDisabled={!formComplete}
                      isRequired
                    />
                  </div>
                  <div className='col-6'>
                    <SelectCustomLabel
                      label='Meso'
                      name='meso'
                      value={state['meso']}
                      onChange={val => handleSelect('meso', val)}
                      options={mesoOptions}
                      isDisabled={!formComplete}
                      isRequired
                    />
                  </div>
                </Row>
                <Row className='mt-2'>
                  <div className='col-6'>
                    <Input label='Temp (c)' name='temp' type='number' step={0.1} value={state['temp'] || ''} onChange={handleFloat} isDisabled={!formComplete} isRequired />
                  </div>
                  <div className='col-6'>
                    <Input label='Width' name='width' type='number' step={0.1} value={state['width'] || ''} onChange={handleFloat} isDisabled={!formComplete} />
                  </div>
                </Row>
              </div>
              <div className='col-8 pb-3'>
                <Row>
                  <div className='col-3'>
                    {/* this field is a calculated field? */}
                    <Input label='Micro' name='micro' value={state['micro']} onChange={handleChange} isDisabled={!formComplete} />
                  </div>
                  <div className='col-3'>
                    <SelectCustomLabel
                      label='Micro Structure'
                      name='microStructure'
                      value={state['microStructure']}
                      onChange={val => handleSelect('microStructure', val)}
                      options={microStructureOptions}
                      isDisabled={!formComplete}
                    />
                  </div>
                  <div className='col-3'>
                    <SelectCustomLabel
                      label='Structure Flow'
                      name='structureFlow'
                      value={state['structureFlow']}
                      onChange={val => handleSelect('structureFlow', val)}
                      options={[
                        { value: 0, text: '0' },
                        { value: 1, text: 'Dry' },
                        { value: 2, text: 'Partial' },
                        { value: 3, text: 'Overflowing' },
                      ]}
                      isDisabled={!formComplete}
                    />
                  </div>
                  <div className='col-3'>
                    <SelectCustomLabel
                      label='Structure Mod'
                      name='structureMod'
                      value={state['structureMod']}
                      onChange={val => handleSelect('structureMod', val)}
                      options={[
                        { value: 0, text: '0' },
                        { value: 1, text: 'Unnotched' },
                        { value: 2, text: 'Bank Notch' },
                        { value: 3, text: 'Top Notch' },
                        { value: 4, text: 'Side Notch' },
                        // 5 & 6 ?
                        { value: 7, text: 'Bank & Top Notch' },
                        { value: 8, text: 'Bank & Side Notch' },
                        { value: 9, text: 'Notch (Undefined)' },
                      ]}
                      isDisabled={!formComplete}
                    />
                  </div>
                </Row>
                <Row>
                  <div className='col-3 offset-3'>
                    <SelectCustomLabel
                      label='Set Site 1'
                      name='setSite1'
                      value={state['setSite1']}
                      onChange={val => handleSelect('setSite1', val)}
                      options={setSite_1_2Options}
                      isDisabled={!formComplete}
                    />
                  </div>
                  <div className='col-3'>
                    <SelectCustomLabel
                      label='Set Site 2'
                      name='setSite2'
                      value={state['setSite2']}
                      onChange={val => handleSelect('setSite2', val)}
                      options={setSite_1_2Options}
                      isDisabled={!formComplete}
                    />
                  </div>
                  <div className='col-3'>
                    <SelectCustomLabel
                      label='Set Site 3'
                      name='setSite3'
                      value={state['setSite3']}
                      onChange={val => handleSelect('setSite3', val)}
                      options={setSite_3Options}
                      isDisabled={!formComplete}
                    />
                  </div>
                </Row>
              </div>
            </Row>

            <Row>
              <div className='col-5 pb-3' style={{ borderRight: '1px solid lightgray' }}>
                <Row>
                  <div className='col-4'>
                    <Input label='Start Time' name='startTime' value={state['startTime']} onChange={handleChange} isDisabled={!formComplete} isRequired />
                  </div>
                  <div className='col-4'>
                    <Input label='Start Latitude' name='startLatitude' type='number' value={state['startLatitude'] || ''} onChange={handleNumber} isDisabled={!formComplete} isRequired />
                  </div>
                  <div className='col-4'>
                    <Input label='Start Longitude' name='startLongitude' type='number' value={state['startLongitude'] || ''} onChange={handleNumber} isDisabled={!formComplete} isRequired />
                  </div>
                </Row>
                <Row>
                  <div className='col-3'>
                    <Input label='Distance (m)' name='distance' type='number' value={state['distance'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                  <div className='col-3'>
                    <Input label='Depth (m)' name='depth1' type='number' step={0.1} value={state['depth1'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                  <div className='col-3'>
                    <Input label=' ' name='depth2' type='number' step={0.1} value={state['depth2'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                  <div className='col-3'>
                    <Input label=' ' name='depth13' type='number' step={0.1} value={state['depth3'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                </Row>
                <Row className='mt-2'>
                  <div className='col-4'>
                    <Input label='Stop Time' name='stopTime' value={state['stopTime']} onChange={handleChange} isDisabled={!formComplete} />
                  </div>
                  <div className='col-4'>
                    <Input label='Stop Latitude' name='stopLatitude' type='number' value={state['stopLatitude'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                  <div className='col-4'>
                    <Input label='Stop Longitude' name='stopLongitude' type='number' value={state['stopLongitude'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                </Row>
              </div>
              <div className='col-7 pb-3'>
                <Row className='no-gutters'>
                  <div className='col-1 mr-2'>
                    <Input label='U1' name='u1' value={state['u1']} onChange={handleChange} isDisabled={!formComplete} />
                  </div>
                  <div className='col-1 mr-2'>
                    <Input label='U2' name='u2' value={state['u2']} onChange={handleChange} isDisabled={!formComplete} />
                  </div>
                  <div className='col-1 mr-2'>
                    <Input label='U3' name='u3' value={state['u3']} onChange={handleChange} isDisabled={!formComplete} />
                  </div>
                  <div className='col-1 mr-2'>
                    <Input label='U4' name='u4' value={state['u4']} onChange={handleChange} isDisabled={!formComplete} />
                  </div>
                  <div className='col-2 mr-2'>
                    <Input label='U5' name='u5' value={state['u5']} onChange={handleChange} isDisabled={!formComplete} />
                  </div>
                  <div className='col-2 mr-2'>
                    <SelectCustomLabel
                      label='U6'
                      name='u6'
                      value={state['u6']}
                      onChange={val => handleSelect('u6', val)}
                      options={[
                        { value: 'MNCF' },
                        { value: 'NSTS' },
                      ]}
                      isDisabled={!formComplete}
                    />
                  </div>
                  <div className='col-3'>
                    <SelectCustomLabel
                      label='U7'
                      name='u7'
                      value={state['u7']}
                      onChange={val => handleSelect('u7', val)}
                      options={u7Options}
                      isDisabled={!formComplete}
                    />
                  </div>
                </Row>
                <Row>
                  <div className='col-3'>
                    <Input label='Structure Number' name='structurenumber' value={state['structurenumber']} onChange={handleChange} isDisabled={!formComplete} />
                  </div>
                  <div className='col-3'>
                    <Input label='Net River Mile' name='netrivermile' type='number' step={0.1} value={state['netrivermile'] || ''} onChange={handleFloat} isDisabled={!formComplete} />
                  </div>
                  <div className='col-3'>
                    <Input label='Conductivity' name='conductivity' type='number' value={state['conductivity'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                  <div className='col-3'>
                    <Input label='D.O.' name='do' type='number' step={0.1} value={state['do'] || ''} onChange={handleFloat} isDisabled={!formComplete} />
                  </div>
                </Row>
                <Row>
                  <div className='col-3'>
                    <Input label='USGS Gauge Code' name='usgs' value={state['usgs']} onChange={handleChange} isDisabled={!formComplete} />
                  </div>
                  <div className='col-3'>
                    <Input label='River Stage' name='riverstage' type='number' step={0.1} value={state['riverstage'] || ''} onChange={handleFloat} isDisabled={!formComplete} />
                  </div>
                  <div className='col-3'>
                    <Input label='Discharge' name='discharge' type='number' value={state['discharge'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                </Row>
              </div>
            </Row>

            <Row>
              <div className='col-5'>
                <Row>
                  <div className='col-5'>
                    <SelectCustomLabel
                      label='Habitat R/N'
                      name='habitatrn'
                      value={state['habitatrn']}
                      onChange={val => handleSelect('habitatrn', val)}
                      options={[
                        { value: 'R', text: 'Random' },
                        { value: 'N', text: 'Non-random' },
                      ]}
                      isDisabled={!formComplete}
                    />
                  </div>
                  <div className='col-3'>
                    <Input label='Turbidity' name='turbidity' type='number' value={state['turbidity'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                  <div className='col-4 text-center'>
                    <label><small>No Turbidity</small></label>
                    <input
                      name='noTurbidity'
                      type='checkbox'
                      title='No Turbidity Field'
                      className='form-control mt-1'
                      style={{ height: '15px', width: '15px', margin: 'auto' }}
                      checked={isNoTurbidity}
                      onChange={() => handleSelect('noTurbidity', !isNoTurbidity)}
                      disabled={!formComplete}
                    />
                  </div>
                </Row>
              </div>
              <div className='col-7'>
                <Row>
                  <div className='col-2 text-right mt-1'>
                    <label><small>Cobble</small></label>
                  </div>
                  <div className='col-4'>
                    <SelectCustomLabel
                      name='cobble'
                      value={state['cobble']}
                      defaultValue={0}
                      onChange={val => handleSelect('cobble', parseInt(val))}
                      options={[
                        { value: 0, text: 'None' },
                        { value: 1, text: 'Incidental' },
                        { value: 2, text: 'Dominant' },
                        { value: 3, text: 'Ubiquitous' },
                      ]}
                      isDisabled={!formComplete}
                    />
                  </div>
                  <div className='col-2 text-right mt-1'>
                    <label><small>Silt (%)</small></label>
                  </div>
                  <div className='col-4'>
                    <Input name='silt' type='number' value={state['silt'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                </Row>
                <Row className='mt-2'>
                  <div className='col-2 text-right mt-1'>
                    <label><small>Organic</small></label>
                  </div>
                  <div className='col-4'>
                    <SelectCustomLabel
                      name='organic'
                      value={state['organic']}
                      defaultValue={0}
                      onChange={val => handleSelect('organic', parseInt(val))}
                      options={[
                        { value: 0, text: 'None' },
                        { value: 1, text: 'Incidental' },
                        { value: 2, text: 'Dominant' },
                        { value: 3, text: 'Ubiquitous' },
                      ]}
                      isDisabled={!formComplete}
                    />
                  </div>
                  <div className='col-2 text-right mt-1'>
                    <label><small>Sand (%)</small></label>
                  </div>
                  <div className='col-4'>
                    <Input name='sand' type='number' value={state['sand'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                </Row>
                <Row className='mt-2'>
                  <div className='col-2 text-right mt-1'>
                    <label><small>Water Velocity</small></label>
                  </div>
                  <div className='col-4'>
                    <SelectCustomLabel
                      name='watervel'
                      value={state['watervel']}
                      defaultValue={0}
                      onChange={val => handleSelect('watervel', parseInt(val))}
                      options={[
                        { value: 0, text: 'Not reliable' },
                        { value: 1, text: 'Eddy' },
                        { value: 2, text: '0 - 0.3 m/s' },
                        { value: 3, text: '0.3 - 0.6 m/s' },
                        { value: 4, text: '0.6 - 0.9 m/s' },
                        { value: 5, text: '> 0.9 m/s' },
                      ]}
                      isDisabled={!formComplete}
                    />
                  </div>
                  <div className='col-2 text-right mt-1'>
                    <label><small>Gravel (%)</small></label>
                  </div>
                  <div className='col-4'>
                    <Input name='gravel' type='number' value={state['gravel'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                </Row>
              </div>
            </Row>

            <Row>
              <div className='col-5'>
                <Row>
                  <div className='col-4'>
                    <Input label='Velocity 1 (bot)' name='velocitybot1' type='number' value={state['velocitybot1'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                  <div className='col-4'>
                    <Input label='Velocity 1 (0.8 or 0.5)' name='velocity08_1' type='number' value={state['velocity08_1'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                  <div className='col-4'>
                    <Input label='Velocity 1 (0.2 or 0.6)' name='velocity02or06_1' type='number' value={state['velocity02or06_1'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                </Row>
                <div className='row mt-2'>
                  <div className='col-4'>
                    <Input label='Velocity 2 (bot)' name='velocitybot2' type='number' value={state['velocitybot2'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                  <div className='col-4'>
                    <Input label='Velocity 2 (0.8 or 0.5)' name='velocity08_2' type='number' value={state['velocity08_2'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                  <div className='col-4'>
                    <Input label='Velocity 2 (0.2 or 0.6)' name='velocity02or06_2' type='number' value={state['velocity02or06_2'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                </div>
                <Row className='mt-2'>
                  <div className='col-4'>
                    <Input label='Velocity 3 (bot)' name='velocitybot3' type='number' value={state['velocitybot3'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                  <div className='col-4'>
                    <Input label='Velocity 3 (0.8)' name='velocity08_3' type='number' value={state['velocity08_3'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                  <div className='col-4'>
                    <Input label='Velocity 3 (0.2 or 0.6)' name='velocity02or06_3' type='number' value={state['velocity02or06_3'] || ''} onChange={handleNumber} isDisabled={!formComplete} />
                  </div>
                </Row>
              </div>
              <div className='col-2 text-center'>
                <label><small>No Velocities</small></label>
                <input
                  name='noVelocity'
                  type='checkbox'
                  title='No Velocties Field'
                  className='form-control mt-1'
                  style={{ height: '15px', width: '15px', margin: 'auto' }}
                  checked={isNoVelocity}
                  onChange={() => handleSelect('noVelocity', !isNoVelocity)}
                  disabled={!formComplete}
                />
              </div>
              <div className='col-5'>
                <TextArea label='Comments' name='comments' rows={5} value={state['comments']} onChange={handleChange} isDisabled={!formComplete} />
                <Row className='mt-2'>
                  <div className='col-9 pt-1 text-right'>
                    <label><small>Edit Initials</small></label>
                  </div>
                  <div className='col-3'>
                    <Input name='editInitials' value={state['editInitials']} onChange={handleChange} isDisabled={!formComplete} />
                  </div>
                </Row>
              </div>
            </Row>

            <hr />
            <Row>
              <div className='col-2 offset-10'>
                <div className='float-right'>
                  <Button
                    isOutline
                    size='small'
                    className='mr-2'
                    variant='secondary'
                    text='Cancel'
                    href='/find-data-sheet'
                  />
                  <Button
                    size='small'
                    variant='success'
                    text='Save'
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

export default MissouriRiverForm;