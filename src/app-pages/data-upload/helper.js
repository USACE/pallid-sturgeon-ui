import { isNumeric } from 'utils';

export const getIsRequired = (key, files) => {
  switch(key) {
    case 'searchEffortFile':
      return !!files['telemetryFishFile'];
    case 'missouriRiverFile':
      return !!files['fishFile'];
    case 'fishFile':
      return !!files['supplemental'];
    case 'supplementalFile':
      return !!files['proceduresFile'];
    case 'proceduresFile':
    case 'telemetryFishFile':
    case 'siteFile':
    default:
      return false;
  }
};

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
  if (typeof value === "string" && value.length === 0){
    return null;
  } else if (isNumeric(value)) {
    return Number(value);
  }

  return value;
};