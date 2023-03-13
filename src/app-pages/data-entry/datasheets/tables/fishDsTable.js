import React, { useCallback, useRef } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

import SelectEditor from 'common/gridCellEditors/selectEditor';
import EditCellRenderer from 'common/gridCellRenderers/editCellRenderer';
import NumberEditor from 'common/gridCellEditors/numberEditor';
import TextEditor from 'common/gridCellEditors/textEditor';

import { baitOptions, finCurlOptions, raySpineOptions, scaleOptions } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/selectHelper';
import { createDropdownOptions, createMesoOptions } from 'app-pages/data-entry/helpers';
import SuppLinkCellRenderer from 'common/gridCellRenderers/suppLinkCellRenderer';

const FishDsTable = connect(
  'doFetchAllDataEntry',
  'doUpdateFishDataEntry',
  'doSaveFishDataEntry',
  'doModalOpen',
  'selectDataEntryFishData',
  'selectDomainsSpecies',
  'selectDomainsFtPrefixes',
  'selectDomainsMr',
  'selectDomainsOtolith',
  'selectDataEntryLastParams',
  ({
    doFetchAllDataEntry,
    doUpdateFishDataEntry,
    doSaveFishDataEntry,
    doModalOpen,
    dataEntryFishData,
    domainsSpecies,
    domainsFtPrefixes,
    domainsMr,
    domainsOtolith,
    dataEntryLastParams,
    setIsAddRow,
    setRowId,
  }) => {
    const gridRef = useRef();
    const lastRow = dataEntryFishData.items[dataEntryFishData.totalCount - 1];
    const initialState = {
      mrId: dataEntryLastParams.mrId
    };

    const addRow = useCallback(() => {
      gridRef.current.api.applyTransaction({ add: [{}] });
    }, []);

    const copyLastRow = () => {
      const row = {...lastRow};
      if (row) {
        delete row['fid'];
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
        <Button
          isOutline
          size='small'
          variant='info'
          text='Export as CSV'
          className='float-right ml-1'
          icon={<Icon icon='download' />}
          //isDisabled
          //handleClick={() => doFetchAllDatasheet('fish-datasheet')}
          handleClick={() => doFetchAllDataEntry('fish-datasheet')}
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
            onRowValueChanged={({ data }) => !data.fid ? doSaveFishDataEntry({...initialState ,...data}, { mrId: dataEntryLastParams.mrId }) : doUpdateFishDataEntry(data, { mrId: dataEntryLastParams.mrId })}
            rowHeight={35}
            rowData={dataEntryFishData.items}
            frameworkComponents={{
              editCellRenderer: EditCellRenderer,
              selectEditor: SelectEditor,
              numberEditor: NumberEditor,
              textEditor: TextEditor,
              suppLinkCellRenderer: SuppLinkCellRenderer
            }}
          >
            <AgGridColumn
              field='Actions'
              width={100}
              pinned
              lockPosition
              cellRenderer='editCellRenderer'
              cellRendererParams={{ 
                type: 'fish',
                doModalOpen: doModalOpen,
              }}
              editable={false}
            />
            <AgGridColumn field='fid' headerName='Fish ID' editable={false} />
            <AgGridColumn field='ffid' headerName='Field ID' width={200} resizable sortable unSortIcon />
            <AgGridColumn
              field='supplink'
              headerName='Supp Link'
              width={130}
              cellRenderer='suppLinkCellRenderer'
              cellRendererParams={{
                setIsAddRow: setIsAddRow,
                setRowId: setRowId,
              }}
              editable={false}
            />
            <AgGridColumn field='panelHook' headerName='Panel Hook' />
            <AgGridColumn 
              field='species' 
              cellEditor='selectEditor' 
              cellEditorParams={{ 
                options: createMesoOptions(domainsSpecies), 
                isRequired: true 
              }} 
            />
            <AgGridColumn field='length' cellEditor='numberEditor' />
            <AgGridColumn field='weight' cellEditor='numberEditor' />
            <AgGridColumn field='countF' headerName='Count' cellEditor='numberEditor' />
            <AgGridColumn 
              field='ftPrefix' 
              headerName='FT Prefix' 
              cellEditor='selectEditor' 
              cellEditorParams={{ 
                options: createMesoOptions(domainsFtPrefixes), 
                isRequired: false 
              }} 
            />
            <AgGridColumn field='mR' headerName='M/R' cellEditor='selectEditor' cellEditorParams={{ options: createMesoOptions(domainsMr), isRequired: false }} />
            <AgGridColumn field='ftnum' headerName='Floy Tag' />
            <AgGridColumn field='geneticsVialNumber' width={125} headerName='Genetics Vial #' />
            <AgGridColumn field='condition' cellEditor='numberEditor' editable={false} />
            <AgGridColumn field='finCurl' cellEditor='selectEditor' cellEditorParams={{ options: finCurlOptions, isRequired: false }} />
            <AgGridColumn field='otolith' cellEditor='selectEditor' cellEditorParams={{ options: createDropdownOptions(domainsOtolith), isRequired: false }} />
            <AgGridColumn field='raySpine' headerName='Ray Spine' cellEditor='selectEditor' cellEditorParams={{ options: raySpineOptions, isRequired: false }} />
            <AgGridColumn headerName='KN' cellEditor='numberEditor' editable={false} />
            <AgGridColumn field='scale' cellEditor='selectEditor' cellEditorParams={{ options: scaleOptions, isRequired: false }} />
            <AgGridColumn headerName='RSD' cellEditor='numberEditor' editable={false} />
            <AgGridColumn field='bait' cellEditor='selectEditor' cellEditorParams={{ options: baitOptions, isRequired: false }} />
            <AgGridColumn field='editInitials' cellEditor='textEditor' cellEditorParams={{ isRequired: true }} />
            <AgGridColumn field='lastEditComment' cellEditor='textEditor' cellEditorParams={{ isRequired: true }} width={200} resizable />
            <AgGridColumn field='uploadedBy' width={150} resizable editable={false} />
          </AgGridReact>
        </div>
      </div>
    );
  }
);

export default FishDsTable;
