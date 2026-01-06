import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';

import Pagination from '@components/pagination';
import MrIdCellRenderer from '@common/gridCellRenderers/mrIdCellRenderer';
import { commonColDef } from '@src/utils/helpers';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

const defaultColDef = { ...commonColDef, width: 100 };
const components = { mrIdCellRenderer: MrIdCellRenderer };
const missouriRiverFormUri = '/sites-list/datasheet/missouriRiver-edit';

const columnDefs = [
  {
    field: 'mrID',
    headerName: 'MR ID',
    cellRenderer: 'mrIdCellRenderer',
    cellRendererParams: {
      uri: missouriRiverFormUri,
      type: 'home',
    },
  },
  { field: 'psb', headerName: 'Project : Segment : Bend', resizable: true, width: 400 },
  { field: 'fieldoffice', headerName: 'Field Office', width: 125 },
  { field: 'recorder' },
  { field: 'siteId' },
  { field: 'projectId', headerName: 'Project', width: 110 },
  { field: 'season' },
  { field: 'segmentId', headerName: 'Segment' },
  { field: 'subsample', width: 150 },
  { field: 'gear', width: 150 },
  { field: 'netrivermile', headerName: 'Net River Mile', width: 150 },
  { field: 'cb', headerName: 'Checked?', width: 150 },
  { field: 'checkedby', width: 150 },
];

const UncheckedDataTable = connect(
  'doSetHomePagination',
  'selectUncheckedDataSheets',
  ({ doSetHomePagination, uncheckedDataSheets }) => {
    const { data, totalResults } = uncheckedDataSheets;

    return (
      <>
        <div className='ag-theme-balham' style={{ height: '600px', width: '100%' }}>
          <AgGridReact rowData={data} components={components} defaultColDef={defaultColDef} columnDefs={columnDefs} />
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

export default UncheckedDataTable;
