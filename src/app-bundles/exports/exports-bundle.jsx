import { queryFromObject } from '@src/utils';

const exportsBundle = {
  name: 'exports',

  getReducer: () => {
    const initialData = {
      exportData: [],
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'UPDATE_EXPORT_DATA':
          return {
            ...state,
            exportData: payload,
          };
        default:
          return state;
      }
    };
  },

  selectExportData: (state) => state.exports.exportData,

  doFetchExportsSites:
    (params) =>
    ({ dispatch, apiGet }) => {
      const uri = `/psapi/export/sites${queryFromObject(params)}`;

      apiGet(uri, (err, body) => {
        if (!err) {
          dispatch({ type: 'UPDATE_EXPORT_DATA', payload: body });
        } else {
          dispatch({ type: 'EXPORTS_SITES_FETCH_ERROR', payload: err });
        }
      });
    },
};

export default exportsBundle;
