import React, { useEffect, useReducer } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import { Input, Row, SelectCustomLabel, TextArea } from './_shared/helper';
import DataHeader from 'app-pages/data-entry/datasheets/components/dataHeader';
import Approval from 'app-pages/data-entry/datasheets/components/approval';

// For testing
// 122 - tableId

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
  'doSaveSupplementalDataEntry',
  'doUpdateSupplementalDataEntry',
  'selectDataEntrySupplemental',
  'selectDataEntryFishData',
  ({
    doSaveSupplementalDataEntry,
    doUpdateSupplementalDataEntry,
    dataEntrySupplemental,
    dataEntryFishData,
    edit,
  }) => {
    const initialState = {
      fid: dataEntryFishData.items[0].fid,
      fFid: dataEntryFishData.items[0].ffid,
      mrId: dataEntryFishData.items[0].mrId
    };
    const [state, dispatch] = useReducer(reducer, initialState);

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

    const doSave = () => {
      if (edit) {
        doUpdateSupplementalDataEntry(state);
      } else {
        doSaveSupplementalDataEntry(state);
      }
    };

    const saveIsDisabled = !(
      !!state['cwtyn'] &&
      !!state['dangler'] &&
      !!state['elcolor'] &&
      !!state['ercolor'] &&
      !!state['erhv'] &&
      (edit ? !!state['editInitials'] && !!state['lastEditComment'] : true)
    );

    useEffect(() => {
      if (edit) {
        dispatch({
          type: 'INITIALIZE_FORM',
          payload: dataEntrySupplemental.items[0],
        });
      }
    }, [edit, dataEntrySupplemental]);

    return (
      <>
        <Row>
          <div className='col-9'>
            <h4>{edit ? 'Edit' : 'Create'} Supplemental Datasheet</h4>
          </div>
        </Row>
        {/* Top Level Info */}
        <DataHeader />
        {/* Approval */}
        <Approval />
        {/* Form Fields */}
        <Card className='mt-3'>
          <Card.Header text='Supplemental Datasheet Form' />
          <Card.Body>
            <Row>
              <div className='col-2'>
                <Input name='tagnumber' label='Tag Number' value={state['tagnumber']} onChange={handleChange} />
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
                <Input name='scuteloc' label='Scute Location' value={state['scuteloc']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='scutenum' label='Scute #' type='number' value={state['scutenum'] || ''} onChange={handleNumber} />
              </div>
            </Row>
            <Row>
              <div className='col-2'>
                <Input name='elcolor' label='EL Color' value={state['elcolor']} onChange={handleChange} isRequired/>
              </div>
              <div className='col-2'>
                <Input name='elhv' label='EL H/V/X' value={state['elhv']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='ercolor' label='ER Color' value={state['ercolor']} onChange={handleChange} isRequired />
              </div>
              <div className='col-2'>
                <Input name='erhv' label='ER H/V/X' value={state['erhv']} onChange={handleChange} isRequired />
              </div>
              <div className='col-2'>
                <Input name='scuteloc2' label='Scute 2 Location' value={state['scuteloc2']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='scutenum2' label='Scute 2 #' type='number' value={state['scutenum2'] || ''} onChange={handleNumber} />
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
                <TextArea name='otherTagInfo' label='Other Tag Info' value={state['otherTagInfo']} onChange={handleChange} />
              </div>
            </Row>
            <Row>
              <div className='col-2'>
                <Input name='broodstock' label='[Genetic Analysis Needs] Broodstock' type='number' value={state['broodstock'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <Input name='hatchWild' label='[Genetic Analysis Needs] Hatch vs Wild' type='number' value={state['hatchWild'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <Input name='speciesId' label='[Genetic Analysis Needs] Species ID' type='number' value={state['speciesId'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <Input name='archive' label='[Genetic Analysis Needs] Archive' type='number' value={state['archive'] || ''} onChange={handleNumber} />
              </div>
            </Row>
            <Row>
              <div className='col-2'>
                <Input name='anal' label='Anal' type='number' value={state['anal'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <Input name='dorsal' label='Dorsal' type='number' value={state['dorsal'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <Input name='head' label='Head' type='number' value={state['head'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <Input name='inter' label='Inter' type='number' value={state['inter'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <Input name='lIb' label='L-IB' type='number' value={state['lIb'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <Input name='lOb' label='L-OB' type='number' value={state['lOb'] || ''} onChange={handleNumber} />
              </div>
            </Row>
            <Row>
              <div className='col-2'>
                <Input name='mIb' label='M-IB' type='number' value={state['mIb'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <Input name='mouth' label='Mouth' type='number' value={state['mouthwidth'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <Input name='rIb' label='R-IB' type='number' value={state['rIb']} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <Input name='rOb' label='R-OB' type='number' value={state['rOb']} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <Input name='snouttomouth' label='Snout to Mouth' type='number' value={state['snouttomouth']} onChange={handleNumber} />
              </div>
            </Row>
            {edit && (<Row>
              <div className='col-5'>
                <TextArea name='lastEditComment' label='Edit Comments' value={state['lastEditComment']} onChange={handleChange} isRequired={edit} />
              </div>
              <div className='col-2'>
                <Input name='editInitials' label='Edit Initials' value={state['editInitials']} onChange={handleChange} isRequired={edit} />
              </div>
            </Row>)}
            <Row>
              <div className='col-4 offset-8'>
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
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  }
);

export default SupplementalForm;
