import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { mdiDownload, mdiPlus } from '@mdi/js';

import Icon from '@components/icon/icon';

import EditCellRenderer from '@common/gridCellRenderers/editCellRenderer';
import MrIdCellRenderer from '@common/gridCellRenderers/mrIdCellRenderer';

import { dateFormatter } from '@common/gridHelpers/ag-grid-helper';
import { Row } from '@pages/data-entry/edit-data-sheet/forms/_shared/helper';
import { Button } from '@trussworks/react-uswds';
import { useEffect, useState } from 'react';

const fishCellStyle = (params) => {
  const isOnline = navigator.onLine;
  var offlineBkgColor = '';
  if (!isOnline) {
    if (params?.data?.fishCount > 0) {
      offlineBkgColor = '#daf2ea';
    }
  }
  return {
    backgroundColor: isOnline ? params.data.bkgColor : offlineBkgColor,
  };
};

const suppCellStyle = (params) => {
  const isOnline = navigator.onLine;
  var offlineBkgColor = '';
  if (!isOnline) {
    if (params?.data?.suppCount > 0) {
      offlineBkgColor = '#daf2ea';
    }
  }
  return {
    backgroundColor: isOnline ? params.data.suppBkgColor : offlineBkgColor,
  };
};

const procCellStyle = (params) => {
  const isOnline = navigator.onLine;
  var offlineBkgColor = '';
  if (!isOnline) {
    if (params?.data?.procCount > 0) {
      offlineBkgColor = '#daf2ea';
    }
  }
  return {
    backgroundColor: isOnline ? params.data.procBkgColor : offlineBkgColor,
  };
};

const MissouriDsTable = connect(
  'doResetFormData',
  'doResetMoRiverDataEntryData',
  'doUpdateUrl',
  'doUpdateComplexStateField',
  'selectMoriverSitesDatasheetData',
  'selectMoriverDraftSitesDatasheetData',
  'doUpdateCurrentTab',
  'selectRouteParams',
  ({
    doResetFormData,
    doResetMoRiverDataEntryData,
    doUpdateUrl,
    doUpdateComplexStateField,
    moriverDraftSitesDatasheetData,
    moriverSitesDatasheetData,
    doUpdateCurrentTab,
    routeParams,
    isDraft,
  }) => {
    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
    const siteId = routeParams?.siteId;
    const moriverDraftKey = `currentMissouriRiverDraft:${siteId}`;
    const data = isDraft ? moriverDraftSitesDatasheetData : moriverSitesDatasheetData;

    const handleAddButtonClick = () => {
      sessionStorage.removeItem(moriverDraftKey);
      // Reset form data
      doResetFormData();
      doResetMoRiverDataEntryData();
      doUpdateCurrentTab(0);
      doUpdateComplexStateField({ name: 'isEditForm', value: false });
      doUpdateUrl(`/sites-list/${siteId}/missouri-river`);
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
            <Button onClick={handleAddButtonClick} className='add-btn' title='Add Missouri River Datasheet'>
              <span>
                <Icon path={mdiPlus} />
              </span>
              Add Missouri River Datasheet
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
              editCellRenderer: EditCellRenderer,
              mrIdCellRenderer: MrIdCellRenderer,
            }}
          >
            <AgGridColumn
              field='mrId'
              headerName='MR ID'
              width={85}
              cellRenderer='mrIdCellRenderer'
              cellRendererParams={{
                type: 'missouriRiver',
                tab: 0,
              }}
              sortable
              unSortIcon
            />
            <AgGridColumn
              field='fishCount'
              headerName='Fish'
              width={70}
              cellStyle={fishCellStyle}
              cellRenderer='mrIdCellRenderer'
              cellRendererParams={{
                type: 'fish',
                tab: 1,
              }}
              sortable
              unSortIcon
            />
            <AgGridColumn
              field='suppCount'
              headerName='Supplemental'
              cellStyle={suppCellStyle}
              width={125}
              sortable
              unSortIcon
            />
            <AgGridColumn
              field='procCount'
              headerName='Procedure'
              cellStyle={procCellStyle}
              width={105}
              sortable
              unSortIcon
            />
            <AgGridColumn field='mrFid' headerName='Field ID' width={170} resizable sortable unSortIcon />
            <AgGridColumn
              field='setdate'
              headerName='Date'
              width={90}
              valueGetter={(params) => dateFormatter(params.data.setdate)}
              sortable
              unSortIcon
            />
            <AgGridColumn field='subsample' width={110} sortable unSortIcon />
            <AgGridColumn field='gearCode' headerName='Gear Code' width={110} sortable unSortIcon />
            <AgGridColumn field='recorder' headerName='Recorder' width={100} sortable unSortIcon />
          </AgGridReact>
        </div>
      </>
    );
  }
);

export default MissouriDsTable;
