import { queryFromObject } from 'utils';

export default {
  name: 'domains',

  getReducer: () => {
    const initialData = {
      projects: [],
      seasons: [],
      segments: [],
      bends: [],
      fieldOffices: [],
      sampleUnitTypes: [],
      bendRn: [],
      meso: [],
      structureFlow: [],
      structureMod: [],
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
        case 'DOMAIN_UPDATED_BENDRN':
          return { ...state, bendRn: payload };
        case 'DOMAIN_UPDATED_FIELD_OFFICES':
          return { ...state, fieldOffices: payload };
        case 'DOMAIN_UPDATED_SAMPLE_UNIT_TYPES':
          return { ...state, sampleUnitTypes: payload };
        case 'DOMAIN_UPDATED_MESO':
          return { ...state, meso: payload };
        case 'DOMAIN_UPDATED_STRUCTURE_FLOW':
          return { ...state, structureFlow: payload };
        case 'DOMAIN_UPDATED_STRUCTURE_MOD':
          return { ...state, structureMod: payload };
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
  selectDomainsBendRn: state => state.domains.bendRn,
  selectDomainsFieldOffices: state => state.domains.fieldOffices,
  selectDomainsSampleUnitTypes: state => state.domains.sampleUnitTypes,
  selectDomainsMeso: state => state.domains.meso,
  selectDomainsStructureFlow: state => state.domains.structureFlow,
  selectDomainsStructureMod: state => state.domains.structureMod,

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

  doDomainBendRnFetch: () => ({ dispatch, apiGet }) => {
    dispatch({ type: 'DOMAIN_FETCH_BENDRN_START' });

    const url = '/psapi/bendRn';

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'DOMAIN_UPDATED_BENDRN',
        payload: body,
      });
      dispatch({ type: 'DOMAIN_FETCH_BENDRN_FINISHED' });
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

  doDomainSampleUnitTypesFetch: () => ({ dispatch, apiGet }) => {
    dispatch({ type: 'DOMAIN_FETCH_SAMPLE_UNIT_TYPES_START' });

    const url = '/psapi/sampleUnitTypes';

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'DOMAIN_UPDATED_SAMPLE_UNIT_TYPES',
        payload: body,
      });
      dispatch({ type: 'DOMAIN_FETCH_SAMPLE_UNIT_TYPES_FINISHED' });
    });
  },

  doDomainsMesoFetch: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'DOMAIN_FETCH_MESO_START' });

    const url = `/psapi/meso${queryFromObject(params)}`;

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'DOMAIN_UPDATED_MESO',
        payload: body,
      });
      dispatch({ type: 'DOMAIN_FETCH_MESO_FINISHED' });
    });
  },

  doDomainsStructureFlowFetch: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'DOMAIN_FETCH_STRUCTURE_FLOW_START' });

    const url = `/psapi/structureFlow${queryFromObject(params)}`;

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'DOMAIN_UPDATED_STRUCTURE_FLOW',
        payload: body,
      });
      dispatch({ type: 'DOMAIN_FETCH_STRUCTURE_FLOW_FINISHED' });
    });
  },

  doDomainsStructureModFetch: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'DOMAIN_FETCH_STRUCTURE_MOD_START' });

    const url = `/psapi/structureMod${queryFromObject(params)}`;

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'DOMAIN_UPDATED_STRUCTURE_MOD',
        payload: body,
      });
      dispatch({ type: 'DOMAIN_FETCH_STRUCTURE_MOD_FINISHED' });
    });
  },
};
