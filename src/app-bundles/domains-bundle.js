export default {
  name: 'domains',

  getReducer: () => {
    const initialData = {
      projects: [],
      seasons: [],
      segments: [],
      bends: [],
      fieldOffices: [],
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case 'DOMAIN_UPDATED_PROJECTS':
          return { ...state, projects: payload };
        case 'DOMAIN_UPDATED_SEASONS':
          return { ...state, seasons: payload };
        case 'DOMAIN_UPDATED_SEGMENTS':
          return { ...state, segments: payload };
        case 'DOMAIN_UPDATED_BENDS':
          return { ...state, bends: payload };
        case 'DOMAIN_UPDATED_FIELD_OFFICES':
          return { ...state, fieldOffices: payload };
        default:
          return state;
      }
    };
  },

  selectDomains: state => state.domains,
  selectDomainsProjects: state => state.domains.projects,
  selectDomainsSeasons: state => state.domains.seasons,
  selectDomainsSegments: state => state.domains.segments,
  selectDomainsBends: state => state.domains.bends,
  selectDomainsFieldOffices: state => state.domains.fieldOffices,

  doDomainProjectsFetch: () => ({ dispatch, apiGet }) => {
    dispatch({ type: 'DOMAIN_FETCH_PROJECTS_START' });

    const url = '/psapi/projects';

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'DOMAIN_UPDATED_PROJECTS',
        payload: body,
      });
      dispatch({ type: 'DOMAIN_FETCH_PROJECTS_FINISHED' });
    });
  },

  doDomainSeasonsFetch: () => ({ dispatch, apiGet }) => {
    dispatch({ type: 'DOMAIN_FETCH_SEASONS_START' });

    const url = '/psapi/seasons';

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'DOMAIN_UPDATED_SEASONS',
        payload: body,
      });
      dispatch({ type: 'DOMAIN_FETCH_SEASONS_FINISHED' });
    });
  },

  doDomainSegmentsFetch: () => ({ dispatch, apiGet }) => {
    dispatch({ type: 'DOMAIN_FETCH_SEGMENTS_START' });

    const url = '/psapi/segments';

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'DOMAIN_UPDATED_SEGMENTS',
        payload: body,
      });
      dispatch({ type: 'DOMAIN_FETCH_SEGMENTS_FINISHED' });
    });
  },

  doDomainBendsFetch: () => ({ dispatch, apiGet }) => {
    dispatch({ type: 'DOMAIN_FETCH_BENDS_START' });

    const url = '/psapi/bends';

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'DOMAIN_UPDATED_BENDS',
        payload: body,
      });
      dispatch({ type: 'DOMAIN_FETCH_BENDS_FINISHED' });
    });
  },

  doDomainFieldOfficesFetch: () => ({ dispatch, apiGet }) => {
    dispatch({ type: 'DOMAIN_FETCH_FIELD_OFFICES_START' });

    const url = '/psapi/fieldOffices';

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'DOMAIN_UPDATED_FIELD_OFFICES',
        payload: body,
      });
      dispatch({ type: 'DOMAIN_FETCH_FIELD_OFFICES_FINISHED' });
    });
  },
};
