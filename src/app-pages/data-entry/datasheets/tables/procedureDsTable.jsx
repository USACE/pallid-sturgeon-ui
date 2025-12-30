import { useCallback, useEffect, useRef } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';
import { mdiDownload } from '@mdi/js';

import Button from '@components/button';
import Icon from '@components/icon/icon';

import EditCellRenderer from '@common/gridCellRenderers/editCellRenderer';
import TextEditor from '@common/gridCellEditors/textEditor';
import SelectEditor from '@common/gridCellEditors/selectEditor';
import NumberEditor from '@common/gridCellEditors/numberEditor';
import FloatEditor from '@common/gridCellEditors/floatEditor';
import DateEditor from '@common/gridCellEditors/dateEditor';

import {
  evalLocationsOptions,
  frequencyIdOptions,
  purposeOptions,
  sexOptions,
  spawnEvaluationOptions,
  visualAssessmentOptions,
  YNNumOptions,
} from '@pages/data-entry/edit-data-sheet/forms/_shared/selectHelper';
import { dateFormatter } from '@common/gridHelpers/ag-grid-helper';
import { tabToNextCell } from './helpers';
import { defaultColDef } from '@src/utils/helpers';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

const defaultColDefObj = { ...defaultColDef, width: 100, editable: true };
const components = {
  editCellRenderer: EditCellRenderer,
  numberEditor: NumberEditor,
  textEditor: TextEditor,
  selectEditor: SelectEditor,
  floatEditor: FloatEditor,
  dateEditor: DateEditor,
};

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
    rowId,
  }) => {
    const gridRef = useRef();
    const { items } = dataEntryProcedure;

    const columnDefs = [
      {
        field: 'Actions',
        pinned: true,
        lockPosition: true,
        cellRenderer: 'editCellRenderer',
        cellRendererParams: {
          doModalOpen: doModalOpen,
          type: 'procedure',
        },
        editable: false,
      },
      { field: 'id', headerName: 'P ID', editable: false },
      { field: 'sid', headerName: 'S ID', editable: false },
      { field: 'fid', headerName: 'Fish ID', editable: false },
      { field: 'fFid', resizable: true },
      { field: 'mrFid', resizable: true },
      {
        field: 'purpose',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: purposeOptions, isRequired: true },
      },
      {
        field: 'procedureDate',
        cellEditor: 'dateEditor',
        cellEditorParams: { isRequired: true },
        valueGetter: (params) => dateFormatter(params.data.procedureDate),
        width: 150,
      },
      {
        field: 'procedureStartTime',
        cellEditor: 'textEditor',
        cellEditorParams: { isRequired: true },
        width: 175,
      },
      {
        field: 'procedureEndTime',
        cellEditor: 'textEditor',
        cellEditorParams: { isRequired: true },
        width: 175,
      },
      {
        field: 'procedureBy',
        cellEditor: 'textEditor',
        cellEditorParams: { isRequired: true },
        width: 150,
      },
      {
        field: 'antibioticInjection',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: YNNumOptions, type: 'number' },
        width: 150,
      },
      {
        field: 'pDorsal',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: YNNumOptions, type: 'number' },
      },
      {
        field: 'pVentral',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: YNNumOptions, type: 'number' },
      },
      {
        field: 'pLeft',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: YNNumOptions, type: 'number' },
      },
      { field: 'oldRadioTagNum', headerName: 'Old Radio Tag #', cellEditor: 'numberEditor', width: 150 },
      {
        field: 'oldFrequencyId',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: frequencyIdOptions, type: 'number' },
        width: 150,
      },
      {
        field: 'dstSerialNum',
        headerName: 'DST Serial #',
        cellEditor: 'numberEditor',
        width: 125,
      },
      {
        field: 'dstStartDate',
        cellEditor: 'dateEditor',
        cellEditorParams: { isRequired: true },
        valueGetter: (params) => dateFormatter(params.data.dstStartDate),
        width: 125,
      },
      {
        field: 'dstStartTime',
        cellEditor: 'textEditor',
        width: 150,
      },
      {
        field: 'dstReimplant',
        headerName: 'DST Reimplant',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: YNNumOptions, type: 'number' },
        width: 125,
      },
      {
        field: 'newRadioTagNum',
        headerName: 'New Radio Tag #',
        cellEditor: 'numberEditor',
        width: 150,
      },
      {
        field: 'newFreqId',
        headerName: 'New Frequency Id',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: frequencyIdOptions, type: 'number' },
        width: 150,
      },
      {
        field: 'sex',
        headerName: 'Sex Code',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: sexOptions },
      },
      {
        field: 'bloodSample',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: YNNumOptions, type: 'number' },
        width: 125,
      },
      {
        field: 'eggSample',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: YNNumOptions, type: 'number' },
        width: 125,
      },
      {
        field: 'comments',
        cellEditor: 'textEditor',
        width: 200,
      },
      {
        field: 'fishHealthComment',
        cellEditor: 'textEditor',
        resizable: true,
        width: 200,
      },
      {
        field: 'evalLocation',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: evalLocationsOptions },
        width: 125,
      },
      {
        field: 'spawnStatus',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: spawnEvaluationOptions },
        width: 125,
      },
      {
        field: 'visualReproStatus',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: visualAssessmentOptions },
        width: 125,
      },
      {
        field: 'ultrasoundReproStatus',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: visualAssessmentOptions },
        width: 200,
      },
      {
        field: 'expectedSpawnYear',
        cellEditor: 'numberEditor',
        width: 175,
      },
      {
        field: 'ultrasoundGonadLength',
        cellEditor: 'numberEditor',
        width: 175,
      },
      {
        field: 'gonadCondition',
        cellEditor: 'textEditor',
        width: 150,
      },
      {
        field: 'lastEditComment',
        cellEditor: 'textEditor',
        cellEditorParams: { isRequired: true },
        width: 200,
        resizable: true,
      },
      {
        field: 'editInitials',
        cellEditor: 'textEditor',
        cellEditorParams: { isRequired: true },
        width: 125,
      },
      { field: 'uploadedBy', width: 200, editable: false },
    ];

    const setDates = useCallback((id) => {
      const rowNode = gridRef.current.api.getRowNode(String(id));
      if (rowNode.data.procedureDate) {
        rowNode.setDataValue('procedureDate', rowNode.data.procedureDate.split('T')[0]);
      }
      if (rowNode.data.dstStartDate) {
        rowNode.setDataValue('dstStartDate', rowNode.data.dstStartDate.split('T')[0]);
      }
    }, []);

    const addRow = useCallback((id) => {
      gridRef.current.api.applyTransaction({
        add: [{ fid: id.fid, sid: id.sid }],
      });
    }, []);

    const onRowValueChanged = ({ data }) => {
      if (!data.id) {
        doSaveProcedureDataEntry(data, {
          mrId: dataEntryLastParams.mrId,
          id: userRole.id,
        });
      } else {
        // Format date fields before submitting data
        setDates(data.sid);
        doUpdateProcedureDataEntry(data, {
          mrId: dataEntryLastParams.mrId,
          id: userRole.id,
        });
      }
    };

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
          icon={<Icon path={mdiDownload} />}
          isDisabled
          // handleClick={() => doFetchAllDatasheet('search-datasheet')}
        />
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact
            getRowNodeId={(params) => String(params.sid)}
            ref={gridRef}
            tabToNextCell={tabToNextCell}
            tabToPreviousCell={tabToNextCell}
            suppressClickEdit
            rowHeight={35}
            rowData={items}
            defaultColDef={defaultColDefObj}
            editType='fullRow'
            onRowValueChanged={onRowValueChanged}
            components={components}
            columnDefs={columnDefs}
          />
        </div>
      </div>
    );
  }
);

export default ProcedureDsTable;
