import React, { useState, useRef } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import FilterSelect from 'app-components/filter-select';
import Icon from 'app-components/icon';
import Select from 'app-components/select';
import SitesListTable from './sites-list-table';
import { createDropdownOptions, createBendsDropdownOptions } from '../../helpers';
import { dropdownYearsToNow } from 'utils';

import '../../dataentry.scss';

const SitesList = connect(
  'selectDatasheetItemsObject',
  ({
    datasheetItemsObject,
  }) => {
    const { projects = [], seasons = [], bends = [], segments = [] } = datasheetItemsObject;

    const [yearFilter, setYearFilter] = useState('');
    const [bendFilter, setBendFilter] = useState('');
    const [seasonFilter, setSeasonFilter] = useState('');
    const [segmentFilter, setSegmentFilter] = useState('');
    const [projectFilter, setProjectFilter] = useState('');
    const segRef = useRef();
    const bendRef = useRef();

    const clearFilters = () => {
      setBendFilter('');
      setSeasonFilter('');
      setSegmentFilter('');
      setProjectFilter('');

      segRef.current.clear();
      bendRef.current.clear();
    };

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
                label='Select Segment'
                handleInputChange={value => setSegmentFilter(value)}
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
                label='Select Bend'
                handleInputChange={value => setBendFilter(value)}
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
      </>
    );
  }
);

export default SitesList;
