import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';
import SearchIdCellRenderer from 'common/gridCellRenderers/searchIdCellRenderer';
import TelemetryIdCellRenderer from 'common/gridCellRenderers/telemetryIdCellRenderer';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const SearchDsTable = connect(
  'doUpdateUrl',
  ({
    doUpdateUrl,
    rowData = []
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
          rowData={rowData}
          // onRowValueChanged={({ data }) => doUpdateRoleOffice(data)}
          defaultColDef={{
            width: 150,
          }}
          frameworkComponents={{
            searchIdCellRenderer: SearchIdCellRenderer,
            telemetryIdCellRenderer: TelemetryIdCellRenderer,
          }}
        >
          <AgGridColumn field='seId' headerName='Search ID' cellRenderer='searchIdCellRenderer' sortable unSortIcon />
          <AgGridColumn field='dsId' cellRenderer='telemetryIdCellRenderer' cellRendererParams={{ paramType: 'seId', uri: '/sites-list/datasheet/telemetry'}} sortable unSortIcon />
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
        </AgGridReact>
      </div>
    </>
  ));

export default SearchDsTable;
