import createRestBundle from './create-rest-bundle';

export default createRestBundle({
  name: 'upload',
  uid: 'id',
  staleAfter: 0,
  persist: false,
  routeParam: '',
  getTemplate: '/psapi/version',
  putTemplate: '',
  postTemplate: '',
  deleteTemplate: '',
  fetchActions: [],
  urlParamSelectors: [],
  forceFetchActions: [],
});

// const uploadBundle = {
//   name: 'upload',
//   doUploadSend: () => async ({ dispatch, store, apiGet }) => {
//     const postUrl = '/version';

//     apiGet(`${postUrl}`, (err, body) => {
//       if (err) {
//         console.error(err.message);
//         store.doNotificationFire({
//           message: err
//             ? `${err.name}: ${err.Detail}`
//             : 'An unexpected error occured. Please try again later.',
//           level: 'error',
//           autoDismiss: 0,
//         });
//       } else {
//         console.log('success handler...');
//       }
//     });
//   }
// };

// export default uploadBundle;