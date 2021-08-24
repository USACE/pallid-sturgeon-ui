import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Card from 'app-components/card';
import DownloadAsCSV from 'app-components/downloadAsCSV';
import Pagination from 'app-components/pagination';
import usePrevious from 'customHooks/usePrevious';

import DSSearchReportTable from './components/dsSearchReportTable';
import SearchInput from './components/searchInput';

const SearchReports = connect(
  'doSearchReportsFetch',
  'selectSearchReportsData',
  'selectSearchReportsTotalResults',
  ({
    doSearchReportsFetch,
    searchReportsData,
    searchReportsTotalResults,
  }) => {
    const [pageNumber, setPageNumber] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [filter, setFilter] = useState('');
    const prevPageNumber = usePrevious(pageNumber);
    const prevItemsPerPage = usePrevious(itemsPerPage);
    const previousFilter = usePrevious(filter);

    const updatePagination = (pageNumber, itemsPerPage) => {
      setPageNumber(pageNumber);
      setItemsPerPage(itemsPerPage);
    };

    useEffect(() => {
      if (pageNumber !== prevPageNumber || itemsPerPage !== prevItemsPerPage || filter !== previousFilter) {
        doSearchReportsFetch(pageNumber, itemsPerPage, filter);
      }
    }, [pageNumber, itemsPerPage, filter]);

    return (
      <Card className='m-3'>
        <Card.Header text='Search Reports' />
        <Card.Body>
          <div className='row'>
            <div className='col-9'>
              <SearchInput handleSearch={filter => setFilter(filter)} />
            </div>
            <div className='col-3'>
              <DownloadAsCSV className='float-right' content={searchReportsData} filePrefix='search-reports' />
            </div>
          </div>
          {filter && (<p><i>Showing reports that contain: </i><b>{filter}</b></p>)}
          <DSSearchReportTable rowData={searchReportsData} />
          <Pagination
            className='mt-3'
            itemCount={searchReportsTotalResults}
            defaultItemsPerPage={20}
            handlePageChange={(pageNumber, itemsPerPage) => updatePagination(pageNumber, itemsPerPage)}
          />
        </Card.Body>
      </Card>
    );
  }
);

export default SearchReports;
