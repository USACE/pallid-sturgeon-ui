import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { mdiDownload } from '@mdi/js';

import Button from '@components/button';
import Icon from '@components/icon/icon';

import { dateFormatter } from '@common/gridHelpers/ag-grid-helper';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const MissouriRiverTable = connect(
  'doFetchAllDatasheet',
  'selectMissouriDataSummary',
  ({ doFetchAllDatasheet, missouriDataSummary }) => {
    const { data } = missouriDataSummary;

    return (
      <>
        <Button
          isOutline
          size='small'
          variant='info'
          text='Export as CSV'
          icon={<Icon path={mdiDownload} />}
          handleClick={() => doFetchAllDatasheet('missouri-river-datasheet')}
        />
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact
            rowData={data}
            defaultColDef={{
              width: 150,
            }}
          >
            <AgGridColumn field='year' />
            <AgGridColumn field='fieldOffice' sortable unSortIcon />
            <AgGridColumn field='project' />
            <AgGridColumn field='segment' />
            <AgGridColumn field='season' />
            <AgGridColumn field='bend' />
            <AgGridColumn field='bendrn' headerName='Bend R/N' />
            <AgGridColumn field='bendRiverMile' />
            <AgGridColumn field='subsample' />
            <AgGridColumn field='pass' />
            <AgGridColumn field='uniqueID' sortable unSortIcon />
            <AgGridColumn
              field='setDate'
              valueGetter={(params) => dateFormatter(params.data.setDate)}
              sortable
              unSortIcon
            />
            <AgGridColumn field='conductivity' sortable unSortIcon />
            <AgGridColumn field='checkedby' sortable unSortIcon />
          </AgGridReact>
        </div>
      </>
    );
  }
);

export default MissouriRiverTable;
