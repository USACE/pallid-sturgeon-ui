import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';
import { mdiDownload, mdiPlus } from '@mdi/js';

import Button from '@components/button';
import Icon from '@components/icon/icon';

import SearchIdCellRenderer from '@common/gridCellRenderers/searchIdCellRenderer';

import { Row } from '@pages/data-entry/edit-data-sheet/forms/_shared/helper';
import { commonColDef } from '@src/utils/helpers';

const telemetryCellStyle = (params) => ({
  backgroundColor: params.data.bkgColor,
});

const components = { searchIdCellRenderer: SearchIdCellRenderer };

const columnDefs = [
  {
    field: 'seID',
    headerName: 'SE ID',
    width: 100,
    cellRenderer: 'searchIdCellRenderer',
    cellRendererParams: { type: 'searchEffort' },
  },
  {
    field: 'telemetryCount',
    headerName: 'Telemetry',
    width: 130,
    cellStyle: telemetryCellStyle,
    cellRenderer: 'searchIdCellRenderer',
    cellRendererParams: { type: 'telemetry', tab: 1 },
  },
  { field: 'searchTypeCode' },
  { field: 'startTime', width: 100 },
  { field: 'startLatitude', headerName: 'fId' },
  { field: 'startLongitude', headerName: 'mrSiteId' },
  { field: 'stopTime', width: 100 },
  { field: 'stopLatitude' },
  { field: 'stopLongitude' },
  { field: 'temp', width: 100 },
  { field: 'conductivity', width: 125 },
  { field: 'recorder', width: 100 },
  { field: 'editInitials', width: 125 },
  { field: 'lastEditComment', width: 200 },
  { field: 'uploadedBy', width: 200 },
];

const SearchDsTable = connect(
  'doUpdateUrl',
  'doUpdateComplexStateField',
  'selectSearchEffortSitesDatasheetData',
  'selectRouteParams',
  ({ doUpdateUrl, doUpdateComplexStateField, searchEffortSitesDatasheetData, routeParams }) => {
    const siteId = routeParams?.siteId;

    const handleAddButtonClick = () => {
      doUpdateComplexStateField({ name: 'isEditForm', value: false });
      doUpdateUrl(`/sites-list/${siteId}/search-effort`);
    };

    return (
      <>
        <Row>
          <div className='col-md-9 col-xs-12'>
            <Button
              isOutline
              size='small'
              variant='success'
              text='Add Search Effort Datasheet'
              title='Add Search Effort Datasheet'
              icon={<Icon path={mdiPlus} />}
              className='btn-width'
              handleClick={handleAddButtonClick}
            />
          </div>
          <div className='col-md-3 col-xs-12'>
            <Button
              isOutline
              size='small'
              variant='info'
              text='Export as CSV'
              icon={<Icon path={mdiDownload} />}
              className='float-right btn-width'
              // handleClick={() => doFetchAllDatasheet('search-datasheet')}
            />
          </div>
        </Row>
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact
            rowHeight={35}
            rowData={searchEffortSitesDatasheetData}
            defaultColDef={commonColDef}
            components={components}
            columnDefs={columnDefs}
          />
        </div>
      </>
    );
  }
);

export default SearchDsTable;
