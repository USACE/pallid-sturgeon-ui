import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';
import Select from 'app-components/select';

import '../../dataentry.scss';

const FindDataSheet = connect(
  'doFetchMoRiverDataEntry',
  'doFetchSupplementalDataEntry',
  'doFetchFishDataEntry',
  ({
    doFetchMoRiverDataEntry,
    doFetchSupplementalDataEntry,
    doFetchFishDataEntry,
  }) => {
    const [pitTag, setPitTag] = useState('');
    const [tableId, setTableId] = useState('');
    const [fieldId, setFieldId] = useState('');
    const [geneticsVial, setGeneticsVial] = useState('');
    const [dataSheetType, setDataSheetType] = useState('');

    const isSupplemental = dataSheetType === 'supplemental';
    const isSearchDisabled = !(dataSheetType && (
      tableId || fieldId || geneticsVial || pitTag
    ));

    const findDataSheet = () => {
      const params = {
        pitTag,
        tableId,
        fieldId,
        geneticsVial,
      };

      switch(dataSheetType) {
        case 'fish':
          doFetchFishDataEntry(params);
          break;
        case 'supplemental':
          doFetchSupplementalDataEntry(params);
          break;
        case 'missouriRiver':
          doFetchMoRiverDataEntry(params);
          break;
        default:
          console.log('select a datasheet type');
          break;
      }
    };

    return (
      <>
        <div className='row d-flex flex-row'>
          <div className='col-md-4 col-sm-12'>
            <div className='row'>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label><small>Select Data Sheet Type</small></label>
                  <div className='select'>
                    <Select
                      onChange={value => setDataSheetType(value)}
                      value={dataSheetType}
                      placeholderText='Datasheet Type...'
                      options={[
                        { value: 'missouriRiver', text: 'Missouri River' },
                        { value: 'fish', text: 'Fish' },
                        { value: 'supplemental', text: 'Supplemental' },
                        { value: 'telemetry', text: 'Telemetry' },
                        { value: 'procedures', text: 'Procedures' },
                        { value: 'searchEffort', text: 'Search Effort' },
                      ]}
                    />
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label><small>Enter Table ID</small></label>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Table ID...'
                    value={tableId}
                    onChange={e => setTableId(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <span className='pt-4 mr-1'>OR</span>
          <div className='col-md-2 col-sm-4'>
            <div className='form-group'>
              <label><small>Enter Field ID</small></label>
              <input
                type='text'
                className='form-control'
                placeholder='Field ID...'
                value={fieldId}
                onChange={e => setFieldId(e.target.value)}
              />
            </div>
          </div>
          <span className='pt-4 mr-1'>OR</span>
          <div className='col-md-2 col-sm-4'>
            <div className='form-group'>
              <label><small>Enter Genetic Vial #</small></label>
              <input
                disabled={!isSupplemental}
                type='text'
                className='form-control'
                placeholder='Genetic Vial #...'
                value={geneticsVial}
                onChange={e => setGeneticsVial(e.target.value)}
              />
            </div>
          </div>
          <span className='pt-4 mr-1'>OR</span>
          <div className='col-md-2 col-sm-4'>
            <div className='form-group'>
              <label><small>Enter Pit Tag</small></label>
              <input
                disabled={!isSupplemental}
                type='text'
                className='form-control'
                placeholder='Pit Tag...'
                value={pitTag}
                onChange={e => setPitTag(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-12 align-self-start mb-3'>
            <Icon icon='help-circle' />
            <span className='info-message ml-2'>Enter the ID for the type of datasheet selected (Missouri River -MR_ID, Fish - F_ID, Supplemental
            -F_ID.</span>
            <br />
            <span className='ml-4'>For Supplemental datasheet, choices also include Genetics Vial # or Pit Tag.</span>
          </div>
          <div className='col-md-2 align-self-end'>
            <Button
              isOutline
              isDisabled={isSearchDisabled}
              size='small'
              variant='info'
              text='Find Data Sheet'
              handleClick={() => findDataSheet()}
            />
          </div>
        </div>
      </>
    );
  }
);

export default FindDataSheet;
