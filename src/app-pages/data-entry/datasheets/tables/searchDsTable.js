import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';
import SearchIdCellRenderer from 'common/gridCellRenderers/searchIdCellRenderer';

import { Row } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const SearchDsTable = connect(
  'doUpdateUrl',
  'selectSearchEffortSitesDatasheetData',
  ({
    doUpdateUrl,
    searchEffortSitesDatasheetData,
  }) => {
    const telemetryCellStyle = (params) => ({
      backgroundColor: params.data.bkgColor,
    });

    return (
      <>
        <Row>
          <div className='col-md-9 col-xs-12'>
            <Button
              isOutline
              size='small'
              variant='success'
              text='Add Search Effort Datasheet'
              title='Add Search Effort Datasheet'
              icon={<Icon icon='plus' />}
              className='btn-width'
              handleClick={() => doUpdateUrl('/sites-list/datasheet/searchEffort-create')}
            />
          </div>
          <div className='col-md-3 col-xs-12'>
            <Button
              isOutline
              size='small'
              variant='info'
              text='Export as CSV'
              icon={<Icon icon='download' />}
              className='float-right btn-width'
              // handleClick={() => doFetchAllDatasheet('search-datasheet')}
            />
          </div>
        </Row>
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact
            rowHeight={35}
            rowData={searchEffortSitesDatasheetData}
            defaultColDef={{
              width: 100,
            }}
            frameworkComponents={{
              searchIdCellRenderer: SearchIdCellRenderer,
            }}
          >
            <AgGridColumn field='seId' headerName='SE ID' cellRenderer='searchIdCellRenderer'  cellRendererParams={{ uri: '/sites-list/datasheet/searchEffort-edit', type: 'searchEffort' }} sortable unSortIcon />
            <AgGridColumn field='telemetryCount' headerName='Telemetry' width={130} cellStyle={telemetryCellStyle} cellRenderer='searchIdCellRenderer' cellRendererParams={{ uri: '/sites-list/datasheet/searchEffort-edit', type: 'telemetry', tab: 1}} sortable unSortIcon/>
            <AgGridColumn field='searchTypeCode' width={150} sortable unSortIcon />
            <AgGridColumn field='startTime' sortable unSortIcon />
            <AgGridColumn field='startLatitude' width={150} sortable unSortIcon />
            <AgGridColumn field='startLongitude' width={150} sortable unSortIcon />
            <AgGridColumn field='stopTime' sortable unSortIcon />
            <AgGridColumn field='stopLatitude' width={150} sortable unSortIcon />
            <AgGridColumn field='stopLongitude' width={150} sortable unSortIcon />
            <AgGridColumn field='temp' sortable unSortIcon />
            <AgGridColumn field='conductivity' width={125} sortable unSortIcon />
            <AgGridColumn field='recorder' sortable unSortIcon />
            <AgGridColumn field='editInitials' width={125} sortable unSortIcon />
            <AgGridColumn field='lastEditComment' width={200} sortable unSortIcon />
            <AgGridColumn field='uploadedBy' width={200} sortable unSortIcon />
          </AgGridReact>
        </div>
      </>
    );});

export default SearchDsTable;
