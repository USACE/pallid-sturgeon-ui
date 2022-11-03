import { createSelector } from 'redux-bundler';

const userAccessRequestBundle = {
  name: 'userAccessRequests',
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
        case 'USERS_ACCESS_REQUESTS_LOADING':
        case 'FETCH_USERS_ACCESS_REQUESTS_START':
        case 'USERS_ACCESS_REQUESTS_ERROR':
        case 'USER_ROLE_OFFICE_UPDATED':
        case 'USER_ROLE_OFFICE_UPDATE_ERROR':
        case 'USERS_ACCESS_REQUESTS_LOADED':
          return Object.assign({}, state, payload);
        default:
      }
      return state;
    };
  },
  doFetchUserAccessRequests: () => ({ dispatch }) => {
    dispatch({
      type: 'USERS_ACCESS_REQUESTS_LOADING',
      payload: {
        loading: true,
        shouldQuery: true,
      },
    });
  },
  doLoadUserAccessRequests: () => ({ dispatch, apiGet, store }) => {
    dispatch({
      type: 'FETCH_USERS_ACCESS_REQUESTS_START',
      payload: { shouldQuery: false },
    });

    apiGet('/psapi/userAccessRequests', (err, body) => {
      if (err) {
        dispatch({
          type: 'USERS_ACCESS_REQUESTS_ERROR',
          payload: {
            loading: false,
            err: { err},
            lastError: Date.now(),
          },
        });
      } else {
        dispatch({
          type: 'USERS_ACCESS_REQUESTS_LOADED',
          payload: {
            loading: false,
            data: body,
            lastFetch: Date.now(),
            err: null,
          },
        });
        store.doDomainProjectsFetch();
        store.doDomainFieldOfficesFetch({ showAll: true });
      }
    });
  },
  doRoleOfficeUpdate: (userRoleOffice, callback) => ({ dispatch, apiPost }) => {
    apiPost('/psapi/userRoleOffice', userRoleOffice, (err) => {
      if (err) {
        dispatch({ type: 'USER_ROLE_OFFICE_UPDATE_ERROR', payload: { err } });
      } else {
        dispatch({
          type: 'USER_ROLE_OFFICE_UPDATED',
          payload: {
            loading: true,
            shouldQuery: true,
          },
        });

        if (callback) {
          callback();
        }
      }
    });
  },

  doUpdateRoleOffice: (userRoleOfficeData) => ({ dispatch, apiPut, store }) => {
    dispatch({ type: 'USER_ROLE_OFFICE_UPDATE_START' });

    const { id, roleId, officeId, projectCode } = userRoleOfficeData;

    const url = '/psapi/userRoleOffice';
    const payload = { userId: parseInt(id), roleId: parseInt(roleId), officeId: parseInt(officeId), projectCode: projectCode };

    apiPut(url, payload, (err, _body) => {
      if (!err) {
        dispatch({ type: 'USER_ROLE_OFFICE_UPDATE_FINISHED' });
        store.doFetchUsers();
      } else {
        dispatch({ type: 'USER_ROLE_OFFICE_UPDATE_ERROR', payload: err });
      }
    });
  },
  
  selectUserAccessRequests: (state) =>  state.userAccessRequests,

  reactShouldLoadUserAccessRequests: createSelector('selectUserAccessRequests', (userAccessRequests) => {
    if (userAccessRequests && userAccessRequests.shouldQuery)
      return { actionCreator: 'doLoadUserAccessRequests' };
  }),
  persistActions: ['USERS_ACCESS_REQUESTS_LOADED'],
};

export default userAccessRequestBundle;
