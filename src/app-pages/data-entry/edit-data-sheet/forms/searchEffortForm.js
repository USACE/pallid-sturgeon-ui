import React, { useReducer } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import { Input, Row, SelectCustomLabel, TextArea } from './_shared/helper';
import { searchTypeOptions } from './_shared/selectHelper';

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

const SearchEffortForm = connect(
  'selectDataEntryData',
  ({
    dataEntryData,
    edit
  }) => {
    const [formData, dispatch] = useReducer(reduceFormState, edit ? dataEntryData : {});
    const formComplete = edit ? !!defaultComplete : false;

    const {
      bendRiverMile, // *
      bendrn, // *
      complete: defaultComplete,
      fieldOffice,
      project,
      sampleUnit, // *
      sampleUnitType, // *
      season,
      segment,
      year, // *
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
            <h4>{edit ? 'Edit' : 'Create'} Search Effort Datasheet</h4>
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
                      // onClick={() => dispatch({ type: 'update', field: 'complete', value: !!complete ? '' : '1' })}
                      // onClick={handleSelect('complete', !!complete ? '' : '1')}
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
                // onChange={e => dispatch({ type: 'update', field: 'qc', value: e.target.value })}
                // onChange={handleChange}
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
                    // handleClick={() => doUpdateMoRiverDataEntry(formData)}
                    />
                  )}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
        {/* Form Fields */}
        <Card className='mt-3'>
          <Card.Header text='Search Effort Datasheet Form' />
          <Card.Body>
            <Row>
              <div className='col-2'>
                <Input name='searchdate' label='SearchDate' type='date' />
              </div>
              <div className='col-2'>
                <Input name='recorder' label='Recorder Initials' type='text' />
              </div>
              <div className='col-2'>
                <SelectCustomLabel
                  name='searchType'
                  label='Search Type'
                  options={searchTypeOptions}
                />
              </div>
              <div className='col-2'>
                <Input name='temp' label='Temp (C)' />
              </div>
              <div className='col-2'>
                <Input name='conductivity' label='Conductivity' />
              </div>
            </Row>
            <Row>
              <div className='col-2'>
                <Input name='startTime' label='Start Time' />
              </div>
              <div className='col-2'>
                <Input name='startLatitude' label='Start Latitude' />
              </div>
              <div className='col-2'>
                <Input name='startLongitude' label='Start Longitude' />
              </div>
              <div className='col-2'>
                <Input name='stopTime' label='Stop Time' />
              </div>
              <div className='col-2'>
                <Input name='stopLatitude' label='Stop Latitude' />
              </div>
              <div className='col-2'>
                <Input name='stopLongitude' label='Stop Longitude' />
              </div>
            </Row>
            <Row>
              <div className='col-5'>
                <TextArea name='editComments' label='Edit Comments' />
              </div>
              <div className='col-2'>
                <Input name='editInitials' label='Edit Initials' />
              </div>
            </Row>
            <div className='row'>
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
                  {edit && (
                    <Button
                      size='small'
                      variant='danger'
                      text='Delete'
                    // handleClick={() => doUpdateMoRiverDataEntry(formData)}
                    />
                  )}
                  {!formComplete && (
                    <Button
                      size='small'
                      variant='success'
                      text={edit ? 'Apply Changes' : 'Save'}
                    // handleClick={() => doUpdateMoRiverDataEntry(formData)}
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

export default SearchEffortForm;