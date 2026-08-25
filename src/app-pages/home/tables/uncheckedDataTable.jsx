import { connect } from 'redux-bundler-react';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

import Pagination from '@components/pagination';
import MrIdCellRenderer from '@common/gridCellRenderers/mrIdCellRenderer';

import { useEffect, useState } from 'react';

const UncheckedDataTable = connect(
  'doSetHomePagination',
  'selectUncheckedDataSheets',
  ({ doSetHomePagination, uncheckedDataSheets }) => {
    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
    const { data, totalResults } = uncheckedDataSheets;

    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (event) => {
        setIsDarkMode(event.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }, []);

    return (
      <>
        <div
          className={isDarkMode ? 'ag-theme-balham-dark' : 'ag-theme-balham'}
          style={{ height: '600px', width: '100%' }}
        >
          <AgGridReact
            rowData={data}
            frameworkComponents={{
              mrIdCellRenderer: MrIdCellRenderer,
            }}
          >
            <AgGridColumn
              field='mrID'
              headerName='mrId'
              width={100}
              cellRenderer='mrIdCellRenderer'
              cellRendererParams={{
                uri: '/sites-list/datasheet/missouriRiver-edit',
                type: 'home',
              }}
              sortable
              unSortIcon
            />
            <AgGridColumn field='psb' headerName='Project : Segment : Bend' resizable width={400} sortable unSortIcon />
            <AgGridColumn field='fieldoffice' headerName='Field Office' width={125} sortable unSortIcon />
            <AgGridColumn field='recorder' width={100} sortable unSortIcon />
            <AgGridColumn field='siteId' width={100} sortable unSortIcon />
            <AgGridColumn field='projectId' width={110} sortable unSortIcon />
            <AgGridColumn field='season' width={100} sortable unSortIcon />
            <AgGridColumn field='segmentId' headerName='Segment' width={100} sortable unSortIcon />
            <AgGridColumn field='subsample' width={150} sortable unSortIcon />
            <AgGridColumn field='gear' width={150} sortable unSortIcon />
            <AgGridColumn field='netrivermile' headerName='Net River Mile' width={150} sortable unSortIcon />
            <AgGridColumn field='cb' headerName='Checked?' width={150} sortable unSortIcon />
            <AgGridColumn field='checkby' width={150} sortable unSortIcon />
          </AgGridReact>
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
