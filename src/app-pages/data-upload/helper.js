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
  switch (action.type) {//Adding some filler text so it forces the process to update
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
  const keepAString = ["siteFid","mrFid","season","setdate","subsampleROrN","subsamplen","recorder","gear","gearType","structurenumber","usgs","riverstage","u1","u2","u3","u4","u5","u6","u7","macro","meso","habitatrn","qc","microStructure","structureFlow","structureMod","setSite_1","setSite_2","setSite_3","startTime","stopTime","watervel","comments","checkby","noTurbidity","noVelocity","editInitials","lastEditComment","fieldOffice"];
  if (typeof value === 'string' && value.length === 0){
    return null;
  } else if (isNumeric(value) && keepAString.indexOf(_header.toLowerCase()) === -1) {
    return Number(value);
  }

  return value;
};
//Adding some filler text so it forces the process to update