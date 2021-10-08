import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import Icon from 'app-components/icon';
import Pagination from 'app-components/pagination';
import Select from 'app-components/select';
import { dropdownYearsToNow } from 'utils';

const yesNoOptions = [
  { value: 0, text: 'No' },
  { value: 1, text: 'Yes' },
];

export default connect(
  'doFetchGeneticCardSummary',
  'doFetchAllGeneticCardSummary',
  'doUpdateGeneticCardSummaryParams',
  'doUpdateGeneticCardSummaryPagination',
  'selectGeneticCardSummaryData',
  'selectGeneticCardSummaryParams',
  'selectGeneticCardSummaryPagination',
  ({
    doFetchGeneticCardSummary,
    doFetchAllGeneticCardSummary,
    doUpdateGeneticCardSummaryParams,
    doUpdateGeneticCardSummaryPagination,
    geneticCardSummaryData,
    geneticCardSummaryParams: params,
    geneticCardSummaryPagination,
  }) => {
    const { year, minDate, maxDate, broodstock, hatchwild, speciesId, archive } = params;
    const { totalResults } = geneticCardSummaryPagination;
    const fieldDisabled = !year;

    useEffect(() => {
      if (params.year) {
        doFetchGeneticCardSummary(params);
      }
    }, [params]);

    return (
      <div className='container-fluid'>
        <h4>Genetic Card Summary</h4>
        <Card className='mt-3'>
          <Card.Header text='Filters' />
          <Card.Body>
            <Icon icon='help-circle' />
            <span className='info-message ml-2'>
              Click the "Export as CSV" link at the top of the report to download the Genetic Card Summary for the year and filters selected.
              The displayed report below only shows a portion of the fields that are included in the downloaded report. 
            </span>
            <div className='row mt-3'>
              <div className='col-2'>
                <Select
                  label='Select Year:'
                  value={year}
                  onChange={val => doUpdateGeneticCardSummaryParams({ year: val })}
                  options={dropdownYearsToNow(2002)}
                />
              </div>
              <div className='col-3'>
                <label>Date Range - Min</label>
                <input
                  disabled={fieldDisabled}
                  type='date'
                  className='form-control'
                  value={minDate}
                  onChange={e => doUpdateGeneticCardSummaryParams({ minDate: e.target.value })}
                />
              </div>
              <div className='col-3'>
                <label>Date Range - Min</label>
                <input
                  disabled={fieldDisabled}
                  type='date'
                  className='form-control'
                  value={maxDate}
                  onChange={e => doUpdateGeneticCardSummaryParams({ maxDate: e.target.value })}
                />
              </div>
            </div>
            <div className='row mt-2'>
              <div className='col-2'>
                <Select
                  isDisabled={fieldDisabled}
                  label='Broodstock'
                  value={broodstock}
                  onChange={val => doUpdateGeneticCardSummaryParams({ broodstock: val })}
                  options={yesNoOptions}
                />
              </div>
              <div className='col-2'>
                <Select
                  isDisabled={fieldDisabled}
                  label='Hatchery/Wild'
                  value={hatchwild}
                  onChange={val => doUpdateGeneticCardSummaryParams({ hatchwild: val })}
                  options={yesNoOptions}
                />
              </div>
              <div className='col-2'>
                <Select
                  isDisabled={fieldDisabled}
                  label='Species Id'
                  value={speciesId}
                  onChange={val => doUpdateGeneticCardSummaryParams({ speciesId: val })}
                  options={yesNoOptions}
                />
              </div>
              <div className='col-2'>
                <Select
                  isDisabled={fieldDisabled}
                  label='Archive'
                  value={archive}
                  onChange={val => doUpdateGeneticCardSummaryParams({ archive: val })}
                  options={yesNoOptions}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card className='mt-3'>
          <Card.Header text='Genetic Card Table' />
          <Card.Body>
            <Button
              isOutline
              size='small'
              variant='info'
              text='Export as CSV'
              icon={<Icon icon='download' />}
              handleClick={() => doFetchAllGeneticCardSummary('genetic-card-summary')}
            />
            <div className='ag-theme-balham mt-3' style={{ width: '100%', height: '600px' }}>
              <AgGridReact
                rowData={geneticCardSummaryData}
                defaultColDef={{
                  width: 125,
                }}
              >
                {/* Columns might not match up to data, needs tested */}
                <AgGridColumn field='year' />
                <AgGridColumn field='fieldOffice' />
                <AgGridColumn field='projectCode' headerName='project' />
                <AgGridColumn field='sturgeonType' />
                <AgGridColumn field='geneticVialNum' headerName='Genetic Vial #' />
                <AgGridColumn field='pittag' headerName='Pit Tag #' />
                <AgGridColumn field='river' />
                <AgGridColumn field='riverMile' />
                <AgGridColumn field='state' />
                <AgGridColumn field='date' />
                <AgGridColumn field='broodstock' headerName='Broodstock?' />
                <AgGridColumn field='hatchwild' headerName='Hatch/Wild?' />
                <AgGridColumn field='speciesId' headerName='Species Id?' />
                <AgGridColumn field='archive' headerName='Archive?' />
              </AgGridReact>
              <Pagination
                className='mt-3'
                itemCount={totalResults}
                handlePageChange={(pageNumber, pageSize) => doUpdateGeneticCardSummaryPagination({ pageNumber, pageSize })}
              />
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }
);
