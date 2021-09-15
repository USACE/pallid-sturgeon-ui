import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

import DownloadAsCSV from 'app-components/downloadAsCSV';
import EditCellRenderer from 'common/gridCellRenderers/editCellRenderer';
import FieldOfficeEditor from 'common/gridCellEditors/fieldOfficeEditor';
import ProjectEditor from 'common/gridCellEditors/projectEditor';
import SampleUnitTypeEditor from 'common/gridCellEditors/sampleUnitTypeEditor';
import SeasonEditor from 'common/gridCellEditors/seasonEditor';
import SegmentEditor from 'common/gridCellEditors/segmentEditor';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const SitesListTable = connect(
  'selectSitesData',
  ({
    sitesData,
    domains,
  }) => {
    const { projects, seasons, bends, segments, fieldOffices, sampleUnitTypes } = domains;

    return (
      <div className='pt-3'>
        <DownloadAsCSV filePrefix='site-table' content={sitesData} />
        <div className='ag-theme-balham' style={{ height: '600px', width: '100%' }}>
          <AgGridReact
            suppressClickEdit
            rowHeight={35}
            defaultColDef={{
              editable: true,
              lockPinned: true,
            }}
            rowData={sitesData}
            editType='fullRow'
            frameworkComponents={{
              editCellRenderer: EditCellRenderer,
              fieldOfficeEditor: FieldOfficeEditor,
              projectEditor: ProjectEditor,
              sampleUnitTypeEditor: SampleUnitTypeEditor,
              seasonEditor: SeasonEditor,
              segmentEditor: SegmentEditor,
            }}
          >
            <AgGridColumn
              field='edit'
              width={90}
              pinned
              lockPosition
              cellRenderer='editCellRenderer'
              editable={false}
            />
            <AgGridColumn field='fieldOffice' cellEditor='fieldOfficeEditor' cellEditorParams={{ fieldOffices }} />
            <AgGridColumn field='project' cellEditor='projectEditor' cellEditorParams={{ projects }} />
            <AgGridColumn field='segment' cellEditor='segmentEditor' cellEditorParams={{ segments }} />
            <AgGridColumn field='season' cellEditor='seasonEditor' cellEditorParams={{ seasons }} />
            <AgGridColumn field='sampleUnitTypeCode' headerName='Sample Unit Type' cellEditor='sampleUnitTypeEditor' cellEditorParams={{ sampleUnitTypes }} />
            <AgGridColumn field='bendrn' headerName='Bend R/N' />
            <AgGridColumn field='bendRiverMile' />
            <AgGridColumn field='comments' />
          </AgGridReact>
        </div>
      </div>
    );
  }
);

export default SitesListTable;
