import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

import EditCellRenderer from 'common/gridCellRenderers/editCellRenderer';
import MrIdCellRenderer from 'common/gridCellRenderers/mrIdCellRenderer';
import { dateFormatter } from 'common/gridHelpers/ag-grid-helper';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const MissouriDsTable = connect(
  'doFetchExportMoriverDataEntries',
  'doUpdateUrl',
  'selectMoriverSitesDatasheetData',
  ({
    doFetchExportMoriverDataEntries,
    doUpdateUrl,
    moriverSitesDatasheetData,
  }) => {
    const fishCellStyle = (params) => ({
      backgroundColor: params.data.bkgColor,
    });

    const suppCellStyle = (params) => ({
      backgroundColor: params.data.suppBkgColor,
    });

    const procCellStyle = (params) => ({
      backgroundColor: params.data.procBkgColor,
    });

    return (
      <>
        <Button
          isOutline
          size='small'
          variant='info'
          text='Export as CSV'
          icon={<Icon icon='download' />}
          handleClick={() => doFetchExportMoriverDataEntries({ siteID: moriverSitesDatasheetData[0].siteId })}
        />
        <Button
          isOutline
          size='small'
          variant='info'
          text='Create Missouri River Datasheet'
          title='Create Missouri River Datasheet'
          className='float-right mr-2'
          handleClick={() => doUpdateUrl('/sites-list/datasheet/missouriRiver-create')}
        />
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact
            rowHeight={35}
            rowData={moriverSitesDatasheetData}
            defaultColDef={{
              width: 150,
            }}
            frameworkComponents={{
              editCellRenderer: EditCellRenderer,
              mrIdCellRenderer: MrIdCellRenderer
            }}
          >
            <AgGridColumn field='mrId' headerName='MR ID' width={100} cellRenderer='mrIdCellRenderer' cellRendererParams={{ uri: '/sites-list/datasheet/missouriRiver-edit', type: 'missouriRiver'}} sortable unSortIcon />
            <AgGridColumn field='fishCount' headerName='Fish' width={130} cellStyle={fishCellStyle} cellRenderer='mrIdCellRenderer' cellRendererParams={{ uri: '/sites-list/datasheet/missouriRiver-edit', type: 'fish', tab: 1}} sortable unSortIcon />
            <AgGridColumn field='suppCount' headerName='Supplemental' width={130} cellStyle={suppCellStyle} cellRenderer='mrIdCellRenderer' cellRendererParams={{ uri: '/sites-list/datasheet/missouriRiver-edit', type: 'supplemental', tab: 2}} sortable unSortIcon />
            <AgGridColumn field='procCount' headerName='Procedure' width={130} cellStyle={procCellStyle} cellRenderer='mrIdCellRenderer' cellRendererParams={{ uri: '/sites-list/datasheet/missouriRiver-edit', type: 'procedure', tab: 3}} sortable unSortIcon />
            <AgGridColumn field='mrFid' headerName='Field ID' width={170} resizable sortable unSortIcon />
            <AgGridColumn field='setdate' headerName='Date' valueGetter={params => dateFormatter(params.data.setdate)} sortable unSortIcon />
            <AgGridColumn field='subsample' sortable unSortIcon />
            <AgGridColumn field='gear' headerName='Gear Code' sortable unSortIcon />
            <AgGridColumn field='recorder' headerName='Recorder' sortable unSortIcon />
            <AgGridColumn field='checkby' headerName='Checked?' sortable unSortIcon />
            {/* @TODO: Check with Tisha on approved field. */}
            <AgGridColumn headerName='Approved?' sortable unSortIcon />
          </AgGridReact>
        </div>
      </>
    );
  }
);

export default MissouriDsTable;
