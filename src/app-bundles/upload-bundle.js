import { toast } from 'react-toastify';
import { tSuccess, tError } from 'common/toast/toastHelper';

export default {
  name: 'upload',
  getReducer: () => {},

  doUploadAllFiles: (params) => ({ dispatch, apiPost }) => {
    dispatch({ type: 'UPLOAD_FILES_START' });
    const toastId = toast.loading('Uploading files, please wait...');

    const { files, data, version, recorder } = params;
    const {
      siteFile          = null,
      searchEffortFile  = null,
      telemetryFishFile = null,
      missouriRiverFile = null,
      fishFile          = null,
      supplementalFile  = null,
      proceduresFile    = null,
    } = data;

    console.log('test files: ', files);

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
        dispatch({ type: 'UPLOAD_FILES_FINISHED' });
        tSuccess(toastId, 'Successfully uploaded all files!');
      } else {
        dispatch({ type: 'UPLOAD_FILES_ERROR', payload: err });
        tError(toastId, 'Failed to upload files. Please verify file formats and try again.');
      }
    });
  },
};
