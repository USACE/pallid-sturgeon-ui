const baseDataBundle = {
  name: 'baseData',

  getReducer: () => {
    const initialData = {
      data: [],
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'UPDATE_BASE_DATA':
          return {
            ...state,
            data: { ...state.data, ...payload },
          };
        default:
          return state;
      }
    };
  },

  selectBaseData: (state) =>  state.baseData.data,

  doUpdateBaseData: (name, value) => ({ dispatch }) => {
    dispatch({ type: 'UPDATE_BASE_DATA', payload: { [name]: value } });
  },
};

export default baseDataBundle;
