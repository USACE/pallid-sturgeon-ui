import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { dateFormatter } from 'common/gridHelpers/ag-grid-helper';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const SearchTable = connect(
  'doFetchAllDatasheet',
  'selectSearchDataSummary',
  ({ 
    doFetchAllDatasheet, 
    searchDataSummary,
  }) => {
    const { data } = searchDataSummary;

    return (
      <>
        <Button
          isOutline
          size='small'
          variant='info'
          text='Export as CSV'
          icon={<Icon icon='download' />}
          handleClick={() => doFetchAllDatasheet('search-datasheet')}
        />
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact rowData={data}>
            <AgGridColumn field='year' sortable unSortIcon />
            <AgGridColumn field='seId' headerName='SE Id' sortable unSortIcon />
            <AgGridColumn field='searchDate' valueGetter={params => dateFormatter(params.data.searchDate)} sortable unSortIcon />
            <AgGridColumn field='projectId' sortable unSortIcon />
            <AgGridColumn field='segmentId' sortable unSortIcon />
            <AgGridColumn field='season' sortable unSortIcon />
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
          </AgGridReact>
        </div>
      </>
    );});

export default SearchTable;
