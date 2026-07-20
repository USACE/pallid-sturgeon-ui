import { ApiStatuses } from '@src/utils/enums';

const rootUrl = '/psapi/Lookup/';

const lookupBundle = {
  name: 'lookup',

  getReducer: () => {
    const initialState = {
      frequencyIds: [],
    };

    return (state = initialState, { type, payload }) => {
      switch (type) {
        case 'UPDATE_ALL_LOOKUP':
          return {
            ...state,
            ...payload,
          };
        default:
          return state;
      }
    };
  },

  selectLookupData: (state) => state.lookup,

  doGetAllLookupData:
    () =>
    ({ dispatch, apiGet }) => {
      const url = `${rootUrl}getAllLookups`;
      apiGet(url, (err, body) => {
        if (!err && body?.status === ApiStatuses.Success) {
          dispatch({ type: 'UPDATE_ALL_LOOKUP', payload: body?.data });
        } else {
          dispatch({ type: 'LOOKUP_FETCH_ERROR', payload: err });
        }
      });
    },
};
export default lookupBundle;
