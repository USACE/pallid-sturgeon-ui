import { createSelector } from 'redux-bundler';

const rolesBundle = {
  name: 'roles',
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
        case 'ROLES_LOADING':
        case 'FETCH_ROLES_START':
        case 'ROLES_ERROR':
        case 'ROLES_LOADED':
          return Object.assign({}, state, payload);
        default:
      }
      return state;
    };
  },
  doFetchRoles: () => ({ dispatch }) => {
    dispatch({
      type: 'ROLES_LOADING',
      payload: {
        loading: true,
        shouldQuery: true,
      },
    });
  },
  doLoadRoles: () => ({ dispatch, apiGet }) => {
    dispatch({
      type: 'FETCH_ROLES_START',
      payload: { shouldQuery: false },
    });

    apiGet('/psapi/roles', (err, body) => {
      if (err) {
        dispatch({
          type: 'ROLES_ERROR',
          payload: {
            loading: false,
            err: { err },
            lastError: Date.now(),
          },
        });

      } else {

        dispatch({
          type: 'ROLES_LOADED',
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
  selectRoles: (state) => state.roles,

  reactShouldLoadRoles: createSelector('selectRoles', (roles) => {
    if (roles && roles.shouldQuery)
      return { actionCreator: 'doLoadRoles' };
  }),
  persistActions: ['ROLES_LOADED'],
};

export default rolesBundle;