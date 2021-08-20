import createRestBundle from './create-rest-bundle';

export default createRestBundle({
  name: 'datasheet',
  addons: {
    doDatasheetLoadData: () => ({ dispatch, store }) => {
      dispatch({ type: 'LOADING_DATASHEET_INIT_DATA' });
      store.doDatasheetProjectsFetch();
      store.doDatasheetSeasonsFetch();
    },

    doDatasheetProjectsFetch: () => ({ dispatch, apiGet }) => {
      dispatch({ type: 'DATASHEET_FETCH_PROJECTS_START' });

      const url = '/psapi/projects';

      apiGet(url, (_err, body) => {
        dispatch({
          type: 'DATASHEETS_UPDATED_PROJECTS',
          payload: body,
        });
        dispatch({ type: 'DATASHEET_FETCH_PROJECTS_FINISHED' });
      });
    },

    doDatasheetSeasonsFetch: () => ({ dispatch, apiGet }) => {
      dispatch({ type: 'DATASHEET_FETCH_SEASONS_START' });

      const url = '/psapi/seasons';

      apiGet(url, (_err, body) => {
        dispatch({
          type: 'DATASHEETS_UPDATED_SEASONS',
          payload: body,
        });
        dispatch({ type: 'DATASHEET_FETCH_SEASONS_FINISHED' });
      });
    },

    doDatasheetSegmentsFetch: () => ({ dispatch, apiGet }) => {
      dispatch({ type: 'DATASHEET_FETCH_SEGMENTS_START' });

      const url = '/psapi/segments';

      apiGet(url, (_err, body) => {
        dispatch({
          type: 'DATASHEETS_UPDATED_SEGMENTS',
          payload: body,
        });
        dispatch({ type: 'DATASHEET_FETCH_SEGMENTS_FINISHED' });
      });
    },

    doDatasheetBendsFetch: () => ({ dispatch, apiGet }) => {
      dispatch({ type: 'DATASHEET_FETCH_BENDS_START' });

      const url = '/psapi/bends';

      apiGet(url, (_err, body) => {
        dispatch({
          type: 'DATASHEETS_UPDATED_BENDS',
          payload: body,
        });
        dispatch({ type: 'DATASHEET_FETCH_BENDS_FINISHED' });
      });
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
  },

  reduceFurther: (state, { type, payload }) => {
    switch (type) {
      case 'DATASHEETS_UPDATED_PROJECTS':
        return { ...state, projects: payload };
      case 'DATASHEETS_UPDATED_SEASONS':
        return { ...state, seasons: payload };
      case 'DATASHEETS_UPDATED_SEGMENTS':
        return { ...state, segments: payload };
      case 'DATASHEETS_UPDATED_BENDS':
        return { ...state, bends: payload };
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