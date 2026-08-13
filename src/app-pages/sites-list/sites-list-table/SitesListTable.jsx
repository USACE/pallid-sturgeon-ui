import { connect } from 'redux-bundler-react';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import { mdiDownload, mdiPlus } from '@mdi/js';
import { Button, Grid } from '@trussworks/react-uswds';

import SitesFormModal from '../site-form-modal/SitesFormModal';

import SiteIdCellRenderer from '@src/app-pages/sites-list/sites-list-table/siteIdCellRenderer';
import ExportButton from '@components/button/exportButton';
import Icon from '@components/icon/icon';

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
    const handleAddButton = () => {
      doModalOpen(SitesFormModal);

      if (navigator.onLine) {
        doDomainBendRnFetch();
      }
    };

    return (
      <div>
        <Grid row style={{ justifyContent: 'space-between' }}>
          <ExportButton
            variant='info'
            size='small'
            isOutline
            isDisabled={sitesData?.length === 0}
            filename={`sites-list-${new Date().toISOString()}`}
            data={exportData}
            icon={<Icon path={mdiDownload} />}
          />
          <div className='add-sites-btn'>
            <Button onClick={handleAddButton} className='add-btn' outline size='small' title='Add Site'>
              <Icon path={mdiPlus} />
              Add Site
            </Button>
          </div>
        </Grid>
        <div className='ag-theme-balham mt-2' style={{ height: '600px', width: '100%' }}>
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
