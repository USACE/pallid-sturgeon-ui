import { queryFromObject } from 'utils';

const exportsBundle = {
  name: 'exports',

  getReducer: () => {
    const initialData = {
      data: [],
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'UPDATE_EXPORTS':
          return {
            ...state,
            data: payload,
          };
        default:
          return state;
      }
    };
  },

  selectExports: state =>  state.exports,
  selectExportsData: state => state.exports.data,

  doFetchExportsSites: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'EXPORTS_SITES_FETCH_START'});

    const uri = `/psapi/export/sites${queryFromObject(params)}`;

    apiGet(uri, (err, body) => {
      if (err) {
        dispatch({ type: 'EXPORTS_SITES_FETCH_ERROR', payload: err});
      } else {
        dispatch({ type: 'UPDATE_EXPORTS', payload: body});
      }
    });

    dispatch({ type: 'EXPORTS_SITES_FETCH_FINISHED'});
  },
};

export default exportsBundle;
