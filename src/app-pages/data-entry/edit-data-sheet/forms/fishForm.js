import React, { useEffect, useReducer } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import { FilterSelectCustomLabel, Input, Row, SelectCustomLabel, TextArea } from './_shared/helper';
import { finCurlOptions } from './_shared/selectHelper';
import DataHeader from 'app-pages/data-entry/datasheets/components/dataHeader';
import Approval from 'app-pages/data-entry/datasheets/components/approval';
import { createDropdownOptions, createMesoOptions } from 'app-pages/data-entry/helpers';

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

// 1046 for testing

const FishForm = connect(
  'doDomainsSpeciesFetch',
  'doDomainsFtPrefixesFetch',
  'doDomainsMrFetch',
  'doDomainsOtolithFetch',
  'doSaveFishDataEntry',
  'doUpdateFishDataEntry',
  'selectDataEntryData',
  'selectDataEntryLastParams',
  'selectSitesData',
  'selectDomainsSpecies',
  'selectDomainsFtPrefixes',
  'selectDomainsMr',
  'selectDomainsOtolith',
  ({
    doDomainsSpeciesFetch,
    doDomainsFtPrefixesFetch,
    doDomainsMrFetch,
    doDomainsOtolithFetch,
    doSaveFishDataEntry,
    doUpdateFishDataEntry,
    dataEntryData,
    dataEntryLastParams,
    sitesData,
    domainsSpecies,
    domainsFtPrefixes,
    domainsMr,
    domainsOtolith,
    edit
  }) => {
    const initialState = {
      mrId: dataEntryLastParams.mrId
    };
    const [state, dispatch] = useReducer(reducer, initialState);

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

    const doSave = () => {
      if (edit) {
        doUpdateFishDataEntry(state);
      } else {
        doSaveFishDataEntry(state);
      }
    };

    const saveIsDisabled = !(
      !!state['species']
    );

    useEffect(() => {
      if (edit) {
        dispatch({
          type: 'INITIALIZE_FORM',
          payload: dataEntryData,
        });
      }
    }, [edit, dataEntryData]);

    useEffect(() => {
      doDomainsFtPrefixesFetch();
      doDomainsMrFetch();
      doDomainsOtolithFetch();
      doDomainsSpeciesFetch();
    }, []);

    return (
      <>
        <Row>
          <div className='col-9'>
            <h4>{edit ? 'Edit' : 'Create'} Fish Datasheet</h4>
          </div>
        </Row>
        {/* Top Level Info */}
        {/* TO DO: include component props */}
        <DataHeader />
        {/* Approval */}
        {/* TO DO: include component props */}
        <Approval />
        {/* Form Fields */}
        <Card className='mt-3'>
          <Card.Header text='Fish Datasheet Form' />
          <Card.Body>
            <Row>
              <div className='col-2'>
                <Input name='panelHook' label='Panel/Hook' value={state['panelHook']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <FilterSelectCustomLabel
                  name='species'
                  label='Species'
                  placeholder='Select species...'
                  value={state['species']}
                  items={createMesoOptions(domainsSpecies)}
                  onChange={(_, __, value) => handleSelect('species', value)}
                  isRequired 
                />
              </div>
              <div className='col-2'>
                <Input name='length' label='Length' type='number' value={state['length'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <Input name='weight' label='Weight' type='number' value={state['weight'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <Input name='countF' label='Count' type='number' value={state['countF'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <SelectCustomLabel 
                  name='ftprefix' 
                  label='FT Prefix'
                  value={state['ftprefix']}
                  onChange={val => handleSelect('ftprefix', val)}
                  options={createMesoOptions(domainsFtPrefixes)} 
                />
              </div>
            </Row>
            <Row>
              <div className='col-2'>
                <Input name='ftnum' label='Floy Tag' value={state['ftnum']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <SelectCustomLabel 
                  name='mR' 
                  label='m/R' 
                  value={state['mR']} 
                  options={createDropdownOptions(domainsMr)}
                  onChange={val => handleSelect('mR', val)} 
                />
              </div>
              <div className='col-2'>
                <Input name='geneticsVialNumber' label='Genetics Vial #' value={state['geneticsVialNumber']} onChange={handleChange} />
              </div>
              <div className='col-2'>
                <Input name='condition' label='Condition' type='number' value={state['condition'] || ''} onChange={handleNumber} />
              </div>
              <div className='col-2'>
                <SelectCustomLabel 
                  name='finCurl'
                  label='Fin Curl' 
                  value={state['finCurl']}
                  options={finCurlOptions}
                  onChange={val => handleSelect('finCurl', val)}
                />
              </div>
              <div className='col-2'>
                <SelectCustomLabel 
                  name='otolith' 
                  label='Otolith' 
                  value={state['otolith']}
                  options={createDropdownOptions(domainsOtolith)}
                  onChange={val => handleSelect('otolith', val)}
                />
              </div>
            </Row>
            <Row>
              <div className='col-2'>
                <SelectCustomLabel 
                  name='rayspine' 
                  label='Ray Spine' 
                  value={state['rayspine']} 
                  // options={[{text: 'placeholder', value: ''}]}
                  onChange={val => handleSelect('rayspine', val)} 
                  isDisabled 
                />
              </div>
              <div className='col-2'>
                <Input name='kn' label='KN' value={state['kn']} onChange={handleChange} isDisabled />
              </div>
              <div className='col-2'>
                <Input name='wr' label='WR' type='number' value={state['wr']} onChange={handleNumber} isDisabled />
              </div>
              <div className='col-2'>
                <SelectCustomLabel 
                  name='scale' 
                  label='Scale' 
                  value={state['scale']} 
                  // options={[{text: 'placeholder', value: ''}]}
                  onChange={val => handleSelect('scale', val)} 
                  isDisabled 
                />
              </div>
              <div className='col-2'>
                <Input name='rsd' label='RSD' value={state['rsd']} onChange={handleChange} isDisabled />
              </div>
              <div className='col-2'>
                <SelectCustomLabel 
                  name='bait' 
                  label='Bait' 
                  value={state['bait']} 
                  // options={[{text: 'placeholder', value: ''}]}
                  onChange={val => handleSelect('bait', val)} 
                  isDisabled 
                />
              </div>
            </Row>
            {edit && (<Row>
              <div className='col-5'>
                <TextArea name='lastEditComment' label='Edit Comments' value={state['lastEditComment']} onChange={handleChange} />
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

export default FishForm;