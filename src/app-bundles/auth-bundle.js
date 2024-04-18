import Keycloak from '../app-components/keycloak';
const keycloakUrl = process.env.REACT_APP_KEYCLOAK_URL;
const redirectUrl = process.env.REACT_APP_REDIRECT_URL;
const keycloakRealm = process.env.REACT_APP_KEYCLOAK_REALM;
const keycloakClient = process.env.REACT_APP_KEYCLOAK_CLIENT;

let keycloak = null;

const createAuthBundle = options => ({
  name: 'auth',

  getReducer: () => {
    const initialState = {
      loading: false,
      token: null,
      authData: null,
      sessionState: null,
      roles: [],
    };

    return (state = initialState, { type, payload }) => {
      switch (type) {
        case 'START_AUTH':
        case 'UPDATE_SESSION_STATE':
        case 'UPDATE_AUTH':
          return ({
            ...state,
            loading: payload.loading,
            token: payload.token,
            authData: {
              ...state.authData,
              ...payload.authData,
            },
            roles: payload.roles,
          });
        case 'UPDATE_ROLES':
          return ({
            ...state,
            authData: {
              ...state.authData,
              role: payload,
            }
          });
        default:
          return state;
      }
    };
  },

  init: store => {
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
      }
    });

    keycloak.checkForSession();
  },

  doAuthenticate: () => ({ dispatch, store }) => {
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

  doAuthLogout: () => ({ store }) => {
    store.doAuthUpdate(null);
  },

  doSessionStateUpdate: (sessionState) => ({ dispatch }) => {
    dispatch({
      type: 'UPDATE_SESSION_STATE',
      payload: {
        sessionState: sessionState,
      },
    });
  },

  doFetchAuthRoles: (accessToken) => ({ dispatch, apiGetWithToken, store }) => {
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
              exp: authInfo ? authInfo.exp : ''
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

  doAuthUpdate: (id) => ({ dispatch, apiGet, store }) => {
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
            exp: null
          },
          loading: false,
        },
      });
    }
  },

  selectAuth: state => state.auth,

  selectAuthLoggedIn: state => !!state.auth.token,

  selectAuthToken: state => state.auth.token,

  selectAuthData: state => state.auth.authData,

  selectUserRole: state => state.auth?.authData?.role,

  selectInitOptions: state => state.auth.initOptions,

  selectAuthRoles: state => state.auth.roles,
});

export default createAuthBundle;