import { toast } from 'react-toastify';
import { tSuccess, tError, tWarning } from '@common/toast/toastHelper';
import { queryFromObject } from '@src/utils';
import { ApiStatuses } from '@src/utils/enums';

export default {
  name: 'tokenStore',
  getReducer: () => {
    const initialData = {
      token: {
        accessKey:null,
        secretHash:null,
        expiration:null,
        user:null
      }
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        // Fetch
        case 'SET_TOKEN':
          return {
            ...state,
            token: payload,
          };

        default:
          return state;
      }
    };
  },

  selectTokenStore: (state) => state.tokenStore,
  selectTokenStoreToken: (state) => state.tokenStore.token,

  // DATA ENTRY FETCHES

  doFetchToken:
    (email) =>
    ({ dispatch, store, apiGet }) => {
      const toastId = ignoreToast ? toast.loading(`Fetching Token Info for ${email}`) : null;

      const url = `/psapi/user/token/${email}`;

      apiGet(url, (err, body) => {
        if (!err && body?.status === ApiStatuses.Success) {

          dispatch({
            type: 'SET_TOKEN',
            payload: body?.data.token,
          });

          ignoreToast && tSuccess(toastId, 'Token Info found!');
          
        } else {
          dispatch({ type: 'TOKEN_FETCH_ERROR', payload: err });
          tError(toastId, 'Error fetching Token Info. Please try again.');
        }
      });
    },

  doSaveToken:
    (email, formData) =>
    ({ dispatch, store, apiPost }) => {
      const toastId = toast.loading('Saving token...');

      const url = `/psapi/user/token/${email}`;

      apiPost(url, formData, (err, _body) => {
        if (!err) {
          tSuccess(toastId, 'Token Set!');
          dispatch({ type: 'TOKEN_SET_FINISHED' });
        } else {
          dispatch({ type: 'TOKEN_SET_ERROR', payload: err });
          tError(toastId, 'Error saving token.');
        }
      });
    },


  doDeleteToken:
    (email) =>
    ({ dispatch, store, apiDelete }) => {
      const toastId = toast.loading(`Deleting token for user: ${email}...`);

      const url = `/psapi/user/token/${email}`;

      apiDelete(url, (err, _body) => {
        if (!err) {
          tSuccess(toastId, `Token for user: ${email} successfully deleted!`);
          dispatch({ type: 'TOKEN_DELETE_FINISHED' });
        } else {
          dispatch({ type: 'TOKEN_DELETE_ERROR', payload: err });
          tError(toastId, `Error deleting token for user: ${email}. Please try again.`);
        }
      });
    }
};
