import { connect } from 'redux-bundler-react';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

import MrIdCellRenderer from '@common/gridCellRenderers/mrIdCellRenderer';

import { useEffect, useState } from 'react';

const OfficeErrorLogTable = connect('selectErrorLogData', ({ errorLogData }) => {
  const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);

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
    <div className={isDarkMode ? 'ag-theme-balham-dark' : 'ag-theme-balham'} style={{ height: '600px', width: '100%' }}>
      <AgGridReact
        rowData={errorLogData}
        frameworkComponents={{
          mrIdCellRenderer: MrIdCellRenderer,
        }}
      >
        <AgGridColumn field='elId' width={100} sortable unSortIcon />
        <AgGridColumn field='errorEntryDate' width={150} sortable unSortIcon />
        <AgGridColumn field='errorDescription' width={350} resizable sortable unSortIcon />
        <AgGridColumn field='errorFixed' width={130} sortable unSortIcon />
        <AgGridColumn field='siteId' width={100} sortable unSortIcon />
        <AgGridColumn field='year' width={100} sortable unSortIcon />
        <AgGridColumn field='worksheetId' width={130} sortable unSortIcon />
        <AgGridColumn field='worksheetTypeId' width={150} sortable unSortIcon />
        <AgGridColumn field='fieldId' width={100} sortable unSortIcon />
        <AgGridColumn field='formId' width={100} sortable unSortIcon />
        <AgGridColumn field='errorFixedDate' width={150} sortable unSortIcon />
      </AgGridReact>
    </div>
  );
});

export default OfficeErrorLogTable;
