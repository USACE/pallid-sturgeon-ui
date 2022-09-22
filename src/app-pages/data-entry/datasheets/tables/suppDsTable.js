import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import Icon from 'app-components/icon';
import { Row } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';
import DataHeader from '../components/dataHeader';
import Approval from '../components/approval';
import SuppIdCellRenderer from 'common/gridCellRenderers/suppIdCellRenderer';
import ProcedureIdCellRenderer from 'common/gridCellRenderers/procedureIdCellRenderer';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const SuppDsTable = connect(
  'doUpdateUrl',
  'selectDataEntry',
  'selectDataEntrySupplemental',
  ({
    doUpdateUrl,
    dataEntry,
    dataEntrySupplemental,
  }) => {
    const { items, totalCount } = dataEntrySupplemental;

    return (
      <div className='container-fluid overflow-auto'>
        <Row>
          <div className='col-8'>
            <h4>Supplemental Datasheet</h4>
          </div>
        </Row>
        {/* @TODO: include component props */}
        {/* Top Level Info */}
        <DataHeader />
        {/* Approval */}
        <Approval />
        <Card className='mt-3'>
          <Card.Header text='Supplemental Datasheet(s)' />
          <Card.Body>
            <Button
              isOutline
              size='small'
              variant='info'
              text='Export as CSV'
              icon={<Icon icon='download' />}
            // handleClick={() => doFetchAllDatasheet('search-datasheet')}
            />
            <Button
              isOutline
              size='small'
              variant='info'
              text='Create Supplemental Datasheet'
              title='Create Supplemental Datasheet'
              className='float-right mr-2'
              handleClick={() => doUpdateUrl('/sites-list/datasheet/supplemental-create')}
              isDisabled={totalCount > 0}
            />
            <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '300px' }}>
              <AgGridReact
                rowHeight={35}
                rowData={items}
                defaultColDef={{
                  width: 150,
                }}
                frameworkComponents={{
                  procedureIdCellRenderer: ProcedureIdCellRenderer,
                  suppIdCellRenderer: SuppIdCellRenderer,
                }}
              >
                <AgGridColumn field='sid' headerName='Supplemental ID' cellRenderer='suppIdCellRenderer' cellRendererParams={{ paramType: 'tableId', uri: '/sites-list/datasheet/supplemental-edit' }} sortable unSortIcon />
                <AgGridColumn field='fid' headerName='Fish ID' sortable unSortIcon />
                <AgGridColumn field='fFid' resizable sortable unSortIcon />
                <AgGridColumn field='mrId' sortable unSortIcon  />
                <AgGridColumn field='procEntries' headerName='Procedure Entries' width={130} cellRenderer='procedureIdCellRenderer' cellRendererParams={{ paramType: 'fId', uri: '/sites-list/datasheet/procedure' }} />
                <AgGridColumn field='tagnumber' sortable unSortIcon />
                <AgGridColumn field='pitrn' sortable unSortIcon />
              </AgGridReact>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  });

export default SuppDsTable;
