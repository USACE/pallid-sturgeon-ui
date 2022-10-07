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
      species: [],
      ftPrefixes: [],
      mr: [],
      otolith: [],
      setsite1: [],
      setsite2: [],
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
        case 'DOMAIN_UPDATED_SPECIES':
          return { ...state, species: payload };
        case 'DOMAIN_UPDATED_FT_PREFIXES':
          return { ...state, ftPrefixes: payload };
        case 'DOMAIN_UPDATED_MR':
          return { ...state, mr: payload };
        case 'DOMAIN_UPDATED_OTOLITH':
          return { ...state, otolith: payload };
        case 'DOMAIN_UPDATED_SET_SITE_1':
          return { ...state, setsite1: payload };
        case 'DOMAIN_UPDATED_SET_SITE_2':
          return { ...state, setsite2: payload };
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
  selectDomainsSpecies: state => state.domains.species,
  selectDomainsFtPrefixes: state => state.domains.ftPrefixes,
  selectDomainsMr: state => state.domains.mr,
  selectDomainsOtolith: state => state.domains.otolith,
  selectDomainsSetSite1: state => state.domains.setsite1,
  selectDomainsSetSite2: state => state.domains.setsite2,

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

  doDomainsSpeciesFetch: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'DOMAIN_FETCH_SPECIES_START' });

    const url = `/psapi/species${queryFromObject(params)}`;

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'DOMAIN_UPDATED_SPECIES',
        payload: body,
      });
      dispatch({ type: 'DOMAIN_FETCH_SPECIES_FINISHED' });
    });
  },

  doDomainsFtPrefixesFetch: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'DOMAIN_FETCH_FT_PREFIXES_START' });

    const url = `/psapi/ftPrefix${queryFromObject(params)}`;

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'DOMAIN_UPDATED_FT_PREFIXES',
        payload: body,
      });
      dispatch({ type: 'DOMAIN_FETCH_FT_PREFIXES_FINISHED' });
    });
  },

  doDomainsMrFetch: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'DOMAIN_FETCH_MR_START' });

    const url = `/psapi/mr${queryFromObject(params)}`;

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'DOMAIN_UPDATED_MR',
        payload: body,
      });
      dispatch({ type: 'DOMAIN_FETCH_MR_FINISHED' });
    });
  },

  doDomainsOtolithFetch: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'DOMAIN_FETCH_OTOLITH_START' });

    const url = `/psapi/otolith${queryFromObject(params)}`;

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'DOMAIN_UPDATED_OTOLITH',
        payload: body,
      });
      dispatch({ type: 'DOMAIN_FETCH_OTOLITH_FINISHED' });
    });
  },

  doDomainsSetSite1Fetch: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'DOMAIN_FETCH_SET_SITE_1_START' });

    const url = `/psapi/setsite1${queryFromObject(params)}`;

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'DOMAIN_UPDATED_SET_SITE_1',
        payload: body,
      });
      dispatch({ type: 'DOMAIN_FETCH_SET_SITE_1_FINISHED' });
    });
  },

  doDomainsSetSite2Fetch: (params) => ({ dispatch, apiGet }) => {
    dispatch({ type: 'DOMAIN_FETCH_SET_SITE_2_START' });

    const url = `/psapi/setsite2${queryFromObject(params)}`;

    apiGet(url, (_err, body) => {
      dispatch({
        type: 'DOMAIN_UPDATED_SET_SITE_2',
        payload: body,
      });
      dispatch({ type: 'DOMAIN_FETCH_SET_SITE_2_FINISHED' });
    });
  },
};