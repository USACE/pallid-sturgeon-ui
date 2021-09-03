import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

import DownloadAsCSV from 'app-components/downloadAsCSV';
import EditCellRenderer from 'common/gridCellRenderers/editCellRenderer';
import Pagination from 'app-components/pagination';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const SitesListTable = connect(
  'doModalOpen',
  ({
    doModalOpen,
  }) => (
    <div className='pt-3'>
      <DownloadAsCSV filePrefix='site-table' content={[]} />
      <div className='ag-theme-balham' style={{ height: '600px', width: '100%' }}>
        <AgGridReact
          suppressClickEdit
          rowHeight={35}
          defaultColDef={{
            editable: true,
          }}
          rowData={[{
            fieldOffice: 'MO',
            project: 'Test Project',
            segment: 'Segment 1',
            season: 'Summer?',
            sampleUnit: 'Bend',
            sampleUnitType: 'n/a',
            bendrn: '123',
            bendRiverMile: '56.5',
          },{
            fieldOffice: 'KC',
            project: 'Test Project 2',
            segment: 'Segment 1',
            season: 'Spring?',
            sampleUnit: 'Bend 2',
            sampleUnitType: 'n/a',
            bendrn: '321',
            bendRiverMile: '152.5',
          }]}
          editType='fullRow'
          frameworkComponents={{
            editCellRenderer: EditCellRenderer,
          }}
        >
          <AgGridColumn
            field='edit'
            width={90}
            lockPosition
            cellRenderer='editCellRenderer'
            editable={false}
          />
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
        handlePageChange={(newPage, pageSize) => {}}
      />
    </div>
  )
);

export default SitesListTable;
