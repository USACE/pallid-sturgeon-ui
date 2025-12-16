import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';
import { mdiDownload } from '@mdi/js';

import Button from '@components/button';
import Icon from '@components/icon/icon';

import { dateFormatter } from '@src/common/gridHelpers/ag-grid-helper';
import { defaultColDef } from '@src/utils/helpers';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const columnDefs = [
  { field: 'year' },
  { field: 'fieldOffice' },
  { field: 'project' },
  { field: 'segment' },
  { field: 'season' },
  { field: 'bend' },
  { field: 'tId', headerName: 'Telemetry ID' },
  { field: 'seId', headerName: 'Search Effort ID' },
  { field: 'siteId', headerName: 'Site ID' },
  { field: 'searchDate', valueGetter: (params) => dateFormatter(params.data.searchDate) },
  { field: 'searchDay' },
  { field: 'radioTagNum', headerName: 'Radio Tag Number' },
  { field: 'frequencyIdCode', headerName: 'Frequency' },
  { field: 'captureTime' },
  { field: 'captureLatitude' },
  { field: 'captureLongitude' },
  { field: 'positionConfidence' },
  { field: 'macroId', headerName: 'Macro' },
  { field: 'mesoId', headerName: 'Meso' },
  { field: 'depth' },
  { field: 'temp' },
  { field: 'conductivity' },
  { field: 'turbidity' },
  { field: 'silt' },
  { field: 'sand' },
  { field: 'gravel' },
  { field: 'comments' },
];

const TelemetryTable = connect(
  'doFetchAllDatasheet',
  'selectTelemetryDataSummary',
  ({ doFetchAllDatasheet, telemetryDataSummary }) => {
    const { data } = telemetryDataSummary;

    return (
      <>
        <Button
          isOutline
          size='small'
          variant='info'
          text='Export as CSV'
          icon={<Icon path={mdiDownload} />}
          handleClick={() => doFetchAllDatasheet('telemetry-datasheet')}
        />
        <div className='ag-theme-balham mt-2' style={{ width: '100%', height: '600px' }}>
          <AgGridReact rowData={data} defaultColDef={defaultColDef} columnDefs={columnDefs} />
        </div>
      </>
    );
  }
);

export default TelemetryTable;
