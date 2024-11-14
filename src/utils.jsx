export const classnames = (opts) => Object.keys(opts)
  .map((key) => !!opts[key] ? key : '')
  .join(' ');

export const classArray = (arr) => arr.filter(e => e).join(' ');

export const formatBytes = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return 'n/a';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

export const isNumeric = str => {
  if (typeof str != 'string') return false; // only process strings
  return !isNaN(str) &&                     // use type coercion to parse the entirety of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str));           // ...and ensure strings of whitespace fail
};

/**
 * Returns a provided string based on parameters provided
 * @param {string} single - The string to be returned if value is 1
 * @param {string} plural - The string to be returned if value is not 1
 * @param {number} value - Checked to determine which string to return;
 * @returns The single or plural string provided based on the value.
 */
export const pluralize = (single, plural, value) => {
  if (value === 1) return single;
  return plural;
};

export const keyAsText = key => {
  const words = key.substring(1).split(/(?=[A-Z])/).join(' ');
  return key.substring(0, 1).toUpperCase() + words;
};

export const hrefAsString = href => {
  const str = href.replace('/', '');
  const words = str.split('-');
  const upperWords = words.map(word => word.substring(0, 1).toUpperCase() + word.substring(1));
  
  return upperWords.join(' ');
};

export const queryFromObject = (obj = {}) => {
  const keys = Object.keys(obj);

  if (!keys.length) return '';

  const finalKeys = keys.filter(key => !!obj[key] || isNumeric(obj[key]));

  return `?${finalKeys.map(key => `${key}=${obj[key]}`).join('&')}`;
};

export const dropdownYearsToNow = (toYear = 2018) => {
  const thisYear = new Date().getFullYear();

  return [...new Array(thisYear - toYear)].map((_, i) => ({
    value: thisYear+1 - i,
  }));
};