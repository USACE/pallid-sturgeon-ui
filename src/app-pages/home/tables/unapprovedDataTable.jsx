import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';

import Pagination from '@components/pagination';
import MrIdCellRenderer from '@common/gridCellRenderers/mrIdCellRenderer';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { dateFormatter } from '@src/common/gridHelpers/ag-grid-helper';

const defaultColDef = { width: 100, sortable: true, unSortIcon: true };

const frameworkComponents = { mrIdCellRenderer: MrIdCellRenderer };

const columnDefs = [
  { field: 'ch', headerName: 'Error Log ID' },
  { field: 'mrId' },
  { field: 'errorDescription', width: 350, resizable: true },
  { field: 'errorFixed', width: 130 },
  { field: 'siteId', headerName: 'Site ID' },
  { field: 'year' },
  { field: 'worksheetId', headerName: 'Worksheet ID' },
  { field: 'worksheetTypeId', headerName: 'Worksheet Type ID' },
  { field: 'fieldId', headerName: 'Field ID' },
  { field: 'formId', headerName: 'Form ID' },
  { field: 'errorFixedDate', width: 150, valueGetter: (params) => dateFormatter(params.data.errorFixedDate) },
];

const UnapprovedDataTable = connect(
  'doSetHomePagination',
  'selectUnapprovedDataSheets',
  ({ doSetHomePagination, unapprovedDataSheets }) => {
    const { data, totalResults } = unapprovedDataSheets;

    return (
      <>
        <div className='ag-theme-balham' style={{ height: '600px', width: '100%' }}>
          <AgGridReact defaultColDef={defaultColDef} rowData={data} frameworkComponents={frameworkComponents} />
          {/* <AgGridColumn field='ch' width={100} sortable unSortIcon />
            <AgGridColumn
              field='mrId'
              width={100}
              cellRenderer='mrIdCellRenderer'
              cellRendererParams={{
                uri: '/sites-list/datasheet/missouriRiver-edit',
                type: 'missouriRiver',
              }}
              sortable
              unSortIcon
            />
            <AgGridColumn field='fp' width={400} resizable sortable unSortIcon />
            <AgGridColumn field='segmentDescription' width={350} resizable sortable unSortIcon />
            <AgGridColumn field='bend' width={100} sortable unSortIcon />
            <AgGridColumn field='subsample' width={120} sortable unSortIcon />
            <AgGridColumn field='recorder' width={100} sortable unSortIcon />
            <AgGridColumn field='checkby' width={100} sortable unSortIcon />
            <AgGridColumn field='netrivermile' width={120} sortable unSortIcon />
            <AgGridColumn field='siteId' width={100} sortable unSortIcon />
            <AgGridColumn field='projectId' width={120} sortable unSortIcon />
            <AgGridColumn field='segmentId' width={120} sortable unSortIcon />
            <AgGridColumn field='season' width={100} sortable unSortIcon />
            <AgGridColumn field='fieldoffice' width={120} sortable unSortIcon />
            <AgGridColumn field='sampleUnitType' width={150} sortable unSortIcon />
            <AgGridColumn field='gear' width={100} sortable unSortIcon /> */}
        </div>
        <Pagination
          className='mt-2'
          itemCount={totalResults}
          defaultItemsPerPage='100'
          handlePageChange={(pageNumber, pageSize) => doSetHomePagination({ pageSize, pageNumber })}
        />
      </>
    );
  }
);

export default UnapprovedDataTable;
