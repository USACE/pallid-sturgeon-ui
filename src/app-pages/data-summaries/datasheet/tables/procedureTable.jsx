import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { mdiDownload } from '@mdi/js';

import Button from '@components/button';
import Icon from '@components/icon/icon';

import { useEffect, useState } from 'react';

const ProcedureTable = connect(
  'doFetchAllDatasheet',
  'selectProcedureDataSummary',
  ({ doFetchAllDatasheet, procedureDataSummary }) => {
    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
    const { data } = procedureDataSummary;

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
        <Button
          isOutline
          size='small'
          variant='info'
          text='Export as CSV'
          icon={<Icon path={mdiDownload} />}
          handleClick={() => doFetchAllDatasheet('procedure-datasheet')}
        />
        <div
          className={`mt-2 ${isDarkMode ? 'ag-theme-balham-dark' : 'ag-theme-balham'}`}
          style={{ width: '100%', height: '600px' }}
        >
          <AgGridReact
            rowData={data}
            defaultColDef={{
              width: 150,
            }}
          >
            {/* @TODO: Confirm with Coral about the displayed fields vs Apex */}
            <AgGridColumn field='year' />
            <AgGridColumn field='fieldOffice' />
            <AgGridColumn field='project' />
            <AgGridColumn field='segment' />
            <AgGridColumn field='season' />
            <AgGridColumn field='bend' />
            <AgGridColumn field='bendrn' />
            <AgGridColumn field='bendRiverMile' />
            <AgGridColumn headerName='Procedure ID' field='id' sortable unSortIcon />
            <AgGridColumn headerName='MR ID' field='uniqueId' sortable unSortIcon />
            <AgGridColumn field='purposeCode' sortable unSortIcon />
            <AgGridColumn field='newRadioTagNum' sortable unSortIcon />
            <AgGridColumn field='newFrequencyId' sortable unSortIcon />
            <AgGridColumn headerName='Spawn Code' field='spawnCode' sortable unSortIcon />
            <AgGridColumn headerName='Expected Spawn Year' field='expectedSpawnYear' sortable unSortIcon />
          </AgGridReact>
        </div>
      </>
    );
  }
);

export default ProcedureTable;
