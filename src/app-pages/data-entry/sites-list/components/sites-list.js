import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import FilterSelect from 'app-components/filter-select/filter-select';
import Icon from 'app-components/icon';
import Pagination from 'app-components/pagination';
import Select from 'app-components/select';
import SitesListTable from './sites-list-table';
import SitesFormModal from './modals/sitesForm';

import { createDropdownOptions, createBendsDropdownOptions } from '../../helpers';
import { dropdownYearsToNow } from 'utils';

import '../../dataentry.scss';
import './../../../data-summaries/data-summary.scss';

const SitesList = connect(
  // 'doDomainBendsFetch',
  'doDomainSeasonsFetch',
  'doDomainSegmentsFetch',
  'doModalOpen',
  'doUpdateSiteParams',
  'doSetSitesPagination',
  'selectDomains',
  'selectSitesTotalResults',
  'selectUserRole',
  ({
    // doDomainBendsFetch,
    doDomainSeasonsFetch,
    doDomainSegmentsFetch,
    doModalOpen,
    doUpdateSiteParams,
    doSetSitesPagination,
    domains,
    sitesTotalResults,
    userRole,
  }) => {
    const { projects, seasons, bends, segments } = domains;

    const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
    const [projectFilter, setProjectFilter] = useState(userRole?.projectCode);
    const [seasonFilter, setSeasonFilter] = useState('');

    const [bendFilter, setBendFilter] = useState('');
    const [bendValue, setBendValue] = useState(null);
    const bendRef = useRef();

    const [segmentFilter, setSegmentFilter] = useState('');
    const [segmentValue, setSegmentValue] = useState(null);
    const segRef = useRef();

    const clearFilters = () => {
      setBendFilter('');
      setBendValue(null);
      setSeasonFilter('');
      setSegmentValue(null);
      setSegmentFilter('');
      setProjectFilter('');

      segRef.current.clear();
      bendRef.current.clear();
    };

    useEffect(() => {
      const searchParams = {
        year: yearFilter,
        bendrn: bendValue,
        seasonCode: seasonFilter,
        segmentCode: segmentValue,
      };
      doUpdateSiteParams(searchParams);
    }, [yearFilter, bendValue, seasonFilter, segmentValue]);

    // Load data
    useEffect(() => {
      doDomainSegmentsFetch();
      doDomainSeasonsFetch();
    }, []);

    // useEffect(() => {
    //   doDomainBendsFetch({ segment: segmentValue });
    // }, [segmentValue]);

    return (
      <>
        <div className='row'>
          <div className='col-sm-2 col-xs-12'>
            <Select
              label='Year'
              placeholderText='Select year...'
              onChange={value => setYearFilter(value)}
              value={yearFilter}
              defaultOption={new Date().getFullYear()}
              options={dropdownYearsToNow(2011)}
            />
          </div>
          <div className='col-sm-2 col-xs-12 offset-8'>
            <Button
              isOutline
              size='small'
              variant='success'
              text='Create New Site'
              className='mt-3 float-right btn-width'
              handleClick={() => doModalOpen(SitesFormModal)}
            />
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-sm-12 col-xs-12 pl-3'>
            <span className='info-message mr-1'><Icon icon='help-circle' /></span>
            <span className='info-message'>Select a year to populate the table and begin your search.</span>
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-sm-4 col-xs-12'>
            <div className='form-group'>
              <Select
                showPlaceholderWhileValid
                label='Select Project'
                placeholderText='Project...'
                onChange={value => setProjectFilter(value)}
                value={projectFilter}
                options={createDropdownOptions(projects)}
                defaultOption={userRole?.projectCode}
                isDisabled={userRole?.projectCode === '2'}
              />
            </div>
          </div>
          <div className='col-sm-4 col-xs-12'>
            <div className='form-group'>
              <Select
                showPlaceholderWhileValid
                label='Select Segment'
                placeholderText='Segment...'
                onChange={value => setSegmentFilter(value)}
                value={segmentFilter}
                options={createDropdownOptions(segments)}
              />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-4 col-xs-12'>
            <div className='form-group'>
              <Select
                isDisabled={!yearFilter}
                showPlaceholderWhileValid
                label='Select Season'
                placeholderText='Season...'
                onChange={value => setSeasonFilter(value)}
                value={seasonFilter}
                options={createDropdownOptions(seasons)}
              />
            </div>
          </div>
          <div className='col-sm-4 col-xs-12'>
            <div className='form-group'>
              <FilterSelect
                ref={bendRef}
                isDisabled
                label='Select Sample Unit'
                handleInputChange={value => setBendFilter(value)}
                onChange={(_, __, val) => setBendValue(val)}
                value={bendFilter}
                placeholder='Sample Unit...'
                items={createBendsDropdownOptions(bends)}
              />
            </div>
          </div>
          <div className='col-sm-2 col-xs-12 align-self-end pl-1 pb-3'>
            <Button
              isOutline
              size='small'
              variant='dark'
              text='Clear Filters'
              className='ml-2 btn-width'
              handleClick={clearFilters}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12 col-xs-12 pl-3'>
            <span className='info-message mr-1'><Icon icon='help-circle' /></span>
            <span className='info-message'>Make selections from the drop down lists to go to the datasheets associated with your selection.</span>
          </div>
        </div>
        <SitesListTable />
        <Pagination
          className='mt-3'
          itemCount={sitesTotalResults}
          defaultItemsPerPage={20}
          handlePageChange={(pageNumber, pageSize) => doSetSitesPagination({ pageNumber, pageSize })}
        />
      </>
    );
  }
);

export default SitesList;
