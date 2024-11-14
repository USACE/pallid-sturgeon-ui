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

  selectUsers: state =>  state.userBundles,
  selectUsersData: state => state.userBundles.data,
  selectUsersList: state => state.userBundles.users,

  // Fetch All User Accounts
  doFetchUsers: () => ({ dispatch, apiGet }) => {
    dispatch({ type: 'USERS_FETCH_START'});
    const uri = '/psapi/users';

    apiGet(uri, (err, body) => {
      if (err) {
        dispatch({ type: 'USERS_FETCH_ERROR', payload: err});
      } else {
        dispatch({ type: 'UPDATE_USERS', payload: body});
      }
    });

    dispatch({ type: 'USERS_FETCH_FINISHED'});
  },

  // Fetch All Unique Users
  doFetchUsersList: () => ({ dispatch, apiGet }) => {
    dispatch({ type: 'USERS_LIST_FETCH_START'});
    const uri = '/psapi/userList';

    apiGet(uri, (err, body) => {
      if (err) {
        dispatch({ type: 'USERS_LIST_FETCH_ERROR', payload: err});
      } else {
        dispatch({ type: 'UPDATE_USERS_LIST', payload: body});
      }
    });

    dispatch({ type: 'USERS_LIST_FETCH_FINISHED'});
  },
};

export default usersBundle;
