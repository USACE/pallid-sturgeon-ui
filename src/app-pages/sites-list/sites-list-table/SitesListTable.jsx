import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';
import { mdiDownload, mdiPlus } from '@mdi/js';
import { Button, Grid } from '@trussworks/react-uswds';

import SitesFormModal from '../site-form-modal/SitesFormModal';

import SiteIdCellRenderer from '@src/app-pages/sites-list/sites-list-table/siteIdCellRenderer';
import ExportButton from '@components/button/exportButton';
import Icon from '@components/icon/icon';

import '@pages/data-summaries/data-summary.scss';
import { defaultColDef } from '@src/utils/helpers';

const frameworkComponents = {
  siteIdCellRenderer: SiteIdCellRenderer,
};

const cellStyle = (params) => ({
  backgroundColor: params.data.bkgColor,
});

const columnDefs = [
  {
    field: 'siteId',
    headerName: 'Site ID',
    cellRenderer: 'siteIdCellRenderer',
    cellRendererParams: { edit: true },
    width: 100,
  },
  { field: 'year', width: 100 },
  { field: 'fieldoffice', headerName: 'Field Office' },
  { field: 'projectId', headerName: 'Project' },
  { field: 'segmentId', headerName: 'Segment' },
  { field: 'season' },
  {
    field: 'bend',
    headerName: 'Sample Unit',
    cellStyle: cellStyle,
    cellRenderer: 'siteIdCellRenderer',
    cellRendererParams: { edit: false },
  },
  { field: 'sampleUnitType', headerName: 'Sample Unit Type' },
  { field: 'bendrn', headerName: 'Bend R/N' },
  { field: 'bendRiverMile' },
  { field: 'editInitials' },
  { field: 'last_edit_comment', headerName: 'Last Edit Comment' },
  { field: 'uploadedBy' },
];

const SitesListTable = connect(
  'doModalOpen',
  'doDomainBendRnFetch',
  'selectSitesData',
  'selectExportData',
  ({ doModalOpen, doDomainBendRnFetch, sitesData, exportData }) => {
    const handleAddButton = () => {
      doModalOpen(SitesFormModal);
      doDomainBendRnFetch();
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
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            frameworkComponents={frameworkComponents}
            rowData={sitesData}
            rowHeight={35}
          />
        </div>
      </div>
    );
  }
);

export default SitesListTable;
