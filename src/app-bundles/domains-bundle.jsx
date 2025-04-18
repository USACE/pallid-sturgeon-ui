import { queryFromObject } from '@src/utils';

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
      years: [],
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
        case 'DOMAIN_UPDATED_YEARS':
          return { ...state, years: payload };
        default:
          return state;
      }
    };
  },

  selectDomains: (state) => state.domains,
  selectDomainsProjects: (state) => state.domains.projects,
  selectDomainsSeasons: (state) => state.domains.seasons,
  selectDomainsSegments: (state) => state.domains.segments,
  selectDomainsBends: (state) => state.domains.bends,
  selectDomainsBendRn: (state) => state.domains.bendRn,
  selectDomainsFieldOffices: (state) => state.domains.fieldOffices,
  selectDomainsSampleUnitTypes: (state) => state.domains.sampleUnitTypes,
  selectDomainsMeso: (state) => state.domains.meso,
  selectDomainsStructureFlow: (state) => state.domains.structureFlow,
  selectDomainsStructureMod: (state) => state.domains.structureMod,
  selectDomainsSpecies: (state) => state.domains.species,
  selectDomainsFtPrefixes: (state) => state.domains.ftPrefixes,
  selectDomainsMr: (state) => state.domains.mr,
  selectDomainsOtolith: (state) => state.domains.otolith,
  selectDomainsSetSite1: (state) => state.domains.setsite1,
  selectDomainsSetSite2: (state) => state.domains.setsite2,
  selectDomainsYears: (state) => state.domains.years,

  doDomainProjectsFetch:
    (filter = true) =>
    ({ dispatch, apiGet, store }) => {
      const id = store.selectUserRole()?.id;
      const project = store.selectUserRole()?.projectCode;

      const url =
        '/psapi/projects?' +
        new URLSearchParams({
          id: id,
        });
      const urlFilter =
        '/psapi/projectsFilter?' +
        new URLSearchParams({
          project: project,
        });

      apiGet(filter === true ? urlFilter : url, (_err, body) => {
        if(!_err && body.status) {
        dispatch({
          type: 'DOMAIN_UPDATED_PROJECTS',
          payload: body?.data,
        });
        dispatch({ type: 'DOMAIN_FETCH_PROJECTS_FINISHED' });
      } else {
        dispatch({ type: 'DOMAIN_PROJECTS_FETCH_ERROR', payload: _err });
      }
      });
    },

  doDomainSeasonsFetch:
    (year = null) =>
    ({ dispatch, apiGet, store }) => {
      const project = store.selectUserRole()?.projectCode;
      const office = store.selectUserRole()?.officeCode;

      const params = {
        office: office,
        project: project,
      };

      const url =
        '/psapi/seasons?' +
        new URLSearchParams(year === null ? params : { ...params, year: year });

      apiGet(url, (_err, body) => {
        if(!_err && body.status) {
        dispatch({
          type: 'DOMAIN_UPDATED_SEASONS',
          payload: body?.data,
        });
        dispatch({ type: 'DOMAIN_FETCH_SEASONS_FINISHED' });
      } else {
        dispatch({ type: 'DOMAIN_FETCH_SEASONS_ERROR', payload: _err });
      }
      });
    },

  doDomainSegmentsFetch:
    () =>
    ({ dispatch, apiGet, store }) => {
      const fieldOffice = store.selectUserRole()?.officeCode;
      const project = store.selectUserRole()?.projectCode;

      const url =
        '/psapi/segments?' +
        new URLSearchParams({
          office: fieldOffice,
          project: project,
        });

      apiGet(url, (_err, body) => {
        if (!_err && body.status) {
        dispatch({
          type: 'DOMAIN_UPDATED_SEGMENTS',
          payload: body?.data,
        });
        dispatch({ type: 'DOMAIN_FETCH_SEGMENTS_FINISHED' });
      } else {
        dispatch({ type: 'DOMAIN_FETCH_SEGMENTS_ERROR', payload: _err });
      }
      });
    },

  doDomainBendsFetch:
    (params) =>
    ({ dispatch, apiGet }) => {
      dispatch({ type: 'DOMAIN_FETCH_BENDS_START' });

      const url = `/psapi/sampleUnit${queryFromObject(params)}`;

      apiGet(url, (_err, body) => {
        if(!_err && body.status) {
        dispatch({
          type: 'DOMAIN_UPDATED_BENDS',
          payload: body?.data,
        });
        dispatch({ type: 'DOMAIN_FETCH_BENDS_FINISHED' });
      } else {
        dispatch({ type: 'DOMAIN_FETCH_BENDS_ERROR', payload: _err });
      }
      });
    },

  doDomainBendRnFetch:
    () =>
    ({ dispatch, apiGet }) => {
      dispatch({ type: 'DOMAIN_FETCH_BENDRN_START' });

      const url = '/psapi/bendRn';

      apiGet(url, (_err, body) => {
        if(!_err && body.status) {
        dispatch({
          type: 'DOMAIN_UPDATED_BENDRN',
          payload: body?.data,
        });
        dispatch({ type: 'DOMAIN_FETCH_BENDRN_FINISHED' });
      } else {
        dispatch({ type: 'DOMAIN_FETCH_BENDRN_ERROR', payload: _err });
      }
      });
    },

  doDomainFieldOfficesFetch:
    (params) =>
    ({ dispatch, apiGet }) => {
      dispatch({ type: 'DOMAIN_FETCH_FIELD_OFFICES_START' });

      const url = `/psapi/fieldOffices${queryFromObject(params)}`;

      apiGet(url, (_err, body) => {
        if(!_err && body.status) {
        dispatch({
          type: 'DOMAIN_UPDATED_FIELD_OFFICES',
          payload: body?.data,
        });
        dispatch({ type: 'DOMAIN_FETCH_FIELD_OFFICES_FINISHED' });
      } else {
        dispatch({ type: 'DOMAIN_FETCH_FIELD_OFFICES_ERROR', payload: _err });
      }
      });
    },

  doDomainSampleUnitTypesFetch:
    () =>
    ({ dispatch, apiGet }) => {
      dispatch({ type: 'DOMAIN_FETCH_SAMPLE_UNIT_TYPES_START' });

      const url = '/psapi/sampleUnitTypes';

      apiGet(url, (_err, body) => {
        if(!_err && body.status) {
        dispatch({
          type: 'DOMAIN_UPDATED_SAMPLE_UNIT_TYPES',
          payload: body?.data,
        });
        dispatch({ type: 'DOMAIN_FETCH_SAMPLE_UNIT_TYPES_FINISHED' });
      } else {
        dispatch({ type: 'DOMAIN_FETCH_SAMPLE_UNIT_TYPES_ERROR', payload: _err });
      }
      });
    },

  doDomainsMesoFetch:
    (params) =>
    ({ dispatch, apiGet }) => {
      dispatch({ type: 'DOMAIN_FETCH_MESO_START' });

      const url = `/psapi/meso${queryFromObject(params)}`;

      apiGet(url, (_err, body) => {
        if(!_err && body.status) {
        dispatch({
          type: 'DOMAIN_UPDATED_MESO',
          payload: body?.data,
        });
        dispatch({ type: 'DOMAIN_FETCH_MESO_FINISHED' });
      } else {
        dispatch({ type: 'DOMAIN_FETCH_MESO_ERROR', payload: _err });
      }
      });
    },

  doDomainsStructureFlowFetch:
    (params) =>
    ({ dispatch, apiGet }) => {
      dispatch({ type: 'DOMAIN_FETCH_STRUCTURE_FLOW_START' });

      const url = `/psapi/structureFlow${queryFromObject(params)}`;

      apiGet(url, (_err, body) => {
        if(!_err && body.status) {
        dispatch({
          type: 'DOMAIN_UPDATED_STRUCTURE_FLOW',
          payload: body?.data,
        });
        dispatch({ type: 'DOMAIN_FETCH_STRUCTURE_FLOW_FINISHED' });
      } else {
        dispatch({ type: 'DOMAIN_FETCH_STRUCTURE_FLOW_ERROR', payload: _err });
      }
      });
    },

  doDomainsStructureModFetch:
    (params) =>
    ({ dispatch, apiGet }) => {
      dispatch({ type: 'DOMAIN_FETCH_STRUCTURE_MOD_START' });

      const url = `/psapi/structureMod${queryFromObject(params)}`;

      apiGet(url, (_err, body) => {
        if(!_err && body.status) {
        dispatch({
          type: 'DOMAIN_UPDATED_STRUCTURE_MOD',
          payload: body?.data,
        });
        dispatch({ type: 'DOMAIN_FETCH_STRUCTURE_MOD_FINISHED' });
      } else {
        dispatch({ type: 'DOMAIN_FETCH_STRUCTURE_MOD_ERROR', payload: _err });
      }
      });
    },

  doDomainsSpeciesFetch:
    (params) =>
    ({ dispatch, apiGet }) => {
      dispatch({ type: 'DOMAIN_FETCH_SPECIES_START' });

      const url = `/psapi/species${queryFromObject(params)}`;

      apiGet(url, (_err, body) => {
        if(!_err && body.status) {
        dispatch({
          type: 'DOMAIN_UPDATED_SPECIES',
          payload: body?.data,
        });
        dispatch({ type: 'DOMAIN_FETCH_SPECIES_FINISHED' });
      } else {
        dispatch({ type: 'DOMAIN_FETCH_SPECIES_ERROR', payload: _err });
      }
      });
    },

  doDomainsFtPrefixesFetch:
    (params) =>
    ({ dispatch, apiGet }) => {
      dispatch({ type: 'DOMAIN_FETCH_FT_PREFIXES_START' });

      const url = `/psapi/ftPrefix${queryFromObject(params)}`;

      apiGet(url, (_err, body) => {
        if (!_err && body.status) {
        dispatch({
          type: 'DOMAIN_UPDATED_FT_PREFIXES',
          payload: body?.data,
        });
        dispatch({ type: 'DOMAIN_FETCH_FT_PREFIXES_FINISHED' });
      } else {
        dispatch({ type: 'DOMAIN_FETCH_FT_PREFIXES_ERROR', payload: _err });
      }
      });
    },

  doDomainsMrFetch:
    (params) =>
    ({ dispatch, apiGet }) => {
      dispatch({ type: 'DOMAIN_FETCH_MR_START' });

      const url = `/psapi/mr${queryFromObject(params)}`;

      apiGet(url, (_err, body) => {
        if(!_err && body.status) {
        dispatch({
          type: 'DOMAIN_UPDATED_MR',
          payload: body?.data,
        });
        dispatch({ type: 'DOMAIN_FETCH_MR_FINISHED' });
      } else {
        dispatch({ type: 'DOMAIN_FETCH_MR_ERROR', payload: _err });
      }
      });
    },

  doDomainsOtolithFetch:
    (params) =>
    ({ dispatch, apiGet }) => {
      dispatch({ type: 'DOMAIN_FETCH_OTOLITH_START' });

      const url = `/psapi/otolith${queryFromObject(params)}`;

      apiGet(url, (_err, body) => {
        if(!_err && body.status) {
        dispatch({
          type: 'DOMAIN_UPDATED_OTOLITH',
          payload: body?.data,
        });
        dispatch({ type: 'DOMAIN_FETCH_OTOLITH_FINISHED' });
      } else {
        dispatch({ type: 'DOMAIN_FETCH_OTOLITH_ERROR', payload: _err });
      }
      });
    },

  doDomainsSetSite1Fetch:
    (params) =>
    ({ dispatch, apiGet }) => {
      dispatch({ type: 'DOMAIN_FETCH_SET_SITE_1_START' });

      const url = `/psapi/setsite1${queryFromObject(params)}`;

      apiGet(url, (_err, body) => {
        if(!_err && body.status) {
        dispatch({
          type: 'DOMAIN_UPDATED_SET_SITE_1',
          payload: body?.data,
        });
        dispatch({ type: 'DOMAIN_FETCH_SET_SITE_1_FINISHED' });
      } else {
        dispatch({ type: 'DOMAIN_FETCH_SET_SITE_1_ERROR', payload: _err });
      }
      });
    },

  doDomainsSetSite2Fetch:
    (params) =>
    ({ dispatch, apiGet }) => {
      dispatch({ type: 'DOMAIN_FETCH_SET_SITE_2_START' });

      const url = `/psapi/setsite2${queryFromObject(params)}`;

      apiGet(url, (_err, body) => {
        if(!_err && body.status) {
        dispatch({
          type: 'DOMAIN_UPDATED_SET_SITE_2',
          payload: body?.data,
        });
        dispatch({ type: 'DOMAIN_FETCH_SET_SITE_2_FINISHED' });
      } else {
        dispatch({ type: 'DOMAIN_FETCH_SET_SITE_2_ERROR', payload: _err });
      }
      });
    },

  doDomainsYearsFetch:
    () =>
    ({ dispatch, apiGet }) => {
      dispatch({ type: 'DOMAIN_FETCH_YEARS_START' });

      const url = '/psapi/years';

      apiGet(url, (_err, body) => {
        if(!_err && body.status) {
        dispatch({
          type: 'DOMAIN_UPDATED_YEARS',
          payload: body?.data,
        });
        dispatch({ type: 'DOMAIN_FETCH_YEARS_FINISHED' });
      } else {
        dispatch({ type: 'DOMAIN_FETCH_YEARS_ERROR', payload: _err });
      }
      });
    },
};
