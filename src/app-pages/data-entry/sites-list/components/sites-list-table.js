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
import SiteIdCellRenderer from 'common/gridCellRenderers/siteIdCellRenderer';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const SitesListTable = connect(
  'doUpdateSite',
  'selectSitesData',
  ({
    doUpdateSite,
    sitesData,
    domains,
  }) => {
    const { projects, seasons, bends, segments, fieldOffices, sampleUnitTypes } = domains;

    const cellStyle = (params) => ({
      backgroundColor: params.data.bkgColor,
    });

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
              width: 150
            }}
            rowData={sitesData}
            editType='fullRow'
            onRowValueChanged={({ data }) => doUpdateSite(data)}
            frameworkComponents={{
              editCellRenderer: EditCellRenderer,
              fieldOfficeEditor: FieldOfficeEditor,
              projectEditor: ProjectEditor,
              sampleUnitTypeEditor: SampleUnitTypeEditor,
              seasonEditor: SeasonEditor,
              segmentEditor: SegmentEditor,
              siteIdCellRenderer: SiteIdCellRenderer
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
            <AgGridColumn field='year' />
            <AgGridColumn field='siteId' />
            <AgGridColumn field='fieldoffice' cellEditor='fieldOfficeEditor' cellEditorParams={{ fieldOffices }} />
            <AgGridColumn field='projectId' cellEditor='projectEditor' cellEditorParams={{ projects }} />
            <AgGridColumn field='segmentId' cellEditor='segmentEditor' cellEditorParams={{ segments }} />
            <AgGridColumn field='season' cellEditor='seasonEditor' cellEditorParams={{ seasons }} />
            <AgGridColumn field='bend' headerName='Sample Unit' cellStyle={cellStyle} cellRenderer='siteIdCellRenderer' />
            <AgGridColumn field='sampleUnitType' headerName='Sample Unit Type' cellEditor='sampleUnitTypeEditor' cellEditorParams={{ sampleUnitTypes }} />
            <AgGridColumn field='bendrn' headerName='Bend R/N' />
            <AgGridColumn field='bendRiverMile' />
          </AgGridReact>
        </div>
      </div>
    );
  }
);

export default SitesListTable;
