import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

import Button from 'app-components/button';
import Icon from 'app-components/icon';
import SiteIdCellRenderer from 'common/gridCellRenderers/siteIdCellRenderer';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

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
            <AgGridColumn field='siteId' headerName='Site ID' cellRenderer='siteIdCellRenderer' cellRendererParams={{ edit: true }} />
            <AgGridColumn field='year' />
            <AgGridColumn field='fieldoffice' headerName='Field Office' />
            <AgGridColumn field='projectId' headerName='Project' />
            <AgGridColumn field='segmentId' headerName='Segment' />
            <AgGridColumn field='season' />
            <AgGridColumn field='sampleUnitType' headerName='Sample Unit Type' />
            <AgGridColumn field='bend' headerName='Sample Unit' cellStyle={cellStyle} cellRenderer='siteIdCellRenderer' cellRendererParams={{ edit: false }} />
            <AgGridColumn field='bendrn' headerName='Bend R/N' />
            <AgGridColumn field='brmId' headerName='BRM ID' />
            <AgGridColumn field='editInitials' />
            <AgGridColumn field='last_edit_comment' />
            <AgGridColumn field='uploadedBy' />
          </AgGridReact>
        </div>
      </div>
    );
  }
);

export default SitesListTable;
