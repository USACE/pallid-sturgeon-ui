import { toast } from 'react-toastify';
import { tSuccess, tError } from 'common/toast/toastHelper';
import { queryFromObject } from 'utils';

const homeDataBundle = {
  name: 'home',

  getReducer: () => {
    const initialData = {
      downloadInfo: {
        versionData: {},
        zipData: null,
      },
      errorLog: {
        data: [],
      },
      usgNoVialNumbers: {
        data: [],
      },
      unapprovedDataSheets: {
        data: [],
        totalResults: 0,
        pageSize: 20,
        pageNumber: 0,
      },
      uncheckedDataSheets: {
        data: [],
        totalResults: 0,
        pageSize: 20,
        pageNumber: 0,
      },
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'SET_DOWNLOAD_INFO_VERSION_DATA': 
          return {
            ...state,
            downloadInfo: {
              ...state.downloadInfo,
              versionData: payload,
            }
          };
        case 'SET_DOWNLOAD_INFO_ZIP_DATA': 
          return {
            ...state,
            downloadInfo: {
              ...state.downloadInfo,
              zipData: payload,
            }
          };
        case 'SET_ERROR_LOG_DATA':
          return {
            ...state,
            errorLog: {
              ...state.errorLog,
              data: payload,
            },
          };
        case 'SET_USG_NO_VIAL_NUMBERS_DATA':
          return {
            ...state,
            usgNoVialNumbers: {
              ...state.usgNoVialNumbers,
              data: payload,
            },
          };
        case 'SET_UNAPROVED_DATA_DATA':
          return {
            ...state,
            unapprovedDataSheets: {
              ...state.unapprovedDataSheets,
              data: payload,
            },
          };
        case 'UPDATE_UNAPROVED_DATA_STATE':
          return {
            ...state,
            unapprovedDataSheets: {
              ...state.unapprovedDataSheets,
              ...payload,
            },
          };
        case 'SET_UNCHECKED_DATA_DATA':
          return {
            ...state,
            uncheckedDataSheets: {
              ...state.uncheckedDataSheets,
              data: payload.items,
              totalResults: payload.totalCount,
            },
          };
        case 'UPDATE_UNCHECKED_DATA_STATE':
          return {
            ...state,
            uncheckedDataSheets: {
              ...state.uncheckedDataSheets,
              ...payload,
            },
          };
        default:
          return state;
      }
    };
  },

  selectHome: state => state.home,
  selectDownloadInfoVersionInfo: state => state.home.downloadInfo.versionData,
  selectErrorLog: state => state.home.errorLog,
  selectUsgNoVialNumbers: state => state.home.usgNoVialNumbers,
  selectUnapprovedDataSheets: state => state.home.unapprovedDataSheets,
  selectUncheckedDataSheets: state => state.home.uncheckedDataSheets,

  doHomeFetch: () => ({ dispatch, store }) => {
    dispatch({ type: 'FETCHING_HOME_DATA '});
    store.doFetchDownloadInfo();
    store.doFetchErrorLog();
    store.doFetchUsgNoVialNumbers();
    store.doFetchUnapprovedData();
    store.doFetchUncheckedData();
  },

  doFetchDownloadInfo: () => ({ dispatch, apiGet }) => {
    dispatch({ type: 'FETCH_DOWNLOAD_INFO_START' });

    const url = '/psapi/downloadInfo?id=54';

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'SET_DOWNLOAD_INFO_VERSION_DATA',
          payload: body,
        });
        dispatch({ type: 'FETCH_DOWNLOAD_INFO_FINISH' });
      } else {
        dispatch({ type: 'FETCH_DOWNLOAD_INFO_ERROR' });
      }
    });
  },

  doFetchDownloadZip: () => ({ dispatch, store, apiFetch }) => {
    dispatch({ type: 'FETCH_DOWNLOAD_ZIP_START' });
    const toastId = toast.loading('Preparing .zip files...');

    const { name } = store.selectDownloadInfoVersionInfo();

    const url = '/psapi/downloadZip?id=54';

    apiFetch(url)
      .then(res => res.blob())
      .then(blob => {
        tSuccess(toastId, 'File ready for download.');
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(_e => {
        tError(toastId, 'Failed to retrieve Field Application download.');
      });
  },

  doFetchErrorLog: () => ({ dispatch, apiGet }) => {
    dispatch({ type: 'FETCH_ERROR_LOG_START' });

    const url = '/psapi/errorCount';

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'SET_ERROR_LOG_DATA',
          payload: body,
        });
        dispatch({ type: 'FETCH_ERROR_LOG_FINISH' });
      } else {
        dispatch({ type: 'FETCH_ERROR_LOG_ERROR' });
      }
    });
  },

  doFetchUsgNoVialNumbers: () => ({ dispatch, apiGet }) => {
    dispatch({ type: 'FETCH_USG_NO_VIAL_NUMBERS_START' });

    const url = '/psapi/usgNoVialNumbers';

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'SET_USG_NO_VIAL_NUMBERS_DATA',
          payload: body,
        });
        dispatch({ type: 'FETCH_USG_NO_VIAL_NUMBERS_FINISHED' });
      } else {
        dispatch({ type: 'FETCH_USG_NO_VIAL_NUMBERS_ERROR' });
      }
    });
  },

  doFetchUnapprovedData: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'FETCH_UNAPPROVED_DATA_START' });

    const params = store.selectUnapprovedDataSheets();
    const { pageSize, pageNumber} = params;

    const query = queryFromObject({
      size: pageSize,
      page: pageNumber,
    });

    const url = `/psapi/unapprovedDataSheets${query}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'SET_UNAPPROVED_DATA_DATA',
          payload: body,
        });
        dispatch({ type: 'FETCH_UNAPPROVED_DATA_FINISH' });
      } else {
        dispatch({ type: 'FETCH_UNAPPROVED_DATA_ERROR' });
      }
    });
  },

  doFetchUncheckedData: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'FETCH_UNCHECKED_DATA_START' });
    const params = store.selectUncheckedDataSheets();
    const { pageSize, pageNumber} = params;

    const query = queryFromObject({
      size: pageSize,
      page: pageNumber,
    });

    const url = `/psapi/uncheckedDataSheets${query}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'SET_UNCHECKED_DATA_DATA',
          payload: body,
        });
        dispatch({ type: 'FETCH_UNCHECKED_DATA_FINISH' });
      } else {
        dispatch({ type: 'FETCH_UNCHECKED_DATA_ERROR' });
      }
    });
  },

  doUpdateUncheckedData: (payload) => ({ dispatch, store }) => {
    dispatch({ type: 'UPDATE_UNCHECKED_DATA_STATE', payload });
    store.doFetchUncheckedData();
  },

  /*
    e.GET(urlContext+"/errorCount", PallidSturgeonH.GetErrorCount)
    e.GET(urlContext+"/usgNoVialNumbers", PallidSturgeonH.GetUsgNoVialNumbers)
    e.GET(urlContext+"/unapprovedDataSheets", PallidSturgeonH.GetUnapprovedDataSheets)
    e.GET(urlContext+"/uncheckedDataSheets", PallidSturgeonH.GetUncheckedDataSheets)
    e.GET(urlContext+"/downloadInfo", PallidSturgeonH.GetDownloadInfo)
    e.GET(urlContext+"/downloadZip", PallidSturgeonH.GetDownloadZip)
  */
  
};

export default homeDataBundle;
