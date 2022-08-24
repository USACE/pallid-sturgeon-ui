import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import Pagination from 'app-components/pagination';

import EditCellRenderer from 'common/gridCellRenderers/editCellRenderer';
import SpeciesEditor from 'common/gridCellEditors/speciesEditor';

// For testing
// 92457 (Field Office: MO)

const FishForm = connect(
  'doFetchFishDataByMrId',
  'doFetchMoRiverDataEntry',
  'doFetchSupplementalDataEntry',
  'doUpdateFishDataEntry',
  'selectDataEntryData',
  'selectDataEntryFishData',
  ({
    doFetchFishDataByMrId,
    doFetchMoRiverDataEntry,
    doFetchSupplementalDataEntry,
    doUpdateFishDataEntry,
    dataEntryData,
    dataEntryFishData,
  }) => {
    const {
      fid,
      mrId,
      year,
      fieldOffice,
      project,
      segment,
      season,
      sampleUnitType,
      sampleUnit,
      bendrn,
      bendRiverMile,
    } = dataEntryData;

    const { items = [], totalCount = 0 } = dataEntryFishData;

    const [pagination, setPagination] = useState({ itemsPerPage: 20, pageNumber: 0 });
    const pagedItems = items.filter((_e, i) => (
      i >= pagination.pageNumber * pagination.itemsPerPage &&
      i < pagination.pageNumber * pagination.itemsPerPage + pagination.itemsPerPage
    ));

    useEffect(() => {
      doFetchFishDataByMrId();
    }, [doFetchFishDataByMrId]);

    return (
      <>
        <div className='row'>
          <div className='col-8'>
            <h4>Fish Datasheets for Missouri River Datasheet {mrId}</h4>
          </div>
          <div className='col-4'>
            <div className='btn-group float-right'>
              <Button
                isOutline
                size='small'
                variant='info'
                text='Missouri River Datasheet'
                handleClick={() => doFetchMoRiverDataEntry({ tableId: mrId })}
              />
              <Button
                isOutline
                size='small'
                variant='info'
                text='Supplemental Datasheets'
                handleClick={() => doFetchSupplementalDataEntry({ mrId })}
              />
            </div>
          </div>
        </div>

        {/* Top Level Info */}
        <Card className='mt-3'>
          <Card.Body>
            <div className='row'>
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
                    {/* <input
                      disabled={formComplete}
                      type='checkbox'
                      title='No Turbidity Field'
                      className='form-control mt-1'
                      style={{ height: '15px', width: '15px', margin: 'auto' }}
                      checked={!!complete}
                      onClick={() => dispatch({ type: 'update', field: 'complete', value: !!complete ? '' : '1' })}
                      onChange={() => {}}
                    /> */}
                  </div>
                </div>
              </div>
              <div className='col-1'>
                <label><small>QC</small></label>
                {/* <input
                  disabled={formComplete}
                  type='text'
                  title='No Turbidity Field'
                  className='form-control mt-1'
                  value={qc}
                  onChange={e => dispatch({ type: 'update', field: 'qc', value: e.target.value })}
                /> */}
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
                  {/* {!formComplete && (
                    <Button
                      size='small'
                      variant='success'
                      text='Save'
                      handleClick={() => doUpdateMoRiverDataEntry(formData)}
                    />
                  )} */}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
        
        {/* Fish Data Table */}
        <Card className='mt-3'>
          <Card.Header text='Fish Datasheets' />
          <Card.Body>
            <div className='ag-theme-balham' style={{ height: '600px', width: '100%' }}>
              <AgGridReact
                defaultColDef={{
                  width: 120,
                  editable: true,
                  lockPinned: true,
                }}
                rowHeight={35}
                rowData={pagedItems}
                editType='fullRow'
                onRowValueChanged={({ data }) => doUpdateFishDataEntry(data)}
                frameworkComponents={{
                  editCellRenderer: EditCellRenderer,
                  speciesEditor: SpeciesEditor,
                }}
              >
                <AgGridColumn
                  field='edit'
                  width={90}
                  pinned
                  lockPosition
                  cellRenderer='editCellRenderer'
                  editable={false}
                />
                <AgGridColumn field='id' headerName='Field ID' />
                <AgGridColumn field='fid' headerName='F ID' />
                <AgGridColumn field='panelhook' headerName='Panel Hook' />
                <AgGridColumn field='species' cellEditor='speciesEditor' />
                <AgGridColumn field='length' />
                <AgGridColumn field='weight' />
                <AgGridColumn field='fishcount' headerName='Count' />
                <AgGridColumn field='ftprefix' headerName='FT Prefix' />
                {/* <AgGridColumn field='floytag' /> */}
                <AgGridColumn field='ftmr' headerName='M/R' />
                <AgGridColumn field='ftnum' headerName='Genetics Vial #' />
                {/* <AgGridColumn field='condition' /> */}
                <AgGridColumn field='finCurl' />
                <AgGridColumn field='otolith' />
                <AgGridColumn field='rayspine' headerName='Ray Spine' />
                {/* <AgGridColumn field='kn' /> */}
                {/* <AgGridColumn field='wr' /> */}
                <AgGridColumn field='scale' />
                {/* <AgGridColumn field='rsd' /> */}
                <AgGridColumn field='bait' />
              </AgGridReact>
            </div>
            <Pagination
              className='mt-2'
              itemCount={totalCount}
              handlePageChange={(pageNumber, itemsPerPage) => setPagination({ pageNumber, itemsPerPage })}
            />
          </Card.Body>
        </Card>
      </>
    );
  }
);

export default FishForm;
