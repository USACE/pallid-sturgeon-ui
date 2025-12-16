import { useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';
import { mdiDownload, mdiHelpCircle } from '@mdi/js';

import Button from '@components/button';
import Card from '@components/card';
import Pagination from '@components/pagination';
import Select from '@components/select';
import Icon from '@components/icon/icon';
import Breadcrumb from '@src/app-components/breadcrumb';

import { dropdownYearsToNow } from '@src/utils';
import { Input } from '@pages/data-entry/edit-data-sheet/forms/_shared/helper';
import { defaultColDef } from '@src/utils/helpers';

const yesNoOptions = [
  { value: 0, text: 'No' },
  { value: 1, text: 'Yes' },
];

const breadcrumbLinks = [
  {
    text: 'Genetic Card Summary',
    current: true,
  },
];

const columnDefs = [
  { field: 'fieldOffice' },
  { field: 'projectCode', headerName: 'Project' },
  { field: 'sturgeonType' },
  { field: 'geneticVialNum', headerName: 'Genetic Vial #' },
  { field: 'pittag', headerName: 'Pit Tag #' },
  { field: 'river' },
  { field: 'riverMile' },
  { field: 'state' },
  { field: 'date', valueGetter: (params) => dateFormatter(params.data.date) },
  { field: 'broodstock' },
  { field: 'hatchwild', headerName: 'Hatch/Wild' },
  { field: 'speciesId' },
  { field: 'archive' },
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
    const { year, minDate, maxDate, broodstock, hatchWild, speciesId } = params;
    const { totalResults } = geneticCardSummaryPagination;
    const fieldDisabled = !year;

    useEffect(() => {
      if (params.year) {
        doFetchGeneticCardSummary(params);
      }
    }, [params]);

    return (
      <div className='container-fluid'>
        <Breadcrumb paths={breadcrumbLinks} />
        <Card>
          <Card.Header text='Genetic Card Filters' />
          <Card.Body>
            <Icon focusable={false} path={mdiHelpCircle} />
            <span className='info-message ml-2'>
              Click the "Export as CSV" link at the top of the report to download the Genetic Card Summary for the year
              and filters selected. The displayed report below only shows a portion of the fields that are included in
              the downloaded report.
            </span>
            <div className='row mt-3'>
              <div className='col-md-2 col-xs-12'>
                <Select
                  label='Select Year'
                  value={year}
                  onChange={(val) => doUpdateGeneticCardSummaryParams({ year: val })}
                  options={dropdownYearsToNow(2002)}
                />
              </div>
              <div className='col-md-3 col-xs-12'>
                <Input
                  label='Date Range - Start'
                  isDisabled={fieldDisabled}
                  type='date'
                  className='form-control'
                  value={minDate}
                  onChange={(e) =>
                    doUpdateGeneticCardSummaryParams({
                      minDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className='col-md-3 col-xs-12'>
                <Input
                  label='Date Range - Start'
                  isDisabled={fieldDisabled}
                  type='date'
                  className='form-control'
                  value={maxDate}
                  onChange={(e) =>
                    doUpdateGeneticCardSummaryParams({
                      maxDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className='row mt-2'>
              <div className='col-md-2 col-xs-12'>
                <Select
                  isDisabled={fieldDisabled}
                  label='Broodstock'
                  value={broodstock}
                  onChange={(val) => doUpdateGeneticCardSummaryParams({ broodstock: val })}
                  options={yesNoOptions}
                />
              </div>
              <div className='col-md-2 col-xs-12'>
                <Select
                  isDisabled={fieldDisabled}
                  label='Hatchery/Wild'
                  value={hatchWild}
                  onChange={(val) => doUpdateGeneticCardSummaryParams({ hatchWild: val })}
                  options={yesNoOptions}
                />
              </div>
              <div className='col-md-2 col-xs-12'>
                <Select
                  isDisabled={fieldDisabled}
                  label='Species Id'
                  value={speciesId}
                  onChange={(val) => doUpdateGeneticCardSummaryParams({ speciesId: val })}
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
              icon={<Icon path={mdiDownload} />}
              handleClick={() => doFetchAllGeneticCardSummary('genetic-card-summary')}
            />
            <div className='ag-theme-balham mt-3' style={{ width: '100%', height: '600px' }}>
              <AgGridReact rowData={geneticCardSummaryData} defaultColDef={defaultColDef} columnDefs={columnDefs} />
              <Pagination
                className='mt-3'
                itemCount={totalResults}
                handlePageChange={(pageNumber, pageSize) =>
                  doUpdateGeneticCardSummaryPagination({ pageNumber, pageSize })
                }
              />
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }
);
