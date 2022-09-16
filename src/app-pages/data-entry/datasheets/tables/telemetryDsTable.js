import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import Icon from 'app-components/icon';
import Pagination from 'app-components/pagination';
import DataHeader from '../components/dataHeader';
import Approval from '../components/approval';
import { Row } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';
import TelemetryIdCellRenderer from 'common/gridCellRenderers/telemetryIdCellRenderer';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

// tableId = 4604 For testing

const TelemetryDsTable = connect(
  'doUpdateUrl',
  'selectDataEntryData',
  'selectDataEntryLastParams',
  'selectDataEntry',
  ({
    doUpdateUrl,
    dataEntryData,
    dataEntryLastParams,
    dataEntry,
  }) => (
    <div className='container-fluid overflow-auto'>
      <Row>
        <div className='col-8'>
          <h4>Search Effort Datasheet - Telemetry Datasheets </h4>
        </div>
      </Row>
      {/* @TODO: include component props */}
      {/* Top Level Info */}
      <DataHeader />
      {/* Approval */}
      <Approval />
      {/* Telemetry Data Table */}
      <Card className='mt-3'>
        <Card.Header text='Telemetry Datasheets' />
        <Card.Body>
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
            text='Create Telemetry Datasheet'
            title='Create Telemetry Datasheet'
            className='float-right mr-2'
            handleClick={() => doUpdateUrl('/sites-list/datasheet/telemetry-create')}
          />
          <div className='ag-theme-balham mt-2' style={{ height: '600px', width: '100%' }}>
            <AgGridReact
              defaultColDef={{
                width: 100,
              }}
              rowHeight={35}
              rowData={dataEntry.data}
              frameworkComponents={{
                telemetryIdCellRenderer: TelemetryIdCellRenderer,
              }}
            >
              <AgGridColumn field='tId' headerName='Telemetry ID' cellRenderer='telemetryIdCellRenderer' cellRendererParams={{ paramType: 'tableId', uri: '/sites-list/datasheet/telemetry-edit' }} sortable unSortIcon />
              <AgGridColumn field='tFid' sortable unSortIcon />
              <AgGridColumn field='seId' headerName='Search Effort ID' sortable unSortIcon />
              <AgGridColumn field='captureLatitude' sortable unSortIcon />
              <AgGridColumn field='captureLongitude' sortable unSortIcon />
              <AgGridColumn field='captureDate' headerName='Capture Time' sortable unSortIcon />
              <AgGridColumn field='conductivity' sortable unSortIcon />
              <AgGridColumn field='depth' sortable unSortIcon />
              <AgGridColumn field='frequencyIdCode' sortable unSortIcon />
              <AgGridColumn field='gravel' sortable unSortIcon />
              <AgGridColumn field='macroId' sortable unSortIcon />
              <AgGridColumn field='mesoId' sortable unSortIcon />
              <AgGridColumn field='positionConfidence' sortable unSortIcon />
              <AgGridColumn field='radioTagNum' sortable unSortIcon />
              <AgGridColumn field='sand' sortable unSortIcon />
              <AgGridColumn field='silt' sortable unSortIcon />
              <AgGridColumn field='temp' sortable unSortIcon />
              <AgGridColumn field='turbidity' sortable unSortIcon />
              <AgGridColumn field='comments' sortable unSortIcon />
              <AgGridColumn field='uploadedBy' sortable unSortIcon />
              <AgGridColumn field='editInitials' sortable unSortIcon />
              <AgGridColumn field='lastEditComment' sortable unSortIcon />
              <AgGridColumn field='checkby' sortable unSortIcon />
            </AgGridReact>
          </div>
          {/* <Pagination
              className='mt-2'
              itemCount={totalCount}
              handlePageChange={(pageNumber, itemsPerPage) => setPagination({ pageNumber, itemsPerPage })}
            /> */}
        </Card.Body>
      </Card>
    </div>
  )
);

export default TelemetryDsTable;
