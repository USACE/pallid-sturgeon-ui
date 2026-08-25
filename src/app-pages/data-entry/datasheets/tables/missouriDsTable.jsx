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

const fishCellStyle = (params) => ({
  backgroundColor: params.data.bkgColor,
});

const suppCellStyle = (params) => ({
  backgroundColor: params.data.suppBkgColor,
});

const procCellStyle = (params) => ({
  backgroundColor: params.data.procBkgColor,
});

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
              width={100}
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
              width={130}
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
              width={130}
              cellStyle={suppCellStyle}
              cellRenderer='mrIdCellRenderer'
              cellRendererParams={{
                type: 'supplemental',
                tab: 1,
              }}
              sortable
              unSortIcon
            />
            <AgGridColumn
              field='procCount'
              headerName='Procedure'
              width={130}
              cellStyle={procCellStyle}
              cellRenderer='mrIdCellRenderer'
              cellRendererParams={{
                type: 'procedure',
                tab: 1,
              }}
              sortable
              unSortIcon
            />
            <AgGridColumn field='mrFid' headerName='Field ID' width={170} resizable sortable unSortIcon />
            <AgGridColumn
              field='setdate'
              headerName='Date'
              valueGetter={(params) => dateFormatter(params.data.setdate)}
              sortable
              unSortIcon
            />
            <AgGridColumn field='subsample' sortable unSortIcon />
            <AgGridColumn field='gear' headerName='Gear Code' sortable unSortIcon />
            <AgGridColumn field='recorder' headerName='Recorder' sortable unSortIcon />
            <AgGridColumn field='checkby' headerName='Checked?' sortable unSortIcon />
            {/* @TODO: Check with Tisha on approved field. */}
            <AgGridColumn headerName='Approved?' sortable unSortIcon />
          </AgGridReact>
        </div>
      </>
    );
  }
);

export default MissouriDsTable;
