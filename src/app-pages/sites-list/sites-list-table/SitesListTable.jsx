import { connect } from 'redux-bundler-react';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import { mdiDownload, mdiPlus } from '@mdi/js';
import { Button, Grid } from '@trussworks/react-uswds';
import { useEffect, useState } from 'react';

import SitesFormModal from '../site-form-modal/SitesFormModal';

import SiteIdCellRenderer from '@src/app-pages/sites-list/sites-list-table/siteIdCellRenderer';
import ExportButton from '@components/button/exportButton';
import Icon from '@components/icon/icon';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@src/app-pages/data-entry/offline/db';
import { exportOfflineRecoveryData } from '@src/app-pages/data-entry/offline/export-recovery';

import '@pages/data-summaries/data-summary.scss';

const cellStyle = (params) => ({
  backgroundColor: params.data.bkgColor,
});

const SitesListTable = connect(
  'doModalOpen',
  'doDomainBendRnFetch',
  'selectSitesData',
  'selectExportData',
  ({ doModalOpen, doDomainBendRnFetch, sitesData, exportData }) => {
    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
    const pendingRecoveryCount = useLiveQuery(() => db.outbox.count(), [], 0);
    const [exportingRecovery, setExportingRecovery] = useState(false);

    const handleAddButton = () => {
      doModalOpen(SitesFormModal);
      if (navigator.onLine) {
        doDomainBendRnFetch();
      }
    };

    const handleRecoveryExport = async () => {
      try {
        setExportingRecovery(true);
        const result = await exportOfflineRecoveryData();
        console.log('Offline recovery export completed:', result);
      } catch (err) {
        console.log('Offline recovery export failed:', err);
        window.alert('Offline recovery export failed. Your offline data has not been deleted.');
      } finally {
        setExportingRecovery(false);
      }
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
      <div>
        <Grid row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ExportButton
              variant='info'
              size='small'
              isOutline
              isDisabled={sitesData?.length === 0}
              filename={`sites-list-${new Date().toISOString()}`}
              data={exportData}
              icon={<Icon path={mdiDownload} />}
            />
            {pendingRecoveryCount > 0 && (
              <Button
                type='button'
                outline
                size='small'
                className='recovery-export-btn'
                disabled={exportingRecovery}
                onClick={handleRecoveryExport}
                title={'Download recovery CSV files for all queued offline records'}
              >
                <Icon path={mdiDownload} />
                {exportingRecovery
                  ? 'Exporting...'
                  : `Export Offline Recovery${pendingRecoveryCount ? `(${pendingRecoveryCount})` : ''}`}
              </Button>
            )}
          </div>
          <div className='add-sites-btn'>
            <Button onClick={handleAddButton} className='add-btn' outline size='small' title='Add Site'>
              <Icon path={mdiPlus} />
              Add Site
            </Button>
          </div>
        </Grid>
        <div
          className={`mt-2 ${isDarkMode ? 'ag-theme-balham-dark' : 'ag-theme-balham'}`}
          style={{ height: '600px', width: '100%' }}
        >
          <AgGridReact
            rowHeight={35}
            defaultColDef={{
              width: 150,
            }}
            rowData={sitesData}
            frameworkComponents={{
              siteIdCellRenderer: SiteIdCellRenderer,
            }}
          >
            <AgGridColumn
              field='siteDisplayId'
              headerName='Site ID'
              cellRenderer='siteIdCellRenderer'
              cellRendererParams={{ edit: true }}
              width={100}
              sortable
              unSortIcon
            />
            <AgGridColumn field='siteFid' width={125} sortable unSortIcon />
            <AgGridColumn field='year' width={100} sortable unSortIcon />
            <AgGridColumn field='fieldoffice' headerName='Field Office' sortable unSortIcon />
            <AgGridColumn field='projectId' headerName='Project' sortable unSortIcon />
            <AgGridColumn field='segmentId' headerName='Segment' sortable unSortIcon />
            <AgGridColumn field='season' sortable unSortIcon />
            <AgGridColumn
              field='bend'
              headerName='Sample Unit'
              cellStyle={cellStyle}
              cellRenderer='siteIdCellRenderer'
              cellRendererParams={{ edit: false }}
              sortable
              unSortIcon
            />
            <AgGridColumn field='sampleUnitType' headerName='Sample Unit Type' sortable unSortIcon />
            <AgGridColumn field='bendrn' headerName='Bend R/N' sortable unSortIcon />
            <AgGridColumn field='bendRiverMile' sortable unSortIcon />
            <AgGridColumn field='editInitials' sortable unSortIcon />
            <AgGridColumn field='last_edit_comment' headerName='Last Edit Comment' sortable unSortIcon />
            <AgGridColumn field='uploadedBy' sortable unSortIcon />
          </AgGridReact>
        </div>
      </div>
    );
  }
);

export default SitesListTable;
