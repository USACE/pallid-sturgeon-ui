import { toast } from 'react-toastify';
import { tSuccess, tError } from 'common/toast/toastHelper';

export default {
  name: 'upload',
  getReducer: () => {},

  doUploadAllFiles: (params) => ({ dispatch, apiPost }) => {
    dispatch({ type: 'UPLOAD_FILES_START' });
    const toastId = toast.loading('Uploading files, please wait...');

    const { files, version, recorder } = params;
    const {
      siteFile          = null,
      searchEffortFile  = null,
      telemetryFishFile = null,
      missouriRiverFile = null,
      fishFile          = null,
      supplementalFile  = null,
      proceduresFile    = null,
    } = files;

    const url = '/psapi/upload';
    const payload = {
      editInitials: recorder,
      ...siteFile           && { siteUpload:          siteFile },
      ...searchEffortFile   && { searchUpload:        searchEffortFile },
      ...telemetryFishFile  && { telemetryUpload:     telemetryFishFile },
      ...missouriRiverFile  && { moriverUpload:       missouriRiverFile },
      ...fishFile           && { fishUpload:          fishFile },
      ...supplementalFile   && { supplementalUpload:  supplementalFile },
      ...proceduresFile     && { procedureUpload:     proceduresFile },
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
