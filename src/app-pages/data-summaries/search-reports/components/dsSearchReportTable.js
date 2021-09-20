import React from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import DownloadAsCSV from 'app-components/downloadAsCSV';

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
        {/* <AgGridColumn field='link' sortable unSortIcon /> */}
        <AgGridColumn field='seId' sortable unSortIcon />
        <AgGridColumn field='searchDate' sortable unSortIcon />
        <AgGridColumn field='recorder' sortable unSortIcon />
        <AgGridColumn field='searchTypeCode' sortable unSortIcon />
        <AgGridColumn field='startTime' sortable unSortIcon />
        <AgGridColumn field='startLatitude' sortable unSortIcon />
        <AgGridColumn field='startLongitude' sortable unSortIcon />
        <AgGridColumn field='stopTime' sortable unSortIcon />
        <AgGridColumn field='stopLatitude' sortable unSortIcon />
        <AgGridColumn field='stopLongitude' sortable unSortIcon />
        <AgGridColumn field='seFid' sortable unSortIcon />
        <AgGridColumn field='dsId' sortable unSortIcon />
        <AgGridColumn field='siteFid' sortable unSortIcon />
        <AgGridColumn field='temp' sortable unSortIcon />
        <AgGridColumn field='conductivity' sortable unSortIcon />
      </AgGridReact>
    </div>
  </>
);

export default DSSearchReportTable;
