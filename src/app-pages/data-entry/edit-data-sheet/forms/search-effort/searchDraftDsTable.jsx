import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { mdiDownload } from '@mdi/js';

import Button from '@src/app-components/button';
import Icon from '@src/app-components/icon/icon';
import SearchIdCellRenderer from '@src/common/gridCellRenderers/searchIdCellRenderer';
import { Row } from '@pages/data-entry/edit-data-sheet/forms/_shared/helper';
import { useEffect, useState } from 'react';

const telemetryCellStyle = (params) => ({
  backgroundColor: params.data.bkgColor,
});

const SearchDraftDsTable = connect(
  'doResetFormData',
  'doResetTelemetryDataEntries',
  'doUpdateCurrentTab',
  'doUpdateUrl',
  'doUpdateComplexStateField',
  'selectSearchEffortSitesDraftDatasheetData',
  'selectRouteParams',
  ({
    doResetFormData,
    doResetTelemetryDataEntries,
    doUpdateCurrentTab,
    doUpdateUrl,
    doUpdateComplexStateField,
    searchEffortSitesDraftDatasheetData,
    routeParams,
  }) => {
    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
    const siteId = routeParams?.siteId;
    const searchDraftKey = `currentSearchEffortDraft:${siteId}`;
    const draftRows = searchEffortSitesDraftDatasheetData ?? [];

    const handleAddButtonClick = () => {
      sessionStorage.removeItem(searchDraftKey);
      // reset form
      doResetFormData();
      doResetTelemetryDataEntries();
      doUpdateCurrentTab(0);
      doUpdateComplexStateField({ name: 'isEditForm', value: false });
      doUpdateUrl(`/sites-list/${siteId}/search-effort`);
    };

    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (event) => {
        setIsDarkMode(event.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }, []);

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
        <div
          className={`mt-2 ${isDarkMode ? 'ag-theme-balham-dark' : 'ag-theme-balham'}`}
          style={{ width: '100%', height: '600px' }}
        >
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
