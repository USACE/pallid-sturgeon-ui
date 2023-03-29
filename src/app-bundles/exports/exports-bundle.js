import { toast } from 'react-toastify';
import { tSuccess, tError } from 'common/toast/toastHelper';
import { ExportToCsv } from 'export-to-csv';
import { sitesExportHeaders, MissouriDataEntryExportHeaders, FishDataEntryExportHeaders, SuppDataEntryExportHeaders } from './helper';
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

  // Data Entries

  doFetchExportMoriverDataEntries: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'EXPORTS_MISSOURI_DATA_ENTRY_FETCH_START'});
    const toastId = toast.loading('Generating .xlsx file. One moment...');

    const uri = `/psapi/export/missouriDataEntries${queryFromObject(params)}`;

    const options = { 
      filename: `missouri-data-entries-${new Date().toISOString()}`,
      showLabels: true, 
      useBom: true,
      headers: MissouriDataEntryExportHeaders,
    };
    const csvExporter = new ExportToCsv(options);

    apiGet(uri, (err, body) => {
      if (err) {
        dispatch({ type: 'EXPORTS_MISSOURI_DATA_ENTRY_FETCH_ERROR', payload: err});
        tError(toastId, 'Failed to generated file. Please try again later.');
      } else {
        csvExporter.generateCsv(body);
        tSuccess(toastId, 'File Generated!');
      }
    });

    dispatch({ type: 'EXPORTS_MISSOURI_DATA_ENTRY_FETCH_FINISHED'});
  },

  doFetchExportFishDataEntries: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'EXPORTS_FISH_DATA_ENTRY_FETCH_START'});
    const toastId = toast.loading('Generating .xlsx file. One moment...');

    const uri = `/psapi/export/fishDataEntries${queryFromObject(params)}`;

    const options = { 
      filename: `fish-data-entries-${new Date().toISOString()}`,
      showLabels: true, 
      useBom: true,
      headers: FishDataEntryExportHeaders,
    };
    const csvExporter = new ExportToCsv(options);

    apiGet(uri, (err, body) => {
      if (err) {
        dispatch({ type: 'EXPORTS_FISH_DATA_ENTRY_FETCH_ERROR', payload: err});
        tError(toastId, 'Failed to generated file. Please try again later.');
      } else {
        csvExporter.generateCsv(body);
        tSuccess(toastId, 'File Generated!');
      }
    });

    dispatch({ type: 'EXPORTS_FISH_DATA_ENTRY_FETCH_FINISHED'});
  },

  doFetchExportSuppDataEntries: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'EXPORTS_SUPPLEMENTAL_DATA_ENTRY_FETCH_START'});
    const toastId = toast.loading('Generating .xlsx file. One moment...');

    const uri = `/psapi/export/suppDataEntries${queryFromObject(params)}`;

    const options = { 
      filename: `supplemental-data-entries-${new Date().toISOString()}`,
      showLabels: true, 
      useBom: true,
      headers: SuppDataEntryExportHeaders,
    };
    const csvExporter = new ExportToCsv(options);

    apiGet(uri, (err, body) => {
      if (err) {
        dispatch({ type: 'EXPORTS_SUPPLEMENTAL_DATA_ENTRY_FETCH_ERROR', payload: err});
        tError(toastId, 'Failed to generated file. Please try again later.');
      } else {
        csvExporter.generateCsv(body);
        tSuccess(toastId, 'File Generated!');
      }
    });

    dispatch({ type: 'EXPORTS_SUPPLEMENTAL_DATA_ENTRY_FETCH_FINISHED'});
  },

  doFetchExportProcDataEntries: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'EXPORTS_PROC_DATA_ENTRY_FETCH_START'});
    const toastId = toast.loading('Generating .xlsx file. One moment...');

    const uri = `/psapi/export/procDataEntries${queryFromObject(params)}`;

    const options = { 
      filename: `procedure-data-entries-${new Date().toISOString()}`,
      showLabels: true, 
      useBom: true,
      headers: sitesExportHeaders,
    };
    const csvExporter = new ExportToCsv(options);

    apiGet(uri, (err, body) => {
      if (err) {
        dispatch({ type: 'EXPORTS_PROC_DATA_ENTRY_FETCH_ERROR', payload: err});
        tError(toastId, 'Failed to generated file. Please try again later.');
      } else {
        csvExporter.generateCsv(body);
        tSuccess(toastId, 'File Generated!');
      }
    });

    dispatch({ type: 'EXPORTS_PROC_DATA_ENTRY_FETCH_FINISHED'});
  },

  doFetchExportSearchDataEntries: (params) => ({ dispatch, apiGet }) => {
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

  doFetchExportTelemetryDataEntries: (params) => ({ dispatch, apiGet }) => {
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