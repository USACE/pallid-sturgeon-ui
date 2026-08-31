import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { mdiDownload } from '@mdi/js';

import Button from '@components/button';
import Icon from '@components/icon/icon';

import { useEffect, useState } from 'react';

const FishTable = connect(
  'doFetchAllDatasheet',
  'selectFishDataSummary',
  ({ doFetchAllDatasheet, fishDataSummary }) => {
    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
    const { data } = fishDataSummary;

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
          handleClick={() => doFetchAllDatasheet('fish-datasheet')}
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
            <AgGridColumn field='uniqueID' sortable unSortIcon />
            <AgGridColumn field='fishId' headerName='Fish ID' sortable unSortIcon />
            <AgGridColumn field='year' />
            <AgGridColumn field='fieldOffice' sortable unSortIcon />
            <AgGridColumn field='project' />
            <AgGridColumn field='segment' />
            <AgGridColumn field='season' />
            <AgGridColumn field='bend' />
            <AgGridColumn field='bendrn' headerName='Bend R/N' />
            <AgGridColumn field='bendRiverMile' />
            <AgGridColumn field='panelhook' headerName='Panel/Hook' />
            <AgGridColumn field='species' />
            <AgGridColumn field='hatcheryOrigin' />
            <AgGridColumn field='checkedby' />
          </AgGridReact>
        </div>
      </>
    );
  }
);

export default FishTable;
