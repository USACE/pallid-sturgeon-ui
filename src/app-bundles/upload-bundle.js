import { toast } from 'react-toastify';
import { tSuccess, tError } from 'common/toast/toastHelper';
import { queryFromObject } from 'utils';

export default {
  name: 'upload',
  getReducer: () => {
    const initialData = {
      logs: [],
      data: [],
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'UPDATE_UPLOAD_SESSION_LOGS':
          return {
            ...state,
            logs: payload,
          };
        case 'UPDATE_UPLOAD':
          return {
            ...state,
            data: payload,
          };
        default:
          return state;
      }
    };
  },

  selectUploadLogs: state => state.upload.logs,
  selectUploadData: state => state.upload.data,

  doUploadAllFiles: (params) => ({ dispatch, apiPost, store }) => {
    dispatch({ type: 'UPLOAD_FILES_START' });
    const toastId = toast.loading('Uploading files, please wait...');

    const { files, data, recorder } = params;
    const {
      siteFile          = null,
      searchEffortFile  = null,
      telemetryFishFile = null,
      missouriRiverFile = null,
      fishFile          = null,
      supplementalFile  = null,
      proceduresFile    = null,
    } = data;

    const url = '/psapi/upload';
    const payload = {
      editInitials: recorder,
      ...siteFile           && { siteUpload:          { uploadFilename: files.siteFile.name,          items: siteFile }},
      ...searchEffortFile   && { searchUpload:        { uploadFilename: files.searchEffortFile.name,  items: searchEffortFile }},
      ...telemetryFishFile  && { telemetryUpload:     { uploadFilename: files.telemetryFishFile.name, items: telemetryFishFile }},
      ...missouriRiverFile  && { moriverUpload:       { uploadFilename: files.missouriRiverFile.name, items: missouriRiverFile }},
      ...fishFile           && { fishUpload:          { uploadFilename: files.fishFile.name,          items: fishFile }},
      ...supplementalFile   && { supplementalUpload:  { uploadFilename: files.supplementalFile.name,  items: supplementalFile }},
      ...proceduresFile     && { procedureUpload:     { uploadFilename: files.proceduresFile.name,    items: proceduresFile }},
    };

    apiPost(url, payload, (err, _body) => {
      if (!err) {
        dispatch({
          type: 'UPDATE_UPLOAD',
          payload: _body,
        });
        dispatch({ type: 'UPLOAD_FILES_FINISHED' });
        tSuccess(toastId, 'Successfully uploaded all files!');
        store.doFetchUploadSessionLogs({ uploadSessionId: _body.uploadSessionId});
      } else {
        dispatch({ type: 'UPLOAD_FILES_ERROR', payload: err });
        tError(toastId, 'Failed to upload files. Please verify file formats and try again.');
      }
    });
  },

  doFetchUploadSessionLogs: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'FETCH_UPLOAD_SESSION_LOGS_START' });

    const url = `/psapi/uploadSessionLogs${queryFromObject(params)}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'UPDATE_UPLOAD_SESSION_LOGS',
          payload: body,
        });
        dispatch({ type: 'FETCH_UPLOAD_SESSION_LOGS_FINISHED' });
      } else {
        dispatch({ type: 'FETCH_UPLOAD_SESSION_LOGS_ERROR' });
      }
    });
  },
};
