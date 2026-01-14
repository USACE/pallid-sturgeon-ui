// eslint-disable-next-line no-control-regex
export const decimalNumberRegex = new RegExp(/^\d*(\.\d*)?$/);
export const emailRegex = new RegExp(/^[\w\-.+]+@([\w-]+\.)+[\w-]{2,}$/);
export const usPhoneRegex = new RegExp(/^\(\d{3}\) \d{3}-\d{4}$/);
export const countryCodeRegex = new RegExp(/^(?:[1-9]|[1-9]\d{1,2})$/);
export const phoneRegex = new RegExp(/^\d{3,18}$/);
export const phoneExtRegex = new RegExp(/^\d{0,6}$/);
export const addressRegex = new RegExp(/^[\wÀ-ž-.,'ʻ# ]+$/); // letters, numbers, diacritics, dashes, periods, commas, apostrophes, okina (hawaii), pound signs, and spaces
export const addressTwoRegex = new RegExp(/^[\wÀ-ž-.,'ʻ# ]*$/); // letters, numbers, diacritics, dashes, periods, commas, apostrophes, okina (hawaii), pound signs, and spaces
export const cityRegex = new RegExp(/[a-zA-ZÀ-ž-'ʻ ]{1,50}$/); // letters, diacritics, dashes, apostrophes, okina (hawaii), and spaces (1-50 characters)
export const zipCodeRegex = new RegExp(/^\d{5}$/);
export const parcelsRegex = new RegExp(/^(?!,)(?!.*,,)[^,]+(?:,[^,]+)*$|^$/);

export const ormRegex = new RegExp(
  '^(MVM|MVN|MVS|MVK|MVR|MVP|NAB|NAN|NAO|NAP|NAE|NWP|NWW|NWK|NWO|NWS|LRH|LRL|LRN|LRP|LRB|LRC|LRE|POH|POA|SAJ|SAC|SAM|SAS|SAW|SPL|SPK|SPN|SPA|SWF|SWG|SWL|SWT|SAA)-' +
    '(19[0-9]{2}|2[0-9]{3})-' + // Matches any year from 1900 to 2999
    '([0-9]{1,6})' + // Matches a sequence of 1 to 6 digits
    '(-[A-Za-z0-9]{1,5})?$', // Makes the final 1 to 5 alphanumeric characters optional
  'i' // Case-insensitive matching
);
export const latlongRegex = new RegExp('^-?([0-9]{1,2}|1[0-7][0-9]|180)(.[0-9]{6,})$');
export const latRegex = /^[+-]?([0-8]?[0-9]\.\d{6,}|90\.0{6,})$/;
export const lngRegex = /^[+-]?(([0-9]?[0-9]|1[0-7][0-9])\.\d{6,}|180\.0{6,})$/;

export const numberRegex = new RegExp('^\\d+(\\.\\d+)?$');
export const projectAreaRegex = new RegExp(/^(\d+(\.\d+)?|\.\d+)$/);
export const tagValueRegex = new RegExp(/^[A-Za-z0-9-. +@=:/_]*$/);
export const filenameRegex = new RegExp(/^[A-Za-z0-9-! _.'()&$@=;+,]*$/);
export const integerRegex = new RegExp(/^\d*$/);
export const setNumberValue = (value, isInt = true) => {
  if (value === undefined || value === null || value === 0) return null;

  const valueInt = parseInt(value);
  const maxIntValue = 2147483647;

  if (isInt === false) {
    return value;
  }
  if (!isNaN(valueInt) && valueInt > maxIntValue) {
    let strValue = value?.toString();
    strValue = strValue?.substr(0, strValue?.length - 1);
    return parseInt(strValue);
  } else return valueInt;
};
export const handleIntegerChange = (event) => {
  const value = event?.target?.value;

  const valueInt = parseInt(value);
  const maxIntValue = 2147483647;
  if (!isNaN(valueInt) && valueInt > maxIntValue) {
    let strValue = value.toString();
    strValue = strValue?.substr(0, strValue?.length - 1);
    event.target.value = parseInt(strValue);
  }
};
