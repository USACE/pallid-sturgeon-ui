const usersBundle = {
  name: 'userBundles',

  getReducer: () => {
    const initialData = {
      data: [],
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'UPDATE_USERS':
          return {
            ...state,
            data: payload,
          };
        default:
          return state;
      }
    };
  },

  selectUsers: state =>  state.userBundles,
  selectUsersData: state => state.userBundles.data,

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
};

export default usersBundle;
