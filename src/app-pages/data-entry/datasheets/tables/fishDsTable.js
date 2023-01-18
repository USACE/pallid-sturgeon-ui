import React, { useCallback, useRef, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import Icon from 'app-components/icon';
import DataHeader from 'app-pages/data-entry/datasheets/components/dataHeader';
import Approval from 'app-pages/data-entry/datasheets/components/approval';

import FishIdCellRenderer from 'common/gridCellRenderers/fishIdCellRenderer';
import SelectEditor from 'common/gridCellEditors/selectEditor';
import SuppIdCellRenderer from 'common/gridCellRenderers/suppIdCellRenderer';
import EditCellRenderer from 'common/gridCellRenderers/editCellRenderer';
import NumberEditor from 'common/gridCellEditors/numberEditor';
import TextEditor from 'common/gridCellEditors/textEditor';

import { Row } from '../../edit-data-sheet/forms/_shared/helper';
import { baitOptions, finCurlOptions, raySpineOptions, scaleOptions } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/selectHelper';
import { createDropdownOptions, createMesoOptions } from 'app-pages/data-entry/helpers';

const FishDsTable = connect(
  'doDomainsSpeciesFetch',
  'doDomainsFtPrefixesFetch',
  'doDomainsMrFetch',
  'doDomainsOtolithFetch',
  'doUpdateFishDataEntry',
  'doSaveFishDataEntry',
  'doModalOpen',
  'selectDataEntryFishData',
  'selectSitesData',
  'selectDomainsSpecies',
  'selectDomainsFtPrefixes',
  'selectDomainsMr',
  'selectDomainsOtolith',
  'selectDataEntryLastParams',
  ({
    doDomainsSpeciesFetch,
    doDomainsFtPrefixesFetch,
    doDomainsMrFetch,
    doDomainsOtolithFetch,
    doUpdateFishDataEntry,
    doSaveFishDataEntry,
    doModalOpen,
    dataEntryFishData,
    sitesData,
    domainsSpecies,
    domainsFtPrefixes,
    domainsMr,
    domainsOtolith,
    dataEntryLastParams,
  }) => {
    const gridRef = useRef();
    const { siteId } = sitesData[0];
    const lastRow = dataEntryFishData.items[dataEntryFishData.totalCount - 1];
    const initialState = {
      mrId: dataEntryLastParams.mrId
    };

    const addRow = useCallback(() => {
      gridRef.current.api.applyTransaction({ add: [{}] });
    }, []);

    const copyLastRow = () => {
      const row = {...lastRow};
      if (row) {
        delete row['fid'];
        delete row['uploadedBy'];
        gridRef.current.api.applyTransaction({ add: [row] });
      }
    };

    useEffect(() => {
      doDomainsFtPrefixesFetch();
      doDomainsMrFetch();
      doDomainsOtolithFetch();
      doDomainsSpeciesFetch();
    }, []);

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
              variant='success'
              text='Add Row'
              className='ml-1'
              icon={<Icon icon='plus' />}
              handleClick={addRow}
            />
            <Button
              isOutline
              size='small'
              variant='secondary'
              text='Copy Last Row'
              title='Copy Last Row'
              className='ml-1'
              icon={<Icon icon='content-copy' />}
              handleClick={copyLastRow}
            />
            <Button
              isOutline
              size='small'
              variant='info'
              text='Export as CSV'
              className='float-right ml-1'
              icon={<Icon icon='download' />}
              isDisabled
              handleClick={() => doFetchAllDatasheet('fish-datasheet')}
            />
            <div className='ag-theme-balham mt-2' style={{ height: '600px', width: '100%' }}>
              <AgGridReact
                ref={gridRef}
                suppressClickEdit
                defaultColDef={{
                  width: 100,
                  editable: true,
                  lockPinned: true,
                }}
                editType='fullRow'
                onRowValueChanged={({ data }) => !data.fid ? doSaveFishDataEntry({...initialState ,...data}, { mrId: dataEntryLastParams.mrId }) : doUpdateFishDataEntry(data, { mrId: dataEntryLastParams.mrId })}
                rowHeight={35}
                rowData={dataEntryFishData.items}
                frameworkComponents={{
                  editCellRenderer: EditCellRenderer,
                  selectEditor: SelectEditor,
                  numberEditor: NumberEditor,
                  textEditor: TextEditor,
                  fishIdCellRenderer: FishIdCellRenderer,
                  suppIdCellRenderer: SuppIdCellRenderer,
                }}
              >
                <AgGridColumn
                  field='Actions'
                  width={100}
                  pinned
                  lockPosition
                  cellRenderer='editCellRenderer'
                  cellRendererParams={{ 
                    type: 'fish',
                    doModalOpen: doModalOpen,
                  }}
                  editable={false}
                />
                <AgGridColumn 
                  field='fid' 
                  headerName='Fish ID' 
                  editable={false}
                  // cellRenderer='fishIdCellRenderer' 
                  // cellRendererParams={{ paramType: 'tableId', uri: '/sites-list/datasheet/fish-edit' }} 
                />
                <AgGridColumn field='ffid' headerName='Field ID' width={200} resizable sortable unSortIcon />
                {/* <AgGridColumn
                  field='suppEntries'
                  headerName='Supp Entries'
                  width={130}
                  cellRenderer='suppIdCellRenderer'
                  cellRendererParams={{ paramType: 'fId', uri: '/sites-list/datasheet/supplemental' }} 
                  editable={false}
                /> */}
                <AgGridColumn field='panelHook' headerName='Panel Hook' />
                <AgGridColumn field='species' cellEditor='selectEditor' cellEditorParams={{ options: createMesoOptions(domainsSpecies), isRequired: true }} />
                <AgGridColumn field='length' cellEditor='numberEditor' />
                <AgGridColumn field='weight' cellEditor='numberEditor' />
                <AgGridColumn field='countF' headerName='Count' cellEditor='numberEditor' />
                <AgGridColumn field='ftPrefix' headerName='FT Prefix' cellEditor='selectEditor' cellEditorParams={{ options: createMesoOptions(domainsFtPrefixes), isRequired: false }} />
                <AgGridColumn field='mR' headerName='M/R' cellEditor='selectEditor' cellEditorParams={{ options: createMesoOptions(domainsMr), isRequired: false }} />
                <AgGridColumn field='ftnum' headerName='Genetics Vial #' />
                <AgGridColumn field='condition' cellEditor='numberEditor' />
                <AgGridColumn field='finCurl' cellEditor='selectEditor' cellEditorParams={{ options: finCurlOptions, isRequired: false }} />
                <AgGridColumn field='otolith' cellEditor='selectEditor' cellEditorParams={{ options: createDropdownOptions(domainsOtolith), isRequired: false }} />
                <AgGridColumn field='raySpine' headerName='Ray Spine' cellEditor='selectEditor' cellEditorParams={{ options: raySpineOptions, isRequired: false }} />
                <AgGridColumn field='scale' cellEditor='selectEditor' cellEditorParams={{ options: scaleOptions, isRequired: false }} />
                <AgGridColumn field='bait' cellEditor='selectEditor' cellEditorParams={{ options: baitOptions, isRequired: false }} />
                <AgGridColumn field='editInitials' cellEditor='textEditor' cellEditorParams={{ isRequired: true }} />
                <AgGridColumn field='lastEditComment' cellEditor='textEditor' cellEditorParams={{ isRequired: true }} resizable />
                <AgGridColumn field='uploadedBy' editable={false} />
              </AgGridReact>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }
);

export default FishDsTable;
