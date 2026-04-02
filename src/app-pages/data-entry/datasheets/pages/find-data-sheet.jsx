import { useState } from 'react';
import { connect } from 'redux-bundler-react';
import { mdiHelpCircle } from '@mdi/js';

import Button from '@components/button';
import Breadcrumb from '@src/app-components/breadcrumb';
import Select from '@components/select';
import Icon from '@components/icon/icon';

import { Input, Row } from '@pages/data-entry/edit-data-sheet/forms/_shared/helper';

import '../../dataentry.scss';
import '@pages/data-summaries/data-summary.scss';

const datasheetTypeOptions = [
  { value: 'missouriRiver', text: 'Missouri River' },
  { value: 'fish', text: 'Fish' },
  { value: 'supplemental', text: 'Supplemental' },
  { value: 'telemetry', text: 'Telemetry' },
  { value: 'procedures', text: 'Procedures' },
  { value: 'searchEffort', text: 'Search Effort' },
];

const FindDataSheet = connect(
  'doFetchMoRiverDataEntry',
  'doFetchFishDataEntry',
  'doFetchSupplementalDataEntry',
  'doFetchProcedureDataEntry',
  'doFetchSearchDataEntry',
  'doFetchTelemetryDataEntry',
  'doUpdateCurrentTab',
  'selectUserRole',
  ({
    doFetchMoRiverDataEntry,
    doFetchFishDataEntry,
    doFetchSupplementalDataEntry,
    doFetchProcedureDataEntry,
    doFetchSearchDataEntry,
    doFetchTelemetryDataEntry,
    doUpdateCurrentTab,
    userRole,
  }) => {
    const [pitTag, setPitTag] = useState('');
    const [tableId, setTableId] = useState('');
    const [fieldId, setFieldId] = useState('');
    const [geneticsVial, setGeneticsVial] = useState('');
    const [dataSheetType, setDataSheetType] = useState('');

    const isSupplemental = dataSheetType === 'supplemental';
    const isSearchDisabled = !(dataSheetType && (tableId || fieldId || geneticsVial || pitTag));

    const findDataSheet = () => {
      const params = {
        pitTag,
        tableId,
        fieldId,
        geneticsVial,
        id: userRole.id,
        status: 2,
      };

      switch (dataSheetType) {
        case 'missouriRiver':
          doFetchMoRiverDataEntry(params, true, true, true);
          doUpdateCurrentTab(0);
          break;
        case 'fish':
          doFetchFishDataEntry(params, true, true);
          doUpdateCurrentTab(1);
          break;
        case 'supplemental':
          doFetchSupplementalDataEntry(params, true, true);
          doUpdateCurrentTab(2);
          break;
        case 'procedures':
          doFetchProcedureDataEntry(params, true, true);
          doUpdateCurrentTab(3);
          break;
        case 'searchEffort':
          doFetchSearchDataEntry(params, true, true, true);
          doUpdateCurrentTab(0);
          break;
        case 'telemetry':
          doFetchTelemetryDataEntry(params, true, true);
          doUpdateCurrentTab(1);
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
                  <label>
                    <small>Select Data Sheet Type</small>
                  </label>
                  <div className='select'>
                    <Select
                      onChange={(value) => setDataSheetType(value)}
                      value={dataSheetType}
                      placeholderText='Datasheet Type...'
                      options={datasheetTypeOptions}
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
                    onChange={(e) => setTableId(e.target.value)}
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
                    onChange={(e) => setFieldId(e.target.value)}
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
                      onChange={(e) => setGeneticsVial(e.target.value)}
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
                      onChange={(e) => setPitTag(e.target.value)}
                    />
                  </div>
                </div>
              </Row>
            </div>
          )}
        </div>
        <Row>
          <div className='col-12 mb-3'>
            <Icon focusable={false} path={mdiHelpCircle} />
            <span className='info-message ml-2'>
              Enter the ID for the type of datasheet selected (EX: Missouri River: MR_ID, Fish: F_ID, Supplemental:
              S_ID).
            </span>
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
