import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';
import Select from 'app-components/select';

import { Input, Row } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';

import '../../dataentry.scss';
import '../../../data-summaries/data-summary.scss';

const FindDataSheet = connect(
  'doFetchMoRiverDataEntry',
  'doFetchSupplementalDataEntry',
  'doFetchFishDataEntry',
  'doFetchSearchDataEntry',
  'doFetchTelemetryDataEntry',
  'doFetchProcedureDataEntry',
  'doUpdateUrl',
  'selectUserRole',
  ({
    doFetchMoRiverDataEntry,
    doFetchSupplementalDataEntry,
    doFetchFishDataEntry,
    doFetchSearchDataEntry,
    doFetchTelemetryDataEntry,
    doFetchProcedureDataEntry,
    doUpdateUrl,
    userRole,
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
        id: userRole.id,
      };

      switch(dataSheetType) {
        case 'fish':
          doFetchFishDataEntry(params, () => doUpdateUrl('/sites-list/datasheet/fish-edit'), true);
          break;
        case 'supplemental':
          doFetchSupplementalDataEntry(params, () => doUpdateUrl('/sites-list/datasheet/supplemental-edit'), true);
          break;
        case 'missouriRiver':
          doFetchMoRiverDataEntry(params, () => doUpdateUrl('/sites-list/datasheet/missouriRiver-edit'), true);
          break;
        case 'searchEffort':
          doFetchSearchDataEntry(params, () => doUpdateUrl('/sites-list/datasheet/searchEffort-edit'), true);
          break;
        case 'telemetry':
          doFetchTelemetryDataEntry(params, () => doUpdateUrl('/sites-list/datasheet/telemetry-edit'), true);
          break;
        case 'procedures':
          doFetchProcedureDataEntry(params, () => doUpdateUrl('/sites-list/datasheet/procedure-edit'), true);
          break;
        default:
          console.log('Select a datasheet type');
          break;
      }
    };

    return (
      <>
        <div className='row d-flex flex-row'>
          <div className='col-md-3 col-xs-12'>
            <Row>
              <div className='col'>
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
            </Row>
          </div>
          <div className='col-md-4 col-xs-12'>
            <Row>
              <div className='col-md-5 col-sm-5 col-xs-5'>
                <div className='form-group'>
                  <Input
                    label='Table ID'
                    type='text'
                    className='form-control'
                    placeholder='Table ID...'
                    value={tableId}
                    onChange={e => setTableId(e.target.value)}
                  />
                </div>
              </div>
              <div className='col-md-1 col-sm-1 col-xs-1'>
                <span className='pt-4 mr-1 mb-3'>OR</span>
              </div>
              <div className='col-md-5 col-sm-5 col-xs-5'>
                <div className='form-group'>
                  <Input
                    label='Field ID'
                    type='text'
                    className='form-control'
                    placeholder='Field ID...'
                    value={fieldId}
                    onChange={e => setFieldId(e.target.value)}
                  />
                </div>
              </div>
            </Row>
          </div>
          {dataSheetType === 'supplemental' && (
            <div className='col-md-5 col-xs-12'>
              <Row>
                <div className='col-md-5 col-sm-5 col-xs-5'>
                  <div className='form-group'>
                    <Input
                      label='Genetic Vial #'
                      disabled={!isSupplemental}
                      type='text'
                      className='form-control'
                      placeholder='Genetic Vial #...'
                      value={geneticsVial}
                      onChange={e => setGeneticsVial(e.target.value)}
                    />
                  </div>
                </div>
                <div className='col-md-1 col-sm-1 col-xs-1'>
                  <span className='pt-4 mr-1 mb-3'>OR</span>
                </div>
                <div className='col-md-5 col-sm-5 col-xs-5'>
                  <div className='form-group'>
                    <Input
                      label='Pit Tag'
                      disabled={!isSupplemental}
                      type='text'
                      className='form-control'
                      placeholder='Pit Tag...'
                      value={pitTag}
                      onChange={e => setPitTag(e.target.value)}
                    />
                  </div>
                </div>
              </Row>
            </div>
          )}
        </div>
        <Row>
          <div className='col-12 mb-3'>
            <Icon icon='help-circle' />
            <span className='info-message ml-2'>Enter the ID for the type of datasheet selected (EX: Missouri River: MR_ID, Fish: F_ID, Supplemental: S_ID).</span>
            <span> For Supplemental datasheet, choices also include Genetics Vial # or Pit Tag.</span>
          </div>
          <div className='col-md-2 align-self-end'>
            <Button
              isOutline
              isDisabled={isSearchDisabled}
              size='small'
              variant='info'
              className='btn-width'
              text='Find Data Sheet'
              handleClick={() => findDataSheet()}
            />
          </div>
        </Row>
      </>
    );
  }
);

export default FindDataSheet;
