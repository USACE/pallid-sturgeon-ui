import React from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import DownloadAsCSV from 'app-components/downloadAsCSV';
import Pagination from 'app-components/pagination';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const SupplementalTable = ({ rowData = [], itemCount = 0, handleChange = () => {} }) => (
  <>
    <DownloadAsCSV content={rowData} filePrefix='supplemental-datasheets' />
    <div className='ag-theme-balham' style={{ width: '100%', height: '400px' }}>
      <AgGridReact rowData={rowData}>
        <AgGridColumn field='edit' />
        <AgGridColumn field='fid' />
        <AgGridColumn field='mrId' />
        <AgGridColumn field='tagnumber' headerName='Tag Number' />
        <AgGridColumn field='fFid' />
        <AgGridColumn field='hatcheryOrigin' />
        <AgGridColumn field='comments' />
        <AgGridColumn field='uploadedBy' />
      </AgGridReact>
    </div>
    <Pagination
      className='mt-2'
      defaultItemsPerPage={20}
      itemCount={itemCount}
      handlePageChange={(pageNumber, pageSize) => handleChange(pageNumber, pageSize)}
    />
  </>
);

export default SupplementalTable;
