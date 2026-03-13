import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Card from '@components/card';
import DownloadAsCSV from '@components/downloadAsCSV';
import Pagination from '@components/pagination';
import Breadcrumb from '@src/app-components/breadcrumb';
import DSSearchReportTable from './components/dsSearchReportTable';
import SearchInput from './components/searchInput';

import './../data-summary.scss';

const breadcrumbLinks = [
  {
    text: 'Search Reports',
    current: true,
  },
];

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
      <div className='container-fluid'>
        <Breadcrumb paths={breadcrumbLinks} />
        <Card>
          <Card.Header text='Search Reports' />
          <Card.Body>
            <div className='row'>
              <div className='col-sm-9 col-xs-12'>
                <SearchInput handleSearch={(filter) => doSetFilter(filter)} />
              </div>
              <div className='col-sm-3 col-xs-12'>
                <DownloadAsCSV
                  className='float-right btn-width'
                  content={searchReportsData}
                  filePrefix='search-reports'
                />
              </div>
            </div>
            {searchReportsFilter && (
              <p>
                <i>Showing reports that contain: </i>
                <b>{searchReportsFilter}</b>
              </p>
            )}
            <DSSearchReportTable rowData={searchReportsData} />
            <Pagination
              className='mt-3'
              itemCount={searchReportsTotalResults}
              defaultItemsPerPage={20}
              handlePageChange={(pageNumber, pageSize) => doSetSearchReportsPagination({ pageNumber, pageSize })}
            />
          </Card.Body>
        </Card>
      </div>
    );
  }
);

export default SearchReports;
