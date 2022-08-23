import React, { useEffect, useReducer } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import { Input, Row, SelectCustomLabel, TextArea } from './_shared/helper';

// For testing
// 230269 - mrId
// 2118152 - tableId

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

const SupplementalForm = connect(
  'selectDataEntryData',
  'selectDataEntryLastParams',
  ({
    dataEntryData,
    edit,
  }) => {
    const [state, dispatch] = useReducer(reducer, {});

    // TODO: saveIsDisabled
    // const formComplete = edit ? !!defaultComplete : false;

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
            <h4>{edit ? 'Edit' : 'Create'} Supplemental Datasheet</h4>
          </div>
        </div>
        {/* Top Level Info */}
        <Card className='mt-3'>
          <Card.Body>
            {edit && <>
              <div className='row'>
                <div className='col-3'>
                  <b className='mr-3'>Datasheet Id:</b>
                  {state['sid'] || '--'}
                </div>
                <div className='col-3'>
                  <b className='mr-2'>Field Id:</b>
                  {state['fid'] || '--'}
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
                      title='No Turbidity Field'
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
                  title='No Turbidity Field'
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
                    href='/find-data-sheet'
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
          <Card.Header text='Telemetry Datasheet Form' />
          <Card.Body>
            <Row>
              <div className='col-2'>
                <Input name='tagnumber' label='Tag Number' value={state['tagnumber']} onChange={handleChange} isRequired={!!state['pitrn']} />
              </div>
              <div className='col-2'>
                <Input name='pitrn' label='PIT R/N/Z' value={state['pitrn']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='cwtyn' label='CWT' value={state['cwtyn']} onChange={handleChange} isRequired />
              </div>
              <div className='col-2'>
                <Input name='dangler' label='Dangler' value={state['dangler']} onChange={handleChange} isRequired />
              </div>
              <div className='col-2'>
                <Input name='scuteloc' label='Scute Location' value={state['scuteloc']} onChange={handleChange} isRequired={!!state['scutenum']} />
              </div>
              <div className='col-2'>
                <Input name='scutenum' label='Scute #' value={state['scutenum']} onChange={handleChange} isRequired={!!state['scuteloc']} />
              </div>
            </Row>
            <Row>
              <div className='col-2'>
                <Input name='elcolor' label='EL Color' value={state['elcolor']} onChange={handleChange} isRequired/>
              </div>
              <div className='col-2'>
                <Input name='elhv' label='EL H/V/X' value={state['elhv']} onChange={handleChange} isRequired={!!state['elcolor']} />
              </div>
              <div className='col-2'>
                <Input name='ercolor' label='ER Color' value={state['ercolor']} onChange={handleChange} isRequired />
              </div>
              <div className='col-2'>
                <Input name='erhv' label='ER H/V/X' value={state['erhv']} onChange={handleChange} isRequired />
              </div>
              <div className='col-2'>
                <Input name='scuteloc2' label='Scute 2 Location' value={state['scuteloc2']} onChange={handleChange} isRequired={!!state['scutenum2']} />
              </div>
              <div className='col-2'>
                <Input name='scutenum2' label='Scute 2 #' value={state['scutenum2']} onChange={handleChange} isRequired={!!state['scuteloc2']} />
              </div>
            </Row>
            <Row>
              <div className='col-2'>
                <SelectCustomLabel 
                  name='genetics' 
                  label='Genetic (Y/N)' 
                  value={state['genetic']} 
                  options={[{ text: 'YES', value: 'Y' }, { text: 'NO', value: 'N' },]}
                  onChange={val => handleSelect('genetic', val)}
                />
              </div>
              <div className='col-2'>
                <Input name='geneticsVialNumber' label='Genetic Vial #' value={state['geneticsVialNumber']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='hatcheryOrigin' label='Hatchery Origin' value={state['hatcheryOrigin']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='otherTagInfo' label='Other Tag Info' value={state['otherTagInfo']} onChange={handleChange} />
              </div>
            </Row>
            <Row>
              <div className='col-2'>
                <Input name='broodstock' label='[Genetic Analysis Needs] Broodstock' value={state['broodstock']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='hatchWild' label='[Genetic Analysis Needs] Hatch vs Wild' value={state['hatchWild']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='speciesId' label='[Genetic Analysis Needs] Species ID' value={state['speciesId']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='archive' label='[Genetic Analysis Needs] Archive' value={state['archive']} onChange={handleChange} />
              </div>
            </Row>
            <Row>
              <div className='col-2'>
                <Input name='anal' label='Anal' value={state['anal']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='dorsal' label='Dorsal' value={state['dorsal']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='head' label='Head' value={state['head']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='inter' label='Inter' value={state['inter']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='lIb' label='L-IB' value={state['lIb']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='lOb' label='L-OB' value={state['lOb']} onChange={handleChange} />
              </div>
            </Row>
            <Row>
              <div className='col-2'>
                <Input name='mIb' label='M-IB' value={state['mIb']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='mouth' label='Mouth' value={state['mouthwidth']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='rIb' label='R-IB' value={state['rIb']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='rOb' label='R-OB' value={state['rOb']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='snouttomouth' label='Snout to Mouth' value={state['snouttomouth']} onChange={handleChange} />
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
              <div className='col-4 offset-8'>
                <div className='float-right'>

                  <Button
                    size='small'
                    className='mr-2'
                    variant='success'
                    text={edit ? 'Apply Changes' : 'Save'}
                  // handleClick={() => doUpdateMoRiverDataEntry(formData)}
                  />

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
                      className='mr-2'
                      variant='danger'
                      text='Delete'
                    // handleClick={() => doUpdateMoRiverDataEntry(formData)}
                    />
                  )}
                </div>
              </div>
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  }
);

export default SupplementalForm;
