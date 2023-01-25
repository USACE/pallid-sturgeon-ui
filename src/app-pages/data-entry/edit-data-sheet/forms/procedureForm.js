import React, { useEffect, useReducer, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import { Input, Row, SelectCustomLabel, TextArea } from './_shared/helper';
import { purposeOptions, frequencyIdOptions, sexOptions, spawnEvaluationOptions, evalLocationsOptions, visualAssessmentOptions } from './_shared/selectHelper';
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

const ProcedureForm = connect(
  'doSaveProcedureDataEntry',
  'doUpdateProcedureDataEntry',
  'selectDataEntryFishData',
  'selectDataEntryProcedure',
  'selectSitesData',
  ({
    doSaveProcedureDataEntry,
    doUpdateProcedureDataEntry,
    dataEntryFishData,
    dataEntryProcedure,
    sitesData,
    edit
  }) => {
    const initialState = {
      fid: dataEntryFishData.items[0].fid,
      dstReimplant: 0,
      eggSample: 0,
      antibioticInjection: 0,
      pDorsal: 0,
      pVentral: 0,
      pLeft: 0,
    };
    const [state, dispatch] = useReducer(reducer, initialState);
    const [isDstReimplant, setIsDstReimplant] = useState(false);
    const [isEggSample, setIsEggSample] = useState(false);
    const [isAntibioticInjection, setIsAntibioticInjection] = useState(false);
    const [isPDorsal, setIsPDorsal] = useState(false);
    const [isPVentral, setIsPVentral] = useState(false);
    const [isPLeft, setIsPLeft] = useState(false);
    const siteId = edit ? state['siteId'] : sitesData[0].siteId;

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

    const handleNumber = e => {
      dispatch({
        type: 'UPDATE_INPUT',
        field: e.target.name,
        value: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
      });
    };

    // @TODO: consolidate checkbox handlers if possible
    const handleDstReimplantCheckbox = () => {
      const val = !isDstReimplant;
      setIsDstReimplant(val);
      handleSelect('dstReimplant', val === false ? 0 : 1);
    };

    const handleEggSampleCheckbox = () => {
      const val = !isEggSample;
      setIsEggSample(val);
      handleSelect('eggSample', val === false ? 0 : 1);
    };

    const handleAntibioticInjectionCheckbox = () => {
      const val = !isAntibioticInjection;
      setIsAntibioticInjection(val);
      handleSelect('antibioticInjection', val === false ? 0 : 1);
    };

    const handlePDorsalCheckbox = () => {
      const val = !isPDorsal;
      setIsPDorsal(val);
      handleSelect('pDorsal', val === false ? 0 : 1);
    };

    const handlePVentralCheckbox = () => {
      const val = !isPVentral;
      setIsPVentral(val);
      handleSelect('pVentral', val === false ? 0 : 1);
    };

    const handlePLeftCheckbox = () => {
      const val = !isPLeft;
      setIsPLeft(val);
      handleSelect('pLeft', val === false ? 0 : 1);
    };

    const doSave = () => {
      if (edit) {
        doUpdateProcedureDataEntry(state, { fId: state['fid'] });
      } else {
        doSaveProcedureDataEntry(state, { fId: state['fid'] });
      }
    };

    const saveIsDisabled = !(
      !!state['procedureDate'] &&
      !!state['purpose'] &&
      !!state['newRadioTagNum'] &&
      !!state['newFreqId'] &&
      !!state['sexCode'] &&
      !!state['procedureBy'] &&
      !!state['procedureStartTime'] &&
      !!state['procedureEndTime'] &&
      (edit ? !!state['editInitials'] && !!state['lastEditComment'] : true)
    );

    useEffect(() => {
      if (edit) {
        dispatch({
          type: 'INITIALIZE_FORM',
          payload: dataEntryProcedure.items[0],
        });
        
        // @TODO: consolidate statements if possible
        if (dataEntryProcedure.items[0].dstReimplant === 1) {
          setIsDstReimplant(true);
        } else {
          setIsDstReimplant(false);
        }

        if (dataEntryProcedure.items[0].eggSample === 1) {
          setIsEggSample(true);
        } else {
          setIsEggSample(false);
        }

        if (dataEntryProcedure.items[0].antibioticInjection === 1) {
          setIsAntibioticInjection(true);
        } else {
          setIsAntibioticInjection(false);
        }

        if (dataEntryProcedure.items[0].pDorsal === 1) {
          setIsPDorsal(true);
        } else {
          setIsPDorsal(false);
        }

        if (dataEntryProcedure.items[0].pVentral === 1) {
          setIsPVentral(true);
        } else {
          setIsPVentral(false);
        }

        if (dataEntryProcedure.items[0].pLeft === 1) {
          setIsPLeft(true);
        } else {
          setIsPLeft(false);
        }
      }
    }, [edit, dataEntryProcedure]);

    return (
      <>
        <Row>
          <div className='col-9'>
            <h4>{edit ? 'Edit' : 'Create'} Procedure Datasheet</h4>
          </div>
        </Row>
        {/* Top Level Info */}
        <DataHeader id={siteId} />
        {/* Approval */}
        {/* TO DO: include component props */}
        <Approval />
        {/* Form Fields */}
        <Card className='mt-3'>
          <Card.Header text='Procedure Datasheet Form' />
          <Card.Body>
            <Row>
              <div className='col-2'>
                <SelectCustomLabel
                  name='purpose'
                  label='Purpose'
                  value={state['purpose']}
                  options={purposeOptions}
                  onChange={val => handleSelect('purpose', val)}
                  isRequired
                />
              </div>
              <div className='col-2'>
                <Input name='procedureDate' 
                  label='Procedure Date' 
                  type='date' 
                  value={state['procedureDate'] ? state['procedureDate'].split('T')[0] : ''} 
                  onChange={handleChange} 
                  isRequired
                />
              </div>
              <div className='col-2'>
                <Input name='procedureStartTime' label='Start Time (hh:mm:ss)' value={state['procedureStartTime']} onChange={handleChange} isRequired />
              </div>
              <div className='col-2'>
                <Input name='procedureEndTime' label='End Time (hh:mm:ss)' value={state['procedureEndTime']} onChange={handleChange} isRequired />
              </div>
              <div className='col-2'>
                <Input name='procedureBy' label='Procedure By Initials' value={state['procedureBy']} onChange={handleChange} isRequired />
              </div>
              <div className='col-2'>
                <Input name='oldRadioTagNum' label='Old Radio Tag Number' type='number' value={state['oldRadioTagNum'] || ''} onChange={handleNumber} />
              </div>
            </Row>
            <Row>
              <div className='col-2'>
                <SelectCustomLabel
                  name='oldFrequencyId'
                  label='Old Frequency ID'
                  value={Number(state['oldFrequencyId'])}
                  options={frequencyIdOptions}
                  onChange={val => handleSelect('oldFrequencyId', val)}
                />
              </div>
              <div className='col-2'>
                <Input name='dstSerialNum' label='DST Serial Number' type='number' value={state['dstSerialNum'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <Input 
                  name='dstStartDate' 
                  label='DST Start Date' 
                  type='date' 
                  value={state['dstStartDate'] ? state['dstStartDate'].split('T')[0] : ''}
                />
              </div>
              <div className='col-2'>
                <Input name='dstStartTime' label='DST Start Time (hh:mm:ss)' value={state['dstStartTime']} onChange={handleChange} />
              </div>
              <div className='col-2 text-center'>
                <label><small>DST Reimplanted</small></label>
                <input
                  name='dstReimplant'
                  type='checkbox'
                  className='form-control mt-1'
                  style={{ height: '15px', width: '15px', margin: 'auto' }}
                  value={state['dstReimplant'] === 0 ? false : true} 
                  onChange={handleDstReimplantCheckbox}
                  checked={isDstReimplant}
                />
              </div>
              <div className='col-2'>
                <Input name='newRadioTagNum' label='New Radio Tag Number' type='number' value={state['newRadioTagNum']} onChange={handleNumber} isRequired />
              </div>
            </Row>
            <Row>
              <div className='col-2'>
                <SelectCustomLabel
                  name='newFreqId'
                  label='New Frequency ID'
                  value={Number(state['newFreqId'])}
                  options={frequencyIdOptions}
                  onChange={val => handleSelect('newFreqId', val)}
                  isRequired
                />
              </div>
              <div className='col-2'>
                <SelectCustomLabel
                  name='sexCode'
                  label='Sex'
                  value={state['sexCode']}
                  options={sexOptions}
                  onChange={val => handleSelect('sexCode', val)}
                  isRequired
                />
              </div>
              <div className='col-2'>
                <SelectCustomLabel
                  name='spawnStatus'
                  label='Spawn Evaluation'
                  value={state['spawnStatus']}
                  options={spawnEvaluationOptions}
                  onChange={val => handleSelect('spawnStatus', val)}
                />
              </div>
              <div className='col-2'>
                <SelectCustomLabel
                  name='evalLocation'
                  label='Evaluation for Location'
                  value={state['evalLocation']}
                  options={evalLocationsOptions}
                  onChange={val => handleSelect('evalLocation', val)}
                />
              </div>
              <div className='col-2 text-center'>
                <label><small>Egg Sample</small></label>
                <input
                  name='eggSample'
                  type='checkbox'
                  className='form-control mt-1'
                  style={{ height: '15px', width: '15px', margin: 'auto' }}
                  value={state['eggSample'] === 0 ? false : true} 
                  onChange={handleEggSampleCheckbox}
                  checked={isEggSample}
                />
              </div>
              <div className='col-2'>
                <SelectCustomLabel 
                  name='visualReproStatus'
                  label='Visual Assessment' 
                  value={state['visualReproStatus']}
                  options={visualAssessmentOptions}
                  onChange={val => handleSelect('visualReproStatus', val)}
                />
              </div>
            </Row>
            <Row>
              <div className='col-2'>
                <SelectCustomLabel
                  name='ultrasoundReproStatus' 
                  label='Ultrasound Assessment' 
                  value={state['ultrasoundReproStatus']}
                  options={visualAssessmentOptions}
                  onChange={val => handleSelect('ultrasoundReproStatus', val)}
                />
              </div>
              <div className='col-2'>
                <Input name='ultrasoundGonadLength' label='Ultrasound Gonad Length' type='number' value={state['ultrasoundGonadLength'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <Input name='gonadCondition' label='Gonad Condition' value={state['gonadCondition']} placeholder='ex: Stage 1' onChange={handleChange} />
              </div>
              <div className='col-2 text-center'>
                <label><small>Antibiotic Injection</small></label>
                <input
                  name='antibioticInjection'
                  type='checkbox'
                  className='form-control mt-1'
                  style={{ height: '15px', width: '15px', margin: 'auto' }}
                  value={state['antibioticInjection'] === 0 ? false : true} 
                  onChange={handleAntibioticInjectionCheckbox}
                  checked={isAntibioticInjection}
                />
                <label><small>Head (dorsal)</small></label>
                <input
                  name='pDorsal'
                  type='checkbox'
                  className='form-control mt-1'
                  style={{ height: '15px', width: '15px', margin: 'auto' }}
                  value={state['pDorsal'] === 0 ? false : true} 
                  onChange={handlePDorsalCheckbox}
                  checked={isPDorsal}
                />
              </div>
              <div className='col-2 text-center'>
                <label><small>Head (ventral)</small></label>
                <input
                  name='pVentral'
                  type='checkbox'
                  className='form-control mt-1'
                  style={{ height: '15px', width: '15px', margin: 'auto' }}
                  value={state['pVentral'] === 0 ? false : true} 
                  onChange={handlePVentralCheckbox}
                  checked={isPVentral}
                />
                <label><small>Head (left)</small></label>
                <input
                  name='pLeft'
                  type='checkbox'
                  className='form-control mt-1'
                  style={{ height: '15px', width: '15px', margin: 'auto' }}
                  value={state['pLeft'] === 0 ? false : true} 
                  onChange={handlePLeftCheckbox}
                  checked={isPLeft}
                />
              </div>
            </Row>
            <Row>
              <div className='col-2'>
                <Input name='expectedSpawnYear' label='Expected Spawn Year' type='number' value={state['expectedSpawnYear'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-4'>
                <TextArea name='comments' label='Comments' value={state['comments']} onChange={handleChange} />
              </div>
              <div className='col-4'>
                <TextArea name='fishHealthComment' label='Fish Health Comments' value={state['fishHealthComment']} onChange={handleChange} />
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
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  }
);

export default ProcedureForm;