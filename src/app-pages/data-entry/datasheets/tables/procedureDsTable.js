import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';
import ProcedureIdCellRenderer from 'common/gridCellRenderers/procedureIdCellRenderer';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const ProcedureDsTable = connect(
  'doUpdateUrl',
  'selectDataEntryProcedure',
  'selectSitesData',
  ({
    doUpdateUrl,
    dataEntryProcedure,
    sitesData
  }) => {
    const { items, totalCount } = dataEntryProcedure;

    return (
      <div className='container-fluid overflow-auto'>
        <Button
          isOutline
          size='small'
          variant='success'
          text='Add Procedure Datasheet'
          title='Add Procedure Datasheet'
          icon={<Icon icon='plus' />}
          handleClick={() => doUpdateUrl('/sites-list/datasheet/procedure-create')}
          isDisabled
          // isDisabled={totalCount > 0}
        />
        <Button
          isOutline
          size='small'
          variant='info'
          text='Export as CSV'
          icon={<Icon icon='download' />}
          className='float-right mr-2'
          isDisabled
          // handleClick={() => doFetchAllDatasheet('search-datasheet')}
        />
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact
            rowHeight={35}
            rowData={items}
            defaultColDef={{
              width: 150,
            }}
            frameworkComponents={{
              procedureIdCellRenderer: ProcedureIdCellRenderer,
            }}
          >
            <AgGridColumn field='id' headerName='Procedure ID' cellRenderer='procedureIdCellRenderer' cellRendererParams={{ paramType: 'tableId', uri: '/sites-list/datasheet/procedure-edit' }} sortable unSortIcon />
            <AgGridColumn field='fid' headerName='Fish ID' sortable unSortIcon />
            <AgGridColumn field='fFid' resizable sortable unSortIcon />
            <AgGridColumn field='mrFid' resizable sortable unSortIcon  />
            <AgGridColumn field='purpose' sortable unSortIcon />
            <AgGridColumn field='procedureDate' sortable unSortIcon />
            <AgGridColumn field='procedureStartTime' sortable unSortIcon />
            <AgGridColumn field='procedureEndTime' sortable unSortIcon />
            <AgGridColumn field='procedureBy' sortable unSortIcon />
            <AgGridColumn field='antibioticInjection' sortable unSortIcon />
            <AgGridColumn field='pDorsal' sortable unSortIcon />
            <AgGridColumn field='pVentral' sortable unSortIcon />
            <AgGridColumn field='pLeft' sortable unSortIcon />
            <AgGridColumn field='oldRadioTagNum' sortable unSortIcon />
            <AgGridColumn field='oldFrequencyId' sortable unSortIcon />
            <AgGridColumn field='dstSerialNum' sortable unSortIcon />
            <AgGridColumn field='dstStartDate' sortable unSortIcon />
            <AgGridColumn field='dstStartTime' sortable unSortIcon />
            <AgGridColumn field='dstReimplant' sortable unSortIcon />
            <AgGridColumn field='newRadioTagNum' sortable unSortIcon />
            <AgGridColumn field='newFreqId' sortable unSortIcon />
            <AgGridColumn field='sexCode' sortable unSortIcon />
            <AgGridColumn field='bloodSample' sortable unSortIcon />
            <AgGridColumn field='eggSample' sortable unSortIcon />
            <AgGridColumn field='comments' resizable sortable unSortIcon />
            <AgGridColumn field='fishHealthComment' resizable sortable unSortIcon />
            <AgGridColumn field='evalLocation' sortable unSortIcon />
            <AgGridColumn field='spawnStatus' sortable unSortIcon />
            <AgGridColumn field='visualReproStatus' sortable unSortIcon />
            <AgGridColumn field='ultrasoundReproStatus' sortable unSortIcon />
            <AgGridColumn field='expectedSpawnYear' sortable unSortIcon />
            <AgGridColumn field='ultrasoundGonadLength' sortable unSortIcon />
            <AgGridColumn field='gonadCondition' sortable unSortIcon />
            <AgGridColumn field='editInitials' sortable unSortIcon />
            <AgGridColumn field='lastEditComment' resizable sortable unSortIcon />
            <AgGridColumn field='lastUpdated' sortable unSortIcon />
            <AgGridColumn field='uploadedBy' sortable unSortIcon />
          </AgGridReact>
        </div>
      </div>
    );
  });

export default ProcedureDsTable;
