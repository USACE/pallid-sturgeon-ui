import { connect } from 'redux-bundler-react';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

import MrIdCellRenderer from '@common/gridCellRenderers/mrIdCellRenderer';

import { useEffect, useState } from 'react';

const UsgNoVialNumbersTable = connect('selectUsgNoVialNumbersData', ({ usgNoVialNumbersData }) => {
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
        rowData={usgNoVialNumbersData}
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
        <AgGridColumn field='fp' headerName='Full Project' resizable width={400} sortable unSortIcon />
        <AgGridColumn field='speciesCode' width={125} sortable unSortIcon />
        <AgGridColumn field='fId' headerName='fId' width={100} sortable unSortIcon />
        <AgGridColumn field='mrsiteId' headerName='mrSiteId' width={100} sortable unSortIcon />
        <AgGridColumn field='sSiteID' headerName='sSiteId' width={100} sortable unSortIcon />
        <AgGridColumn field='GeneticsVialNumber' width={250} sortable unSortIcon />
      </AgGridReact>
    </div>
  );
});

export default UsgNoVialNumbersTable;
