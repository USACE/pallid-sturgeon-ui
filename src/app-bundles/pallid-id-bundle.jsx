import { ApiStatuses } from '@src/utils/enums';

const rootUrl = '/psapi/DataEntry/';

const pallidIdBundle = {
  name: 'pallidId',

  getReducer: () => {
    const initialState = {
      geneticNeeds: '',
      lab: '',
      stockedJuvenileInfo: [],
      recaptureInfo: [],
    };

    return (state = initialState, { type, payload }) => {
      switch (type) {
        case 'UPDATE_PALLID_ID_DATA':
          return {
            ...state,
            ...payload,
          };
        default:
          return state;
      }
    };
  },

  selectPallidIdData: (state) => state.pallidId,

  doGetPallidIdData:
    (tagnumber) =>
    ({ dispatch, apiGet }) => {
      const url = `${rootUrl}getPallidIdData?` + new URLSearchParams({ tagnumber: tagnumber });
      apiGet(url, (err, body) => {
        if (!err && body?.status === ApiStatuses.Success) {
          dispatch({ type: 'UPDATE_PALLID_ID_DATA', payload: body?.data });
        } else {
          dispatch({ type: 'PALLID_ID_FETCH_ERROR', payload: err });
        }
      });
    },
};
export default pallidIdBundle;
