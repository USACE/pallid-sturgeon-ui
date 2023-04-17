import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import ReactTooltip from 'react-tooltip';

import Icon from 'app-components/icon';
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
import SearchTable from './tables/searchTable';

import { createDropdownOptions } from './datasheetHelpers';
import { SelectCustomLabel } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';

import '../data-summary.scss';

export default connect(
  'doDatasheetLoadData',
  'doDataSummaryLoadData',
  'doSetDatasheetPagination',
  'doUpdateDatasheetParams',
  'selectDomains',
  'selectDatasheetData',
  'selectDatasheet',
  'selectDomainsYears',
  'selectUserRole',
  ({
    doDatasheetLoadData,
    doDataSummaryLoadData,
    doSetDatasheetPagination,
    doUpdateDatasheetParams,
    domains,
    datasheetData,
    datasheet,
    domainsYears,
    userRole,
  }) => {
    const [currentTab, setCurrentTab] = useState(0);
    const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
    const [monthFilter, setMonthFilter] = useState('');
    const [projectFilter, setProjectFilter] = useState(userRole ? userRole.projectCode : '');
    const [approvalFilter, setApprovalFilter] = useState('');
    const [seasonFilter, setSeasonFilter] = useState('');
    const [speciesFilter, setSpeciesFilter] = useState(1);
    const [fromDateFilter, setFromDateFilter] = useState('');
    const [toDateFilter, setToDateFilter] = useState('');

    const { projects, seasons } = domains;

    const tabs = ['missouriRiverData', 'fishData',  'suppData', 'telemetryData', 'procedureData', 'searchData'];

    const clearAllFilters = () => {
      setYearFilter('');
      setMonthFilter('');
      setApprovalFilter('');
      setSeasonFilter('');
      setSpeciesFilter('');
      setFromDateFilter('');
      setToDateFilter('');
    };

    const formatDate = dateString => {
      const year = dateString.split('-')[0];
      const month = dateString.split('-')[1];
      const day = dateString.split('-')[2];

      if (year === '' || month === '' || day === '') {
        return '';
      }

      return month + '/' + day + '/' + year;
    };

    useEffect(() => {
      const params = {
        tab: currentTab,
        year: yearFilter,
        month: monthFilter,
        project: projectFilter,
        season: seasonFilter,
        fromDate: formatDate(fromDateFilter),
        toDate: formatDate(toDateFilter),
        approved: approvalFilter,
        id: userRole.id,
        spice: speciesFilter,
      };
      doUpdateDatasheetParams(params);
    }, [currentTab, yearFilter, monthFilter, projectFilter, seasonFilter, approvalFilter, speciesFilter, fromDateFilter, toDateFilter, doUpdateDatasheetParams]);

    useEffect(() => {
      doDatasheetLoadData();
      doDataSummaryLoadData();
    }, [doDatasheetLoadData, doDataSummaryLoadData]);

    return (
      <div className='container-fluid'>
        <Card className='mb-3' >
          <Card.Header text='Datasheet Filters' />
          <Card.Body>
            <div className='row'>
              <div className='col-md-3 col-xs-12'>
                <SelectCustomLabel
                  label='Select a Year'
                  // showPlaceholderWhileValid
                  placeholderText='Select a Year...'
                  className='d-block mt-1 mb-2'
                  onChange={val => setYearFilter(val)}
                  value={yearFilter}
                  options={domainsYears && domainsYears.map(item => ({ value: item.year }))}
                  defaultValue={new Date().getFullYear()}
                />
              </div>
              <div className='col-md-6 col-xs-12'>
                <SelectCustomLabel
                  label='Select Project'
                  // showPlaceholderWhileValid
                  placeholderText='Select a Project...'
                  className='d-block mt-1 mb-2'
                  onChange={val => setProjectFilter(val)}
                  value={projectFilter}
                  options={createDropdownOptions(projects)}
                  defaultValue={userRole && (userRole.projectCode === '2' ? 2 : userRole.projectCode)} 
                  isDisabled={userRole && (userRole.projectCode === '2')} 
                />
              </div>
              <div className='col-md-3 col-xs-12'>
                <SelectCustomLabel
                  label='Approval'
                  // showPlaceholderWhileValid
                  className='d-block mt-1 mb-2'
                  onChange={val => setApprovalFilter(val)}
                  value={approvalFilter}
                  options={[
                    { value: 0, text: '0 - Not Approved'},
                    { value: 1, text: '1 - Approved'},
                  ]}
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
                <Icon
                  icon='help-circle-outline'
                  data-tip
                  data-for='helpSpecies'
                  style={{ fontSize: '15px', marginBottom: '8px' }}
                />
                <ReactTooltip id='helpSpecies' effect='solid' place='bottom'>
                  <span>
                    The Species filter will <b>only apply</b> to the Missouri River, Fish, Supplemental, and Procedure datasheets.
                  </span>
                </ReactTooltip>
                <Select
                  showPlaceholderWhileValid
                  className='d-block mt-1 mb-2'
                  onChange={val => setSpeciesFilter(val)}
                  value={speciesFilter}
                  defaultOption={1}
                  options={[
                    { value: 1, text: '1 - All Species' },
                    { value: 2, text: '2 - PDSG' },
                    { value: 3, text: '3 - All Sturgeon' },
                  ]}
                />
              </div>
              <div className='col-md-2 col-xs-4'>
                <label><small>Select Month</small></label>
                <Icon
                  icon='help-circle-outline'
                  data-tip
                  data-for='helpMonth'
                  style={{ fontSize: '15px', marginBottom: '8px' }}
                />
                <ReactTooltip id='helpMonth' effect='solid' place='bottom'>
                  <span>
                    The Month and Date Range filters will filter by <b>Set Date</b> for Missouri River, Fish, Supplemental, and Procedure datasheets, 
                    <br></br> and <b>Search Date</b> for Search Effort and Telemetry datasheets.
                  </span>
                </ReactTooltip>
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
                <input
                  type='date'
                  className='form-control mt-1 mr-2 date-input'
                  value={fromDateFilter}
                  onChange={e => setFromDateFilter(e.target.value)}
                />
                -
                <input
                  type='date'
                  className='form-control mt-1 ml-2 date-input'
                  value={toDateFilter}
                  onChange={e => setToDateFilter(e.target.value)}
                />
              </div>
            </div>
            <div className='mt-2'>
              <Button
                isOutline
                variant='info'
                size='small'
                className='mr-2'
                text='Apply Filters'
                handleClick={() => doDataSummaryLoadData()}
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
                  title: `Missouri River (${datasheet.missouriRiver.totalCount})`,
                  content: <MissouriRiverTable />,
                }, {
                  title: `Fish (${datasheet.fish.totalCount})`,
                  content: <FishTable />,
                }, {
                  title: `Supplemental (${datasheet.supplemental.totalCount})`,
                  content: <SupplementalTable />,
                },
                { 
                  title: `Procedure (${datasheet.procedure.totalCount})`, 
                  content: <ProcedureTable />,
                },
                { 
                  title: `Search Effort (${datasheet.searchEffort.totalCount})`, 
                  content: <SearchTable />
                },
                { 
                  title: `Telemetry (${datasheet.telemetry.totalCount})`, 
                  content: <TelemetryTable />,
                },
              ]}
              onTabChange={(_str, ind) => setCurrentTab(ind)}
            />
            <Pagination
              className='mt-2'
              itemCount={(datasheetData[tabs[currentTab]] || {}).totalCount}
              defaultItemsPerPage='50'
              handlePageChange={(pageNumber, pageSize) => doSetDatasheetPagination({ pageSize, pageNumber })}
            />
          </Card.Body>
        </Card>
      </div>
    );
  }
);