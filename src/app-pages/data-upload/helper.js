import { isNumeric } from 'utils';

export const requiredFiles = {
  '4.0.4': ['siteFile', 'searchEffortFile', 'telemetryFishFile', 'missouriRiverFile', 'fishFile', 'supplementalFile', 'proceduresFile'],
  '3.7.1': ['siteFile', 'missouriRiverFile', 'fishFile', 'supplementalFile'],
};

export const getIsRequired = (key, version) => version ? requiredFiles[version].includes(key) : false;

export const reduceCsvState = (state, action) => {
  switch (action.type) {
    case 'update':
      return {
        ...state,
        [action.key]: action.data,
      };
    default:
      throw new Error();
  }
};

export const formatJsonKey = (key = '', _index) => {
  const str = key.toLowerCase();
  const words = str.split('_');

  return words.map((word, i) => {
    if (!i) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join('');
};

export const formatAsNumber = (value, _header) => {
  if (isNumeric(value)) {
    return Number(value);
  }

  return value;
};