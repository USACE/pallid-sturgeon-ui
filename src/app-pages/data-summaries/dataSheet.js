import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import Pagination from 'app-components/pagination';
import Select from 'app-components/select';
import TabContainer from 'app-components/tab';

import DSSearchReportTable from './tables/dsSearchReportTable';
import FishTable from './tables/fishTable';
import MissouriRiverTable from './tables/missouriRiverTable';
import ProcedureTable from './tables/procedureTable';
import SupplementalTable from './tables/supplementalTable';
import TelemetryTable from './tables/telemetryTable';

import './data-summary.scss';

export default connect(
  ({  }) => {
    const [yearFilter, setYearFilter] = useState('');
    const [monthFilter, setMonthFilter] = useState('');
    const [projectFilter, setProjectFilter] = useState('');
    const [approvalFilter, setApprovalFilter] = useState('');
    const [seasonFilter, setSeasonFilter] = useState('');
    const [speciesFilter, setSpeciesFilter] = useState('');

    const clearAllFilters = () => {
      setYearFilter('');
      setMonthFilter('');
      setProjectFilter('');
      setApprovalFilter('');
      setSeasonFilter('');
      setSpeciesFilter('');
    };

    return (
      <div className='container-fluid'>
        <Card className='mb-3' >
          <Card.Header text='Datasheet Filters' />
          <Card.Body>
            <div className='row'>
              <div className='col-md-3 col-xs-12'>
                <label>Select Year:</label>
                <Select
                  showPlaceholderWhileValid
                  className='d-block mt-1 mb-2'
                  onChange={val => setYearFilter(val)}
                  value={yearFilter}
                  options={[
                    { value: '2021' },
                    { value: '2020' },
                    { value: '2019' }
                  ]}
                />
              </div>
              <div className='col-md-6 col-xs-12'>
                <label>Select Project:</label>
                <Select
                  showPlaceholderWhileValid
                  className='d-block mt-1 mb-2'
                  onChange={val => setProjectFilter(val)}
                  value={projectFilter}
                  options={[]}
                />
              </div>
              <div className='col-md-3 col-xs-12'>
                <label>Approval:</label>
                <Select
                  showPlaceholderWhileValid
                  className='d-block mt-1 mb-2'
                  onChange={val => setApprovalFilter(val)}
                  value={approvalFilter}
                  options={[]}
                />
              </div>
            </div>
            <div className='row'>
              <div className='col-md-2 col-xs-4'>
                <label>Season:</label>
                <Select
                  showPlaceholderWhileValid
                  className='d-block mt-1 mb-2'
                  onChange={val => setSeasonFilter(val)}
                  value={seasonFilter}
                  options={[]}
                />
              </div>
              <div className='col-md-2 col-xs-4'>
                <label>Species:</label>
                <Select
                  showPlaceholderWhileValid
                  className='d-block mt-1 mb-2'
                  onChange={val => setSpeciesFilter(val)}
                  value={speciesFilter}
                  options={[]}
                />
              </div>
              <div className='col-md-2 col-xs-4'>
                <label>Month:</label>
                <Select
                  showPlaceholderWhileValid
                  placeholderText='Select a Month...'
                  className='d-block mt-1 mb-2'
                  onChange={val => setMonthFilter(val)}
                  value={monthFilter}
                  options={[
                    { value: 'January' },
                    { value: 'February' },
                    { value: 'March' },
                    { value: 'April' },
                    { value: 'May' },
                    { value: 'June' },
                    { value: 'July' },
                    { value: 'August' },
                    { value: 'September' },
                    { value: 'October' },
                    { value: 'November' },
                    { value: 'December' },
                  ]}
                />
              </div>
              <div className='col-md-6 col-xs-12'>
                <label>
                  Date Range (From - To):
                </label>
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
                { title: 'Missouri River', content: <MissouriRiverTable /> },
                { title: 'Fish', content: <FishTable /> },
                { title: 'Supplemental', content: <SupplementalTable /> },
                { title: 'DS Search Report', content: <DSSearchReportTable /> },
                { title: 'Telemetry', content: <TelemetryTable /> },
                { title: 'Procedure', content: <ProcedureTable /> },
              ]}
            />
            <Pagination
              itemCount={0}
              className='mt-2'
              handlePageChange={() => {}}
            />
          </Card.Body>
        </Card>
      </div>
    );
  }
);
