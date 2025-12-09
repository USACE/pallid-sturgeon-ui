import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { mdiDownload } from '@mdi/js';

import Button from '@components/button';
import Icon from '@components/icon/icon';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { dateFormatter } from '@src/common/gridHelpers/ag-grid-helper';

const TelemetryTable = connect(
  'doFetchAllDatasheet',
  'selectTelemetryDataSummary',
  ({ doFetchAllDatasheet, telemetryDataSummary }) => {
    const { data } = telemetryDataSummary;

    return (
      <>
        <Button
          isOutline
          size='small'
          variant='info'
          text='Export as CSV'
          icon={<Icon path={mdiDownload} />}
          handleClick={() => doFetchAllDatasheet('telemetry-datasheet')}
        />
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact
            rowData={data}
            defaultColDef={{
              width: 150,
            }}
          >
            <AgGridColumn field='year' sortable unSortIcon />
            <AgGridColumn field='fieldOffice' sortable unSortIcon />
            <AgGridColumn field='project' sortable unSortIcon />
            <AgGridColumn field='segment' sortable unSortIcon />
            <AgGridColumn field='season' sortable unSortIcon />
            <AgGridColumn headerName='Site Bend' field='bend' sortable unSortIcon />
            <AgGridColumn headerName='Bend R/M' field='bend' sortable unSortIcon />
            <AgGridColumn headerName='Telemetry ID' field='tId' sortable unSortIcon />
            <AgGridColumn headerName='Search Effort ID' field='seId' sortable unSortIcon />
            <AgGridColumn headerName='Site ID' field='siteId' sortable unSortIcon />
            <AgGridColumn
              field='searchDate'
              valueGetter={(params) => dateFormatter(params.data.searchDate)}
              sortable
              unSortIcon
            />
            <AgGridColumn field='searchDay' sortable unSortIcon />
            <AgGridColumn headerName='Radio Tag Number' field='radioTagNum' sortable unSortIcon />
            <AgGridColumn headerName='Frequency' field='frequencyIdCode' sortable unSortIcon />
            <AgGridColumn field='captureTime' sortable unSortIcon />
            <AgGridColumn field='captureLatitude' sortable unSortIcon />
            <AgGridColumn field='captureLongitude' sortable unSortIcon />
            <AgGridColumn field='positionConfidence' sortable unSortIcon />
            <AgGridColumn field='macroId' sortable unSortIcon />
            <AgGridColumn field='mesoId' sortable unSortIcon />
            <AgGridColumn field='depth' sortable unSortIcon />
            <AgGridColumn field='temp' sortable unSortIcon />
            <AgGridColumn field='conductivity' sortable unSortIcon />
            <AgGridColumn field='turbidity' sortable unSortIcon />
            <AgGridColumn field='silt' sortable unSortIcon />
            <AgGridColumn field='sand' sortable unSortIcon />
            <AgGridColumn field='gravel' sortable unSortIcon />
            <AgGridColumn field='comments' sortable unSortIcon />
          </AgGridReact>
        </div>
      </>
    );
  }
);

export default TelemetryTable;
