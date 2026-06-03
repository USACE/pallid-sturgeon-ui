import { ApiStatuses } from '@src/utils/enums';

const rootUrl = '/psapi/Lookup/';

const lookupBundle = {
  name: 'lookup',

  getReducer: () => {
    const initialState = {
      bendSelections: [],
      bendRiverMile: [],
      chutes: [],
      estimations: [],
      fieldOffices: [],
      fieldOfficeSegments: [],
      filteredGearCodes: [],
      fishCodes: [],
      fishStructures: [],
      floyTagPrefixes: [],
      gearCodes: [],
      gearTypes: [],
      lengthTypes: [],
      macros: [],
      mesos: [],
      macroMesos: [],
      markRecaptureOptions: [],
      microSetSite: [],
      microStructures: [],
      microHabitats: [],
      projects: [],
      reach: [],
      sampleUnitTypes: [],
      seasons: [],
      segments: [],
      setSite1Options: [],
      setSite2Options: [],
      setSite3Options: [],
      structureFlows: [],
      structureMods: [],
      subsampleTypes: [],
      u6Options: [],
      u7Options: [],
      years: [],
      frequencyId: [],
      spawnBehavior: [],
      positionConfidence: [],
      searchTypeCodes: [],
      pitRnzOptions: [],
      elastomerColorOptions: [],
      elastomerHvxOptions: [],
      pallidLocationStatusOptions: [],
      hatcheryOriginOptions: [],
      purposeOptions: [],
      evalLocationOptions: [],
      sexOptions: [],
      reproductiveStatusOptions: [],
      yesNoOptions: [],
    };

    return (state = initialState, { type, payload }) => {
      switch (type) {
        case 'UPDATE_ALL_LOOKUP':
          return {
            ...state,
            ...payload,
          };
        default:
          return state;
      }
    };
  },

  selectLookupData: (state) => state.lookup,

  doGetAllLookupData:
    () =>
    ({ dispatch, apiGet }) => {
      const url = `${rootUrl}getAllLookups`;
      apiGet(url, (err, body) => {
        if (!err && body?.status === ApiStatuses.Success) {
          dispatch({ type: 'UPDATE_ALL_LOOKUP', payload: body?.data });
        } else {
          dispatch({ type: 'LOOKUP_FETCH_ERROR', payload: err });
        }
      });
    },
};
export default lookupBundle;
