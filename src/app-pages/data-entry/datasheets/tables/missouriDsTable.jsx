import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';
import { mdiDownload, mdiPlus } from '@mdi/js';

import Button from '@components/button';
import Icon from '@components/icon/icon';

import EditCellRenderer from '@common/gridCellRenderers/editCellRenderer';
import MrIdCellRenderer from '@common/gridCellRenderers/mrIdCellRenderer';

import { dateFormatter } from '@common/gridHelpers/ag-grid-helper';
import { Row } from '@pages/data-entry/edit-data-sheet/forms/_shared/helper';
import { defaultColDef } from '@src/utils/helpers';

const fishCellStyle = (params) => ({
  backgroundColor: params.data.bkgColor,
});

const suppCellStyle = (params) => ({
  backgroundColor: params.data.suppBkgColor,
});

const procCellStyle = (params) => ({
  backgroundColor: params.data.procBkgColor,
});

const components = {
  editCellRenderer: EditCellRenderer,
  mrIdCellRenderer: MrIdCellRenderer,
};

const columnDefs = [
  {
    field: 'mrID',
    headerName: 'MR ID',
    width: 100,
    cellRenderer: 'mrIdCellRenderer',
    cellRendererParams: { type: 'missouriRiver' },
  },
  {
    field: 'fishCount',
    headerName: 'Fish',
    width: 130,
    cellStyle: fishCellStyle,
    cellRenderer: 'mrIdCellRenderer',
    cellRendererParams: { type: 'fish', tab: 1 },
  },
  {
    field: 'suppCount',
    headerName: 'Supplemental',
    width: 130,
    cellStyle: suppCellStyle,
    cellRenderer: 'mrIdCellRenderer',
    cellRendererParams: { type: 'supplemental', tab: 2 },
  },
  {
    field: 'procCount',
    headerName: 'Procedure',
    width: 130,
    cellStyle: procCellStyle,
    cellRenderer: 'mrIdCellRenderer',
    cellRendererParams: { type: 'procedure', tab: 3 },
  },
  { field: 'mrFid', headerName: 'Field ID', resizable: true, width: 170 },
  {
    field: 'setdate',
    headerName: 'Date',
    valueGetter: (params) => dateFormatter(params.data.setdate),
  },
  { field: 'subsample' },
  { field: 'gear', headerName: 'Gear Code' },
  { field: 'recorder', headerName: 'Recorder' },
  { field: 'checkby', headerName: 'Checked?' },
  { headerName: 'Approved?' },
];

const MissouriDsTable = connect(
  'doUpdateUrl',
  'doUpdateComplexStateField',
  'selectMoriverSitesDatasheetData',
  'selectRouteParams',
  ({ doUpdateUrl, doUpdateComplexStateField, moriverSitesDatasheetData, routeParams }) => {
    const siteId = routeParams?.siteId;

    const handleAddButtonClick = () => {
      doUpdateComplexStateField({ name: 'isEditForm', value: false });
      doUpdateUrl(`/sites-list/${siteId}/missouri-river`);
    };

    return (
      <>
        <Row>
          <div className='col-md-9 col-xs-12'>
            <Button
              isOutline
              size='small'
              variant='success'
              text='Add Missouri River Datasheet'
              title='Add Missouri River Datasheet'
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
              className='float-right btn-width'
              icon={<Icon path={mdiDownload} />}
              isDisabled
            />
          </div>
        </Row>
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact
            rowHeight={35}
            rowData={moriverSitesDatasheetData}
            defaultColDef={defaultColDef}
            components={components}
            columnDefs={columnDefs}
          />
        </div>
      </>
    );
  }
);

export default MissouriDsTable;
