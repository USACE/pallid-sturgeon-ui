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
import { dateFormatter } from 'common/gridHelpers/ag-grid-helper';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const ProcedureDsTable = connect(
  'doModalOpen',
  'doSaveProcedureDataEntry',
  'doUpdateProcedureDataEntry',
  'selectDataEntryProcedure',
  'selectDataEntryLastParams',
  'selectUserRole',
  ({
    doModalOpen,
    doSaveProcedureDataEntry,
    doUpdateProcedureDataEntry,
    dataEntryProcedure,
    dataEntryLastParams,
    userRole,
    isAddRow,
    rowId
  }) => {
    const gridRef = useRef();
    const { items } = dataEntryProcedure;

    const addRow = useCallback((id) => {
      gridRef.current.api.applyTransaction({ add: [{ fid: id.fid, sid: id.sid }] });
    }, []);

    const onRowValueChanged = (data) => {
      if (!data.id) {
        doSaveProcedureDataEntry(data, { mrId: dataEntryLastParams.mrId, id: userRole.id });
      } else {
        // Format date fields before submitting data
        setDates(data.sid);
        doUpdateProcedureDataEntry(data, { mrId: dataEntryLastParams.mrId, id: userRole.id });
      }
    };

    const setDates = useCallback((id) => {
      const rowNode = gridRef.current.api.getRowNode(String(id));
      if (rowNode.data.procedureDate) {
        rowNode.setDataValue('procedureDate', rowNode.data.procedureDate.split('T')[0]);
      }
      if (rowNode.data.dstStartDate) {
        rowNode.setDataValue('dstStartDate', rowNode.data.dstStartDate.split('T')[0]);
      }
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
          variant='info'
          text='Export as CSV'
          icon={<Icon icon='download' />}
          isDisabled
        // handleClick={() => doFetchAllDatasheet('search-datasheet')}
        />
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact
            getRowNodeId={params => String(params.sid)}
            ref={gridRef}
            suppressRowClickSelection={true}
            rowHeight={35}
            rowData={items}
            defaultColDef={{
              width: 100,
              editable: true,
            }}
            editType='fullRow'
            onRowValueChanged={({ data }) => onRowValueChanged(data)}
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
              cellRenderer='editCellRenderer'
              cellRendererParams={{
                type: 'procedure',
                doModalOpen: doModalOpen,
              }}
              editable={false}
            />
            <AgGridColumn
              field='id'
              headerName='P ID'
              sortable
              unSortIcon
              editable={false}
            />
            <AgGridColumn field='sid' headerName='S ID' sortable unSortIcon editable={false} />
            <AgGridColumn field='fid' headerName='F ID' sortable unSortIcon editable={false} />
            <AgGridColumn field='fFid' resizable sortable unSortIcon />
            <AgGridColumn field='mrFid' resizable sortable unSortIcon />
            <AgGridColumn field='purpose' cellEditor='selectEditor' cellEditorParams={{ options: purposeOptions, isRequired: true }} sortable unSortIcon />
            <AgGridColumn field='procedureDate'
              cellEditor='dateEditor'
              cellEditorParams={{ isRequired: true }}
              valueGetter={params => dateFormatter(params.data.procedureDate)}
              width={150}
              sortable
              unSortIcon
            />
            <AgGridColumn field='procedureStartTime' cellEditor='textEditor' cellEditorParams={{ isRequired: true }} width={175} sortable unSortIcon />
            <AgGridColumn field='procedureEndTime' cellEditor='textEditor' cellEditorParams={{ isRequired: true }} width={175} sortable unSortIcon />
            <AgGridColumn field='procedureBy' cellEditor='textEditor' cellEditorParams={{ isRequired: true }} width={150} sortable unSortIcon />
            {/* @TODO: Change Y/N cell editor to checkbox */}
            <AgGridColumn field='antibioticInjection' cellEditor='selectEditor' cellEditorParams={{ options: YNNumOptions, type: 'number' }} width={150} sortable unSortIcon />
            <AgGridColumn field='pDorsal' cellEditor='selectEditor' cellEditorParams={{ options: YNNumOptions, type: 'number' }} sortable unSortIcon />
            <AgGridColumn field='pVentral' cellEditor='selectEditor' cellEditorParams={{ options: YNNumOptions, type: 'number' }} sortable unSortIcon />
            <AgGridColumn field='pLeft' cellEditor='selectEditor' cellEditorParams={{ options: YNNumOptions, type: 'number' }} sortable unSortIcon />
            <AgGridColumn field='oldRadioTagNum' headerName='Old Radio Tag #' cellEditor='numberEditor' width={150} sortable unSortIcon />
            <AgGridColumn field='oldFrequencyId' cellEditor='selectEditor' cellEditorParams={{ options: frequencyIdOptions, type: 'number' }} width={150} sortable unSortIcon />
            <AgGridColumn field='dstSerialNum' headerName='DST Serial #' cellEditor='numberEditor' width={125} sortable unSortIcon />
            <AgGridColumn
              field='dstStartDate'
              cellEditor='dateEditor'
              cellEditorParams={{ isRequired: true }}
              valueGetter={params => dateFormatter(params.data.dstStartDate)}
              width={125}
              sortable
              unSortIcon
            />
            <AgGridColumn field='dstStartTime' headerName='DST Start Time' cellEditor='textEditor' width={150} sortable unSortIcon />
            <AgGridColumn field='dstReimplant' headerName='DST Reimplant' cellEditor='selectEditor' cellEditorParams={{ options: YNNumOptions, type: 'number' }} width={125} sortable unSortIcon />
            <AgGridColumn field='newRadioTagNum' headerName='New Radio Tag #' cellEditor='numberEditor' width={150} sortable unSortIcon />
            <AgGridColumn field='newFreqId' headerName='New Frequency Id' cellEditor='selectEditor' cellEditorParams={{ options: frequencyIdOptions, type: 'number' }} width={150} sortable unSortIcon />
            <AgGridColumn field='sexCode' cellEditor='selectEditor' cellEditorParams={{ options: sexOptions }} sortable unSortIcon />
            {/* Blood sample not on the original form? */}
            <AgGridColumn field='bloodSample' cellEditor='selectEditor' cellEditorParams={{ options: YNNumOptions, type: 'number' }} width={125} sortable unSortIcon />
            {/* @TODO: Change egg sample Y/N cell editor to checkbox */}
            <AgGridColumn field='eggSample' cellEditor='selectEditor' cellEditorParams={{ options: YNNumOptions, type: 'number' }} width={125} sortable unSortIcon />
            <AgGridColumn field='comments' cellEditor='textEditor' width={200} resizable sortable unSortIcon />
            <AgGridColumn field='fishHealthComment' cellEditor='textEditor' width={200} resizable sortable unSortIcon />
            <AgGridColumn field='evalLocation' cellEditor='selectEditor' cellEditorParams={{ options: evalLocationsOptions }} width={125} sortable unSortIcon />
            <AgGridColumn field='spawnStatus' cellEditor='selectEditor' cellEditorParams={{ options: spawnEvaluationOptions }} width={125} sortable unSortIcon />
            <AgGridColumn field='visualReproStatus' cellEditor='selectEditor' cellEditorParams={{ options: visualAssessmentOptions }} width={150} sortable unSortIcon />
            <AgGridColumn field='ultrasoundReproStatus' cellEditor='selectEditor' cellEditorParams={{ options: visualAssessmentOptions }} width={200} sortable unSortIcon />
            <AgGridColumn field='expectedSpawnYear' cellEditor='numberEditor' width={175} sortable unSortIcon />
            <AgGridColumn field='ultrasoundGonadLength' cellEditor='numberEditor' width={175} sortable unSortIcon />
            <AgGridColumn field='gonadCondition' cellEditor='textEditor' width={150} sortable unSortIcon />
            <AgGridColumn field='lastEditComment' cellEditor='textEditor' cellEditorParams={{ isRequired: true }} width={200} resizable sortable unSortIcon />
            <AgGridColumn field='editInitials' cellEditor='textEditor' cellEditorParams={{ isRequired: true }} width={125} sortable unSortIcon />
            <AgGridColumn field='uploadedBy' width={200} sortable unSortIcon editable={false} />
          </AgGridReact>
        </div>
      </div>
    );
  });

export default ProcedureDsTable;
