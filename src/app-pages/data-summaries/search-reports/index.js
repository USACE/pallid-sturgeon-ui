import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Card from 'app-components/card';
import DSSearchReportTable from './components/dsSearchReportTable';
import Pagination from 'app-components/pagination';
import SearchInput from './components/searchInput';
import DownloadAsCSV from '../datasheet/components/downloadAsCSV';
import usePrevious from 'customHooks/usePrevious';

const SearchReports = connect(
  'doSearchReportsFetch',
  'doSearchReportsLoadData',
  'selectSearchReportsData',
  'selectSearchReportsTotalResults',
  ({
    doSearchReportsFetch,
    doSearchReportsLoadData,
    searchReportsData,
    searchReportsTotalResults,
  }) => {
    const [pageNumber, setPageNumber] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const prevPageNumber = usePrevious(pageNumber);
    const prevItemsPerPage = usePrevious(itemsPerPage);

    const updatePagination = (pageNumber, itemsPerPage) => {
      setPageNumber(pageNumber);
      setItemsPerPage(itemsPerPage);
    };

    useEffect(() => {
      if (pageNumber !== prevPageNumber || itemsPerPage !== prevItemsPerPage) {
        doSearchReportsFetch(pageNumber, itemsPerPage);
      }
    }, [pageNumber, itemsPerPage]);

    // console.log('test searchReportsData', searchReportsData);
    // console.log('test searchReportsTotalResults', searchReportsTotalResults);

    return (
      <Card className='m-3'>
        <Card.Header text='Search Reports' />
        <Card.Body>
          <div className='row'>
            <div className='col-9'>
              <SearchInput />
            </div>
            <div className='col-3'>
              <DownloadAsCSV className='float-right' content={searchReportsData} />
            </div>
          </div>
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
