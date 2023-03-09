import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

import EditCellRenderer from 'common/gridCellRenderers/editCellRenderer';
import ProcLinkCellRenderer from 'common/gridCellRenderers/procLinkCellRenderer';
import TextEditor from 'common/gridCellEditors/textEditor';
import SelectEditor from 'common/gridCellEditors/selectEditor';
import NumberEditor from 'common/gridCellEditors/numberEditor';

import { HVXOptions, ScuteOptions, visualAssessmentOptions, YNNumOptions, YNTextOptions } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/selectHelper';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const SuppDsTable = connect(
  'doModalOpen',
  'doSaveSupplementalDataEntry',
  'doUpdateSupplementalDataEntry',
  'selectDataEntrySupplemental',
  'selectDataEntryLastParams',
  ({
    doModalOpen,
    doSaveSupplementalDataEntry,
    doUpdateSupplementalDataEntry,
    dataEntrySupplemental,
    dataEntryLastParams,
    isAddRow,
    rowId,
    setIsAddRow,
    setRowId,
  }) => {
    const gridRef = useRef();
    const [ isEditingRow, setIsEditingRow ] = useState(false);
    const { items } = dataEntrySupplemental;

    const initialState = {
      mrId: dataEntryLastParams.mrId
    };

    const addRow = useCallback((fid) => {
      gridRef.current.api.applyTransaction({ add: [{ fid: fid }] });
    }, []);

    const refreshSuppLinkButtons = () => {
      gridRef.current.api.forEachNode(rowNode => {
        if (gridRef.current.api.getEditingCells().length > 0) {
          if (rowNode.rowIndex === gridRef.current.api.getEditingCells()[0].rowIndex) {
            rowNode.setDataValue('proclink', true);
          } else {
            rowNode.setDataValue('proclink', false);
          }
        }
        console.log(rowNode.rowIndex, rowNode.data.proclink);
      });
      gridRef.current.api.refreshCells({ columns: ['proclink'] });
    };

    useEffect(() => {
      if (isAddRow) {
        addRow(rowId);
      }
    }, [isAddRow]);

    useEffect(() => {
      // Reset proclink column values
      gridRef.current.api.forEachNode(rowNode => {
        rowNode.setDataValue('proclink', false);
      });
      gridRef.current.api.refreshCells({ columns: ['proclink'] });
      // Find row(s) user is editing and update proclink value
      refreshSuppLinkButtons();
    }, [isEditingRow]);

    return (
      <div className='container-fluid overflow-auto'>
        <Button
          isOutline
          size='small'
          variant='info'
          text='Export as CSV'
          icon={<Icon icon='download' />}
          isDisabled
          // handleClick={() => doFetchAllDatasheet('search-datasheet')}
        />
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact
            ref={gridRef}
            suppressClickEdit
            rowHeight={35}
            rowData={items}
            defaultColDef={{
              width: 100,
              editable: true,
              lockPinned: true,
            }}
            editType='fullRow'
            onRowValueChanged={({ data }) => !data.sid ? doSaveSupplementalDataEntry({...initialState ,...data}, { mrId: dataEntryLastParams.mrId }) : doUpdateSupplementalDataEntry(data, { mrId: dataEntryLastParams.mrId })}
            frameworkComponents={{
              editCellRenderer: EditCellRenderer,
              procLinkCellRenderer: ProcLinkCellRenderer,
              textEditor: TextEditor,
              selectEditor: SelectEditor,
              numberEditor: NumberEditor,
            }}
          >
            <AgGridColumn
              field='Actions'
              width={100}
              pinned
              lockPosition
              cellRenderer='editCellRenderer'
              cellRendererParams={{ 
                type: 'supplemental',
                doModalOpen: doModalOpen,
                setIsEditingRow: setIsEditingRow,
              }}
              editable={false}
            />
            <AgGridColumn field='sid' headerName='S ID' editable={false} sortable unSortIcon />
            <AgGridColumn field='fid' headerName='Fish ID' editable={false} sortable unSortIcon />
            <AgGridColumn field='complete' cellEditor='selectEditor' cellEditorParams={{ options: YNNumOptions, type: 'number' }} sortable unSortIcon />
            <AgGridColumn field='fFid' cellEditor='textEditor' resizable sortable unSortIcon />
            <AgGridColumn 
              field='proclink' 
              headerName='Proc Link' 
              width={130} 
              cellRenderer='procLinkCellRenderer' 
              cellRendererParams={{
                setIsAddRow: setIsAddRow,
                setRowId: setRowId,
              }}
              editable={false}
            />
            <AgGridColumn field='checkby' headerName='Checked' cellEditor='textEditor' sortable unSortIcon />
            <AgGridColumn field='approved' cellEditor='selectEditor' cellEditorParams={{ options: YNNumOptions, type: 'number' }} sortable unSortIcon />
            <AgGridColumn field='speciesId' headerName='Species' cellEditor='numberEditor' sortable unSortIcon />
            <AgGridColumn field='recorder' cellEditor='textEditor' sortable unSortIcon />
            <AgGridColumn field='tagnumber' cellEditor='textEditor' width={125} sortable unSortIcon />
            <AgGridColumn field='pitrn' headerName='PIT' cellEditor='selectEditor' cellEditorParams={{ options: visualAssessmentOptions }} sortable unSortIcon />
            <AgGridColumn field='cwtyn' headerName='CWT' cellEditor='selectEditor' cellEditorParams={{ options: YNTextOptions, isRequired: true }} unSortIcon />
            <AgGridColumn field='dangler' cellEditor='selectEditor' cellEditorParams={{ options: YNTextOptions, isRequired: true }} sortable unSortIcon />
            <AgGridColumn field='scuteloc' headerName='Scute' cellEditor='selectEditor' cellEditorParams={{ options: ScuteOptions }} sortable unSortIcon />
            <AgGridColumn field='scutenum' headerName='Scute #' cellEditor='numberEditor' sortable unSortIcon />
            <AgGridColumn field='scuteloc2' headerName='Scute 2' cellEditor='selectEditor' cellEditorParams={{ options: ScuteOptions }} sortable unSortIcon />
            <AgGridColumn field='scutenum2' headerName='Scute # 2' cellEditor='numberEditor' sortable unSortIcon />
            <AgGridColumn field='elhv' headerName='EL H/V/X' cellEditor='selectEditor' cellEditorParams={{ options: HVXOptions }} sortable unSortIcon />
            <AgGridColumn field='elcolor' headerName='EL Color' cellEditor='textEditor' cellEditorParams={{ isRequired: true }} sortable unSortIcon />
            <AgGridColumn field='erhv' headerName='ER H/V/X' cellEditor='selectEditor' cellEditorParams={{ options: HVXOptions }} sortable unSortIcon />
            <AgGridColumn field='ercolor' headerName='ER Color' cellEditor='textEditor' cellEditorParams={{ isRequired: true }} sortable unSortIcon />
            <AgGridColumn field='genetic' headerName='Genetic Y/N' cellEditor='selectEditor' cellEditorParams={{ options: YNTextOptions }} width={125} sortable unSortIcon />
            {/* @TODO: Do we need the following fields? */}
            <AgGridColumn field='geneticNeeds' cellEditor='textEditor' width={150} sortable unSortIcon />
            <AgGridColumn field='geneticsVialNumber' headerName='Genetics Vial #' cellEditor='textEditor' width={150} sortable unSortIcon />
            <AgGridColumn field='otherTagInfo' cellEditor='textEditor' width={200} sortable unSortIcon />
            <AgGridColumn field='anal' cellEditor='numberEditor' sortable unSortIcon />
            <AgGridColumn field='archive' cellEditor='numberEditor' sortable unSortIcon />
            <AgGridColumn field='broodstock' cellEditor='numberEditor' width={125} sortable unSortIcon />
            <AgGridColumn field='hatchWild' cellEditor='numberEditor' width={125} sortable unSortIcon />
            <AgGridColumn field='hatcheryOrigin' cellEditor='textEditor' width={150} sortable unSortIcon />
            <AgGridColumn field='head' cellEditor='numberEditor' sortable unSortIcon />
            <AgGridColumn field='inter' cellEditor='numberEditor' sortable unSortIcon />
            <AgGridColumn field='lIb' cellEditor='numberEditor' sortable unSortIcon />
            <AgGridColumn field='lOb' cellEditor='numberEditor' sortable unSortIcon />
            <AgGridColumn field='mIb' cellEditor='numberEditor' sortable unSortIcon />
            <AgGridColumn field='rIb' cellEditor='numberEditor' sortable unSortIcon />
            <AgGridColumn field='rOb' cellEditor='numberEditor' sortable unSortIcon />
            <AgGridColumn field='mouthwidth' cellEditor='numberEditor' width={125} sortable unSortIcon />
            <AgGridColumn field='recapture' cellEditor='textEditor' sortable unSortIcon />
            <AgGridColumn field='lastEditComment' cellEditor='textEditor' width={200} cellEditorParams={{ isRequired: true }} sortable unSortIcon />
            <AgGridColumn field='editInitials' cellEditor='textEditor' cellEditorParams={{ isRequired: true }} width={125} sortable unSortIcon />
            <AgGridColumn field='uploadedBy' width={150} sortable unSortIcon editable={false} />
          </AgGridReact>
        </div>
      </div>
    );
  });

export default SuppDsTable;
