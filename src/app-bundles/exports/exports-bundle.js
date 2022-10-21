import { toast } from 'react-toastify';
import { tSuccess, tError } from 'common/toast/toastHelper';
import { ExportToCsv } from 'export-to-csv';
import { sitesExportHeaders } from './helper';
import { queryFromObject } from 'utils';

const exportsBundle = {
  name: 'exports',

  doFetchExportsSites: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'EXPORTS_SITES_FETCH_START'});
    const toastId = toast.loading('Generating .xlsx file. One moment...');

    const uri = `/psapi/export/sites${queryFromObject(params)}`;

    const options = { 
      filename: `sites-list-${new Date().toISOString()}`,
      showLabels: true, 
      useBom: true,
      headers: sitesExportHeaders,
    };
    const csvExporter = new ExportToCsv(options);

    apiGet(uri, (err, body) => {
      if (err) {
        dispatch({ type: 'EXPORTS_SITES_FETCH_ERROR', payload: err});
        tError(toastId, 'Failed to generated file. Please try again later.');
      } else {
        csvExporter.generateCsv(body);
        tSuccess(toastId, 'File Generated!');
      }
    });

    dispatch({ type: 'EXPORTS_SITES_FETCH_FINISHED'});
  },
};

export default exportsBundle;