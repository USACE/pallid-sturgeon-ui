import { ApiStatuses } from '@src/utils/enums';
import { db } from '@src/app-pages/data-entry/offline/db';

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
    async ({ dispatch, apiGet }) => {
      const normalizedTag = String(tagnumber ?? '')
        .trim()
        .toUpperCase();
      const emptyResult = {
        geneticNeeds: '',
        lab: '',
        stockedJuvenileInfo: [],
        recaptureInfo: [],
      };

      if (!normalizedTag) {
        dispatch({ type: 'UPDATE_PALLID_ID_DATA', payload: emptyResult });
        return;
      }

      if (!navigator.onLine) {
        try {
          const cached = await db.pallidId.get(normalizedTag);

          if (cached) {
            dispatch({
              type: 'UPDATE_PALLID_ID_DATA',
              payload: {
                geneticNeeds: cached.geneticNeeds ?? '',
                lab: cached.lab ?? '',
                stockedJuvenileInfo: cached.stockedJuvenileInfo ?? [],
                recaptureInfo: cached.recaptureInfo ?? [],
              },
            });
            return;
          }

          dispatch({
            type: 'UPDATE_PALLID_ID_DATA',
            payload: emptyResult,
          });
          console.warn(`No offline Pallid ID data found for ${normalizedTag}`);
        } catch (err) {
          console.error('Offline Pallid ID lookup failed:', err);
          dispatch({
            type: 'PALLID_ID_FETCH_ERROR',
            payload: err,
          });
        }
        return;
      }

      const url = `${rootUrl}getPallidIdData?` + new URLSearchParams({ tagnumber: normalizedTag });
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
