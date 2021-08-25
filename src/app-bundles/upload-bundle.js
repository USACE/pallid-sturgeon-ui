export default {
  name: 'upload',
  getReducer: () => {},

  doUploadAllFiles: (params) => ({ dispatch, apiPost }) => {
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

    dispatch({ type: 'UPLOAD_FILES_START' });

    const url = '/psapi/upload';
    const payload = {
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
      } else {
        dispatch({ type: 'UPLOAD_FILES_ERROR', payload: err });
      }
    });
  },
};
