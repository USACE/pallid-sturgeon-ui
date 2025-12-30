import { useCallback, useRef, useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';
import { mdiContentCopy, mdiDownload, mdiPlus } from '@mdi/js';

import Button from '@components/button';
import Icon from '@components/icon/icon';

import SelectEditor from '@common/gridCellEditors/selectEditor';
import EditCellRenderer from '@common/gridCellRenderers/editCellRenderer';
import NumberEditor from '@common/gridCellEditors/numberEditor';
import FloatEditor from '@common/gridCellEditors/floatEditor';
import TextEditor from '@common/gridCellEditors/textEditor';

import {
  baitOptions,
  finCurlOptions,
  raySpineOptions,
  scaleOptions,
} from '@pages/data-entry/edit-data-sheet/forms/_shared/selectHelper';
import { createDropdownOptions, createMesoOptions } from '@pages/data-entry/helpers';
import SuppLinkCellRenderer from '@common/gridCellRenderers/suppLinkCellRenderer';
import { Row } from '@pages/data-entry/edit-data-sheet/forms/_shared/helper';
import { tabToNextCell } from './helpers';
import { defaultColDef } from '@src/utils/helpers';

import '@pages/data-summaries/data-summary.scss';
import '@pages/data-entry/dataentry.scss';

const defaultColDefObj = { ...defaultColDef, width: 100, editable: true };
const components = {
  editCellRenderer: EditCellRenderer,
  selectEditor: SelectEditor,
  numberEditor: NumberEditor,
  floatEditor: FloatEditor,
  textEditor: TextEditor,
  suppLinkCellRenderer: SuppLinkCellRenderer,
};

const FishDsTable = connect(
  'doUpdateFishDataEntry',
  'doSaveFishDataEntry',
  'doModalOpen',
  'selectDataEntryFishData',
  'selectDomainsSpecies',
  'selectDomainsFtPrefixes',
  'selectDomainsMr',
  'selectDomainsOtolith',
  'selectDataEntryLastParams',
  'selectUserRole',
  ({
    doUpdateFishDataEntry,
    doSaveFishDataEntry,
    doModalOpen,
    dataEntryFishData,
    domainsSpecies,
    domainsFtPrefixes,
    domainsMr,
    domainsOtolith,
    dataEntryLastParams,
    userRole,
    setIsAddRow,
    setRowId,
  }) => {
    const gridRef = useRef();
    const [isEditingRow, setIsEditingRow] = useState(false);
    const lastRow = dataEntryFishData?.items?.[dataEntryFishData?.totalCount - 1];
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
          type: 'fish',
        },
        editable: false,
      },
      { field: 'fid', headerName: 'Fish ID', editable: false },
      { field: 'ffid', headerName: 'Field ID', width: 200, resizable: true },
      {
        field: 'supplink',
        headerName: 'Supp Link',
        width: 130,
        cellRenderer: 'suppLinkCellRenderer',
        cellRendererParams: {
          setIsAddRow: setIsAddRow,
          setRowId: setRowId,
        },
        editable: false,
      },
      {
        field: 'species',
        cellEditor: 'selectEditor',
        cellEditorParams: {
          options: createMesoOptions(domainsSpecies),
          isRequired: true,
        },
      },
      { field: 'length', cellEditor: 'floatEditor' },
      { field: 'weight', cellEditor: 'floatEditor' },
      { field: 'countF', headerName: 'count', cellEditor: 'numberEditor' },
      {
        field: 'ftPrefix',
        headerName: 'FT Prefix',
        cellEditor: 'selectEditor',
        cellEditorParams: {
          options: createMesoOptions(domainsFtPrefixes),
          isRequired: false,
        },
      },
      {
        field: 'mR',
        headerName: 'M/R',
        cellEditor: 'selectEditor',
        cellEditorParams: {
          options: createMesoOptions(domainsMr),
          isRequired: false,
        },
      },
      { field: 'floyTag', headerName: 'Floy Tag' },
      { field: 'geneticsVialNumber', headerName: 'Genetics Vial #', width: 125 },
      { field: 'condition', cellEditor: 'numberEditor', editable: false },
      {
        field: 'finCurl',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: finCurlOptions, isRequired: false },
      },
      {
        field: 'otolith',
        cellEditor: 'selectEditor',
        cellEditorParams: {
          options: createDropdownOptions(domainsOtolith),
          isRequired: false,
        },
      },
      {
        field: 'raySpine',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: raySpineOptions, isRequired: false },
      },
      { field: 'KN', cellEditor: 'numberEditor', editable: false },
      {
        field: 'scale',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: scaleOptions, isRequired: false },
      },
      { field: 'RSD', cellEditor: 'numberEditor', editable: false },
      {
        field: 'bait',
        cellEditor: 'selectEditor',
        cellEditorParams: { options: baitOptions, isRequired: false },
      },
      {
        field: 'editInitials',
        cellEditor: 'textEditor',
        cellEditorParams: { isRequired: true },
      },
      {
        field: 'lastEditComment',
        cellEditor: 'textEditor',
        cellEditorParams: { isRequired: true },
        width: 200,
        resizable: true,
      },
      { field: 'uploadedBy', width: 150, resizable: true, editable: false },
    ];

    const addRow = useCallback(() => {
      gridRef.current.api.applyTransaction({ add: [{}] });
    }, []);

    const copyLastRow = () => {
      const row = { ...lastRow };
      if (row) {
        delete row['fid'];
        delete row['uploadedBy'];
        gridRef.current.api.applyTransaction({ add: [row] });
      }
    };

    const refreshSuppLinkButtons = () => {
      gridRef.current.api.forEachNode((rowNode) => {
        if (gridRef.current.api.getEditingCells().length > 0) {
          if (rowNode.rowIndex === gridRef.current.api.getEditingCells()[0].rowIndex) {
            rowNode.setDataValue('supplink', true);
          } else {
            rowNode.setDataValue('supplink', false);
          }
        }
      });
      gridRef.current.api.refreshCells({ columns: ['supplink'] });
    };

    const onRowValueChanged = ({ data }) => {
      !data.fid
        ? doSaveFishDataEntry({ ...initialState, ...data }, { mrId: dataEntryLastParams.mrId, id: userRole.id })
        : doUpdateFishDataEntry(data, {
            mrId: dataEntryLastParams.mrId,
            id: userRole.id,
          });
    };

    useEffect(() => {
      // Reset supplink column values
      gridRef.current.api.forEachNode((rowNode) => {
        rowNode.setDataValue('supplink', false);
      });
      gridRef.current.api.refreshCells({ columns: ['supplink'] });
      // Find row(s) user is editing and update supplink value
      refreshSuppLinkButtons();
    }, [isEditingRow]);

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
              className='float-right btn-width mt-1'
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
            defaultColDef={defaultColDefObj}
            editType='fullRow'
            onRowValueChanged={onRowValueChanged}
            rowHeight={35}
            rowData={dataEntryFishData.items}
            components={components}
            columnDefs={columnDefs}
          />
        </div>
      </div>
    );
  }
);

export default FishDsTable;
