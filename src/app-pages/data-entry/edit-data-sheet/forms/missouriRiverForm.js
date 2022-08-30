import React, { useReducer } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import Select from 'app-components/select';
import { gearCodeOptions, macroOptions, mesoOptions, microStructureOptions, setSite_1_2Options, setSite_3Options, u7Options } from './_shared/selectHelper';

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

// 11847 for testing

const MissouriRiverForm = connect(
  'doUpdateMoRiverDataEntry',
  'doDataEntrySetActiveType',
  'selectDataEntryData',
  ({
    doUpdateMoRiverDataEntry,
    doDataEntrySetActiveType,
    dataEntryData,
    edit,
  }) => {
    const {
      bendRiverMile, // *
      bendrn, // *
      cobble: defaultCobble = '',
      complete: defaultComplete,
      fieldOffice,
      gearCode: defaultGearCode = '',
      gearType: defaultGearType = '',
      habitatrn: defaultHabitatrn = '',
      macro: defaultMacro = '',
      meso: defaultMeso = '',
      microStructure: defaultMicroStructure = '',
      mrFid,
      mrId,
      organic: defaultOrganic = '',
      project,
      sampleUnit, // *
      sampleUnitType, // *
      season,
      segment,
      setSite_1: defaultSetSite_1 = '',
      setSite_2: defaultSetSite_2 = '',
      setSite_3: defaultSetSite_3 = '',
      structureFlow: defaultStructureFlow = '',
      structureMod: defaultStructureMod = '',
      subsampleROrN: defaultSubsampleROrN = '',
      u6: defaultU6 = '',
      u7: defaultU7 = '',
      watervel: defaultWatervel = '',
      year, // *
    } = dataEntryData;

    const [formData, dispatch] = useReducer(reduceFormState, edit ? dataEntryData : {});

    const {
      checkby,
      comments,
      complete,
      conductivity,
      depth1,
      depth2,
      depth3,
      discharge,
      distance,
      do: doValue,
      editInitials,
      gravel,
      micro,
      netrivermile,
      noTurbidity,
      noVelocity,
      qc,
      recorder,
      riverstage,
      sand,
      setdate,
      silt,
      startLatitude,
      startLongitude,
      startTime,
      stopLatitude,
      stopLongitude,
      stopTime,
      structurenumber,
      subsample,
      subsamplepass,
      temp,
      turbidity,
      u1,
      u2,
      u3,
      u4,
      u5,
      usgs,
      velocity02or06_1,
      velocity02or06_2,
      velocity02or06_3,
      velocity08_1,
      velocity08_2,
      velocity08_3,
      velocitybot1,
      velocitybot2,
      velocitybot3,
      width,
    } = formData;

    const formComplete = edit ? !!defaultComplete : false;

    const handleChange = (e) => {
      dispatch({ 
        type: 'update', 
        field: e.target.name, 
        value: e.target.value 
      });
    };

    const handleSelect = (field, val) => {
      dispatch({
        type: 'update', 
        field: field, 
        value: val
      });
    };

    return (
      <>
        <div className='row'>
          <div className='col-9'>
            <h4>{edit ? 'Edit' : 'Create'} Missouri River Datasheet</h4>
          </div>
        </div>
        {/* Top Level Info */}
        <Card className='mt-3'>
          <Card.Body>
            {edit && <>
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
            </>
            }
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
        {/* Approval */}
        <Card className='mt-3'>
          <Card.Body>
            <div className='row'>
              <div className='col-3' style={{ borderRight: '1px solid lightgray' }}>
                <div className='row'>
                  <div className='col-4 pl-4'>
                    <label><small>Checked By</small></label>
                    <div>{checkby || '--'}</div>
                  </div>
                  <div className='col-4 text-center'>
                    <label><small>Approved?</small></label>
                    <input
                      disabled={formComplete}
                      type='checkbox'
                      title='No Turbidity Field'
                      className='form-control mt-1'
                      style={{ height: '15px', width: '15px', margin: 'auto' }}
                      checked={!!complete}
                      onClick={() => dispatch({ type: 'update', field: 'complete', value: !!complete ? '' : '1' })}
                      onChange={() => { }}
                    />
                  </div>
                </div>
              </div>
              <div className='col-1'>
                <label><small>QC</small></label>
                <input
                  disabled={formComplete}
                  type='text'
                  title='No Turbidity Field'
                  className='form-control mt-1'
                  value={qc}
                  onChange={e => dispatch({ type: 'update', field: 'qc', value: e.target.value })}
                />
              </div>
              <div className='col-2 offset-6'>
                <div className='float-right pt-4'>
                  <Button
                    isOutline
                    size='small'
                    className='mr-2'
                    variant='secondary'
                    text='Cancel'
                    href='/find-data-sheet'
                  />
                  {!formComplete && (
                    <Button
                      size='small'
                      variant='success'
                      text='Save'
                      handleClick={() => doUpdateMoRiverDataEntry(formData)}
                    />
                  )}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
        {/* Form Fields */}
        <Card className='mt-3'>
          <Card.Header text='Missouri River Datasheet Form' />
          <Card.Body>
            <div className='row'>
              <div className='col-2'>
                <label><small>Setdate</small></label>
                <input
                  disabled={formComplete}
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
                  disabled={formComplete}
                  type='number'
                  title='Subsample Field'
                  placeholder='Enter Subsample...'
                  className='form-control mt-1'
                  value={subsample || ''}
                  onChange={e => dispatch({ type: 'update', field: 'subsample', value: e.target.value })}
                />
              </div>
              <div className='col-1'>
                <label><small>Pass</small></label>
                <input
                  disabled={formComplete}
                  type='number'
                  title='Subsample Pass Field'
                  placeholder='Enter Pass...'
                  className='form-control mt-1'
                  value={subsamplepass || ''}
                  onChange={e => dispatch({ type: 'update', field: 'subsamplepass', value: e.target.value })}
                />
              </div>
              <div className='col-2'>
                <Select
                  isDisabled={formComplete}
                  label='R/N'
                  showPlaceholderWhileValid
                  defaultOption={defaultSubsampleROrN || ''}
                  onChange={value => dispatch({ type: 'update', field: 'subsampleROrN', value })}
                  options={[
                    { value: 'R' },
                    { value: 'N' },
                  ]}
                />
              </div>
              <div className='col-2'>
                <Select
                  isDisabled={formComplete}
                  label='Gear Type'
                  showPlaceholderWhileValid
                  defaultOption={defaultGearType || ''}
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
                  isDisabled={formComplete}
                  label='Gear Code'
                  showPlaceholderWhileValid
                  defaultOption={defaultGearCode || ''}
                  onChange={value => dispatch({ type: 'update', field: 'gearCode', value })}
                  options={gearCodeOptions}
                />
              </div>
              <div className='col-1'>
                <label><small>Recorder</small></label>
                <input
                  disabled={formComplete}
                  type='text'
                  title='Recorder Field'
                  placeholder='Enter Initials...'
                  className='form-control mt-1'
                  value={recorder || ''}
                  onChange={e => dispatch({ type: 'update', field: 'recorder', value: e.target.value })}
                />
              </div>
            </div>

            <div className='row mt-5'>
              <div className='col-4 pb-3' style={{ borderRight: '1px solid lightgray' }}>
                <div className='row'>
                  <div className='col-6'>
                    <Select
                      isDisabled={formComplete}
                      label='Macro'
                      showPlaceholderWhileValid
                      defaultOption={defaultMacro || ''}
                      onChange={value => dispatch({ type: 'update', field: 'macro', value })}
                      options={macroOptions}
                    />
                  </div>
                  <div className='col-6'>
                    <Select
                      isDisabled={formComplete}
                      label='Meso'
                      showPlaceholderWhileValid
                      defaultOption={defaultMeso || ''}
                      onChange={value => dispatch({ type: 'update', field: 'meso', value })}
                      options={mesoOptions}
                    />
                  </div>
                </div>
                <div className='row mt-2'>
                  <div className='col-6'>
                    <label><small>Temp (c)</small></label>
                    <input
                      disabled={formComplete}
                      type='number'
                      title='Temperature Field'
                      placeholder='Enter Temp...'
                      step={0.1}
                      className='form-control mt-1'
                      value={temp || ''}
                      onChange={e => dispatch({ type: 'update', field: 'temp', value: e.target.value })}
                    />
                  </div>
                  <div className='col-6'>
                    <label><small>Width</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='Width Field'
                      placeholder='Enter Width...'
                      className='form-control mt-1'
                      value={width || ''}
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
                      disabled={formComplete}
                      type='text'
                      title='Micro Field'
                      placeholder='Enter Micro...'
                      className='form-control mt-1'
                      value={micro || ''}
                      onChange={e => dispatch({ type: 'update', field: 'micro', value: e.target.value })}
                    />
                  </div>
                  <div className='col-3'>
                    <Select
                      isDisabled={formComplete}
                      label='Micro Structure'
                      showPlaceholderWhileValid
                      defaultOption={defaultMicroStructure || ''}
                      onChange={value => dispatch({ type: 'update', field: 'microStructure', value })}
                      options={microStructureOptions}
                    />
                  </div>
                  <div className='col-3'>
                    <Select
                      isDisabled={formComplete}
                      label='Structure Flow'
                      showPlaceholderWhileValid
                      defaultOption={defaultStructureFlow || ''}
                      onChange={value => dispatch({ type: 'update', field: 'structureFlow', value })}
                      options={[
                        { value: 0, text: '0' },
                        { value: 1, text: 'Dry' },
                        { value: 2, text: 'Partial' },
                        { value: 3, text: 'Overflowing' },
                      ]}
                    />
                  </div>
                  <div className='col-3'>
                    <Select
                      isDisabled={formComplete}
                      label='Structure Mod'
                      showPlaceholderWhileValid
                      defaultOption={defaultStructureMod || ''}
                      onChange={value => dispatch({ type: 'update', field: 'structureMod', value })}
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
                    />
                  </div>
                </div>
                <div className='row mt-2'>
                  <div className='col-3 offset-3'>
                    <Select
                      isDisabled={formComplete}
                      label='Set Site 1'
                      showPlaceholderWhileValid
                      defaultOption={defaultSetSite_1 || ''}
                      onChange={value => dispatch({ type: 'update', field: 'setSite_1', value })}
                      options={setSite_1_2Options}
                    />
                  </div>
                  <div className='col-3'>
                    <Select
                      isDisabled={formComplete}
                      label='Set Site 2'
                      showPlaceholderWhileValid
                      defaultOption={defaultSetSite_2 || ''}
                      onChange={value => dispatch({ type: 'update', field: 'setSite_2', value })}
                      options={setSite_1_2Options}
                    />
                  </div>
                  <div className='col-3'>
                    <Select
                      isDisabled={formComplete}
                      label='Set Site 3'
                      showPlaceholderWhileValid
                      defaultOption={defaultSetSite_3 || ''}
                      onChange={value => dispatch({ type: 'update', field: 'setSite_3', value })}
                      options={setSite_3Options}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='row mt-5'>
              <div className='col-5 pb-3' style={{ borderRight: '1px solid lightgray' }}>
                <div className='row'>
                  <div className='col-4'>
                    <label><small>Start Time</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='Start Time Field'
                      placeholder='Enter Start Time...'
                      className='form-control mt-1'
                      value={startTime || ''}
                      onChange={e => dispatch({ type: 'update', field: 'startTime', value: e.target.value })}
                    />
                  </div>
                  <div className='col-4'>
                    <label><small>Start Latitude</small></label>
                    <input
                      disabled={formComplete}
                      type='number'
                      title='Start Latitude Field'
                      placeholder='Enter Start Latitude...'
                      className='form-control mt-1'
                      value={startLatitude || ''}
                      onChange={e => dispatch({ type: 'update', field: 'startLatitude', value: e.target.value })}
                    />
                  </div>
                  <div className='col-4'>
                    <label><small>Start Longitude</small></label>
                    <input
                      disabled={formComplete}
                      type='number'
                      title='Start Longitude Field'
                      placeholder='Enter Start Longitude...'
                      className='form-control mt-1'
                      value={startLongitude || ''}
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
                      disabled={formComplete}
                      type='number'
                      title='Distance Field'
                      placeholder='Enter Distance...'
                      className='form-control mt-1'
                      value={distance || ''}
                      onChange={e => dispatch({ type: 'update', field: 'distance', value: e.target.value })}
                    />
                  </div>
                  <div className='col-3'>
                    <input
                      disabled={formComplete}
                      type='number'
                      title='Depth (1) Field'
                      placeholder='Enter Depth (1)...'
                      className='form-control mt-1'
                      step={0.1}
                      value={depth1 || ''}
                      onChange={e => dispatch({ type: 'update', field: 'depth1', value: e.target.value })}
                    />
                  </div>
                  <div className='col-3'>
                    <input
                      disabled={formComplete}
                      type='number'
                      title='Depth (2) Field'
                      placeholder='Enter Depth (2)...'
                      className='form-control mt-1'
                      step={0.1}
                      value={depth2 || ''}
                      onChange={e => dispatch({ type: 'update', field: 'depth2', value: e.target.value })}
                    />
                  </div>
                  <div className='col-3'>
                    <input
                      disabled={formComplete}
                      type='number'
                      title='Depth (3) Field'
                      placeholder='Enter Depth (3)...'
                      className='form-control mt-1'
                      step={0.1}
                      value={depth3 || ''}
                      onChange={e => dispatch({ type: 'update', field: 'depth3', value: e.target.value })}
                    />
                  </div>
                </div>
                <div className='row mt-2'>
                  <div className='col-4'>
                    <label><small>Stop Time</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='Stop Time Field'
                      placeholder='Enter Stop Time...'
                      className='form-control mt-1'
                      value={stopTime || ''}
                      onChange={e => dispatch({ type: 'update', field: 'stopTime', value: e.target.value })}
                    />
                  </div>
                  <div className='col-4'>
                    <label><small>Stop Latitude</small></label>
                    <input
                      disabled={formComplete}
                      type='number'
                      title='Stop Latitude Field'
                      placeholder='Enter Stop Latitude...'
                      className='form-control mt-1'
                      value={stopLatitude || ''}
                      onChange={e => dispatch({ type: 'update', field: 'stopLatitude', value: e.target.value })}
                    />
                  </div>
                  <div className='col-4'>
                    <label><small>Stop Longitude</small></label>
                    <input
                      disabled={formComplete}
                      type='number'
                      title='Stop Longitude Field'
                      placeholder='Enter Stop Longitude...'
                      className='form-control mt-1'
                      value={stopLongitude || ''}
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
                      disabled={formComplete}
                      type='text'
                      title='U1 Field'
                      placeholder='U1...'
                      className='form-control mt-1'
                      value={u1 || ''}
                      onChange={e => dispatch({ type: 'update', field: 'u1', value: e.target.value })}
                    />
                  </div>
                  <div className='col-1 mr-2'>
                    <label><small>U2</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='U2 Field'
                      placeholder='U2...'
                      className='form-control mt-1'
                      value={u2 || ''}
                      onChange={e => dispatch({ type: 'update', field: 'u2', value: e.target.value })}
                    />
                  </div>
                  <div className='col-1 mr-2'>
                    <label><small>U3</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='U3 Field'
                      placeholder='U3...'
                      className='form-control mt-1'
                      value={u3 || ''}
                      onChange={e => dispatch({ type: 'update', field: 'u3', value: e.target.value })}
                    />
                  </div>
                  <div className='col-1 mr-2'>
                    <label><small>U4</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='U4 Field'
                      placeholder='U4...'
                      className='form-control mt-1'
                      value={u4 || ''}
                      onChange={e => dispatch({ type: 'update', field: 'u4', value: e.target.value })}
                    />
                  </div>
                  <div className='col-2 mr-2'>
                    <label><small>U5</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='U5 Field'
                      placeholder='U5...'
                      className='form-control mt-1'
                      value={u5 || ''}
                      onChange={e => dispatch({ type: 'update', field: 'u5', value: e.target.value })}
                    />
                  </div>
                  <div className='col-2 mr-2'>
                    <Select
                      isDisabled={formComplete}
                      label='U6'
                      showPlaceholderWhileValid
                      defaultOption={defaultU6 || ''}
                      onChange={value => dispatch({ type: 'update', field: 'u6', value })}
                      options={[
                        { value: 'MNCF' },
                        { value: 'NSTS' },
                      ]}
                    />
                  </div>
                  <div className='col-3'>
                    <Select
                      isDisabled={formComplete}
                      label='U7'
                      showPlaceholderWhileValid
                      defaultOption={defaultU7 || ''}
                      onChange={value => dispatch({ type: 'update', field: 'u7', value })}
                      options={u7Options}
                    />
                  </div>
                </div>
                <div className='row mt-2'>
                  <div className='col-3'>
                    <label><small>Structure Number</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='Structure Number Field'
                      placeholder='Enter Structure Number...'
                      className='form-control mt-1'
                      value={structurenumber || ''}
                      onChange={e => dispatch({ type: 'update', field: 'structurenumber', value: e.target.value })}
                    />
                  </div>
                  <div className='col-3'>
                    <label><small>Net River Mile</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='Net River Mile Field'
                      placeholder='Enter Net River Mile...'
                      className='form-control mt-1'
                      value={netrivermile || ''}
                      onChange={e => dispatch({ type: 'update', field: 'netrivermile', value: e.target.value })}
                    />
                  </div>
                  <div className='col-3'>
                    <label><small>Conductivity</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='Conductivity Field'
                      placeholder='Enter Conductivity...'
                      className='form-control mt-1'
                      value={conductivity || ''}
                      onChange={e => dispatch({ type: 'update', field: 'conductivity', value: e.target.value })}
                    />
                  </div>
                  <div className='col-3'>
                    <label><small>D.O.</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='D.O. Field'
                      placeholder='Enter D.O...'
                      className='form-control mt-1'
                      value={doValue || ''}
                      onChange={e => dispatch({ type: 'update', field: 'do', value: e.target.value })}
                    />
                  </div>
                </div>
                <div className='row mt-2'>
                  <div className='col-3'>
                    <label><small>USGS Gauge Code</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='USGS Gauge Code Field'
                      placeholder='Enter USGS Gauge Code...'
                      className='form-control mt-1'
                      value={usgs || ''}
                      onChange={e => dispatch({ type: 'update', field: 'usgs', value: e.target.value })}
                    />
                  </div>
                  <div className='col-3'>
                    <label><small>River Stage</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='River Stage Field'
                      placeholder='Enter River Stage...'
                      className='form-control mt-1'
                      value={riverstage || ''}
                      onChange={e => dispatch({ type: 'update', field: 'riverstage', value: e.target.value })}
                    />
                  </div>
                  <div className='col-3'>
                    <label><small>Discharge</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='Discharge Field'
                      placeholder='Enter Discharge...'
                      className='form-control mt-1'
                      value={discharge || ''}
                      onChange={e => dispatch({ type: 'update', field: 'discharge', value: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='row mt-5'>
              <div className='col-5'>
                <div className='row'>
                  <div className='col-5'>
                    <Select
                      isDisabled={formComplete}
                      showPlaceholderWhileValid
                      label='Habitat R/N'
                      defaultOption={defaultHabitatrn || ''}
                      onChange={value => dispatch({ type: 'update', field: 'habitatrn', value })}
                      options={[
                        { value: 'R', text: 'Random' },
                        { value: 'N', text: 'Non-random' },
                      ]}
                    />
                  </div>
                  <div className='col-3'>
                    <label><small>Turbidity</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='Turbidity Field'
                      placeholder='Enter Turbidity...'
                      className='form-control mt-1'
                      value={turbidity || ''}
                      onChange={e => dispatch({ type: 'update', field: 'turbidity', value: e.target.value })}
                    />
                  </div>
                  <div className='col-4 text-center'>
                    <label><small>No Turbidity</small></label>
                    <input
                      disabled={formComplete}
                      type='checkbox'
                      title='No Turbidity Field'
                      className='form-control mt-1'
                      style={{ height: '15px', width: '15px', margin: 'auto' }}
                      checked={!!noTurbidity}
                      onClick={() => dispatch({ type: 'update', field: 'noTurbidity', value: !noTurbidity })}
                      onChange={() => { }}
                    />
                  </div>
                </div>
              </div>
              <div className='col-7'>
                <div className='row'>
                  <div className='col-2 text-right mt-1'>
                    <label><small>Cobble</small></label>
                  </div>
                  <div className='col-4'>
                    <Select
                      isDisabled={formComplete}
                      showPlaceholderWhileValid
                      defaultOption={defaultCobble || ''}
                      onChange={value => dispatch({ type: 'update', field: 'cobble', value })}
                      options={[
                        { value: 0, text: 'None' },
                        { value: 1, text: 'Incidental' },
                        { value: 2, text: 'Dominant' },
                        { value: 3, text: 'Ubiquitous' },
                      ]}
                    />
                  </div>
                  <div className='col-2 text-right mt-1'>
                    <label><small>Silt (%)</small></label>
                  </div>
                  <div className='col-4'>
                    <input
                      disabled={formComplete}
                      type='number'
                      title='Silt Percentage Field'
                      placeholder='Enter Silt (%)...'
                      className='form-control mt-1'
                      value={silt || ''}
                      onChange={e => dispatch({ type: 'update', field: 'silt', value: e.target.value })}
                    />
                  </div>
                </div>
                <div className='row mt-2'>
                  <div className='col-2 text-right mt-1'>
                    <label><small>Organic</small></label>
                  </div>
                  <div className='col-4'>
                    <Select
                      isDisabled={formComplete}
                      showPlaceholderWhileValid
                      defaultOption={defaultOrganic || ''}
                      onChange={value => dispatch({ type: 'update', field: 'organic', value })}
                      options={[
                        { value: 0, text: 'None' },
                        { value: 1, text: 'Incidental' },
                        { value: 2, text: 'Dominant' },
                        { value: 3, text: 'Ubiquitous' },
                      ]}
                    />
                  </div>
                  <div className='col-2 text-right mt-1'>
                    <label><small>Sand (%)</small></label>
                  </div>
                  <div className='col-4'>
                    <input
                      disabled={formComplete}
                      type='number'
                      title='Sand Percentage Field'
                      placeholder='Enter Sand (%)...'
                      className='form-control mt-1'
                      value={sand || ''}
                      onChange={e => dispatch({ type: 'update', field: 'sand', value: e.target.value })}
                    />
                  </div>
                </div>
                <div className='row mt-2'>
                  <div className='col-2 text-right mt-1'>
                    <label><small>Water Velocity</small></label>
                  </div>
                  <div className='col-4'>
                    <Select
                      isDisabled={formComplete}
                      showPlaceholderWhileValid
                      defaultOption={defaultWatervel || ''}
                      onChange={value => dispatch({ type: 'update', field: 'watervel', value })}
                      options={[
                        { value: 0, text: 'Not reliable' },
                        { value: 1, text: 'Eddy' },
                        { value: 2, text: '0 - 0.3 m/s' },
                        { value: 3, text: '0.3 - 0.6 m/s' },
                        { value: 4, text: '0.6 - 0.9 m/s' },
                        { value: 5, text: '> 0.9 m/s' },
                      ]}
                    />
                  </div>
                  <div className='col-2 text-right mt-1'>
                    <label><small>Gravel (%)</small></label>
                  </div>
                  <div className='col-4'>
                    <input
                      disabled={formComplete}
                      type='number'
                      title='Gravel Percentage Field'
                      placeholder='Enter Gravel (%)...'
                      className='form-control mt-1'
                      value={gravel || ''}
                      onChange={e => dispatch({ type: 'update', field: 'gravel', value: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='row mt-5'>
              <div className='col-5'>
                <div className='row'>
                  <div className='col-4'>
                    <label><small>Velocity 1 (bot)</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='Velocity 1 (bot) Field'
                      placeholder='Enter Velocity (bot)...'
                      className='form-control mt-1'
                      value={velocitybot1 || ''}
                      onChange={e => dispatch({ type: 'update', field: 'velocitybot1', value: e.target.value })}
                    />
                  </div>
                  <div className='col-4'>
                    <label><small>Velocity 1 (0.8 or 0.5)</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='Velocity 1 (0.8 or 0.5) Field'
                      placeholder='Enter Velocity (0.8 or 0.5)...'
                      className='form-control mt-1'
                      value={velocity08_1 || ''}
                      onChange={e => dispatch({ type: 'update', field: 'velocity08_1', value: e.target.value })}
                    />
                  </div>
                  <div className='col-4'>
                    <label><small>Velocity 1 (0.2 or 0.6)</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='Velocity 1 (0.2 or 0.6) Field'
                      placeholder='Enter Velocity (0.2 or 0.6)...'
                      className='form-control mt-1'
                      value={velocity02or06_1 || ''}
                      onChange={e => dispatch({ type: 'update', field: 'velocity02or06_1', value: e.target.value })}
                    />
                  </div>
                </div>
                <div className='row mt-2'>
                  <div className='col-4'>
                    <label><small>Velocity 2 (bot)</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='Velocity 2 (bot) Field'
                      placeholder='Enter Velocity (bot)...'
                      className='form-control mt-1'
                      value={velocitybot2 || ''}
                      onChange={e => dispatch({ type: 'update', field: 'velocitybot2', value: e.target.value })}
                    />
                  </div>
                  <div className='col-4'>
                    <label><small>Velocity 2 (0.8 or 0.5)</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='Velocity 2 (0.8 or 0.5) Field'
                      placeholder='Enter Velocity (0.8 or 0.5)...'
                      className='form-control mt-1'
                      value={velocity08_2 || ''}
                      onChange={e => dispatch({ type: 'update', field: 'velocity08_2', value: e.target.value })}
                    />
                  </div>
                  <div className='col-4'>
                    <label><small>Velocity 2 (0.2 or 0.6)</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='Velocity 2 (0.2 or 0.6) Field'
                      placeholder='Enter Velocity (0.2 or 0.6)...'
                      className='form-control mt-1'
                      value={velocity02or06_2 || ''}
                      onChange={e => dispatch({ type: 'update', field: 'velocity02or06_2', value: e.target.value })}
                    />
                  </div>
                </div>
                <div className='row mt-2'>
                  <div className='col-4'>
                    <label><small>Velocity 3 (bot)</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='Velocity 3 (bot) Field'
                      placeholder='Enter Velocity (bot)...'
                      className='form-control mt-1'
                      value={velocitybot3 || ''}
                      onChange={e => dispatch({ type: 'update', field: 'velocitybot3', value: e.target.value })}
                    />
                  </div>
                  <div className='col-4'>
                    <label><small>Velocity 3 (0.8)</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='Velocity 3 (0.8) Field'
                      placeholder='Enter Velocity (0.8)...'
                      className='form-control mt-1'
                      value={velocity08_3 || ''}
                      onChange={e => dispatch({ type: 'update', field: 'velocity08_3', value: e.target.value })}
                    />
                  </div>
                  <div className='col-4'>
                    <label><small>Velocity 3 (0.2 or 0.6)</small></label>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='Velocity 3 (0.2 or 0.6) Field'
                      placeholder='Enter Velocity (0.2 or 0.6)...'
                      className='form-control mt-1'
                      value={velocity02or06_3 || ''}
                      onChange={e => dispatch({ type: 'update', field: 'velocity02or06_3', value: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className='col-2 text-center'>
                <label><small>No Velocities</small></label>
                <input
                  disabled={formComplete}
                  type='checkbox'
                  title='No Velocties Field'
                  className='form-control mt-1'
                  style={{ height: '15px', width: '15px', margin: 'auto' }}
                  checked={!!noVelocity}
                  onClick={() => dispatch({ type: 'update', field: 'noVelocity', value: !noVelocity })}
                  onChange={() => { }}
                />
              </div>
              <div className='col-5'>
                <label><small>Comments</small></label>
                <textarea
                  disabled={formComplete}
                  className='form-control mt-1'
                  rows={5}
                  value={comments || ''}
                  onChange={e => dispatch({ type: 'update', field: 'comments', value: e.target.value })}
                />
                <div className='row mt-2'>
                  <div className='col-9 pt-1 text-right'>
                    <label><small>Edit Initials</small></label>
                  </div>
                  <div className='col-3'>
                    <input
                      disabled={formComplete}
                      type='text'
                      title='Edit Initials Field'
                      placeholder='Initials...'
                      className='form-control mt-1'
                      value={editInitials || ''}
                      onChange={e => dispatch({ type: 'update', field: 'editInitials', value: e.target.value })}
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
                  {!formComplete && (
                    <Button
                      size='small'
                      variant='success'
                      text='Save'
                      handleClick={() => doUpdateMoRiverDataEntry(formData)}
                    />
                  )}
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
