import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

import Button from 'app-components/button';
import DownloadAsCSV from 'app-pages/data-summaries/datasheet/components/downloadAsCSV';
import Icon from 'app-components/icon';
import Pagination from 'app-components/pagination';
import Select from 'app-components/select';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import '../dataentry.scss';

const SitesListTable = connect(
  'doModalOpen',
  ({
    doModalOpen,
  }) => {
    const [bendFilter, setBendFilter] = useState('');
    const [seasonFilter, setSeasonFilter] = useState('');
    const [segmentFilter, setSegmentFilter] = useState('');
    const [projectFilter, setProjectFilter] = useState('');

    return (
      <>
        <div className='row'>
          <div className='col-md-3'>
            <div className='form-group'>
              <label><small>Select Project</small></label>
              <Select
                onChange={value => setProjectFilter(value)}
                value={projectFilter}
                placeholderText='Project...'
                options={[]}
              />
            </div>
          </div>
          <div className='col-md-3 pl-0'>
            <div className='form-group'>
              <label><small>Select Segment</small></label>
              <Select
                onChange={value => setSegmentFilter(value)}
                value={segmentFilter}
                placeholderText='Segment...'
                options={[]}
              />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-3'>
            <div className='form-group'>
              <label><small>Select Season</small></label>
              <Select
                onChange={value => setSeasonFilter(value)}
                value={seasonFilter}
                placeholderText='Season...'
                options={[]}
              />
            </div>
          </div>
          <div className='col-md-3 pl-0'>
            <div className='form-group'>
              <label><small>Select Bend</small></label>
              <Select
                onChange={value => setBendFilter(value)}
                value={bendFilter}
                placeholderText='Bend...'
                options={[]}
              />
            </div>
          </div>
          <div className='col-md-2 align-self-end pl-1 pb-3'>
            <Button
              isOutline
              size='small'
              variant='dark'
              text='Clear Filters'
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12 pl-3'>
            <span className='info-message mr-1'><Icon icon='help-circle' /></span>
            <span className='info-message'>Please make selections from the drop down lists to go to the Missouri River data sheets associated with your selection.
            </span>
          </div>
        </div>
        <div className='pt-3'>
          <DownloadAsCSV filePrefix='site-table' content={[]} />
          <div className='ag-theme-balham' style={{ height: '600px', width: '100%' }}>
            <AgGridReact rowData={[]}>
              <AgGridColumn field='edit' />
              <AgGridColumn field='fieldOffice' />
              <AgGridColumn field='project' />
              <AgGridColumn field='segment' />
              <AgGridColumn field='season' />
              <AgGridColumn field='sampleUnit' />
              <AgGridColumn field='sampleUnitType' />
              <AgGridColumn field='bendrn' headerName='Bend R/N' />
              <AgGridColumn field='bendRiverMile' />
            </AgGridReact>
          </div>
          <Pagination
            itemCount={0}
            handlePageChange={(newPage, pageSize) => console.log(newPage, pageSize)}
          />
        </div>
      </>
    );
  }
);

export default SitesListTable;
