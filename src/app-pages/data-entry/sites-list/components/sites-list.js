import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import FilterSelect from 'app-components/filter-select';
import Icon from 'app-components/icon';
import Pagination from 'app-components/pagination';
import Select from 'app-components/select';
import SitesListTable from './sites-list-table';
import usePrevious from 'customHooks/usePrevious';
import { createDropdownOptions, createBendsDropdownOptions } from '../../helpers';
import { dropdownYearsToNow } from 'utils';

import '../../dataentry.scss';

const SitesList = connect(
  'doSitesFetch',
  'selectDomains',
  'selectSitesTotalResults',
  ({
    doSitesFetch,
    domains,
    sitesTotalResults,
  }) => {
    const { projects, seasons, bends, segments } = domains;
    const [pageNumber, setPageNumber] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const prevPageNumber = usePrevious(pageNumber);
    const prevItemsPerPage = usePrevious(itemsPerPage);

    const [yearFilter, setYearFilter] = useState('');
    const [bendFilter, setBendFilter] = useState('');
    const [bendValue, setBendValue] = useState(null);
    const [seasonFilter, setSeasonFilter] = useState('');
    const [segmentFilter, setSegmentFilter] = useState('');
    const [segmentValue, setSegmentValue] = useState(null);
    const [projectFilter, setProjectFilter] = useState('');
    const segRef = useRef();
    const bendRef = useRef();

    const clearFilters = () => {
      setBendFilter('');
      setBendValue('');
      setSeasonFilter('');
      setSegmentValue('');
      setSegmentFilter('');
      setProjectFilter('');

      segRef.current.clear();
      bendRef.current.clear();
    };

    const updatePagination = (pageNumber, itemsPerPage) => {
      setPageNumber(pageNumber);
      setItemsPerPage(itemsPerPage);
    };

    useEffect(() => {
      clearFilters();
    }, [yearFilter, clearFilters]);

    useEffect(() => {
      if (yearFilter || prevItemsPerPage !== itemsPerPage || prevPageNumber !== pageNumber) {
        const params = {
          year: yearFilter,
          bendrn: bendValue,
          seasonCode: seasonFilter,
          segmentCode: segmentValue,
          projectCode: projectFilter,
          page: pageNumber,
          size: itemsPerPage,
        };

        doSitesFetch(params);
      }
    }, [yearFilter, bendValue, seasonFilter, segmentValue, projectFilter, itemsPerPage, pageNumber, prevPageNumber, prevItemsPerPage, doSitesFetch]);

    return (
      <>
        <div className='row'>
          <div className='col-2'>
            <Select
              label='Year'
              placeholderText='Select year...'
              onChange={value => setYearFilter(value)}
              value={yearFilter}
              options={dropdownYearsToNow()}
            />
          </div>
          <div className='col-2 offset-8'>
            <Button
              isOutline
              size='small'
              variant='success'
              text='Create New Site'
              className='mt-3 float-right'
              href='/sites-list/create-new-site'
            />
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-md-12 pl-3'>
            <span className='info-message mr-1'><Icon icon='help-circle' /></span>
            <span className='info-message'>Select a year to populate the table and begin your search.</span>
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-md-4'>
            <div className='form-group'>
              <Select
                isDisabled={!yearFilter}
                showPlaceholderWhileValid
                label='Select Project'
                placeholderText='Project...'
                onChange={value => setProjectFilter(value)}
                value={projectFilter}
                options={createDropdownOptions(projects)}
              />
            </div>
          </div>
          <div className='col-md-4 pl-0'>
            <div className='form-group'>
              <FilterSelect
                ref={segRef}
                isDisabled={!yearFilter}
                label='Select Segment'
                handleInputChange={value => setSegmentFilter(value)}
                onChange={(_, __, val) => setSegmentValue(val)}
                value={segmentFilter}
                placeholder='Segment...'
                items={createDropdownOptions(segments)}
              />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-4'>
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
          <div className='col-md-4 pl-0'>
            <div className='form-group'>
              <FilterSelect
                ref={bendRef}
                isDisabled={!yearFilter}
                label='Select Bend'
                handleInputChange={value => setBendFilter(value)}
                onChange={(_, __, val) => setBendValue(val)}
                value={bendFilter}
                placeholder='Bend...'
                items={createBendsDropdownOptions(bends)}
              />
            </div>
          </div>
          <div className='col-md-2 align-self-end pl-1 pb-3'>
            <Button
              isOutline
              size='small'
              variant='dark'
              text='Clear Filters'
              handleClick={clearFilters}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12 pl-3'>
            <span className='info-message mr-1'><Icon icon='help-circle' /></span>
            <span className='info-message'>Make selections from the drop down lists to go to the Missouri River data sheets associated with your selection.</span>
          </div>
        </div>
        <SitesListTable />
        <Pagination
          className='mt-3'
          itemCount={sitesTotalResults}
          defaultItemsPerPage={20}
          handlePageChange={(newPage, pageSize) => updatePagination(newPage, pageSize)}
        />
      </>
    );
  }
);

export default SitesList;
