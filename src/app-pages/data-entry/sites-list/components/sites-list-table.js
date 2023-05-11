import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

import Button from 'app-components/button';
import Icon from 'app-components/icon';
import SiteIdCellRenderer from 'common/gridCellRenderers/siteIdCellRenderer';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import './../../../data-summaries/data-summary.scss';

const SitesListTable = connect(
  'doFetchExportsSites',
  'selectSitesData',
  'selectSitesParams',
  ({
    doFetchExportsSites,
    sitesData,
    sitesParams,
  }) => {
    const cellStyle = (params) => ({
      backgroundColor: params.data.bkgColor,
    });

    return (
      <div className='pt-3'>
        <Button
          size='small'
          variant='info'
          text='Export to CSV'
          className='btn-width'
          icon={<Icon icon='download' />}
          onClick={() => doFetchExportsSites(sitesParams)}
          isOutline
          isDisabled={sitesData.length === 0}
        />
        <div className='ag-theme-balham mt-2' style={{ height: '600px', width: '100%' }}>
          <AgGridReact
            rowHeight={35}
            defaultColDef={{
              width: 150
            }}
            rowData={sitesData}
            frameworkComponents={{
              siteIdCellRenderer: SiteIdCellRenderer,
            }}
          >
            <AgGridColumn field='siteId' headerName='Site ID' cellRenderer='siteIdCellRenderer' cellRendererParams={{ edit: true }} width={100} sortable unSortIcon />
            <AgGridColumn field='year' width={100} sortable unSortIcon />
            <AgGridColumn field='fieldoffice' headerName='Field Office' sortable unSortIcon />
            <AgGridColumn field='projectId' headerName='Project' sortable unSortIcon />
            <AgGridColumn field='segmentId' headerName='Segment' sortable unSortIcon />
            <AgGridColumn field='season' sortable unSortIcon />
            <AgGridColumn field='bend' headerName='Sample Unit' cellStyle={cellStyle} cellRenderer='siteIdCellRenderer' cellRendererParams={{ edit: false }} sortable unSortIcon />
            <AgGridColumn field='sampleUnitType' headerName='Sample Unit Type' sortable unSortIcon />
            <AgGridColumn field='bendrn' headerName='Bend R/N' sortable unSortIcon />
            <AgGridColumn field='bendRiverMile' sortable unSortIcon />
            <AgGridColumn field='editInitials' sortable unSortIcon />
            <AgGridColumn field='last_edit_comment' headerName='Last Edit Comment' sortable unSortIcon />
            <AgGridColumn field='uploadedBy' sortable unSortIcon />
          </AgGridReact>
        </div>
      </div>
    );
  }
);

export default SitesListTable;
