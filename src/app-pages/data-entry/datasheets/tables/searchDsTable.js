import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';
import SearchIdCellRenderer from 'common/gridCellRenderers/searchIdCellRenderer';
import TelemetryIdCellRenderer from 'common/gridCellRenderers/telemetryIdCellRenderer';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import NullRenderer from 'common/gridCellRenderers/nullRenderer';

const SearchDsTable = connect(
  'doUpdateUrl',
  'selectSearchEffortSitesDatasheetData',
  ({
    doUpdateUrl,
    searchEffortSitesDatasheetData,
  }) => (
    <>
      <Button
        isOutline
        size='small'
        variant='info'
        text='Export as CSV'
        icon={<Icon icon='download' />}
      // handleClick={() => doFetchAllDatasheet('search-datasheet')}
      />
      <Button
        isOutline
        size='small'
        variant='info'
        text='Create Search Effort Datasheet'
        title='Create Search Effort Datasheet'
        className='float-right mr-2'
        handleClick={() => doUpdateUrl('/sites-list/datasheet/searchEffort-create')}
      />
      <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
        <AgGridReact
          rowHeight={35}
          rowData={searchEffortSitesDatasheetData}
          defaultColDef={{
            width: 150,
          }}
          frameworkComponents={{
            searchIdCellRenderer: SearchIdCellRenderer,
            telemetryIdCellRenderer: TelemetryIdCellRenderer,
            nullRenderer: NullRenderer,
          }}
        >
          <AgGridColumn field='seId' headerName='Search ID' cellRenderer='searchIdCellRenderer'  cellRendererParams={{ uri: '/sites-list/datasheet/searchEffort-edit'}} sortable unSortIcon />
          {/* <AgGridColumn
            field='telemetryEntries'
            headerName='Telemetry Entries'
            width={150}
            cellRenderer='telemetryIdCellRenderer'
            cellRendererParams={{ paramType: 'fId', uri: '/sites-list/datasheet/telemetry' }}
          /> */}
          <AgGridColumn field='searchTypeCode' sortable unSortIcon />
          <AgGridColumn field='startTime' sortable unSortIcon />
          <AgGridColumn field='startLatitude' sortable unSortIcon />
          <AgGridColumn field='startLongitude' sortable unSortIcon />
          <AgGridColumn field='stopTime' sortable unSortIcon />
          <AgGridColumn field='stopLatitude' sortable unSortIcon />
          <AgGridColumn field='stopLongitude' sortable unSortIcon />
          <AgGridColumn field='temp' sortable unSortIcon />
          <AgGridColumn field='conductivity' sortable unSortIcon />
          <AgGridColumn field='recorder' sortable unSortIcon />
          <AgGridColumn field='editInitials' sortable unSortIcon />
          <AgGridColumn field='lastEditComment' sortable unSortIcon />
          <AgGridColumn field='lastUpdated' sortable unSortIcon />
          <AgGridColumn field='uploadedBy' sortable unSortIcon />
        </AgGridReact>
      </div>
    </>
  ));

export default SearchDsTable;
