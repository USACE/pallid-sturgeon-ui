import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Card from 'app-components/card';
import DownloadAsCSV from 'app-components/downloadAsCSV';
import Pagination from 'app-components/pagination';

import DSSearchReportTable from './components/dsSearchReportTable';
import SearchInput from './components/searchInput';

import './../data-summary.scss';

const SearchReports = connect(
  'doSetFilter',
  'doSearchReportsLoadData',
  'doSetSearchReportsPagination',
  'selectSearchReportsData',
  'selectSearchReportsFilter',
  'selectSearchReportsTotalResults',
  ({
    doSetFilter,
    doSearchReportsLoadData,
    doSetSearchReportsPagination,
    searchReportsData,
    searchReportsFilter,
    searchReportsTotalResults,
  }) => {
    useEffect(() => {
      doSearchReportsLoadData();
    }, [doSearchReportsLoadData]);

    return (
      <Card className='m-3'>
        <Card.Header text='Search Reports' />
        <Card.Body>
          <div className='row'>
            <div className='col-sm-9 col-xs-12'>
              <SearchInput handleSearch={filter => doSetFilter(filter)} />
            </div>
            <div className='col-sm-3 col-xs-12'>
              <DownloadAsCSV className='float-right btn-width' content={searchReportsData} filePrefix='search-reports' />
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
    );
  }
);

export default SearchReports;
