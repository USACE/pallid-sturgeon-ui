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
        console.log('test body: ', body);

        dispatch({
          type: 'DATASHEETS_UPDATED_SEASONS',
          payload: body,
        });
        dispatch({ type: 'DATASHEET_FETCH_SEASONS_FINISHED' });
      });
    },
  },

  reduceFurther: (state, { type, payload }) => {
    switch (type) {
      case 'DATASHEETS_UPDATED_PROJECTS':
        return Object.assign({}, state, { projects: payload });
      case 'DATASHEETS_UPDATED_SEASONS':
        return Object.assign({}, state, { seasons: payload });
      default:
        return state;
    }
  },
});