import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';
import Select from 'app-components/select';

import '../dataentry.scss';

const titlize = str => str ? str.charAt(0).toUpperCase() + str.slice(1) : 'N/A';

const Table = connect(
  ({

  }) => {
    
    const [tableId, setTableId] = useState('');
    const [fieldId, setFieldId] = useState('');
    const [geneticVial, setGeneticVial] = useState('');
    const [pitTag, setPitTag] = useState('');

    const currentYear = (new Date()).getFullYear();
    const years = Array.from(new Array(25), (val, index) => currentYear - index);
    
    return (
      <>
        <div className='row d-flex flex-row'>
          <div className='col-sm-4'>
            <div className='row'>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label><small>Select Data Sheet Type</small></label>
                  <div className='select'>
                    <Select
                      // onChange={value => doChartUpdateType(value)}
                      placeholderText='Datasheet Type'
                      data-size='3'
                      options={[
                        { value: '2021', text: '2021' },
                        { value: '2020', text: '2020' },
                        { value: '2019', text: '2019' },
                      ]}
                    />
                  </div>
                </div>
              </div>
              <div className='col-md-6 pl-0'>
                <div className='form-group'>
                  <label><small>Enter Table ID</small></label>
                  <input
                    value={tableId}
                    onChange={(e) => {
                      setTableId(e.target.value);
                    }}
                    className='form-control'
                    type='text'
                    placeholder='Table ID'
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='col-sm-0.5 pt-4 pl-2 pr-3'>
            <span>OR</span>
          </div>
          <div className='col-sm-2 pl-0'>
            <div className='form-group'>
              <label><small>Enter Field ID</small></label>
              <input
                value={fieldId}
                onChange={(e) => {
                  setFieldId(e.target.value);
                }}
                className='form-control'
                type='text'
                placeholder='Field ID'
              />
            </div>
          </div>
          <div className='col-sm-0.5 pt-4 pl-2 pr-3'>
            <span>OR</span>
          </div>
          <div className='col-sm-2 pl-0'>
            <div className='form-group'>
              <label><small>Enter Genetic Vial #</small></label>
              <input
                value={geneticVial}
                onChange={(e) => {
                  setGeneticVial(e.target.value);
                }}
                className='form-control'
                type='text'
                placeholder='Genetic Vial #'
              />
            </div>
          </div>
          <div className='col-sm-0.5 pt-4 pl-2 pr-3'>
            <span>OR</span>
          </div>
          <div className='col-sm-2 pl-0 pr-0'>
            <div className='form-group'>
              <label><small>Enter Pit Tag</small></label>
              <input
                value={pitTag}
                onChange={(e) => {
                  setPitTag(e.target.value);
                }}
                className='form-control'
                type='text'
                placeholder='Pit Tag'
              />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-10 pl-3'>
            <div className='block_container'>
              <div className='info-message'><Icon icon='help-circle' /></div>
              <div className='info-message'>Enter the ID for the type of data sheet selected (Missouri River -MD_ID, Fish - F_ID, Supplemental
              -F_ID. For Supplemental data sheet, choices also include Genetics Nial # or Pit Tag.
              </div>
            </div>
          </div>
          <div className='col-md-2 align-self-end pl-1'>
            <div className='form-group'>
              <Button
                size='small'
                variant='dark'
                isOutline
                text='Go To Data Sheet'
              />
            </div>
          </div>
        </div>
      </>
    );
  }
);

export default Table;
