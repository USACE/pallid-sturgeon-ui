const loadingBundle = {
  name: 'loading',

  getReducer: () => {
    const initialState = { isLoading: false, message: 'Loading...' };

    return (state = initialState, { type, payload }) => {

      if (type === 'SET_LOADING_STATE') {
        return { ...state, isLoading: payload };

      };

      if (type === 'SET_LOADING_MESSAGE') {
        return { ...state, message: payload };
      };

      return state;
    };
  },

  doSetLoadingState:
    (payload) =>
      ({ dispatch }) => {
        dispatch({ type: 'SET_LOADING_STATE', payload });
      },
  doSetLoadingMessage:
    (payload) =>
      ({ dispatch }) => {
        dispatch({ type: 'SET_LOADING_MESSAGE', payload });
      },

  selectLoadingState: (state) => state.loading.isLoading,
  selectLoadingMessage: (state) => state.loading.message,

};
export default loadingBundle;
