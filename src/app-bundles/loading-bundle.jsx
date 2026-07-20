const loadingBundle = {
  name: 'loading',

  getReducer: () => {
    const initialState = {
      isLoading: false,
      message: 'Loading...',
      isLoadingBtn: false,
    };

    return (state = initialState, { type, payload }) => {
      if (type === 'SET_LOADING_STATE') {
        return { ...state, isLoading: payload };
      }

      if (type === 'SET_LOADING_MESSAGE') {
        return { ...state, message: payload };
      }

      if (type === 'SET_LOADING_BUTTON_STATE') {
        return { ...state, isLoadingBtn: payload };
      }

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
  doSetLoadingButtonState:
    (payload) =>
    ({ dispatch }) => {
      dispatch({ type: 'SET_LOADING_BUTTON_STATE', payload });
    },

  selectLoadingState: (state) => state.loading.isLoading,
  selectLoadingMessage: (state) => state.loading.message,
  selectLoadingButtonState: (state) => state.loading.isLoadingBtn,
};
export default loadingBundle;
