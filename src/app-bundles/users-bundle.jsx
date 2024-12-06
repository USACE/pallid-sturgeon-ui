const usersBundle = {
  name: 'userBundles',

  getReducer: () => {
    const initialData = {
      data: [],
      users: [],
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'UPDATE_USERS':
          return {
            ...state,
            data: payload,
          };
        case 'UPDATE_USERS_LIST':
          return {
            ...state,
            users: payload,
          };
        default:
          return state;
      }
    };
  },

  selectUsers: (state) => state.userBundles,
  selectUsersData: (state) => state.userBundles.data,
  selectUsersList: (state) => state.userBundles.users,

  // Fetch All User Accounts
  doFetchUsers:
    () =>
    ({ dispatch, apiGet, store }) => {
      const uri = '/psapi/users';

      store.doSetLoadingState(true);
      store.doSetLoadingMessage('Fetching Users...');

      apiGet(uri, (err, body) => {
        store.doSetLoadingState(false);
        if (err) {
          dispatch({ type: 'USERS_FETCH_ERROR', payload: err });
        } else {
          dispatch({ type: 'UPDATE_USERS', payload: body });
        }
      });
    },

  // Fetch All Unique Users
  doFetchUsersList:
    () =>
    ({ dispatch, apiGet, store }) => {
      const uri = '/psapi/userList';

      store.doSetLoadingState(true);
      store.doSetLoadingMessage('Fetching Users...');

      apiGet(uri, (err, body) => {
        store.doSetLoadingState(false);
        if (err) {
          dispatch({ type: 'USERS_LIST_FETCH_ERROR', payload: err });
        } else {
          dispatch({ type: 'UPDATE_USERS_LIST', payload: body });
        }
      });
    },
};

export default usersBundle;
