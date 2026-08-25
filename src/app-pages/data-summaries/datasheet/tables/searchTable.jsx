import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { mdiDownload } from '@mdi/js';

import Button from '@components/button';
import Icon from '@components/icon/icon';

import { dateFormatter } from '@common/gridHelpers/ag-grid-helper';

import { useEffect, useState } from 'react';

const SearchTable = connect(
  'doFetchAllDatasheet',
  'selectSearchDataSummary',
  ({ doFetchAllDatasheet, searchDataSummary }) => {
    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
    const { data } = searchDataSummary;

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
          handleClick={() => doFetchAllDatasheet('search-datasheet')}
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
            <AgGridColumn field='year' sortable unSortIcon />
            <AgGridColumn field='fieldoffice' sortable unSortIcon />
            <AgGridColumn field='projectId' sortable unSortIcon />
            <AgGridColumn field='segmentId' sortable unSortIcon />
            <AgGridColumn field='season' sortable unSortIcon />
            <AgGridColumn field='bend' sortable unSortIcon />
            <AgGridColumn field='bendRiverMile' sortable unSortIcon />
            <AgGridColumn field='bendrn' sortable unSortIcon />
            <AgGridColumn field='seId' headerName='Search Effort ID' sortable unSortIcon />
            <AgGridColumn
              field='searchDate'
              valueGetter={(params) => dateFormatter(params.data.searchDate)}
              sortable
              unSortIcon
            />
            <AgGridColumn field='searchDay' sortable unSortIcon />
            <AgGridColumn field='recorder' sortable unSortIcon />
            <AgGridColumn field='searchTypeCode' sortable unSortIcon />
            <AgGridColumn field='startTime' sortable unSortIcon />
            <AgGridColumn field='startLattitude' sortable unSortIcon />
            <AgGridColumn field='startLongitude' sortable unSortIcon />
            <AgGridColumn field='stopTime' sortable unSortIcon />
            <AgGridColumn field='stopLattitude' sortable unSortIcon />
            <AgGridColumn field='stopLongitude' sortable unSortIcon />
            <AgGridColumn field='temp' sortable unSortIcon />
            <AgGridColumn field='conductivity' sortable unSortIcon />
            <AgGridColumn field='checkby' sortable unSortIcon />
          </AgGridReact>
        </div>
      </>
    );
  }
);

export default SearchTable;
