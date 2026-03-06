// eslint-disable-next-line no-control-regex
export const decimalNumberRegex = new RegExp(/^\d*(\.\d*)?$/);

export const latlongRegex = new RegExp('^-?([0-9]{1,2}|1[0-7][0-9]|180)(.[0-9]{6,})$');
export const latRegex = /^[+-]?([0-8]?[0-9]\.\d{6,}|90\.0{6,})$/;
export const lngRegex = /^[+-]?(([0-9]?[0-9]|1[0-7][0-9])\.\d{6,}|180\.0{6,})$/;

export const numberRegex = new RegExp('^\\d+(\\.\\d+)?$');
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
