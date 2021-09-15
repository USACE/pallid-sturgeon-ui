import createRestBundle from './create-rest-bundle';

import { toast } from 'react-toastify';
import { tSuccess, tError } from 'common/toast/toastHelper';

export default createRestBundle({
  name: 'datasheet',
  addons: {
    doDatasheetLoadData: () => ({ dispatch, store }) => {
      dispatch({ type: 'LOADING_DATASHEET_INIT_DATA' });
      store.doDomainProjectsFetch();
      store.doDomainSeasonsFetch();
    },

    doDatasheetFetch: (tab, filters) => ({ dispatch, apiGet }) => {
      dispatch({ type: 'DATASHEET_FETCH_DATA_START' });

      const uris = {
        missouriRiverData: '/missouriDataSummary',
        fishData: '/fishDataSummary',
        suppData: '/suppDataSummary',
      };

      const uriKeys = Object.keys(uris);
      const uriValues = Object.values(uris);
      const queryKeys = Object.keys(filters).filter(key => filters[key]);
      const strings = queryKeys.map(key => `${key}=${filters[key]}`);
      const query = `?${strings.join('&')}&officeCode=MO`;

      const url = `/psapi${uriValues[tab]}${query}`;

      apiGet(url, (_err, body) => {
        dispatch({
          type: 'DATASHEETS_UPDATED_DATA',
          payload: {
            key: uriKeys[tab],
            data: body,
          }
        });
        dispatch({ type: 'DATASHEET_FETCH_DATA_FINISHED' });
      });
    },

    doFetchAllMissouriData: () => ({ dispatch, store, apiGet }) => {
      dispatch({ type: 'DATASHEET_ALL_MISSOURI_FETCH_START' });

      const uri = '/missouriFullDataSummary';

      apiGet(uri, (_err, body) => {
        console.log('response :', body);
      });
    },
  },

  reduceFurther: (state, { type, payload }) => {
    switch (type) {
      case 'DATASHEETS_UPDATED_DATA':
        return {
          ...state,
          data: {
            ...state.data,
            [payload.key]: payload.data,
          }
        };
      default:
        return state;
    }
  },
});