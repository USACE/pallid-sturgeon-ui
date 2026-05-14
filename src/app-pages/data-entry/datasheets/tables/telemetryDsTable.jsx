import React, { useRef, useCallback } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { mdiContentCopy, mdiDownload, mdiPlus } from '@mdi/js';

import Button from '@components/button';
import Icon from '@components/icon/icon';

import EditCellRenderer from '@common/gridCellRenderers/editCellRenderer';
import SelectEditor from '@common/gridCellEditors/selectEditor';
import NumberEditor from '@common/gridCellEditors/numberEditor';
import TextEditor from '@common/gridCellEditors/textEditor';
import FloatEditor from '@common/gridCellEditors/floatEditor';

import { Row } from '@pages/data-entry/edit-data-sheet/forms/_shared/helper';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import '@pages/data-summaries/data-summary.scss';
import '@pages/data-entry/dataentry.scss';
import { tabToNextCell } from './helpers';
import { createDropdownOptions } from '../../helpers';

// tableId = 4604 For testing

const TelemetryDsTable = connect(
  'doModalOpen',
  'doSaveTelemetryDataEntry',
  'doUpdateTelemetryDataEntry',
  'selectDataEntryTelemetryData',
  'selectDataEntryLastParams',
  'selectUserRole',
  'selectBaseData',
  'selectLookupData',
  ({
    doModalOpen,
    doSaveTelemetryDataEntry,
    doUpdateTelemetryDataEntry,
    dataEntryTelemetryData,
    dataEntryLastParams,
    userRole,
    baseData,
    lookupData,
  }) => {
    const { items } = dataEntryTelemetryData;
    const { frequencyIds } = lookupData;

    const gridRef = useRef();

    const getFrequencyIdString = (id) => frequencyIds?.filter((item) => item.code === id)?.[0]?.description;

    const rowData = items?.map((item) => ({
      ...item,
      bendRiverMile: baseData?.bendRiverMile,
    }));

    const lastRow = dataEntryTelemetryData.items[dataEntryTelemetryData.totalCount - 1];
    const initialState = {
      seId: dataEntryLastParams?.seId ?? null,
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
            defaultColDef={{
              width: 100,
              editable: true,
              lockPinned: true,
            }}
            editType='fullRow'
            onRowValueChanged={({ data }) =>
              !data.tId
                ? doSaveTelemetryDataEntry(
                    { ...initialState, ...data },
                    { seId: dataEntryLastParams?.seId, id: userRole.id }
                  )
                : doUpdateTelemetryDataEntry(data, {
                    seId: dataEntryLastParams?.seId,
                    id: userRole.id,
                  })
            }
            rowHeight={35}
            rowData={rowData}
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
            <AgGridColumn field='tId' headerName='T ID' sortable unSortIcon editable={false} />
            <AgGridColumn field='tFid' sortable unSortIcon />
            <AgGridColumn field='bend' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='bendRiverMile' sortable unSortIcon editable={false} />
            <AgGridColumn
              field='radioTagNum'
              headerName='Radio Tag #'
              cellEditor='numberEditor'
              cellEditorParams={{ isRequired: true }}
              width={125}
              sortable
              unSortIcon
            />
            <AgGridColumn
              field='frequencyIdCode'
              headerName='Frequency Id'
              cellEditor='selectEditor'
              cellEditorParams={{
                options: createDropdownOptions(frequencyIds),
                type: 'number',
                isRequired: true,
              }}
              valueFormatter={(params) => getFrequencyIdString(params.data.frequencyIdCode)}
              width={125}
              sortable
              unSortIcon
            />
            <AgGridColumn field='captureDate' headerName='Capture Time' width={125} sortable unSortIcon />
            <AgGridColumn
              field='captureLatitude'
              cellEditor='floatEditor'
              cellEditorParams={{ isRequired: true }}
              width={150}
              sortable
              unSortIcon
            />
            <AgGridColumn
              field='captureLongitude'
              cellEditor='floatEditor'
              cellEditorParams={{ isRequired: true }}
              width={150}
              sortable
              unSortIcon
            />
            <AgGridColumn
              field='positionConfidence'
              cellEditor='floatEditor'
              cellEditorParams={{ isRequired: true }}
              width={175}
              sortable
              unSortIcon
            />
            <AgGridColumn field='mesoId' sortable unSortIcon />
            <AgGridColumn field='depth' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='macroId' sortable unSortIcon />
            <AgGridColumn field='temp' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='conductivity' cellEditor='floatEditor' width={125} sortable unSortIcon />
            <AgGridColumn field='turbidity' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='silt' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='sand' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='gravel' cellEditor='floatEditor' sortable unSortIcon />
            <AgGridColumn field='suspectedSpawningActivity' cellEditor='numberEditor' width={150} sortable unSortIcon />
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
