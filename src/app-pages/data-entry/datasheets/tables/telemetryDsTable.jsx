import React, { useRef, useCallback } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';
import { mdiContentCopy, mdiDownload, mdiPlus } from '@mdi/js';

import Button from '@components/button';
import Icon from '@components/icon/icon';

import EditCellRenderer from '@common/gridCellRenderers/editCellRenderer';
import SelectEditor from '@common/gridCellEditors/selectEditor';
import NumberEditor from '@common/gridCellEditors/numberEditor';
import TextEditor from '@common/gridCellEditors/textEditor';
import FloatEditor from '@common/gridCellEditors/floatEditor';

import { Row } from '@pages/data-entry/edit-data-sheet/forms/_shared/helper';
import { frequencyIdOptions } from '@pages/data-entry/edit-data-sheet/forms/_shared/selectHelper';
import { tabToNextCell } from './helpers';
import { commonColDef } from '@src/utils/helpers';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import '@pages/data-summaries/data-summary.scss';
import '@pages/data-entry/dataentry.scss';

const defaultColDef = { ...commonColDef, width: 100, editable: true };
const components = {
  editCellRenderer: EditCellRenderer,
  selectEditor: SelectEditor,
  numberEditor: NumberEditor,
  textEditor: TextEditor,
  floatEditor: FloatEditor,
};

const TelemetryDsTable = connect(
  'doModalOpen',
  'doSaveTelemetryDataEntry',
  'doUpdateTelemetryDataEntry',
  'selectDataEntryTelemetryData',
  'selectDataEntryLastParams',
  'selectUserRole',
  'selectBaseData',
  ({
    doModalOpen,
    doSaveTelemetryDataEntry,
    doUpdateTelemetryDataEntry,
    dataEntryTelemetryData,
    dataEntryLastParams,
    userRole,
    baseData,
  }) => {
    const { items } = dataEntryTelemetryData;
    const gridRef = useRef();

    const columnDefs = [
      {
        field: 'Actions',
        pinned: true,
        lockPosition: true,
        cellRenderer: 'editCellRenderer',
        cellRendererParams: {
          doModalOpen: doModalOpen,
          type: 'telemetry',
        },
        editable: false,
      },
      { field: 'tId', headerName: 'T ID', editable: false },
      { field: 'tFid' },
      { field: 'bend', cellEditor: 'floatEditor' },
      { field: 'bendRiverMile', editable: false },
      {
        field: 'radioTagNum',
        headerName: 'Radio Tag #',
        cellEditor: 'numberEditor',
        cellEditorParams: { isRequired: true },
        width: 125,
      },
      {
        field: 'frequencyIdCode',
        headerName: 'Frequency Id',
        cellEditor: 'selectEditor',
        cellEditorParams: {
          options: frequencyIdOptions,
          type: 'number',
          isRequired: true,
        },
        width: 125,
      },
      { field: 'captureDate', headerName: 'Capture Time', width: 125 },
      { field: 'captureLatitude', cellEditor: 'floatEditor', cellEditorParams: { isRequired: true }, width: 150 },
      { field: 'captureLongitude', cellEditor: 'floatEditor', cellEditorParams: { isRequired: true }, width: 150 },
      { field: 'positionConfidence', cellEditor: 'floatEditor', cellEditorParams: { isRequired: true }, width: 175 },
      { field: 'mesoId' },
      { field: 'depth', cellEditor: 'floatEditor' },
      { field: 'macroId' },
      { field: 'conductivity', cellEditor: 'floatEditor', width: 125 },
      { field: 'turbidity', cellEditor: 'floatEditor' },
      { field: 'silt', cellEditor: 'floatEditor' },
      { field: 'sand', cellEditor: 'floatEditor' },
      { field: 'gravel', cellEditor: 'floatEditor' },
      { field: 'comments', width: 200 },
      { field: 'editInitials', width: 125 },
      { field: 'lastEditComment', width: 200, resizable: true },
      { field: 'checkby' },
      { field: 'uploadedBy', width: 200, editable: false },
    ];

    const rowData = items?.map((item) => ({
      ...item,
      bendRiverMile: baseData?.bendRiverMile,
    }));

    const lastRow = dataEntryTelemetryData.items[dataEntryTelemetryData.totalCount - 1];
    const initialState = {
      seId: dataEntryLastParams.seId,
    };

    const addRow = useCallback(() => {
      gridRef.current.api.applyTransaction({
        add: [{ bendRiverMile: baseData?.bendRiverMile }],
      });
    }, []);

    const copyLastRow = () => {
      const row = { ...lastRow };
      if (row) {
        delete row['tId'];
        delete row['uploadedBy'];
        gridRef.current.api.applyTransaction({ add: [row] });
      }
    };

    const onRowValueChanged = ({ data }) => {
      !data.tId
        ? doSaveTelemetryDataEntry({ ...initialState, ...data }, { seId: dataEntryLastParams.seId, id: userRole.id })
        : doUpdateTelemetryDataEntry(data, {
            seId: dataEntryLastParams.seId,
            id: userRole.id,
          });
    };

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
              icon={<Icon path={mdiPlus} />}
              handleClick={addRow}
            />
            <Button
              isOutline
              size='small'
              variant='secondary'
              text='Copy Last Row'
              title='Copy Last Row'
              className='ml-1 mt-1 btn-width'
              icon={<Icon path={mdiContentCopy} />}
              handleClick={copyLastRow}
            />
          </div>
          <div className='col-md-3 col-xs-12'>
            <Button
              isOutline
              size='small'
              variant='info'
              text='Export as CSV'
              className='float-right ml-1 mt-1 btn-width'
              icon={<Icon path={mdiDownload} />}
              isDisabled
              handleClick={() => doFetchAllDatasheet('fish-datasheet')}
            />
          </div>
        </Row>
        <div className='ag-theme-balham mt-2' style={{ height: '600px', width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            tabToNextCell={tabToNextCell}
            tabToPreviousCell={tabToNextCell}
            suppressClickEdit
            defaultColDef={defaultColDef}
            editType='fullRow'
            onRowValueChanged={onRowValueChanged}
            rowHeight={35}
            rowData={rowData}
            components={components}
            columnDefs={columnDefs}
          />
        </div>
      </div>
    );
  }
);

export default TelemetryDsTable;
