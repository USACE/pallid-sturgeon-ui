import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';

import Pagination from '@components/pagination';
import MrIdCellRenderer from '@common/gridCellRenderers/mrIdCellRenderer';

import { commonColDef } from '@src/utils/helpers';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

const defaultColDef = { ...commonColDef, width: 100 };

const components = { mrIdCellRenderer: MrIdCellRenderer };

const columnDefs = [
  {
    field: 'mrId',
    headerName: 'MR ID',
    cellRenderer: 'mrIdCellRenderer',
    cellRendererParams: {
      uri: '/sites-list/datasheet/missouriRiver-edit',
      type: 'missouriRiver',
    },
  },
  { field: 'fId', headerName: 'Fish ID' },
  { field: 'psb', width: 400, resizable: true },
  { field: 'year' },
  { field: 'fieldoffice', headerName: 'Field Office', width: 120, resizable: true },
  { field: 'segmentId', headerName: 'Segment', width: 120 },
  { field: 'bend' },
  { field: 'bendrn', headerName: 'Bend R/N' },
  { field: 'bendrivermile', width: 150 },
  { field: 'panelhook', headerName: 'Panel/Hook', width: 120 },
  { field: 'recorder' },
  { field: 'subsample', width: 120 },
  { field: 'gear' },
  { field: 'fishcount' },
];

const BafiDataTable = connect(
  'doSetHomePagination',
  'selectBafiDataSheets',
  ({ doSetHomePagination, bafiDataSheets }) => {
    const { data, totalResults } = bafiDataSheets;

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

export default BafiDataTable;
