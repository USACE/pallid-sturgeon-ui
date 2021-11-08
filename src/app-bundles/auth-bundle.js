import Keycloak from '../app-components/keycloak';
const keycloakUrl = process.env.REACT_APP_KEYCLOAK_URL;
const redirectUrl = process.env.REACT_APP_REDIRECT_URL;
const keycloakRealm = process.env.REACT_APP_KEYCLOAK_REALM;
const keycloakClient = process.env.REACT_APP_KEYCLOAK_CLIENT;

let keycloak = null;

export default {
  name: 'auth',

  getReducer: () => {
    const initialState = {
      loading: false,
      token: null,
      authData: null,
      sessionState: null,
    };

    return (state = initialState, { type, payload }) => {
      switch (type) {
        case 'START_AUTH':
        case 'UPDATE_SESSION_STATE':
        case 'UPDATE_AUTH':
          return ({ ...state, ...payload });
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
      refreshInterval: 30,
      sessionEndWarning: 120,
      onAuthenticate: (token) => {
        store.doAuthUpdate(token);
      },
      onRedirect: (sessionState) => {
        store.doSessionStateUpdate(sessionState);
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
    dispatch({
      type: 'START_AUTH',
      payload: {
        loading: true,
      },
    });
    keycloak.authenticate();
  },

  doAuthLogout: () => ({ dispatch, store }) => {
    store.doAuthUpdate(null);
  },

  doSessionStateUpdate: (sessionState) => ({ dispatch, store }) => {
    dispatch({
      type: 'UPDATE_SESSION_STATE',
      payload: {
        sessionState: sessionState,
      },
    });
  },

  doAuthUpdate: (accessToken) => ({ dispatch, apiGetWithToken }) => {
    const authInfo = accessToken ? JSON.parse(atob(accessToken.split('.')[1])) : null;

    if (authInfo) {
      const url = `/psapi/userRoleOffice/${authInfo.email}`;

      apiGetWithToken(url, accessToken, (_err, body) => {
        dispatch({
          type: 'UPDATE_AUTH',
          payload: {
            token: accessToken,
            authData: {
              role: body,
              fullName: authInfo ? authInfo.name : '',
              userId: authInfo ? Number(authInfo.sub) : '',
              name: authInfo && authInfo.name ? authInfo.name.split('.')[0] : '',
              exp: authInfo ? authInfo.exp : ''
            },
            loading: false,
          },
        });
      });
    } else {
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

  selectUserRole: state => state.auth.authData.role,

  selectInitOptions: state => state.auth.initOptions,
}; 
