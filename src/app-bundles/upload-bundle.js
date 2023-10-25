import { toast } from 'react-toastify';
import { tSuccess, tError } from 'common/toast/toastHelper';
import { queryFromObject } from 'utils';

const processResponse = (response, type) => (
  new Promise((resolve, reject) => {
    const func = response.status < 400 ? resolve : reject;
    // @TODO: handle different response types
    type === 'json' ?
      response.json()
        .then(json => func({
          'status': response.status,
          'json': json,
        }))
        .catch(e => console.error(e)) :
      response.blob()
        .then(blob => func({
          'status': response.status,
          'blob': blob,
        }))
        .catch(e => console.error(e));
  })
);

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

  doUploadAllFiles: (files, version, recorder) => ({ dispatch, apiFetch, store }) => {
    dispatch({ type: 'UPLOAD_FILES_START' });
    const toastId = toast.loading('Uploading files, please wait...');

    const url = '/psapi/upload';

    var data = new FormData();
    data.append('editInitials', recorder);
    data.append('version', version);
    for (let key in files) {
      files[key] && data.append('files', files[key]);
    }
    // PRINTING FORMDATA
    // for (var pair of data.entries()) {
    //   console.log(pair);
    // }

    apiFetch(url, { method: 'POST', body: data })
      .then(response => processResponse(response, 'json'))
      .then(response => {
        if (response.json.status === 'Success') {
          dispatch({ type: 'UPDATE_UPLOAD', payload: body });
          dispatch({ type: 'UPLOAD_FILES_FINISHED' });
          tSuccess(toastId, 'Successfully uploaded all files!');
          store.doFetchUploadSessionLogs({ uploadSessionId: body.uploadSessionId });
        } else {
          dispatch({ type: 'UPLOAD_FILES_ERROR', payload: err });
          tError(toastId, 'Failed to upload files. Please verify file formats and try again.');
        }
      })
      .catch(e => {
        dispatch({ type: 'UPLOAD_FILE_ERROR' });
        console.error(`Request returned a ${e.status}`);
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
