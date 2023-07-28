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

import { Row } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import '../../../data-summaries/data-summary.scss';
import '../../dataentry.scss';

// tableId = 4604 For testing

const TelemetryDsTable = connect(
  'doModalOpen',
  'doSaveTelemetryDataEntry',
  'doUpdateTelemetryDataEntry',
  'selectDataEntryTelemetryData',
  'selectDataEntryLastParams',
  'selectUserRole',
  ({
    doModalOpen,
    doSaveTelemetryDataEntry,
    doUpdateTelemetryDataEntry,
    dataEntryTelemetryData,
    dataEntryLastParams,
    userRole
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
            suppressClickEdit
            defaultColDef={{
              width: 100,
              editable: true,
              lockPinned: true,
            }}
            editType='fullRow'
            onRowValueChanged={({ data }) => !data.tId ? doSaveTelemetryDataEntry({...initialState ,...data}, { seId: dataEntryLastParams.seId, id: userRole.id }) : doUpdateTelemetryDataEntry(data, { seId: dataEntryLastParams.seId, id: userRole.id })}
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
              headerName='T ID' 
              sortable 
              unSortIcon 
              editable={false}
            />
            <AgGridColumn field='tFid' sortable unSortIcon />
            <AgGridColumn field='bend' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='radioTagNum' headerName='Radio Tag #' cellEditor='numberEditor' cellEditorParams={{ isRequired: true }} width={125} sortable unSortIcon />
            <AgGridColumn field='frequencyIdCode' headerName='Frequency Id' cellEditor='numberEditor' cellEditorParams={{ isRequired: true }} width={125} sortable unSortIcon />
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
