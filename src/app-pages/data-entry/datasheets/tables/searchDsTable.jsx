import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { mdiDownload, mdiPlus } from '@mdi/js';

import Icon from '@components/icon/icon';

import SearchIdCellRenderer from '@common/gridCellRenderers/searchIdCellRenderer';

import { Row } from '@pages/data-entry/edit-data-sheet/forms/_shared/helper';
import { Button } from '@trussworks/react-uswds';

const telemetryCellStyle = (params) => ({
  backgroundColor: params.data.bkgColor,
});

const SearchDsTable = connect(
  'doUpdateUrl',
  'doUpdateComplexStateField',
  'selectSearchEffortSitesDatasheetData',
  'selectRouteParams',
  ({ doUpdateUrl, doUpdateComplexStateField, searchEffortSitesDatasheetData, routeParams }) => {
    const siteId = routeParams?.siteId;

    const handleAddButtonClick = () => {
      const searchDraftKey = `currentSearchEffortDraft:${siteId}`;
      sessionStorage.removeItem(searchDraftKey);

      doUpdateComplexStateField({ name: 'isEditForm', value: false });
      doUpdateUrl(`/sites-list/${siteId}/search-effort`);
    };

    return (
      <>
        <Row>
          <div className='col-md-12 col-xs-12' style={{ justifyContent: 'space-between' }}>
            <Button onClick={handleAddButtonClick} className='add-btn' title='Add Search Effort Datasheet'>
              <span>
                <Icon path={mdiPlus} />
              </span>
              Add Search Effort Datasheet
            </Button>
            <Button onClick={() => {}} className='clear-btn' title='Export as CSV' disabled>
              <span>
                <Icon path={mdiDownload} />
              </span>
              Export as CSV
            </Button>
          </div>
        </Row>
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact
            rowHeight={35}
            rowData={searchEffortSitesDatasheetData}
            defaultColDef={{
              width: 100,
            }}
            frameworkComponents={{
              searchIdCellRenderer: SearchIdCellRenderer,
            }}
          >
            <AgGridColumn
              field='seId'
              headerName='SE ID'
              cellRenderer='searchIdCellRenderer'
              cellRendererParams={{
                type: 'searchEffort',
              }}
              sortable
              unSortIcon
            />
            <AgGridColumn
              field='telemetryCount'
              headerName='Telemetry'
              width={130}
              cellStyle={telemetryCellStyle}
              cellRenderer='searchIdCellRenderer'
              cellRendererParams={{
                type: 'telemetry',
                tab: 1,
              }}
              sortable
              unSortIcon
            />
            <AgGridColumn field='searchTypeCode' width={150} sortable unSortIcon />
            <AgGridColumn field='startTime' sortable unSortIcon />
            <AgGridColumn field='startLatitude' width={150} sortable unSortIcon />
            <AgGridColumn field='startLongitude' width={150} sortable unSortIcon />
            <AgGridColumn field='stopTime' sortable unSortIcon />
            <AgGridColumn field='stopLatitude' width={150} sortable unSortIcon />
            <AgGridColumn field='stopLongitude' width={150} sortable unSortIcon />
            <AgGridColumn field='temp' sortable unSortIcon />
            <AgGridColumn field='conductivity' width={125} sortable unSortIcon />
            <AgGridColumn field='recorder' sortable unSortIcon />
            <AgGridColumn field='editInitials' width={125} sortable unSortIcon />
            <AgGridColumn field='lastEditComment' width={200} sortable unSortIcon />
            <AgGridColumn field='uploadedBy' width={200} sortable unSortIcon />
          </AgGridReact>
        </div>
      </>
    );
  }
);

export default SearchDsTable;
