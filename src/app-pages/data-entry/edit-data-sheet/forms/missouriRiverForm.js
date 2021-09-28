import React, { useEffect, useReducer } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import Select from 'app-components/select';
import { gearCodeOptions, macroOptions, mesoOptions, microStructureOptions, setSite_3Options, u7Options } from './helper';

const reduceFormState = (state, action) => {
  switch (action.type) {
    case 'update':
      return {
        ...state,
        [action.field]: action.value,
      };
    default:
      throw new Error();
  }
};

const MissouriRiverForm = connect(
  'doUpdateMoRiverDataEntry',
  'selectDataEntryData',
  ({
    doUpdateMoRiverDataEntry,
    dataEntryData,
  }) => {
    // @TODO: Missing some of these fields in the api response... Dee can you check tables for marked fields (*)?
    const {
      bendRiverMile, // *
      bendrn, // *
      fieldOffice,
      gearCode: defaultGearCode,
      gearType: defaultGearType,
      macro: defaultMacro,
      meso: defaultMeso,
      microStructure: defaultMicroStructure,
      mrFid,
      mrId,
      project,
      sampleUnit, // *
      sampleUnitType, // *
      season,
      segment,
      setSite_1: defaultSetSite_1,
      setSite_2: defaultSetSite_2,
      setSite_3: defaultSetSite_3,
      structureFlow: defaultStructureFlow,
      structureMod: defaultStructureMod,
      subsampleROrN: defaultSubsampleROrN,
      u6: defaultU6,
      u7: defaultU7,
      year, // *
    } = dataEntryData;

    const [formData, dispatch] = useReducer(reduceFormState, dataEntryData);

    const {
      conductivity,
      depth1,
      depth2,
      depth3,
      discharge,
      distance,
      do: doValue,
      gearCode,
      gearType,
      macro,
      meso,
      micro,
      microStructure,
      netrivermile,
      recorder,
      riverstage,
      setdate,
      setSite_1,
      setSite_2,
      setSite_3,
      startLatitude,
      startLongitude,
      startTime,
      stopLatitude,
      stopLongitude,
      stopTime,
      structureFlow,
      structureMod,
      structurenumber,
      subsample,
      subsamplepass,
      subsampleROrN,
      temp,
      u1,
      u2,
      u3,
      u4,
      u5,
      u6,
      u7,
      usgs,
      width,
    } = formData;

    useEffect(() => {
      console.log('test dataEntryData:', dataEntryData);
      console.log('test formData:', formData);
    }, [dataEntryData, formData]);
  
    return (
      <>
        <h4>Missouri River Data Sheets - Edit Data</h4>
        {/* Top Level Info */}
        <Card className='mt-3'>
          <Card.Body>
            <div className='row'>
              <div className='col-3'>
                <b className='mr-3'>Data Sheet Id:</b>
                {mrId || '--'}
              </div>
              <div className='col-3'>
                <b className='mr-2'>Field Id:</b>
                {mrFid || '--'}
              </div>
            </div>
            <hr />
            <div className='row mt-2'>
              <div className='col-2'>
                <b className='mr-2'>Year:</b>
                {year || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Field Office:</b>
                {fieldOffice || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Project:</b>
                {project || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Segment:</b>
                {segment || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Season:</b>
                {season || '--'}
              </div>
            </div>
            <hr />
            <div className='row mt-2'>
              <div className='col-2'>
                <b className='mr-2'>Sample Unit Type:</b>
                {sampleUnitType || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Sample Unit:</b>
                {sampleUnit || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>R/N:</b>
                {bendrn || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Bend River Mile:</b>
                {bendRiverMile || '--'}
              </div>
            </div>
          </Card.Body>
        </Card>
        {/* Form Fields */}
        <Card className='mt-3'>
          <Card.Header text='Missouri River Data Sheet Form' />
          <Card.Body>
            <div className='row'>
              <div className='col-2'>
                <label><small>Setdate</small></label>
                <input
                  type='date'
                  title='Date Field'
                  placeholder='Enter Date...'
                  className='form-control mt-1'
                  value={setdate ? setdate.split('T')[0] : ''}
                  onChange={e => dispatch({ type: 'update', field: 'setdate', value: e.target.value })}
                />
              </div>
              <div className='col-1'>
                <label><small>Subsample</small></label>
                <input
                  type='number'
                  title='Subsample Field'
                  placeholder='Enter Subsample...'
                  className='form-control mt-1'
                  value={subsample}
                  onChange={e => dispatch({ type: 'update', field: 'subsample', value: e.target.value })}
                />
              </div>
              <div className='col-1'>
                <label><small>Pass</small></label>
                <input
                  type='number'
                  title='Subsample Pass Field'
                  placeholder='Enter Pass...'
                  className='form-control mt-1'
                  value={subsamplepass}
                  onChange={e => dispatch({ type: 'update', field: 'subsamplepass', value: e.target.value })}
                />
              </div>
              <div className='col-2'>
                <Select
                  label='R/N'
                  defaultOption={defaultSubsampleROrN}
                  onChange={value => dispatch({ type: 'update', field: 'subsampleROrN', value })}
                  options={[
                    { value: 'R' },
                    { value: 'N' },
                  ]}
                />
              </div>
              <div className='col-2'>
                <Select
                  label='Gear Type'
                  defaultOption={defaultGearType}
                  onChange={value => dispatch({ type: 'update', field: 'gearType', value })}
                  options={[
                    { value: 'E' },
                    { value: 'S' },
                    { value: 'W' },
                  ]}
                />
              </div>
              <div className='col-2'>
                <Select
                  label='Gear Code'
                  defaultOption={defaultGearCode}
                  onChange={value => dispatch({ type: 'update', field: 'gearCode', value })}
                  options={gearCodeOptions}
                />
              </div>
              <div className='col-1'>
                <label><small>Recorder</small></label>
                <input
                  type='text'
                  title='Recorder Field'
                  placeholder='Enter Initials...'
                  className='form-control mt-1'
                  value={recorder}
                  onChange={e => dispatch({ type: 'update', field: 'recorder', value: e.target.value })}
                />
              </div>
            </div>

            <div className='row mt-4'>
              <div className='col-4 pb-3' style={{ borderRight: '1px solid lightgray' }}>
                <div className='row'>
                  <div className='col-6'>
                    <Select
                      label='Macro'
                      defaultOption={defaultMacro}
                      onChange={value => dispatch({ type: 'update', field: 'macro', value })}
                      options={macroOptions}
                    />
                  </div>
                  <div className='col-6'>
                    <Select
                      label='Meso'
                      defaultOption={defaultMeso}
                      onChange={value => dispatch({ type: 'update', field: 'meso', value })}
                      options={mesoOptions}
                    />
                  </div>
                </div>
                <div className='row mt-2'>
                  <div className='col-6'>
                    <label><small>Temp (c)</small></label>
                    <input
                      type='number'
                      title='Temperature Field'
                      placeholder='Enter Temp...'
                      step={0.1}
                      className='form-control mt-1'
                      value={temp}
                      onChange={e => dispatch({ type: 'update', field: 'temp', value: e.target.value })}
                    />
                  </div>
                  <div className='col-6'>
                    <label><small>Width</small></label>
                    <input
                      disabled
                      type='text'
                      title='Width Field'
                      placeholder='Enter Width...'
                      className='form-control mt-1'
                      value={width}
                      onChange={e => dispatch({ type: 'update', field: 'width', value: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className='col-8'>
                <div className='row'>
                  <div className='col-3'>
                    <label><small>Micro</small></label>
                    <input
                      type='text'
                      title='Micro Field'
                      placeholder='Enter Micro...'
                      className='form-control mt-1'
                      value={micro}
                      onChange={e => dispatch({ type: 'update', field: 'micro', value: e.target.value })}
                    />
                  </div>
                  <div className='col-3'>
                    <Select
                      label='Micro Structure'
                      defaultOption={defaultMicroStructure}
                      onChange={value => dispatch({ type: 'update', field: 'microStructure', value })}
                      options={microStructureOptions}
                    />
                  </div>
                  <div className='col-3'>
                    <Select
                      isDisabled
                      label='Structure Flow'
                      defaultOption={defaultStructureFlow}
                      onChange={value => dispatch({ type: 'update', field: 'structureFlow', value })}
                      options={[]}
                    />
                  </div>
                  <div className='col-3'>
                    <Select
                      isDisabled
                      label='Structure Mod'
                      defaultOption={defaultStructureMod}
                      onChange={value => dispatch({ type: 'update', field: 'structureMod', value })}
                      options={[]}
                    />
                  </div>
                </div>
                <div className='row mt-2'>
                  <div className='col-3 offset-3'>
                    <Select
                      label='Set Site 1'
                      defaultOption={defaultSetSite_1}
                      onChange={value => dispatch({ type: 'update', field: 'setSite_1', value })}
                      options={[]}
                    />
                  </div>
                  <div className='col-3'>
                    <Select
                      label='Set Site 2'
                      defaultOption={defaultSetSite_2}
                      onChange={value => dispatch({ type: 'update', field: 'setSite_2', value })}
                      options={[]}
                    />
                  </div>
                  <div className='col-3'>
                    <Select
                      label='Set Site 3'
                      defaultOption={defaultSetSite_3}
                      onChange={value => dispatch({ type: 'update', field: 'setSite_3', value })}
                      options={setSite_3Options}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='row mt-4'>
              <div className='col-5 pb-3' style={{ borderRight: '1px solid lightgray' }}>
                <div className='row'>
                  <div className='col-4'>
                    <label><small>Start Time</small></label>
                    <input
                      type='text'
                      title='Start Time Field'
                      placeholder='Enter Start Time...'
                      className='form-control mt-1'
                      value={startTime}
                      onChange={e => dispatch({ type: 'update', field: 'startTime', value: e.target.value })}
                    />
                  </div>
                  <div className='col-4'>
                    <label><small>Start Latitude</small></label>
                    <input
                      type='number'
                      title='Start Latitude Field'
                      placeholder='Enter Start Latitude...'
                      className='form-control mt-1'
                      value={startLatitude}
                      onChange={e => dispatch({ type: 'update', field: 'startLatitude', value: e.target.value })}
                    />
                  </div>
                  <div className='col-4'>
                    <label><small>Start Longitude</small></label>
                    <input
                      type='number'
                      title='Start Longitude Field'
                      placeholder='Enter Start Longitude...'
                      className='form-control mt-1'
                      value={startLongitude}
                      onChange={e => dispatch({ type: 'update', field: 'startLongitude', value: e.target.value })}
                    />
                  </div>
                </div>
                <div className='row mt-2'>
                  <div className='col-3'>
                    <label><small>Distance (m)</small></label>
                  </div>
                  <div className='col-9'>
                    <label><small>Depth (m)</small></label>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-3'>
                    <input
                      type='number'
                      title='Distance Field'
                      placeholder='Enter Distance...'
                      className='form-control mt-1'
                      value={distance}
                      onChange={e => dispatch({ type: 'update', field: 'distance', value: e.target.value })}
                    />
                  </div>
                  <div className='col-3'>
                    <input
                      type='number'
                      title='Depth (1) Field'
                      placeholder='Enter Depth (1)...'
                      className='form-control mt-1'
                      step={0.1}
                      value={depth1}
                      onChange={e => dispatch({ type: 'update', field: 'depth1', value: e.target.value })}
                    />
                  </div>
                  <div className='col-3'>
                    <input
                      type='number'
                      title='Depth (2) Field'
                      placeholder='Enter Depth (2)...'
                      className='form-control mt-1'
                      step={0.1}
                      value={depth2}
                      onChange={e => dispatch({ type: 'update', field: 'depth2', value: e.target.value })}
                    />
                  </div>
                  <div className='col-3'>
                    <input
                      type='number'
                      title='Depth (3) Field'
                      placeholder='Enter Depth (3)...'
                      className='form-control mt-1'
                      step={0.1}
                      value={depth3}
                      onChange={e => dispatch({ type: 'update', field: 'depth3', value: e.target.value })}
                    />
                  </div>
                </div>
                <div className='row mt-2'>
                  <div className='col-4'>
                    <label><small>Stop Time</small></label>
                    <input
                      disabled
                      type='text'
                      title='Stop Time Field'
                      placeholder='Enter Stop Time...'
                      className='form-control mt-1'
                      value={stopTime}
                      onChange={e => dispatch({ type: 'update', field: 'stopTime', value: e.target.value })}
                    />
                  </div>
                  <div className='col-4'>
                    <label><small>Stop Latitude</small></label>
                    <input
                      disabled
                      type='number'
                      title='Stop Latitude Field'
                      placeholder='Enter Stop Latitude...'
                      className='form-control mt-1'
                      value={stopLatitude}
                      onChange={e => dispatch({ type: 'update', field: 'stopLatitude', value: e.target.value })}
                    />
                  </div>
                  <div className='col-4'>
                    <label><small>Stop Longitude</small></label>
                    <input
                      disabled
                      type='number'
                      title='Stop Longitude Field'
                      placeholder='Enter Stop Longitude...'
                      className='form-control mt-1'
                      value={stopLongitude}
                      onChange={e => dispatch({ type: 'update', field: 'stopLongitude', value: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className='col-7'>
                <div className='row no-gutters'>
                  <div className='col-1 mr-2'>
                    <label><small>U1</small></label>
                    <input
                      type='text'
                      title='U1 Field'
                      placeholder='U1...'
                      className='form-control mt-1'
                      value={u1}
                      onChange={e => dispatch({ type: 'update', field: 'u1', value: e.target.value })}
                    />
                  </div>
                  <div className='col-1 mr-2'>
                    <label><small>U2</small></label>
                    <input
                      type='text'
                      title='U2 Field'
                      placeholder='U2...'
                      className='form-control mt-1'
                      value={u2}
                      onChange={e => dispatch({ type: 'update', field: 'u2', value: e.target.value })}
                    />
                  </div>
                  <div className='col-1 mr-2'>
                    <label><small>U3</small></label>
                    <input
                      type='text'
                      title='U3 Field'
                      placeholder='U3...'
                      className='form-control mt-1'
                      value={u3}
                      onChange={e => dispatch({ type: 'update', field: 'u3', value: e.target.value })}
                    />
                  </div>
                  <div className='col-1 mr-2'>
                    <label><small>U4</small></label>
                    <input
                      type='text'
                      title='U4 Field'
                      placeholder='U4...'
                      className='form-control mt-1'
                      value={u4}
                      onChange={e => dispatch({ type: 'update', field: 'u4', value: e.target.value })}
                    />
                  </div>
                  <div className='col-2 mr-2'>
                    <label><small>U5</small></label>
                    <input
                      type='text'
                      title='U5 Field'
                      placeholder='U5...'
                      className='form-control mt-1'
                      value={u5}
                      onChange={e => dispatch({ type: 'update', field: 'u5', value: e.target.value })}
                    />
                  </div>
                  <div className='col-2 mr-2'>
                    <Select
                      label='U6'
                      defaultOption={defaultU6}
                      onChange={value => dispatch({ type: 'update', field: 'u6', value })}
                      options={[
                        { value: 'MNCF' },
                        { value: 'NSTS' },
                      ]}
                    />
                  </div>
                  <div className='col-3'>
                    <Select
                      label='U7'
                      defaultOption={defaultU7}
                      onChange={value => dispatch({ type: 'update', field: 'u7', value })}
                      options={u7Options}
                    />
                  </div>
                </div>
                <div className='row mt-2'>
                  <div className='col-3'>
                    <label><small>Structure Number</small></label>
                    <input
                      type='text'
                      title='Structure Number Field'
                      placeholder='Enter Structure Number...'
                      className='form-control mt-1'
                      value={structurenumber}
                      onChange={e => dispatch({ type: 'update', field: 'structurenumber', value: e.target.value })}
                    />
                  </div>
                  <div className='col-3'>
                    <label><small>Net River Mile</small></label>
                    <input
                      type='text'
                      title='Net River Mile Field'
                      placeholder='Enter Net River Mile...'
                      className='form-control mt-1'
                      value={netrivermile}
                      onChange={e => dispatch({ type: 'update', field: 'netrivermile', value: e.target.value })}
                    />
                  </div>
                  <div className='col-3'>
                    <label><small>Conductivity</small></label>
                    <input
                      type='text'
                      title='Conductivity Field'
                      placeholder='Enter Conductivity...'
                      className='form-control mt-1'
                      value={conductivity}
                      onChange={e => dispatch({ type: 'update', field: 'conductivity', value: e.target.value })}
                    />
                  </div>
                  <div className='col-3'>
                    <label><small>D.O.</small></label>
                    <input
                      type='text'
                      title='D.O. Field'
                      placeholder='Enter D.O...'
                      className='form-control mt-1'
                      value={doValue}
                      onChange={e => dispatch({ type: 'update', field: 'do', value: e.target.value })}
                    />
                  </div>
                </div>
                <div className='row mt-2'>
                  <div className='col-3'>
                    <label><small>USGS Gauge Code</small></label>
                    <input
                      type='text'
                      title='USGS Gauge Code Field'
                      placeholder='Enter USGS Gauge Code...'
                      className='form-control mt-1'
                      value={usgs}
                      onChange={e => dispatch({ type: 'update', field: 'usgs', value: e.target.value })}
                    />
                  </div>
                  <div className='col-3'>
                    <label><small>River Stage</small></label>
                    <input
                      type='text'
                      title='River Stage Field'
                      placeholder='Enter River Stage...'
                      className='form-control mt-1'
                      value={riverstage}
                      onChange={e => dispatch({ type: 'update', field: 'riverstage', value: e.target.value })}
                    />
                  </div>
                  <div className='col-3'>
                    <label><small>Discharge</small></label>
                    <input
                      type='text'
                      title='Discharge Field'
                      placeholder='Enter Discharge...'
                      className='form-control mt-1'
                      value={discharge}
                      onChange={e => dispatch({ type: 'update', field: 'discharge', value: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className='row'>
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
                    handleClick={() => doUpdateMoRiverDataEntry(formData)}
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

export default MissouriRiverForm;
