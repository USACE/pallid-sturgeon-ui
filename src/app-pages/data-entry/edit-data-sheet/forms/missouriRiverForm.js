import React, { useEffect, useReducer } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import Select from 'app-components/select';
import { gearCodeOptions } from './helper';

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
      mrFid,
      mrId,
      project,
      sampleUnit, // *
      sampleUnitType, // *
      season,
      segment,
      subsampleROrN: defaultSubsampleROrN,
      year, // *
    } = dataEntryData;

    const [formData, dispatch] = useReducer(reduceFormState, dataEntryData);

    const {
      gearCode,
      gearType,
      recorder,
      setdate,
      subsample,
      subsamplepass,
      subsampleROrN,
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
                  className='form-control mt-1'
                  value={setdate ? setdate.split('T')[0] : ''}
                  onChange={e => dispatch({ type: 'update', field: 'setdate', value: e.target.value })}
                />
              </div>
              <div className='col-1'>
                <label><small>Subsample</small></label>
                <input
                  type='number'
                  className='form-control mt-1'
                  value={subsample}
                  onChange={e => dispatch({ type: 'update', field: 'subsample', value: e.target.value })}
                />
              </div>
              <div className='col-1'>
                <label><small>Pass</small></label>
                <input
                  type='number'
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
                  className='form-control mt-1'
                  value={recorder}
                  onChange={e => dispatch({ type: 'update', field: 'recorder', value: e.target.value })}
                />
              </div>
            </div>

            <hr />
            <div className='row'>
              <div className='col-2 offset-10'>
                <div className='float-right'>
                  <Button
                    isOutline
                    className='mr-2'
                    variant='secondary'
                    text='Cancel'
                    href='/find-data-sheet'
                  />
                  <Button
                    isOutline
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
