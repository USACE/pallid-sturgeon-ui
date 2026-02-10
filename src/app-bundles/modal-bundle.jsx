const ModalBundle = {
  name: 'modal',
  getReducer: () => {
    const initialData = {
      content: null,
      secondaryContent: null,
      props: null,
      secondaryProps: null,
      size: null,
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'MODAL_UPDATED':
          return { ...state, ...payload };
      }
      return state;
    };
  },
  doModalOpen:
    (content, props) =>
    ({ dispatch }) => {
      dispatch({
        type: 'MODAL_UPDATED',
        payload: {
          content: content,
          props: props,
        },
      });
    },
  doModalClose:
    () =>
    ({ dispatch }) => {
      dispatch({
        type: 'MODAL_UPDATED',
        payload: {
          content: null,
          props: null,
        },
      });
    },
  doSecondaryModalOpen:
    (content, props) =>
    ({ dispatch }) => {
      dispatch({
        type: 'MODAL_UPDATED',
        payload: {
          secondaryContent: content,
          secondaryProps: props,
        },
      });
    },
  doSecondaryModalClose:
    () =>
    ({ dispatch }) => {
      dispatch({
        type: 'MODAL_UPDATED',
        payload: {
          secondaryContent: null,
          secondaryProps: null,
        },
      });
    },
  selectModalContent: (state) => state.modal.content,
  selectModalProps: (state) => state.modal.props,
  selectSecondaryModalContent: (state) => state.modal.secondaryContent,
  selectSecondaryModalProps: (state) => state.modal.secondaryProps,
};

export default ModalBundle;
