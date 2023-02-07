import React, { useCallback, useEffect, useRef } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';
import EditCellRenderer from 'common/gridCellRenderers/editCellRenderer';
import TextEditor from 'common/gridCellEditors/textEditor';
import SelectEditor from 'common/gridCellEditors/selectEditor';
import NumberEditor from 'common/gridCellEditors/numberEditor';
import FloatEditor from 'common/gridCellEditors/floatEditor';
import DateEditor from 'common/gridCellEditors/dateEditor';

import { evalLocationsOptions, frequencyIdOptions, purposeOptions, sexOptions, spawnEvaluationOptions, visualAssessmentOptions, YNNumOptions } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/selectHelper';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const ProcedureDsTable = connect(
  'doModalOpen',
  'doSaveProcedureDataEntry',
  'doUpdateProcedureDataEntry',
  'doUpdateUrl',
  'selectDataEntryProcedure',
  'selectDataEntryLastParams',
  ({
    doModalOpen,
    doSaveProcedureDataEntry,
    doUpdateProcedureDataEntry,
    doUpdateUrl,
    dataEntryProcedure,
    dataEntryLastParams,
    isAddRow,
    rowId
  }) => {
    const gridRef = useRef();
    const { items } = dataEntryProcedure;

    const addRow = useCallback((id) => {
      gridRef.current.api.applyTransaction({ add: [{ fid: id.fid, sid: id.sid }] });
    }, []);

    useEffect(() => {
      if (isAddRow) {
        addRow(rowId);
      }
    }, [isAddRow]);

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
            ref={gridRef}
            suppressClickEdit
            rowHeight={35}
            rowData={items}
            defaultColDef={{
              width: 150,
              editable: true,
              lockPinned: true,
            }}
            editType='fullRow'
            onRowValueChanged={({ data }) => !data.id ? doSaveProcedureDataEntry(data, { mrId: dataEntryLastParams.mrId }) : doUpdateProcedureDataEntry(data, { mrId: dataEntryLastParams.mrId })}
            frameworkComponents={{
              editCellRenderer: EditCellRenderer,
              numberEditor: NumberEditor,
              textEditor: TextEditor,
              selectEditor: SelectEditor,
              floatEditor: FloatEditor,
              dateEditor: DateEditor,
            }}
          >
            <AgGridColumn
              field='Actions'
              width={100}
              pinned
              lockPosition
              cellRenderer='editCellRenderer'
              cellRendererParams={{ 
                type: 'procedure',
                doModalOpen: doModalOpen,
              }}
              editable={false}
            />
            <AgGridColumn 
              field='id' 
              headerName='Procedure ID' 
              sortable 
              unSortIcon 
              editable={false}
            />
            <AgGridColumn field='sid' headerName='Supp ID' sortable unSortIcon editable={false} />
            <AgGridColumn field='fid' headerName='Fish ID' sortable unSortIcon editable={false} />
            <AgGridColumn field='fFid' resizable sortable unSortIcon />
            <AgGridColumn field='mrFid' resizable sortable unSortIcon  />
            <AgGridColumn field='purpose' cellEditor='selectEditor' cellEditorParams={{ options: purposeOptions, isRequired: true }} sortable unSortIcon />
            <AgGridColumn field='procedureDate' 
              cellEditor='dateEditor' 
              cellEditorParams={{ isRequired: true }} 
              sortable 
              unSortIcon 
            />
            <AgGridColumn field='procedureStartTime' cellEditor='textEditor' cellEditorParams={{ isRequired: true }} sortable unSortIcon />
            <AgGridColumn field='procedureEndTime' cellEditor='textEditor' cellEditorParams={{ isRequired: true }} sortable unSortIcon />
            <AgGridColumn field='procedureBy' cellEditor='textEditor' cellEditorParams={{ isRequired: true }} sortable unSortIcon />
            {/* @TODO: Change Y/N cell editor to checkbox */}
            <AgGridColumn field='antibioticInjection' cellEditor='selectEditor' cellEditorParams={{ options: YNNumOptions, type: 'number' }} sortable unSortIcon />
            <AgGridColumn field='pDorsal' cellEditor='selectEditor' cellEditorParams={{ options: YNNumOptions, type: 'number' }} sortable unSortIcon />
            <AgGridColumn field='pVentral' cellEditor='selectEditor' cellEditorParams={{ options: YNNumOptions, type: 'number' }} sortable unSortIcon />
            <AgGridColumn field='pLeft'cellEditor='selectEditor' cellEditorParams={{ options: YNNumOptions, type: 'number' }}  sortable unSortIcon />
            <AgGridColumn field='oldRadioTagNum' cellEditor='numberEditor' sortable unSortIcon />
            <AgGridColumn field='oldFrequencyId' cellEditor='selectEditor' cellEditorParams={{ options: frequencyIdOptions, type: 'number' }} sortable unSortIcon />
            <AgGridColumn field='dstSerialNum' cellEditor='numberEditor' sortable unSortIcon />
            <AgGridColumn field='dstStartDate' cellEditor='dateEditor' cellEditorParams={{ isRequired: true }} sortable unSortIcon />
            <AgGridColumn field='dstStartTime' cellEditor='textEditor' sortable unSortIcon />
            <AgGridColumn field='dstReimplant' cellEditor='selectEditor' cellEditorParams={{ options: YNNumOptions, type: 'number' }} sortable unSortIcon />
            <AgGridColumn field='newRadioTagNum' cellEditor='numberEditor' sortable unSortIcon />
            <AgGridColumn field='newFreqId' cellEditor='selectEditor' cellEditorParams={{ options: frequencyIdOptions, type: 'number' }} sortable unSortIcon />
            <AgGridColumn field='sexCode' cellEditor='selectEditor' cellEditorParams={{ options: sexOptions }} sortable unSortIcon />
            {/* Blood sample not on the original form? */}
            <AgGridColumn field='bloodSample' cellEditor='selectEditor' cellEditorParams={{ options: YNNumOptions, type: 'number' }} sortable unSortIcon /> 
            {/* @TODO: Change egg sample Y/N cell editor to checkbox */}
            <AgGridColumn field='eggSample' cellEditor='selectEditor' cellEditorParams={{ options: YNNumOptions, type: 'number' }} sortable unSortIcon />
            <AgGridColumn field='comments' cellEditor='textEditor' resizable sortable unSortIcon />
            <AgGridColumn field='fishHealthComment' cellEditor='textEditor' resizable sortable unSortIcon />
            <AgGridColumn field='evalLocation' cellEditor='selectEditor' cellEditorParams={{ options: evalLocationsOptions }} sortable unSortIcon />
            <AgGridColumn field='spawnStatus' cellEditor='selectEditor' cellEditorParams={{ options: spawnEvaluationOptions }} sortable unSortIcon />
            <AgGridColumn field='visualReproStatus' cellEditor='selectEditor' cellEditorParams={{ options: visualAssessmentOptions }} sortable unSortIcon />
            <AgGridColumn field='ultrasoundReproStatus' cellEditor='selectEditor' cellEditorParams={{ options: visualAssessmentOptions }}sortable unSortIcon />
            <AgGridColumn field='expectedSpawnYear' cellEditor='numberEditor' sortable unSortIcon />
            <AgGridColumn field='ultrasoundGonadLength' cellEditor='numberEditor' sortable unSortIcon />
            <AgGridColumn field='gonadCondition' cellEditor='textEditor' sortable unSortIcon />
            <AgGridColumn field='editInitials' cellEditor='textEditor' cellEditorParams={{ isRequired: true}} sortable unSortIcon />
            <AgGridColumn field='lastEditComment' cellEditor='textEditor' cellEditorParams={{ isRequired: true}} resizable sortable unSortIcon />
            <AgGridColumn field='lastUpdated' sortable unSortIcon editable={false} />
            <AgGridColumn field='uploadedBy' sortable unSortIcon editable={false} />
          </AgGridReact>
        </div>
      </div>
    );
  });

export default ProcedureDsTable;
