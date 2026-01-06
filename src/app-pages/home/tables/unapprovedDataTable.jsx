import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';

import Pagination from '@components/pagination';
import MrIdCellRenderer from '@common/gridCellRenderers/mrIdCellRenderer';
import { dateFormatter } from '@src/common/gridHelpers/ag-grid-helper';
import { commonColDef } from '@src/utils/helpers';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

const defaultColDef = { ...commonColDef, width: 100 };
const components = { mrIdCellRenderer: MrIdCellRenderer };
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
          <AgGridReact defaultColDef={defaultColDef} rowData={data} components={components} columnDefs={columnDefs} />
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
