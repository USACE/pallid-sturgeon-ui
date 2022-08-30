import React, { useEffect, useReducer } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
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
  'selectDataEntryData',
  ({
    dataEntryData,
    edit
  }) => {
    const [state, dispatch] = useReducer(reducer, {});

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

    // TODO: Complete this function
    const doSave = () => {
      if (edit) {
        // doUpdate
      } else {
        // doPost
      }
    };

    const saveIsDisabled = !(
      !!state['searchDate'] &&
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
                  <b className='mr-3'>Datasheet Id:</b>
                  {/* {mrId || '--'} */}
                </div>
                <div className='col-3'>
                  <b className='mr-2'>Field Id:</b>
                  {/* {mrFid || '--'} */}
                </div>
              </div>
              <hr />
            </>
            }
            <div className='row mt-2'>
              <div className='col-2'>
                <b className='mr-2'>Year:</b>
                {/* {year || '--'} */}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Field Office:</b>
                {/* {fieldOffice || '--'} */}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Project:</b>
                {/* {project || '--'} */}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Segment:</b>
                {/* {segment || '--'} */}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Season:</b>
                {/* {season || '--'} */}
              </div>
            </div>
            <hr />
            <div className='row mt-2'>
              <div className='col-2'>
                <b className='mr-2'>Sample Unit Type:</b>
                {/* {sampleUnitType || '--'} */}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Sample Unit:</b>
                {/* {sampleUnit || '--'} */}
              </div>
              <div className='col-2'>
                <b className='mr-2'>R/N:</b>
                {/* {bendrn || '--'} */}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Bend River Mile:</b>
                {/* {bendRiverMile || '--'} */}
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
                    {/* <div>{checkby || '--'}</div> */}
                  </div>
                  <div className='col-4 text-center'>
                    <label><small>Approved?</small></label>
                    <input
                      // disabled={formComplete}
                      type='checkbox'
                      title='approved'
                      className='form-control mt-1'
                      style={{ height: '15px', width: '15px', margin: 'auto' }}
                      // checked={!!complete}
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
                  // disabled={formComplete}
                  type='text'
                  title='qc'
                  className='form-control mt-1'
                // value={qc}
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
                    // href='/find-data-sheet'
                  />
                  <Button
                    size='small'
                    variant='success'
                    text='Save'
                  // handleClick={() => doUpdateMoRiverDataEntry(formData)}
                  />
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
                <Input name='searchDate' label='Search Date' type='date' value={state['searchDate']} onChange={handleChange} isRequired />
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
                <Input name='startLatitude' label='Start Latitude' value={state['startLatitude']} onChange={handleChange} isRequired />
              </div>
              <div className='col-2'>
                <Input name='startLongitude' label='Start Longitude' value={state['startLongitude']} onChange={handleChange} isRequired />
              </div>
              <div className='col-2'>
                <Input name='stopTime' label='Stop Time' value={state['stopTime']} onChange={handleChange} isRequired />
              </div>
              <div className='col-2'>
                <Input name='stopLatitude' label='Stop Latitude' value={state['stopLatitude']} onChange={handleChange} isRequired />
              </div>
              <div className='col-2'>
                <Input name='stopLongitude' label='Stop Longitude' value={state['stopLongitude']} onChange={handleChange} isRequired />
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
                  {edit && (
                    <Button
                      size='small'
                      variant='danger'
                      text='Delete'
                    // handleClick={() => doUpdateMoRiverDataEntry(formData)}
                    />
                  )}
                  <Button
                    size='small'
                    variant='success'
                    text={edit ? 'Apply Changes' : 'Save'}
                    isDisabled={saveIsDisabled}
                  // handleClick={() => doUpdateMoRiverDataEntry(formData)}
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