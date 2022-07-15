import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const TelemetryTable = ({ doFetchAllDatasheet, rowData = [] }) => (
  <>
    <Button
      isOutline
      size='small'
      variant='info'
      text='Export as CSV'
      icon={<Icon icon='download' />}
      handleClick={() => doFetchAllDatasheet('telemetry-datasheet')}
    />
    <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
      <AgGridReact rowData={rowData}>
        <AgGridColumn headerName='ID' field='tId' />
        {/* <AgGridColumn headerName='T FID' field='tFid' />
        <AgGridColumn headerName='Se ID' field='seId' /> */}
        {/* <AgGridColumn headerName='UniqueID' field='uniqueId' />
        <AgGridColumn headerName='Year' field='year' />
        <AgGridColumn headerName='Field Office' field='fieldOffice' />
        <AgGridColumn headerName='Project' field='project' />
        <AgGridColumn headerName='Segment' field='segment' />
        <AgGridColumn headerName='Season' field='season' /> */}
        <AgGridColumn headerName='Bend' field='bend' />
        <AgGridColumn headerName='Conductivity' field='conductivity' sortable unSortIcon />
        <AgGridColumn headerName='Radio Tag Number' field='radioTagNum' />
        <AgGridColumn headerName='Frequency' field='frequencyIdCode' />
        <AgGridColumn headerName='Capture Time' field='captureTime' />
        {/* <AgGridColumn headerName='Capture Latitude' field='captureLatitude' />
        <AgGridColumn headerName='Capture Longitude' field='captureLongitude' />
        <AgGridColumn headerName='Position Confidence' field='positionConfidence' />
        <AgGridColumn headerName='Macro Habitat Code' field='macroId' />
        <AgGridColumn headerName='Meso Habitat Code' field='mesoId' />
        <AgGridColumn headerName='Depth' field='depth' /> */}
      </AgGridReact>
    </div>
  </>
);

export default connect('doFetchAllDatasheet', TelemetryTable);
