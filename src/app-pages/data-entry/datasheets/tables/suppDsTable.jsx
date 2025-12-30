import { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';
import { mdiDownload } from '@mdi/js';

import Button from '@components/button';
import Icon from '@components/icon/icon';

import EditCellRenderer from '@common/gridCellRenderers/editCellRenderer';
import ProcLinkCellRenderer from '@common/gridCellRenderers/procLinkCellRenderer';
import TextEditor from '@common/gridCellEditors/textEditor';
import SelectEditor from '@common/gridCellEditors/selectEditor';
import NumberEditor from '@common/gridCellEditors/numberEditor';

import {
  ERELOptions,
  HVXOptions,
  ScuteOptions,
  visualAssessmentOptions,
  YNNumOptions,
  YNTextOptions,
} from '@pages/data-entry/edit-data-sheet/forms/_shared/selectHelper';
import { tabToNextCell } from './helpers';
import { defaultColDef } from '@src/utils/helpers';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

const defaultColDefObj = { ...defaultColDef, width: 100, editable: true };
const components = {
  editCellRenderer: EditCellRenderer,
  procLinkCellRenderer: ProcLinkCellRenderer,
  textEditor: TextEditor,
  selectEditor: SelectEditor,
  numberEditor: NumberEditor,
};

const SuppDsTable = connect(
  'doModalOpen',
  'doSaveSupplementalDataEntry',
  'doUpdateSupplementalDataEntry',
  'selectDataEntrySupplemental',
  'selectDataEntryLastParams',
  'selectUserRole',
  'selectBaseData',
  ({
    doModalOpen,
    doSaveSupplementalDataEntry,
    doUpdateSupplementalDataEntry,
    dataEntrySupplemental,
    dataEntryLastParams,
    userRole,
    baseData,
    isAddRow,
    setIsAddRow,
    setRowId,
  }) => {
    const gridRef = useRef();
    const [isEditingRow, setIsEditingRow] = useState(false);
    const { items } = dataEntrySupplemental;

    const defaultValues = {
      fid: baseData?.fid,
      ffid: baseData?.ffid,
      condition: baseData?.condition,
      netrivermile: baseData?.netrivermile,
      length: baseData?.length,
      weight: baseData?.weight,
      species: baseData?.species,
    };

    const initialState = {
      mrId: dataEntryLastParams.mrId,
    };

    const columnDefs = [
      {
        field: 'Actions',
        pinned: true,
        lockPosition: true,
        cellRenderer: 'editCellRenderer',
        cellRendererParams: {
          doModalOpen: doModalOpen,
          setIsEditingRow: setIsEditingRow,
          type: 'supplemental',
        },
        editable: false,
      },
      { field: 'sid', headerName: 'S ID', editable: false },
      { field: 'fid', headerName: 'Fish ID', editable: false },
      {
        field: 'complete',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: YNNumOptions, type: 'number' },
      },
      {
        field: 'fFid',
        cellEditor: 'textEditor',
        resizable: true,
      },
      {
        field: 'proclink',
        headerName: 'Proc Link',
        width: 130,
        cellRenderer: 'procLinkCellRenderer',
        cellRendererParams: {
          setIsAddRow: setIsAddRow,
          setRowId: setRowId,
        },
        editable: false,
      },
      {
        field: 'checkby',
        headerName: 'Checked',
        cellEditor: 'textEditor',
      },
      {
        field: 'approved',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: YNNumOptions, type: 'number' },
      },
      {
        field: 'species',
        headerName: 'Checked',
        cellEditor: 'textEditor',
        editable: false,
      },
      { field: 'netrivermile', headerName: 'Net River Mile', cellEditor: 'numberEditor', editable: false },
      { field: 'length', cellEditor: 'textEditor', editable: false },
      { field: 'weight', cellEditor: 'textEditor', editable: false },
      { field: 'condition', cellEditor: 'numberEditor', editable: false },
      { field: 'recorder', cellEditor: 'textEditor' },
      { field: 'tagnumber', headerName: 'Tag #', cellEditor: 'textEditor', width: 125 },
      {
        field: 'pitrn',
        headerName: 'PIT R/N/Z',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: visualAssessmentOptions },
      },
      {
        field: 'cwtyn',
        headerName: 'CWT',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: YNTextOptions, isRequired: true },
      },
      {
        field: 'dangler',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: YNTextOptions, isRequired: true },
      },
      {
        field: 'scuteloc',
        headerName: 'Scute',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: ScuteOptions },
      },
      { field: 'scutenum', headerName: 'Scute #', cellEditor: 'numberEditor' },
      {
        field: 'scuteloc2',
        headerName: 'Scute 2',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: ScuteOptions },
      },
      { field: 'scutenum2', headerName: 'Scute # 2', cellEditor: 'numberEditor' },
      {
        field: 'elhv',
        headerName: 'EL H/V/X',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: HVXOptions },
      },
      {
        field: 'elcolor',
        headerName: 'EL Color',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: ERELOptions },
      },
      {
        field: 'erhv',
        headerName: 'ER H/V/X',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: HVXOptions },
      },
      {
        field: 'ercolor',
        headerName: 'ER Color',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: ERELOptions },
      },
      {
        field: 'genetic',
        headerName: 'Genetic Y/N',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: YNTextOptions },
        width: 125,
      },
      { field: 'geneticNeeds', cellEditor: 'textEditor', width: 150 },
      {
        field: 'geneticsVialNumber',
        headerName: 'Genetics Vial #',
        cellEditor: 'textEditor',
        width: 150,
      },
      { field: 'otherTagInfo', cellEditor: 'textEditor', width: 200 },
      { field: 'anal', cellEditor: 'numberEditor' },
      { field: 'archive', cellEditor: 'numberEditor' },
      { field: 'broodstock', cellEditor: 'numberEditor', width: 125 },
      { field: 'hatchWild', cellEditor: 'numberEditor', width: 125 },
      { field: 'hatcheryOrigin', cellEditor: 'textEditor', width: 150 },
      { field: 'head', cellEditor: 'numberEditor' },
      { field: 'inter', cellEditor: 'numberEditor' },
      { field: 'lIb', cellEditor: 'numberEditor' },
      { field: 'lOb', cellEditor: 'numberEditor' },
      { field: 'mIb', cellEditor: 'numberEditor' },
      { field: 'rIb', cellEditor: 'numberEditor' },
      { field: 'rOb', cellEditor: 'numberEditor' },
      { field: 'mouthwidth', cellEditor: 'numberEditor', width: 125 },
      { field: 'recapture', cellEditor: 'textEditor' },
      {
        field: 'lastEditComment',
        cellEditor: 'textEditor',
        cellEditorParams: { isRequired: true },
        width: 200,
      },
      {
        field: 'editInitials',
        cellEditor: 'textEditor',
        cellEditorParams: { isRequired: true },
        width: 125,
      },
      { field: 'uploadedBy', width: 150, editable: false },
    ];

    const addRow = useCallback(() => {
      gridRef.current.api.applyTransaction({ add: [defaultValues] });
    }, []);

    const refreshSuppLinkButtons = () => {
      gridRef.current.api.forEachNode((rowNode) => {
        if (gridRef.current.api.getEditingCells().length > 0) {
          if (rowNode.rowIndex === gridRef.current.api.getEditingCells()[0].rowIndex) {
            rowNode.setDataValue('proclink', true);
          } else {
            rowNode.setDataValue('proclink', false);
          }
        }
      });
      gridRef.current.api.refreshCells({ columns: ['proclink'] });
    };

    useEffect(() => {
      if (isAddRow) {
        addRow();
      }
    }, [isAddRow]);

    const onRowValueChanged = ({ data }) => {
      !data.sid
        ? doSaveSupplementalDataEntry({ ...initialState, ...data }, { mrId: dataEntryLastParams.mrId, id: userRole.id })
        : doUpdateSupplementalDataEntry(data, {
            mrId: dataEntryLastParams.mrId,
            id: userRole.id,
          });
    };

    useEffect(() => {
      // Reset proclink column values
      gridRef.current.api.forEachNode((rowNode) => {
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
          icon={<Icon path={mdiDownload} />}
          isDisabled
          // handleClick={() => doFetchAllDatasheet('search-datasheet')}
        />
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact
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

export default SuppDsTable;
