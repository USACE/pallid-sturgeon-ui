import Keycloak from '@components/keycloak';
import {
  getOfflineAuthSession,
  isOfflineAuthSessionValid,
  saveOfflineAuthSession,
  clearOfflineAuthSession,
} from '@src/app-pages/data-entry/offline/offline-auth';

const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL;
const redirectUrl = import.meta.env.VITE_REDIRECT_URL;
const keycloakRealm = import.meta.env.VITE_KEYCLOAK_REALM;
const keycloakClient = import.meta.env.VITE_KEYCLOAK_CLIENT;

let keycloak = null;

const createAuthBundle = (options) => ({
  name: 'auth',

  getReducer: () => {
    const initialState = {
      loading: false,
      token: null,
      authData: null,
      sessionState: null,
      roles: [],
      offlineSession: null,
      offlineAuthenticated: false,
    };

    return (state = initialState, { type, payload }) => {
      switch (type) {
        case 'START_AUTH':
        case 'UPDATE_SESSION_STATE':
        case 'UPDATE_AUTH':
          return {
            ...state,
            loading: payload.loading,
            token: payload.token,
            authData: {
              ...state.authData,
              ...payload.authData,
            },
            roles: payload.roles,
          };
        case 'UPDATE_ROLES':
          return {
            ...state,
            authData: {
              ...state.authData,
              role: payload,
            },
          };
        case 'OFFLINE_AUTH_ENABLED':
          return {
            ...state,
            offlineSession: payload,
            offlineAuthenticated: true,
          };
        case 'RESTORE_OFFLINE_AUTH':
          return {
            ...state,
            loading: false,
            token: payload.token ?? null,
            authData: payload.authData,
            roles: payload.roles ?? [],
            offlineSession: payload.offlineSession,
            offlineAuthenticated: true,
          };
        case 'CLEAR_OFFLINE_AUTH':
          return {
            ...state,
            offlineSession: null,
            offlineAuthenticated: false,
          };
        default:
          return state;
      }
    };
  },

  init: (store) => {
    keycloak = new Keycloak({
      keycloakUrl: keycloakUrl,
      realm: keycloakRealm,
      client: keycloakClient,
      redirectUrl: redirectUrl,
      refreshInterval: 120,
      sessionEndWarning: 120,
      onAuthenticate: (token) => {
        store.doFetchAuthRoles(token);
      },
      onRedirect: (sessionState) => {
        // store.doSessionStateUpdate(sessionState);
      },
      onError: (err) => {
        console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
        console.log(err);
        console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
      },
      onSessionEnding: (remainingTime) => {
        console.log('=======================================>>>>' + remainingTime);
      },
    });

    keycloak.checkForSession();

    if (!navigator.onLine) {
      store.doRestoreOfflineAuth();
    }
  },

  doRestoreOfflineAuth:
    () =>
    async ({ dispatch }) => {
      const offlineSession = await getOfflineAuthSession();

      if (!isOfflineAuthSessionValid(offlineSession)) {
        return false;
      }

      keycloak.restoreTokens({
        accessToken: offlineSession.accessToken,
        refreshToken: offlineSession.refreshToken,
      });

      dispatch({
        type: 'RESTORE_OFFLINE_AUTH',
        payload: {
          token: offlineSession.accessToken,
          authData: offlineSession.authData,
          roles: offlineSession.roles,
          offlineSession,
        },
      });
      return true;
    },

  doEnableOfflineAuth:
    () =>
    async ({ dispatch, store }) => {
      const auth = store.selectAuth();
      const refreshToken = keycloak?.getRefreshToken();
      const session = await saveOfflineAuthSession({
        accessToken: auth?.token,
        refreshToken,
        authData: auth?.authData,
        roles: auth?.roles ?? [],
      });

      dispatch({
        type: 'OFFLINE_AUTH_ENABLED',
        payload: session,
      });
      return session;
    },

  doRefreshOfflineAuth:
    () =>
    async ({ dispatch, store }) => {
      if (!navigator.onLine) {
        throw new Error('Internet connection is required to refresh authentication.');
      }
      const offlineSession = await getOfflineAuthSession();

      if (!offlineSession || !isOfflineAuthSessionValid(offlineSession)) {
        throw new Error('Offline field session has expired. Please log in again.');
      }
      if (!offlineSession.refreshToken) {
        throw new Error('No offline Keycloak token is available. Please log in again.');
      }

      keycloak.restoreTokens({
        accessToken: offlineSession.accessToken,
        refreshToken: offlineSession.refreshToken,
      });

      const tokens = await keycloak.refreshStoredSession();
      const currentAuth = store.selectAuth();
      const updatedSession = await saveOfflineAuthSession({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        authData: currentAuth?.authData,
        roles: currentAuth?.roles ?? [],
      });

      dispatch({
        type: 'UPDATE_AUTH',
        payload: {
          token: tokens.accessToken,
          authData: currentAuth?.authData,
          roles: currentAuth?.roles ?? [],
          loading: false,
        },
      });

      return {
        token: tokens.accessToken,
        session: updatedSession,
      };
    },

  doAuthenticate:
    () =>
    ({ dispatch, store }) => {
      store.doSetLoadingState(true);
      store.doSetLoadingMessage('Authenticating...');
      dispatch({
        type: 'START_AUTH',
        payload: {
          loading: true,
        },
      });
      keycloak.authenticate();
    },

  doAuthLogout:
    () =>
    async ({ dispatch, store }) => {
      await clearOfflineAuthSession();
      sessionStorage.removeItem('offlineSetupReady');
      sessionStorage.removeItem('isLoggedIn');

      dispatch({ type: 'CLEAR_OFFLINE_AUTH' });
      store.doAuthUpdate(null);
    },

  doSessionStateUpdate:
    (sessionState) =>
    ({ dispatch }) => {
      dispatch({
        type: 'UPDATE_SESSION_STATE',
        payload: {
          sessionState: sessionState,
        },
      });
    },

  doFetchAuthRoles:
    (accessToken) =>
    ({ dispatch, apiGetWithToken, store }) => {
      const authInfo = accessToken ? JSON.parse(atob(accessToken.split('.')[1])) : null;

      if (authInfo) {
        const url = `/psapi/userRoleOffices/${authInfo.email}`;
        apiGetWithToken(url, accessToken, (_err, body) => {
          dispatch({
            type: 'UPDATE_AUTH',
            payload: {
              token: accessToken,
              authData: {
                fullName: authInfo ? authInfo.name : '',
                userId: authInfo ? Number(authInfo.sub) : '',
                name: authInfo && authInfo.name ? authInfo.name.split('.')[0] : '',
                exp: authInfo ? authInfo.exp : '',
              },
              loading: false,
              roles: body,
            },
          });
          if (body) {
            if (body.length === 1 && !store.selectUserRole()) {
              store.doAuthUpdate(body[0].id);
            }
          }
        });
      }
    },

  doAuthUpdate:
    (id) =>
    ({ dispatch, apiGet, store }) => {
      store.doSetLoadingState(true);
      store.doSetLoadingMessage('Fetching user...');

      if (id) {
        const url = `/psapi/userRoleOffice/${id}`;

        apiGet(url, (_err, body) => {
          store.doSetLoadingState(false);
          store.doSetLoadingMessage('Loading...');
          dispatch({
            type: 'UPDATE_ROLES',
            payload: body,
          });
        });
        sessionStorage.setItem('isLoggedIn', true);
      } else {
        store.doSetLoadingState(false);
        store.doSetLoadingMessage('Loading...');
        dispatch({
          type: 'UPDATE_AUTH',
          payload: {
            token: null,
            authData: {
              role: {},
              fullName: null,
              userId: null,
              name: null,
              exp: null,
            },
            loading: false,
          },
        });
      }
    },

  selectAuth: (state) => state.auth,

  selectAuthLoggedIn: (state) => !!state.auth.token,

  selectAuthToken: (state) => state.auth.token,

  selectAuthData: (state) => state.auth.authData,

  selectUserRole: (state) => state.auth?.authData?.role,

  selectInitOptions: (state) => state.auth.initOptions,

  selectAuthRoles: (state) => state.auth.roles,
});

export default createAuthBundle;
