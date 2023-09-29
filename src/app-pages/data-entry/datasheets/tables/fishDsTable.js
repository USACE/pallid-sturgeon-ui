import React, { useCallback, useRef, useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

import SelectEditor from 'common/gridCellEditors/selectEditor';
import EditCellRenderer from 'common/gridCellRenderers/editCellRenderer';
import NumberEditor from 'common/gridCellEditors/numberEditor';
import FloatEditor from 'common/gridCellEditors/floatEditor';
import TextEditor from 'common/gridCellEditors/textEditor';
import ConfirmDelete from 'common/modals/confirmDelete';

import { baitOptions, finCurlOptions, raySpineOptions, scaleOptions } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/selectHelper';
import { createDropdownOptions, createMesoOptions } from 'app-pages/data-entry/helpers';
import SuppLinkCellRenderer from 'common/gridCellRenderers/suppLinkCellRenderer';
import { Row } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';

import '../../../data-summaries/data-summary.scss';
import '../../dataentry.scss';

const FishDsTable = connect(
  'doSubmitFishDataEntries',
  'doResetStagedData',
  'doUpdateStagedData',
  'doModalOpen',
  'selectDomainsSpecies',
  'selectDomainsFtPrefixes',
  'selectDomainsMr',
  'selectDomainsOtolith',
  'selectDataEntryLastParams',
  'selectStagedData',
  'selectCombinedFishData',
  ({
    doSubmitFishDataEntries,
    doResetStagedData,
    doUpdateStagedData,
    doModalOpen,
    domainsSpecies,
    domainsFtPrefixes,
    domainsMr,
    domainsOtolith,
    dataEntryLastParams,
    stagedData,
    combinedFishData,
    setIsAddRow,
    setRowId,
  }) => {
    const gridRef = useRef();
    const [isEditingRow, setIsEditingRow] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const lastRow = combinedFishData[combinedFishData.length - 1];
    const initialState = {
      mrId: dataEntryLastParams.mrId,
    };

    const addRow = useCallback(() => {
      gridRef.current.api.applyTransaction({ add: [{}] });
    }, []);

    const copyLastRow = () => {
      const row = { ...lastRow };
      if (row) {
        delete row['fid'];
        delete row['uploadedBy'];
        row['id'] = combinedFishData.length + 1;
        gridRef.current.api.applyTransaction({ add: [row] });
        doUpdateStagedData({ ...initialState, ...row }, 'fish');
      }
    };

    const getSelectedRows = () => {
      setSelectedRows(gridRef.current.api.getSelectedNodes());
    };

    const refreshSuppLinkButtons = () => {
      gridRef.current.api.forEachNode(rowNode => {
        if (gridRef.current.api.getEditingCells().length > 0) {
          rowNode.setDataValue('supplink', (rowNode.rowIndex === gridRef.current.api.getEditingCells()[0].rowIndex) ? true : false);
        }
      });
      gridRef.current.api.refreshCells({ columns: ['supplink'] });
    };

    useEffect(() => {
      // Reset supplink column values
      gridRef.current.api.forEachNode(rowNode => {
        rowNode.setDataValue('supplink', false);
      });
      gridRef.current.api.refreshCells({ columns: ['supplink'] });
      // Find row(s) user is editing and update supplink value
      refreshSuppLinkButtons();
    }, [isEditingRow]);

    useEffect(() => {
      doResetStagedData();
    }, []);

    return (
      <div className='container-fluid overflow-auto'>
        <Row>
          <div className='col-md-9 col-xs-12'>
            <Button
              isOutline
              size='small'
              variant='success'
              text='Add Row'
              className='btn-width'
              icon={<Icon icon='plus' />}
              handleClick={addRow}
            />
            <Button
              isOutline
              size='small'
              variant='secondary'
              text='Copy Last Row'
              title='Copy Last Row'
              className='ml-1 mt-1 btn-width'
              icon={<Icon icon='content-copy' />}
              handleClick={copyLastRow}
            />
            <Button
              isOutline
              size='small'
              variant={selectedRows.length > 0 ? 'danger' : 'info'}
              text={selectedRows.length > 0 ? `Delete (${selectedRows.length})` : `Submit ${stagedData.length > 0 ? `(${stagedData.length})` : ''}`}
              className='ml-1 mt-1 btn-width'
              icon={<Icon icon={selectedRows.length > 0 ? 'trash-can-outline' : 'content-save-outline'} />}
              handleClick={() => {
                selectedRows.length > 0 ? doModalOpen(ConfirmDelete, { type: 'fish', selectedData: selectedRows, setSelectedRows: setSelectedRows }) : doSubmitFishDataEntries(stagedData);
              }}
            />
          </div>
          <div className='col-md-3 col-xs-12'>
            <Button
              isOutline
              size='small'
              variant='info'
              text='Export as CSV'
              className='float-right btn-width mt-1'
              icon={<Icon icon='download' />}
              isDisabled
              handleClick={() => doFetchAllDatasheet('fish-datasheet')}
            />
          </div>
        </Row>
        <div className='ag-theme-balham mt-2' style={{ height: '600px', width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            defaultColDef={{
              width: 100,
              editable: true,
            }}
            editType='fullRow'
            rowSelection='multiple'
            suppressRowClickSelection={true}
            onRowSelected={getSelectedRows}
            onSelectionChanged={() => { }}
            rowHeight={35}
            rowData={combinedFishData}
            frameworkComponents={{
              editCellRenderer: EditCellRenderer,
              selectEditor: SelectEditor,
              numberEditor: NumberEditor,
              floatEditor: FloatEditor,
              textEditor: TextEditor,
              suppLinkCellRenderer: SuppLinkCellRenderer
            }}
            onRowValueChanged={({ data }) => {
              if (data.fid) {
                doUpdateStagedData({ ...initialState, ...data }, 'fish');
              } else if (data.id) {
                doUpdateStagedData({ ...{ ...initialState, id: data.id }, ...data }, 'fish');
              } else {
                doUpdateStagedData({ ...{ ...initialState, id: Number(combinedFishData.length + 1) }, ...data }, 'fish');
              }
            }}
          >
            <AgGridColumn field='' headerName='' width={50} editable={false} headerCheckboxSelection={true} checkboxSelection={true} />
            <AgGridColumn
              field='Actions'
              width={100}
              cellRenderer='editCellRenderer'
              cellRendererParams={{
                type: 'fish',
                doModalOpen: doModalOpen,
                setIsEditingRow: setIsEditingRow,
              }}
              editable={false}
            />
            <AgGridColumn field='fid' headerName='Fish ID' editable={false} />
            <AgGridColumn field='ffid' headerName='Field ID' width={200} resizable sortable unSortIcon />
            <AgGridColumn
              field='supplink'
              headerName='Supp Link'
              width={130}
              cellRenderer='suppLinkCellRenderer'
              cellRendererParams={{
                setIsAddRow: setIsAddRow,
                setRowId: setRowId,
              }}
              editable={false}
            />
            <AgGridColumn field='panelHook' headerName='Panel Hook' />
            <AgGridColumn
              field='species'
              cellEditor='selectEditor'
              cellEditorParams={{
                options: createMesoOptions(domainsSpecies),
                isRequired: true
              }}
            />
            <AgGridColumn field='length' cellEditor='numberEditor' />
            <AgGridColumn field='weight' cellEditor='floatEditor' />
            <AgGridColumn field='countF' headerName='Count' cellEditor='numberEditor' />
            <AgGridColumn
              field='ftPrefix'
              headerName='FT Prefix'
              cellEditor='selectEditor'
              cellEditorParams={{
                options: createMesoOptions(domainsFtPrefixes),
                isRequired: false
              }}
            />
            <AgGridColumn field='mR' headerName='M/R' cellEditor='selectEditor' cellEditorParams={{ options: createMesoOptions(domainsMr), isRequired: false }} />
            <AgGridColumn field='ftnum' headerName='Floy Tag' />
            <AgGridColumn field='geneticsVialNumber' width={125} headerName='Genetics Vial #' />
            <AgGridColumn field='condition' cellEditor='numberEditor' editable={false} />
            <AgGridColumn field='finCurl' cellEditor='selectEditor' cellEditorParams={{ options: finCurlOptions, isRequired: false }} />
            <AgGridColumn field='otolith' cellEditor='selectEditor' cellEditorParams={{ options: createDropdownOptions(domainsOtolith), isRequired: false }} />
            <AgGridColumn field='raySpine' headerName='Ray Spine' cellEditor='selectEditor' cellEditorParams={{ options: raySpineOptions, isRequired: false }} />
            <AgGridColumn headerName='KN' cellEditor='numberEditor' editable={false} />
            <AgGridColumn field='scale' cellEditor='selectEditor' cellEditorParams={{ options: scaleOptions, isRequired: false }} />
            <AgGridColumn headerName='RSD' cellEditor='numberEditor' editable={false} />
            <AgGridColumn field='bait' cellEditor='selectEditor' cellEditorParams={{ options: baitOptions, isRequired: false }} />
            <AgGridColumn field='editInitials' cellEditor='textEditor' cellEditorParams={{ isRequired: true }} />
            <AgGridColumn field='lastEditComment' cellEditor='textEditor' cellEditorParams={{ isRequired: true }} width={200} resizable />
            <AgGridColumn field='uploadedBy' width={150} resizable editable={false} />
          </AgGridReact>
        </div>
      </div>
    );
  }
);

export default FishDsTable;
