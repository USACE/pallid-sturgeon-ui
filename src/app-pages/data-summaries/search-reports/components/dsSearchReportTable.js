import React from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import DownloadAsCSV from '../../datasheet/components/downloadAsCSV';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

/**

conductivity: null
​​​dsId: 2
​​​recorder: "JRH"
​​​seFid: "20200502-141558024-002"
​​​seId: 21
​​​searchDate: "2020-05-02T00:00:00Z"
​​​searchTypeCode: "IN"
​​​siteFid: ""
​​​startLatitude: 42.48193
​​​startLongitude: -96.50049
​​​startTime: "14:34:13"
​​​stopLatitude: 42.49041
​​​stopLongitude: -96.44005
​​​stopTime: "15:32:49"
temp: "15"

 */

const DSSearchReportTable = ({
  rowData,
}) => (
  <>
    <div className='ag-theme-balham' style={{ width: '100%', height: '600px' }}>
      <AgGridReact rowData={rowData}>
        {/* <AgGridColumn field='link' sortable /> */}
        <AgGridColumn field='seId' sortable />
        <AgGridColumn field='searchDate' sortable />
        <AgGridColumn field='recorder' sortable />
        <AgGridColumn field='searchTypeCode' sortable />
        <AgGridColumn field='startTime' sortable />
        <AgGridColumn field='startLatitude' sortable />
        <AgGridColumn field='startLongitude' sortable />
        <AgGridColumn field='stopTime' sortable />
        <AgGridColumn field='stopLatitude' sortable />
        <AgGridColumn field='stopLongitude' sortable />
        <AgGridColumn field='seFid' sortable />
        <AgGridColumn field='dsId' sortable />
        {/* <AgGridColumn field='Site ID' sortable /> */}
        <AgGridColumn field='siteFid' sortable />
        <AgGridColumn field='temp' sortable />
        <AgGridColumn field='conductivity' sortable />
      </AgGridReact>
    </div>
  </>
);

export default DSSearchReportTable;
