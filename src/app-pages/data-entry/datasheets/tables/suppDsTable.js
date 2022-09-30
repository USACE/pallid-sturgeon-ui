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
  'selectDataEntrySupplemental',
  'selectSitesData',
  ({
    doUpdateUrl,
    dataEntrySupplemental,
    sitesData,
  }) => {
    const { items, totalCount } = dataEntrySupplemental;
    const { siteId } = sitesData[0];
    
    return (
      <div className='container-fluid overflow-auto'>
        <Row>
          <div className='col-8'>
            <h4>Supplemental Datasheet</h4>
          </div>
        </Row>
        {/* Top Level Info */}
        <DataHeader id={siteId} />
        {/* Approval */}
        {/* @TODO: include component props */}
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
                <AgGridColumn field='cwtyn' sortable unSortIcon />
                <AgGridColumn field='dangler' sortable unSortIcon />
                <AgGridColumn field='scuteloc' sortable unSortIcon />
                <AgGridColumn field='scutenum' sortable unSortIcon />
                <AgGridColumn field='scuteloc2' sortable unSortIcon />
                <AgGridColumn field='scutenum2' sortable unSortIcon />
                <AgGridColumn field='elcolor' sortable unSortIcon />
                <AgGridColumn field='elhv' sortable unSortIcon />
                <AgGridColumn field='ercolor' sortable unSortIcon />
                <AgGridColumn field='erhv' sortable unSortIcon />
                <AgGridColumn field='genetic' sortable unSortIcon />
                <AgGridColumn field='geneticNeeds' sortable unSortIcon />
                <AgGridColumn field='geneticsVialNumber' sortable unSortIcon />
                <AgGridColumn field='otherTagInfo' sortable unSortIcon />
                <AgGridColumn field='anal' sortable unSortIcon />
                <AgGridColumn field='archive' sortable unSortIcon />
                <AgGridColumn field='broodstock' sortable unSortIcon />
                <AgGridColumn field='hatchWild' sortable unSortIcon />
                <AgGridColumn field='hatcheryOrigin' sortable unSortIcon />
                <AgGridColumn field='head' sortable unSortIcon />
                <AgGridColumn field='inter' sortable unSortIcon />
                <AgGridColumn field='lIb' sortable unSortIcon />
                <AgGridColumn field='lOb' sortable unSortIcon />
                <AgGridColumn field='mIb' sortable unSortIcon />
                <AgGridColumn field='rIb' sortable unSortIcon />
                <AgGridColumn field='rOb' sortable unSortIcon />
                <AgGridColumn field='mouthwidth' sortable unSortIcon />
                <AgGridColumn field='recapture' sortable unSortIcon />
                <AgGridColumn field='lastEditComment' sortable unSortIcon />
                <AgGridColumn field='editInitials' sortable unSortIcon />
                <AgGridColumn field='uploadedBy' sortable unSortIcon />
              </AgGridReact>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  });

export default SuppDsTable;
