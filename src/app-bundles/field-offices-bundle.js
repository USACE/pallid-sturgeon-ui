import { createSelector } from 'redux-bundler';

const fieldOfficesBundle = {
  name: 'fieldOffices',
  getReducer: () => {
    const initialData = {
      data: [],
      loading: false,
      shouldQuery: false,
      err: null,
      lastError: null,
      lastFetch: null,
    };
    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'FIELDOFFICE_LOADING':
        case 'FETCH_FIELDOFFICE_START':
        case 'FIELDOFFICE_ERROR':
        case 'FIELDOFFICE_LOADED':
          return Object.assign({}, state, payload);
        default:
      }
      return state;
    };
  },
  doFetchFieldOffices: () => ({ dispatch }) => {
    dispatch({
      type: 'FIELDOFFICE_LOADING',
      payload: {
        loading: true,
        shouldQuery: true,
      },
    });
  },
  doLoadFieldOffices: () => ({ dispatch, apiGet }) => {
    dispatch({
      type: 'FETCH_FIELDOFFICE_START',
      payload: { shouldQuery: false },
    });

    apiGet('/psapi/fieldOffices', (err, body) => {
      if (err) {
        dispatch({
          type: 'FIELDOFFICE_ERROR',
          payload: {
            loading: false,
            err: { err },
            lastError: Date.now(),
          },
        });

      } else {

        dispatch({
          type: 'FIELDOFFICE_LOADED',
          payload: {
            loading: false,
            data: body,
            lastFetch: Date.now(),
            err: null,
          },
        });
      }
    });
  },
  selectFieldOffices: (state) => state.fieldOffices,

  reactShouldLoadFieldOffices: createSelector('selectFieldOffices', (fieldOffices) => {
    if (fieldOffices && fieldOffices.shouldQuery)
      return { actionCreator: 'doLoadFieldOffices' };
  }),
  persistActions: ['FIELDOFFICE_LOADED'],
};

export default fieldOfficesBundle;
