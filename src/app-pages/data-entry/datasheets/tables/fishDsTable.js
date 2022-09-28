import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import Icon from 'app-components/icon';
import DataHeader from 'app-pages/data-entry/datasheets/components/dataHeader';
import Approval from 'app-pages/data-entry/datasheets/components/approval';
import FishIdCellRenderer from 'common/gridCellRenderers/fishIdCellRenderer';
import SpeciesEditor from 'common/gridCellEditors/speciesEditor';
import SuppIdCellRenderer from 'common/gridCellRenderers/suppIdCellRenderer';
import { Row } from '../../edit-data-sheet/forms/_shared/helper';

const FishDsTable = connect(
  'doUpdateUrl',
  'selectDataEntryFishData',
  'selectSitesData',
  ({
    doUpdateUrl,
    dataEntryFishData,
    sitesData,
  }) => {
    const { items } = dataEntryFishData;
    const { siteId } = sitesData[0];

    return (
      <div className='container-fluid overflow-auto'>
        <Row>
          <div className='col-8'>
            <h4>Fish Datasheets</h4>
          </div>
        </Row>
        {/* Top Level Info */}
        <DataHeader id={siteId} />
        {/* Approval */}
        {/* @TODO: include component props */}
        <Approval />
        {/* Fish Data Table */}
        <Card className='mt-3'>
          <Card.Header text='Fish Datasheets' />
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
              text='Create Fish Datasheet'
              title='Create Fish Datasheet'
              className='float-right mr-2'
              handleClick={() => doUpdateUrl('/sites-list/datasheet/fish-create')}
            />
            <div className='ag-theme-balham mt-2' style={{ height: '300px', width: '100%' }}>
              <AgGridReact
                defaultColDef={{
                  width: 100,
                }}
                rowHeight={35}
                rowData={items}
                frameworkComponents={{
                  speciesEditor: SpeciesEditor,
                  fishIdCellRenderer: FishIdCellRenderer,
                  suppIdCellRenderer: SuppIdCellRenderer,
                }}
              >
                <AgGridColumn field='fid' headerName='Fish ID' cellRenderer='fishIdCellRenderer' cellRendererParams={{ paramType: 'tableId', uri: '/sites-list/datasheet/fish-edit' }} />
                <AgGridColumn field='ffid' headerName='Field ID' width={150} resizable sortable unSortIcon />
                <AgGridColumn
                  field='suppEntries'
                  headerName='Supp Entries'
                  width={130}
                  cellRenderer='suppIdCellRenderer'
                  cellRendererParams={{ paramType: 'fId', uri: '/sites-list/datasheet/supplemental' }} 
                />
                <AgGridColumn field='panelHook' headerName='Panel Hook' />
                <AgGridColumn field='species' cellEditor='speciesEditor' />
                <AgGridColumn field='length' />
                <AgGridColumn field='weight' />
                <AgGridColumn field='countF' headerName='Count' />
                <AgGridColumn field='ftPrefix' headerName='FT Prefix' />
                <AgGridColumn field='mR' headerName='M/R' />
                <AgGridColumn field='ftnum' headerName='Genetics Vial #' />
                <AgGridColumn field='finCurl' />
                <AgGridColumn field='otolith' />
                <AgGridColumn field='raySpine' headerName='Ray Spine' />
                <AgGridColumn field='scale' />
                <AgGridColumn field='bait' />
                <AgGridColumn field='editInitials' />
                <AgGridColumn field='lastEditComment' />
                <AgGridColumn field='uploadedBy' />
              </AgGridReact>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }
);

export default FishDsTable;
