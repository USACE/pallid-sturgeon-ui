import React from 'react';
import { connect } from 'redux-bundler-react';

import Card from 'app-components/card';
import DownloadAsCSV from 'app-components/downloadAsCSV';
import Pagination from 'app-components/pagination';

import DSSearchReportTable from './components/dsSearchReportTable';
import SearchInput from './components/searchInput';

const SearchReports = connect(
  'doSetFilter',
  'doSetSearchReportsPagination',
  'selectSearchReportsData',
  'selectSearchReportsFilter',
  'selectSearchReportsTotalResults',
  ({
    doSetFilter,
    doSetSearchReportsPagination,
    searchReportsData,
    searchReportsFilter,
    searchReportsTotalResults,
  }) => (
    <Card className='m-3'>
      <Card.Header text='Search Reports' />
      <Card.Body>
        <div className='row'>
          <div className='col-9'>
            <SearchInput handleSearch={filter => doSetFilter(filter)} />
          </div>
          <div className='col-3'>
            <DownloadAsCSV className='float-right' content={searchReportsData} filePrefix='search-reports' />
          </div>
        </div>
        {searchReportsFilter && (<p><i>Showing reports that contain: </i><b>{searchReportsFilter}</b></p>)}
        <DSSearchReportTable rowData={searchReportsData} />
        <Pagination
          className='mt-3'
          itemCount={searchReportsTotalResults}
          defaultItemsPerPage={20}
          handlePageChange={(pageNumber, pageSize) => doSetSearchReportsPagination({ pageNumber, pageSize })}
        />
      </Card.Body>
    </Card>
  )
);

export default SearchReports;
