import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Card from 'app-components/card';
import Icon from 'app-components/icon';
import Select from 'app-components/select';
import { dropdownYearsToNow } from 'utils';

const yesNoOptions = [
  { value: 0, text: 'No' },
  { value: 1, text: 'Yes' },
];

export default connect(
  'doFetchGeneticCardSummary',
  'doUpdateGeneticCardSummaryParams',
  'selectGeneticCardSummaryData',
  'selectGeneticCardSummaryParams',
  ({
    doFetchGeneticCardSummary,
    doUpdateGeneticCardSummaryParams,
    geneticCardSummaryData,
    geneticCardSummaryParams: params,
  }) => {
    const { year, minDate, maxDate, broodstock, hatchwild, speciesId, archive } = params;

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
              Click the "Download Data" link at the top of the report to download the Genetic Card Summary for the year and filters selected.
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
                  type='date'
                  className='form-control'
                  value={minDate}
                  onChange={e => doUpdateGeneticCardSummaryParams({ minDate: e.target.value })}
                />
              </div>
              <div className='col-3'>
                <label>Date Range - Min</label>
                <input
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
                  label='Broodstock'
                  value={broodstock}
                  onChange={val => doUpdateGeneticCardSummaryParams({ broodstock: val })}
                  options={yesNoOptions}
                />
              </div>
              <div className='col-2'>
                <Select
                  label='Hatchery/Wild'
                  value={hatchwild}
                  onChange={val => doUpdateGeneticCardSummaryParams({ hatchwild: val })}
                  options={yesNoOptions}
                />
              </div>
              <div className='col-2'>
                <Select
                  label='Species Id'
                  value={speciesId}
                  onChange={val => doUpdateGeneticCardSummaryParams({ speciesId: val })}
                  options={yesNoOptions}
                />
              </div>
              <div className='col-2'>
                <Select
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
            <div className='ag-theme-balham' style={{ width: '100%', height: '600px' }}>
              <AgGridReact
                rowData={geneticCardSummaryData}
                defaultColDef={{
                  width: 125,
                }}
              >
                {/* Columns might not match up to data, needs tested */}
                <AgGridColumn field='year' />
                <AgGridColumn field='fieldOffice' />
                <AgGridColumn field='project' />
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
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }
);
