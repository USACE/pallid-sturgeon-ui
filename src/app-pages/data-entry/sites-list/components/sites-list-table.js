import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

import DownloadAsCSV from 'app-components/downloadAsCSV';
import SiteIdCellRenderer from 'common/gridCellRenderers/siteIdCellRenderer';

import { sitesExportHeaders } from './_shared/helper';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const SitesListTable = connect(
  'selectExportsData',
  'selectSitesData',
  ({
    exportsData,
    sitesData,
  }) => {
    const cellStyle = (params) => ({
      backgroundColor: params.data.bkgColor,
    });

    return (
      <div className='pt-3'>
        <DownloadAsCSV filePrefix='sites-list' content={exportsData} headers={sitesExportHeaders} />
        <div className='ag-theme-balham' style={{ height: '600px', width: '100%' }}>
          <AgGridReact
            rowHeight={35}
            defaultColDef={{
              width: 150
            }}
            rowData={sitesData}
            frameworkComponents={{
              siteIdCellRenderer: SiteIdCellRenderer
            }}
          >
            <AgGridColumn field='siteId' cellRenderer='siteIdCellRenderer' cellRendererParams={{ edit: true }} />
            <AgGridColumn field='year' />
            <AgGridColumn field='fieldoffice' />
            <AgGridColumn field='projectId' />
            <AgGridColumn field='segmentId' />
            <AgGridColumn field='season' />
            <AgGridColumn field='bend' headerName='Sample Unit' cellStyle={cellStyle} cellRenderer='siteIdCellRenderer' cellRendererParams={{ edit: false }} />
            <AgGridColumn field='sampleUnitType' headerName='Sample Unit Type' />
            <AgGridColumn field='bendrn' headerName='Bend R/N' />
            <AgGridColumn field='bendRiverMile' />
            <AgGridColumn field='complete' />
            <AgGridColumn field='approved' />
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
