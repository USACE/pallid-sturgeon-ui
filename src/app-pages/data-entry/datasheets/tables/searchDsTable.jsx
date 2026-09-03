import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { mdiDownload, mdiPlus } from '@mdi/js';

import Icon from '@components/icon/icon';

import SearchIdCellRenderer from '@common/gridCellRenderers/searchIdCellRenderer';

import { Row } from '@pages/data-entry/edit-data-sheet/forms/_shared/helper';
import { Button } from '@trussworks/react-uswds';
import { useEffect, useState } from 'react';

const telemetryCellStyle = (params) => {
  const isOnline = navigator.onLine;
  var offlineBkgColor = '';
  if (!isOnline) {
    if (params?.data?.telemetryCount > 0) {
      offlineBkgColor = '#daf2ea';
    }
  }
  return {
    backgroundColor: isOnline ? params.data.bkgColor : offlineBkgColor,
  };
};

const SearchDsTable = connect(
  'doResetFormData',
  'doResetTelemetryDataEntries',
  'doUpdateCurrentTab',
  'doUpdateUrl',
  'doUpdateComplexStateField',
  'selectSearchEffortSitesDatasheetData',
  'selectSearchEffortSitesDraftDatasheetData',
  'selectRouteParams',
  ({
    doResetFormData,
    doResetTelemetryDataEntries,
    doUpdateCurrentTab,
    doUpdateUrl,
    doUpdateComplexStateField,
    searchEffortSitesDatasheetData,
    searchEffortSitesDraftDatasheetData,
    routeParams,
    isDraft,
  }) => {
    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
    const siteId = routeParams?.siteId;
    const searchDraftKey = `currentSearchEffortDraft:${siteId}`;
    const data = isDraft ? searchEffortSitesDraftDatasheetData : searchEffortSitesDatasheetData;

    const handleAddButtonClick = () => {
      sessionStorage.removeItem(searchDraftKey);
      // Reset form data
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
        <div
          className={`mt-2 ${isDarkMode ? 'ag-theme-balham-dark' : 'ag-theme-balham'}`}
          style={{ width: '100%', height: '600px' }}
        >
          <AgGridReact
            rowHeight={35}
            rowData={data}
            defaultColDef={{
              width: 150,
            }}
            frameworkComponents={{
              searchIdCellRenderer: SearchIdCellRenderer,
            }}
          >
            <AgGridColumn
              field='seId'
              headerName='SE ID'
              width={75}
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
              width={100}
              cellStyle={telemetryCellStyle}
              cellRenderer='searchIdCellRenderer'
              cellRendererParams={{
                type: 'telemetry',
                tab: 1,
              }}
              sortable
              unSortIcon
            />
            <AgGridColumn field='searchTypeCode' sortable unSortIcon />
            <AgGridColumn field='startTime' width={100} sortable unSortIcon />
            <AgGridColumn field='startLatitude' width={125} sortable unSortIcon />
            <AgGridColumn field='startLongitude' width={130} sortable unSortIcon />
            <AgGridColumn field='stopTime' width={100} sortable unSortIcon />
            <AgGridColumn field='stopLatitude' width={125} sortable unSortIcon />
            <AgGridColumn field='stopLongitude' width={130} sortable unSortIcon />
            <AgGridColumn field='temp' width={75} sortable unSortIcon />
            <AgGridColumn field='conductivity' width={120} sortable unSortIcon />
            <AgGridColumn field='recorder' width={100} sortable unSortIcon />
            <AgGridColumn field='editInitials' width={110} sortable unSortIcon />
            <AgGridColumn field='lastEditComment' width={200} sortable unSortIcon />
            <AgGridColumn field='uploadedBy' sortable unSortIcon />
          </AgGridReact>
        </div>
      </>
    );
  }
);

export default SearchDsTable;
