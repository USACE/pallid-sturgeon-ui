import { toast } from 'react-toastify';
import { tSuccess, tError } from 'common/toast/toastHelper';
import { queryFromObject } from 'utils';

const homeDataBundle = {
  name: 'home',

  getReducer: () => {
    const initialData = {
      downloadInfo: {},
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
      bafiDataSheets: {
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
            downloadInfo: payload,
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
        case 'SET_UNAPPROVED_DATA_DATA':
          return {
            ...state,
            unapprovedDataSheets: {
              ...state.unapprovedDataSheets,
              data: payload.items,
              totalResults: payload.totalCount,
            },
          };
        case 'UPDATE_UNAPPROVED_DATA_STATE':
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
        case 'SET_BAFI_DATA_DATA':
          return {
            ...state,
            bafiDataSheets: {
              ...state.bafiDataSheets,
              data: payload.items,
              totalResults: payload.totalCount,
            },
          };
        case 'UPDATE_BAFI_DATA_STATE':
          return {
            ...state,
            bafiDataSheets: {
              ...state.bafiDataSheets,
              ...payload,
            },
          };
        case 'SET_HOME_PAGINATION':
          return {
            ...state,
            uncheckedDataSheets: {
              ...state.uncheckedDataSheets,
              pageSize: payload.pageSize,
              pageNumber: payload.pageNumber,
            },
          };
        default:
          return state;
      }
    };
  },

  selectHome: state => state.home,
  selectDownloadInfo: state => state.home.downloadInfo,
  selectErrorLog: state => state.home.errorLog,
  selectErrorLogData: state => state.home.errorLog.data,
  selectUsgNoVialNumbers: state => state.home.usgNoVialNumbers,
  selectUsgNoVialNumbersData: state => state.home.usgNoVialNumbers.data,
  selectUnapprovedDataSheets: state => state.home.unapprovedDataSheets,
  selectBafiDataSheets: state => state.home.bafiDataSheets,
  selectUncheckedDataSheets: state => state.home.uncheckedDataSheets,
  selectUncheckedDataParams: state => state.home.uncheckedDataSheets.params,

  doHomeFetch: () => ({ store }) => {
    store.doFetchDownloadInfo();

    // Fetch data based on user role
    if (store.selectUserRole().role === 'ADMINISTRATOR') {
      store.doFetchOfficeErrorLogs();
      store.doFetchUsgNoVialNumbers();
      store.doFetchUnapprovedData();
      store.doFetchBafiData();
      store.doFetchUncheckedData();
    }

    if (store.selectUserRole().role === 'OFFICE ADMIN') {
      store.doFetchOfficeErrorLogs();
      store.doFetchUsgNoVialNumbers();
      store.doFetchUncheckedData();
    }

    if (store.selectUserRole().role === 'OFFICE USER') {
      store.doFetchOfficeErrorLogs();
      store.doFetchUsgNoVialNumbers();
      store.doFetchBafiData();
    }
  },

  doFetchDownloadInfo: () => ({ dispatch, apiGet }) => {
    const url = '/psapi/downloadInfo';

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'SET_DOWNLOAD_INFO_VERSION_DATA',
          payload: body,
        });
      } else {
        dispatch({ type: 'FETCH_DOWNLOAD_INFO_ERROR' });
      }
    });
  },

  doFetchDownloadZip: () => ({ store, apiFetch }) => {
    const toastId = toast.loading('Preparing .zip file...');

    const url = '/psapi/downloadZip';
    const { name } = store.selectDownloadInfo();

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

  // doFetchErrorLog: () => ({ dispatch, apiGet }) => {
  //   dispatch({ type: 'FETCH_ERROR_LOG_START' });

  //   const url = '/psapi/errorCount';

  //   apiGet(url, (err, body) => {
  //     if (!err) {
  //       dispatch({
  //         type: 'SET_ERROR_LOG_DATA',
  //         payload: body,
  //       });
  //       dispatch({ type: 'FETCH_ERROR_LOG_FINISH' });
  //     } else {
  //       dispatch({ type: 'FETCH_ERROR_LOG_ERROR' });
  //     }
  //   });
  // },

  doFetchOfficeErrorLogs: () => ({ dispatch, apiGet, store }) => {
    const query = queryFromObject({ id: store.selectUserRole().id });
    const url = `/psapi/officeErrorLog${query}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'SET_ERROR_LOG_DATA',
          payload: body,
        });
      } else {
        dispatch({ type: 'FETCH_RROR_LOG_ERROR' });
      }
    });
  },

  doFetchUsgNoVialNumbers: () => ({ dispatch, apiGet, store }) => {
    const query = queryFromObject({ id: store.selectUserRole().id });
    const url = `/psapi/usgNoVialNumbers${query}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'SET_USG_NO_VIAL_NUMBERS_DATA',
          payload: body,
        });
      } else {
        dispatch({ type: 'FETCH_USG_NO_VIAL_NUMBERS_ERROR' });
      }
    });
  },

  doFetchUnapprovedData: () => ({ dispatch, store, apiGet }) => {
    const params = store.selectUnapprovedDataSheets();
    const { pageSize, pageNumber } = params;

    const query = queryFromObject({
      size: pageSize,
      page: pageNumber,
      id: store.selectUserRole().id
    });
    const url = `/psapi/unapprovedDataSheets${query}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'SET_UNAPPROVED_DATA_DATA',
          payload: body,
        });
      } else {
        dispatch({ type: 'FETCH_UNAPPROVED_DATA_ERROR' });
      }
    });
  },

  doFetchBafiData: () => ({ dispatch, store, apiGet }) => {
    const params = store.selectUnapprovedDataSheets();
    const { pageSize, pageNumber } = params;

    const query = queryFromObject({
      size: pageSize,
      page: pageNumber,
      id: store.selectUserRole().id
    });
    const url = `/psapi/bafiDataSheets${query}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'SET_BAFI_DATA_DATA',
          payload: body,
        });
      } else {
        dispatch({ type: 'FETCH_BAFI_DATA_ERROR' });
      }
    });
  },

  doFetchUncheckedData: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'FETCH_UNCHECKED_DATA_START' });
    const params = store.selectUncheckedDataSheets();
    const { pageSize, pageNumber } = params;

    const query = queryFromObject({
      size: pageSize,
      page: pageNumber,
      id: store.selectUserRole().id
    });
    const url = `/psapi/uncheckedDataSheets${query}`;

    apiGet(url, (err, body) => {
      if (!err) {
        dispatch({
          type: 'SET_UNCHECKED_DATA_DATA',
          payload: body,
        });
      } else {
        dispatch({ type: 'FETCH_UNCHECKED_DATA_ERROR' });
      }
    });
  },

  doUpdateUncheckedData: (payload) => ({ dispatch, store }) => {
    dispatch({ type: 'UPDATE_UNCHECKED_DATA_STATE', payload });
    store.doFetchUncheckedData();
  },

  doSetHomePagination: ({ pageSize, pageNumber }) => ({ dispatch, store }) => {
    dispatch({ type: 'SET_HOME_PAGINATION', payload: { pageSize, pageNumber } });
    store.doHomeFetch();
  },
};

export default homeDataBundle;
