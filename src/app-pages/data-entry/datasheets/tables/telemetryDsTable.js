import React, { useRef, useCallback, useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';
import ConfirmDelete from 'common/modals/confirmDelete';

import EditCellRenderer from 'common/gridCellRenderers/editCellRenderer';
import SelectEditor from 'common/gridCellEditors/selectEditor';
import NumberEditor from 'common/gridCellEditors/numberEditor';
import TextEditor from 'common/gridCellEditors/textEditor';
import FloatEditor from 'common/gridCellEditors/floatEditor';

import { Row } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';
import { frequencyIdOptions } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/selectHelper';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import '../../../data-summaries/data-summary.scss';
import '../../dataentry.scss';

// tableId = 4604 For testing

const TelemetryDsTable = connect(
  'doModalOpen',
  'doSaveTelemetryDataEntry',
  'doSubmitTelemetryDataEntries',
  'doResetStagedData',
  'doUpdateStagedData',
  'doUpdateTelemetryDataEntry',
  'selectDataEntryTelemetryData',
  'selectDataEntryLastParams',
  'selectUserRole',
  'selectCombinedTelemetryData',
  'selectStagedData',
  ({
    doModalOpen,
    doSaveTelemetryDataEntry,
    doSubmitTelemetryDataEntries,
    doResetStagedData,
    doUpdateStagedData,
    doUpdateTelemetryDataEntry,
    dataEntryTelemetryData,
    dataEntryLastParams,
    userRole,
    combinedTelemetryData,
    stagedData
  }) => {
    const gridRef = useRef();
    const [selectedRows, setSelectedRows] = useState([]);
    const lastRow = combinedTelemetryData[combinedTelemetryData.length - 1];
    const initialState = {
      seId: dataEntryLastParams.seId
    };

    const addRow = useCallback(() => {
      gridRef.current.api.applyTransaction({ add: [{}] });
    }, []);

    const copyLastRow = () => {
      const row = { ...lastRow };
      if (row) {
        delete row['tId'];
        delete row['uploadedBy'];
        row['id'] = combinedTelemetryData.length + 1;
        gridRef.current.api.applyTransaction({ add: [row] });
        doUpdateStagedData({ ...initialState, ...row }, 'telemetry');
      }
    };

    const getSelectedRows = () => {
      setSelectedRows(gridRef.current.api.getSelectedNodes());
    };

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
                selectedRows.length > 0 ? doModalOpen(ConfirmDelete, { type: 'telemetry', selectedData: selectedRows, setSelectedRows: setSelectedRows }) : doSubmitTelemetryDataEntries(stagedData);
              }}
              isDisabled={selectedRows.length === 0 && stagedData.length === 0}
            />
          </div>
          <div className='col-md-3 col-xs-12'>
            <Button
              isOutline
              size='small'
              variant='info'
              text='Export as CSV'
              className='float-right ml-1 mt-1 btn-width'
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
            rowHeight={35}
            rowData={combinedTelemetryData}
            frameworkComponents={{
              editCellRenderer: EditCellRenderer,
              selectEditor: SelectEditor,
              numberEditor: NumberEditor,
              textEditor: TextEditor,
              floatEditor: FloatEditor,
            }}
            // onRowValueChanged={({ data }) => !data.tId ? doSaveTelemetryDataEntry({ ...initialState, ...data }, { seId: dataEntryLastParams.seId, id: userRole.id }) : doUpdateTelemetryDataEntry(data, { seId: dataEntryLastParams.seId, id: userRole.id })}
            onRowValueChanged={({ data }) => {
              if (data.fid) {
                doUpdateStagedData({ ...initialState, ...data }, 'telemetry');
              } else if (data.id) {
                doUpdateStagedData({ ...{ ...initialState, id: data.id }, ...data }, 'telemetry');
              } else {
                doUpdateStagedData({ ...{ ...initialState, id: Number(combinedTelemetryData.length + 1) }, ...data }, 'telemetry');
              }
            }}
          >
            <AgGridColumn field='' headerName='' width={50} editable={false} headerCheckboxSelection={true} checkboxSelection={true} />
            <AgGridColumn
              field='Actions'
              width={100}
              cellRenderer='editCellRenderer'
              cellRendererParams={{
                type: 'telemetry',
                doModalOpen: doModalOpen,
              }}
              editable={false}
            />
            <AgGridColumn
              field='tId'
              headerName='T ID'
              sortable
              unSortIcon
              editable={false}
            />
            <AgGridColumn field='tFid' sortable unSortIcon />
            <AgGridColumn field='bend' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='radioTagNum' headerName='Radio Tag #' cellEditor='numberEditor' cellEditorParams={{ isRequired: true }} width={125} sortable unSortIcon />
            <AgGridColumn field='frequencyIdCode' headerName='Frequency Id' cellEditor='selectEditor' cellEditorParams={{ options: frequencyIdOptions, type: 'number', isRequired: true }} width={125} sortable unSortIcon />
            <AgGridColumn field='captureDate' headerName='Capture Time' width={125} sortable unSortIcon />
            <AgGridColumn field='captureLatitude' cellEditor='floatEditor' cellEditorParams={{ isRequired: true }} width={150} sortable unSortIcon />
            <AgGridColumn field='captureLongitude' cellEditor='floatEditor' cellEditorParams={{ isRequired: true }} width={150} sortable unSortIcon />
            <AgGridColumn field='positionConfidence' cellEditor='floatEditor' cellEditorParams={{ isRequired: true }} width={175} sortable unSortIcon />
            <AgGridColumn field='mesoId' sortable unSortIcon />
            <AgGridColumn field='depth' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='macroId' sortable unSortIcon />
            <AgGridColumn field='temp' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='conductivity' cellEditor='floatEditor' width={125} sortable unSortIcon />
            <AgGridColumn field='turbidity' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='silt' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='sand' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='gravel' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='comments' width={200} sortable unSortIcon />
            <AgGridColumn field='editInitials' width={125} sortable unSortIcon />
            <AgGridColumn field='lastEditComment' width={200} sortable unSortIcon />
            <AgGridColumn field='checkby' sortable unSortIcon />
            <AgGridColumn field='uploadedBy' width={200} sortable unSortIcon editable={false} />
          </AgGridReact>
        </div>
      </div>
    );
  }
);

export default TelemetryDsTable;
