import React, { useRef, useCallback } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

import EditCellRenderer from 'common/gridCellRenderers/editCellRenderer';
import SelectEditor from 'common/gridCellEditors/selectEditor';
import NumberEditor from 'common/gridCellEditors/numberEditor';
import TextEditor from 'common/gridCellEditors/textEditor';
import FloatEditor from 'common/gridCellEditors/floatEditor';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

// tableId = 4604 For testing

const TelemetryDsTable = connect(
  'doModalOpen',
  'doSaveTelemetryDataEntry',
  'doUpdateTelemetryDataEntry',
  'selectDataEntryTelemetryData',
  'selectDataEntryLastParams',
  ({
    doModalOpen,
    doSaveTelemetryDataEntry,
    doUpdateTelemetryDataEntry,
    dataEntryTelemetryData,
    dataEntryLastParams
  }) => {
    const { items } = dataEntryTelemetryData;
    const gridRef = useRef();

    const lastRow = dataEntryTelemetryData.items[dataEntryTelemetryData.totalCount - 1];
    const initialState = {
      seId: dataEntryLastParams.seId
    };

    const addRow = useCallback(() => {
      gridRef.current.api.applyTransaction({ add: [{}] });
    }, []);

    const copyLastRow = () => {
      const row = {...lastRow};
      if (row) {
        delete row['tId'];
        delete row['uploadedBy'];
        gridRef.current.api.applyTransaction({ add: [row] });
      }
    };
    
    return (
      <div className='container-fluid overflow-auto'>
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
        {/* <Button
          isOutline
          size='small'
          variant='info'
          text='Create Telemetry Datasheet'
          title='Create Telemetry Datasheet'
          className='ml-1'
          handleClick={() => doUpdateUrl('/sites-list/datasheet/telemetry-create')}
          isDisabled
        /> */}
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
            onRowValueChanged={({ data }) => !data.tId ? doSaveTelemetryDataEntry({...initialState ,...data}, { seId: dataEntryLastParams.seId }) : doUpdateTelemetryDataEntry(data, { seId: dataEntryLastParams.seId })}
            rowHeight={35}
            rowData={items}
            frameworkComponents={{
              editCellRenderer: EditCellRenderer,
              selectEditor: SelectEditor,
              numberEditor: NumberEditor,
              textEditor: TextEditor,
              floatEditor: FloatEditor,
            }}
          >
            <AgGridColumn
              field='Actions'
              width={100}
              pinned
              lockPosition
              cellRenderer='editCellRenderer'
              cellRendererParams={{ 
                type: 'telemetry',
                doModalOpen: doModalOpen,
              }}
              editable={false}
            />
            <AgGridColumn 
              field='tId' 
              headerName='Telemetry ID' 
              sortable 
              unSortIcon 
              editable={false}
            />
            <AgGridColumn field='tFid' sortable unSortIcon />
            <AgGridColumn field='bend' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='radioTagNum' cellEditor='numberEditor' cellEditorParams={{ isRequired: true }} sortable unSortIcon />
            <AgGridColumn field='frequencyIdCode' cellEditor='numberEditor' cellEditorParams={{ isRequired: true }} sortable unSortIcon />
            <AgGridColumn field='captureDate' headerName='Capture Time' sortable unSortIcon />
            <AgGridColumn field='captureLatitude' cellEditor='floatEditor' cellEditorParams={{ isRequired: true }} sortable unSortIcon />
            <AgGridColumn field='captureLongitude' cellEditor='floatEditor' cellEditorParams={{ isRequired: true }} sortable unSortIcon />
            <AgGridColumn field='positionConfidence' cellEditor='floatEditor' cellEditorParams={{ isRequired: true }} sortable unSortIcon />
            <AgGridColumn field='mesoId' sortable unSortIcon />
            <AgGridColumn field='depth' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='macroId' sortable unSortIcon />
            <AgGridColumn field='temp' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='conductivity' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='turbidity' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='silt' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='sand' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='gravel' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='comments' sortable unSortIcon />
            <AgGridColumn field='editInitials' sortable unSortIcon />
            <AgGridColumn field='lastEditComment' sortable unSortIcon />
            <AgGridColumn field='checkby' sortable unSortIcon />
            <AgGridColumn field='uploadedBy' sortable unSortIcon editable={false} />
          </AgGridReact>
        </div>
      </div>
    );
  }
);

export default TelemetryDsTable;
