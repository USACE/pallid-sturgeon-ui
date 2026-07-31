import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { mdiDownload } from '@mdi/js';

import Button from '@src/app-components/button';
import Icon from '@src/app-components/icon/icon';
import SearchIdCellRenderer from '@src/common/gridCellRenderers/searchIdCellRenderer';
import { Row } from '@pages/data-entry/edit-data-sheet/forms/_shared/helper';

const telemetryCellStyle = (params) => ({
  backgroundColor: params.data.bkgColor,
});

const SearchDraftDsTable = connect(
  'doUpdateUrl',
  'selectSearchEffortSitesDraftDatasheetData',
  'selectRouteParams',
  ({ doUpdateUrl, searchEffortSitesDraftDatasheetData, routeParams }) => {
    const siteId = routeParams?.siteId;

    const draftRows = searchEffortSitesDraftDatasheetData ?? [];

    const handleAddButtonClick = () => {
      doUpdateComplexStateField({ name: 'isEditForm', value: false });
      doUpdateUrl(`/sites-list/${siteId}/search-effort`);
    };

    return (
      <>
        <Row>
          <div className='col-md-9 col-xs-12' />
          <div className='col-md-3 col-xs-12'>
            <Button
              isOutline
              size='small'
              variant='info'
              text='Export Drafts CSV'
              icon={<Icon path={mdiDownload} />}
              className='float-right btn-width'
              handleClick={handleAddButtonClick}
            />
          </div>
        </Row>
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact
            rowHeight={35}
            rowData={draftRows}
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
                tab: 0,
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

export default SearchDraftDsTable;
