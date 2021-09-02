import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import Pagination from 'app-components/pagination/pagination';
import Select from 'app-components/select';
import TabContainer from 'app-components/tab';

import FishTable from './tables/fishTable';
import MissouriRiverTable from './tables/missouriRiverTable';
import ProcedureTable from './tables/procedureTable';
import SupplementalTable from './tables/supplementalTable';
import TelemetryTable from './tables/telemetryTable';

import usePrevious from 'customHooks/usePrevious';
import { createDropdownOptions } from './datasheetHelpers';
import { dropdownYearsToNow } from 'utils';

import '../data-summary.scss';

export default connect(
  'doDatasheetFetch',
  'doDatasheetLoadData',
  'selectDatasheetItemsObject',
  ({
    doDatasheetFetch,
    doDatasheetLoadData,
    datasheetItemsObject,
  }) => {
    const [currentTab, setCurrentTab] = useState(0);
    const [yearFilter, setYearFilter] = useState('');
    const [monthFilter, setMonthFilter] = useState('');
    const [projectFilter, setProjectFilter] = useState('');
    const [approvalFilter, setApprovalFilter] = useState('');
    const [seasonFilter, setSeasonFilter] = useState('');
    const [speciesFilter, setSpeciesFilter] = useState('');

    const [pageNumber, setPageNumber] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const prevPageNumber = usePrevious(pageNumber);
    const prevItemsPerPage = usePrevious(itemsPerPage);

    const { projects = [], seasons = [], data = {} } = datasheetItemsObject;
    const { missouriRiverData = {}, fishData = {}, suppData = {} } = data;
    const tabs = ['missouriRiverData', 'fishData',  'suppData'];

    const clearAllFilters = () => {
      setYearFilter('');
      setMonthFilter('');
      setProjectFilter('');
      setApprovalFilter('');
      setSeasonFilter('');
      setSpeciesFilter('');
    };

    const fetchDatasheet = (page = 0, size = 20) => {
      doDatasheetFetch(currentTab, {
        year: yearFilter,
        month: monthFilter,
        project: projectFilter,
        season: seasonFilter,
        page,
        size,
      });
    };

    const updatePagination = (pageNumber, itemsPerPage) => {
      setPageNumber(pageNumber);
      setItemsPerPage(itemsPerPage);
    };

    useEffect(() => {
      if (pageNumber !== prevPageNumber || itemsPerPage !== prevItemsPerPage) {
        fetchDatasheet(pageNumber, itemsPerPage);
      }
    }, [pageNumber, itemsPerPage, fetchDatasheet]);

    useEffect(() => {
      doDatasheetLoadData();
    }, []);

    return (
      <div className='container-fluid'>
        <Card className='mb-3' >
          <Card.Header text='Datasheet Filters' />
          <Card.Body>
            <div className='row'>
              <div className='col-md-3 col-xs-12'>
                <label><small>Select Year</small></label>
                <Select
                  showPlaceholderWhileValid
                  placeholderText='Select a Year...'
                  className='d-block mt-1 mb-2'
                  onChange={val => setYearFilter(val)}
                  value={yearFilter}
                  options={dropdownYearsToNow()}
                />
              </div>
              <div className='col-md-6 col-xs-12'>
                <label><small>Select Project</small></label>
                <Select
                  showPlaceholderWhileValid
                  placeholderText='Select a Project...'
                  className='d-block mt-1 mb-2'
                  onChange={val => setProjectFilter(val)}
                  value={projectFilter}
                  options={createDropdownOptions(projects)}
                />
              </div>
              <div className='col-md-3 col-xs-12'>
                <label><small>Approval</small></label>
                <Select
                  isDisabled
                  showPlaceholderWhileValid
                  className='d-block mt-1 mb-2'
                  onChange={val => setApprovalFilter(val)}
                  value={approvalFilter}
                  options={[]}
                />
              </div>
            </div>
            <div className='row mt-1'>
              <div className='col-md-2 col-xs-4'>
                <label><small>Select Season</small></label>
                <Select
                  showPlaceholderWhileValid
                  className='d-block mt-1 mb-2'
                  onChange={val => setSeasonFilter(val)}
                  value={seasonFilter}
                  options={createDropdownOptions(seasons)}
                />
              </div>
              <div className='col-md-2 col-xs-4'>
                <label><small>Select Species</small></label>
                <Select
                  isDisabled
                  showPlaceholderWhileValid
                  className='d-block mt-1 mb-2'
                  onChange={val => setSpeciesFilter(val)}
                  value={speciesFilter}
                  options={[]}
                />
              </div>
              <div className='col-md-2 col-xs-4'>
                <label><small>Select Month</small></label>
                <Select
                  showPlaceholderWhileValid
                  placeholderText='Select a Month...'
                  className='d-block mt-1 mb-2'
                  onChange={val => setMonthFilter(val)}
                  value={monthFilter}
                  options={[
                    { value: 1, text: 'January' },
                    { value: 2, text: 'February' },
                    { value: 3, text: 'March' },
                    { value: 4, text: 'April' },
                    { value: 5, text: 'May' },
                    { value: 6, text: 'June' },
                    { value: 7, text: 'July' },
                    { value: 8, text: 'August' },
                    { value: 9, text: 'September' },
                    { value: 10, text: 'October' },
                    { value: 11, text: 'November' },
                    { value: 12, text: 'December' },
                  ]}
                />
              </div>
              <div className='col-md-6 col-xs-12'>
                <label><small>
                  Date Range (From - To)
                </small></label>
                <br />
                <input type='date' className='form-control mt-1 mr-2 date-input' />
                -
                <input type='date' className='form-control mt-1 ml-2 date-input' />
              </div>
            </div>
            <div className='mt-2'>
              <Button
                isOutline
                variant='info'
                size='small'
                className='mr-2'
                text='Apply Filters'
                handleClick={() => fetchDatasheet()}
              />
              <Button
                isOutline
                variant='secondary'
                size='small'
                text='Clear All Filters'
                handleClick={() => clearAllFilters()}
              />
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header text='Datasheets' />
          <Card.Body>
            <TabContainer
              tabs={[
                {
                  title: 'Missouri River',
                  content: <MissouriRiverTable rowData={missouriRiverData.items} />,
                }, {
                  title: 'Fish',
                  content: <FishTable rowData={fishData.items} />,
                }, {
                  title: 'Supplemental',
                  content: <SupplementalTable rowData={suppData.items}/>,
                },
                { title: 'Telemetry', content: <TelemetryTable />, isDisabled: true },
                { title: 'Procedure', content: <ProcedureTable />, isDisabled: true },
              ]}
              onTabChange={(_str, ind) => setCurrentTab(ind)}
            />
            <Pagination
              className='mt-2'
              defaultItemsPerPage={20}
              itemCount={(data[tabs[currentTab]] || {}).totalCount}
              handlePageChange={updatePagination}
            />
          </Card.Body>
        </Card>
      </div>
    );
  }
);
