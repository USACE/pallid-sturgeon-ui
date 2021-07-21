const uploadBundle = {
  name: 'upload',
  doUploadSend: () => async ({ dispatch, store, apiPost }) => {
    const postUrl = '';

    apiPost(`${postUrl}`, (err, body) => {
      if (err) {
        console.error(err.message);
        store.doNotificationFire({
          message: err
            ? `${err.name}: ${err.Detail}`
            : 'An unexpected error occured. Please try again later.',
          level: 'error',
          autoDismiss: 0,
        });
      } else {
        console.log('success handler...');
      }
    });
  }
};

export default uploadBundle;