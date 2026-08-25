import { connect } from 'redux-bundler-react';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

import Pagination from '@components/pagination';
import MrIdCellRenderer from '@common/gridCellRenderers/mrIdCellRenderer';

import { useEffect, useState } from 'react';

const UnapprovedDataTable = connect(
  'doSetHomePagination',
  'selectUnapprovedDataSheets',
  ({ doSetHomePagination, unapprovedDataSheets }) => {
    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
    const { data, totalResults } = unapprovedDataSheets;

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
            <AgGridColumn field='ch' width={100} sortable unSortIcon />
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
            <AgGridColumn field='gear' width={100} sortable unSortIcon />
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

export default UnapprovedDataTable;
