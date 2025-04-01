const complexStateBundle = {
  name: 'complexstate',

  getReducer: () => {
    const initialData = {
      isEditForm: false,
    };

    return (state = initialData, { type, payload }) => {
      if (type === 'COMPLEX_STATE_RESET') {
        return initialData;
      }

      if (type === 'COMPLEX_STATE_FIELD_UPDATED') {
        return { ...state, [payload.name]: payload.value };
      }

      if (type === 'COMPLEX_STATE_FIELD_RESET') {
        return { ...state, [payload.name]: null };
      }

      return state;
    };
  },

  selectIsEditForm: (state) => state.complexstate.isEditForm,

  doResetComplexState:
    () =>
    ({ dispatch }) => {
      dispatch({
        type: 'COMPLEX_STATE_RESET',
      });
    },
  doResetComplexStateField:
    (props) =>
    ({ dispatch }) => {
      dispatch({
        type: 'COMPLEX_STATE_FIELD_RESET',
        payload: { name: props.name },
      });
    },
  doUpdateComplexStateField:
    (props) =>
    ({ dispatch }) => {
      dispatch({
        type: 'COMPLEX_STATE_FIELD_UPDATED',
        payload: { name: props.name, value: props.value },
      });
    },
  selectComplexState: (state) => state.complexstate,
};

export default complexStateBundle;
