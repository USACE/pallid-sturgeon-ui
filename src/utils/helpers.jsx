export const getLabelTextById = (id) => {
  const label = document.querySelector(`label.usa-label span[id="${id}_label"]`);
  const text = label?.textContent;

  return label ? text : undefined;
};

export const formatDate = (dateStr) => {
  const subStr = 'T';
  if (!dateStr) return;
  if (dateStr?.includes(subStr)) {
    return dateStr.split('T')[0];
  }
  return dateStr;
};

export const filterNullEmptyObjects = (data) => {
  if (Array.isArray(data)) {
    // Handle array elements recursively
    const filteredArray = data
      .map((item) => filterNullEmptyObjects(item))
      .filter(
        (item) =>
          !(typeof item === 'object' && item !== null && Object.keys(item).length === 0) &&
          item !== '' &&
          item !== undefined
      );
    // Return null if array is empty after filtering
    return filteredArray.length > 0 && filteredArray.some((obj) => obj !== undefined && obj !== null)
      ? filteredArray
      : null;
  } else if (typeof data === 'object' && data !== null) {
    // Create a new object for filtered properties if input is an object
    const newObj = {};
    Object.keys(data).forEach((key) => {
      const value = data[key];
      const filteredValue = filterNullEmptyObjects(value);
      if (typeof filteredValue === 'object') {
        if (filteredValue !== null && Object.keys(filteredValue).length !== 0) {
          newObj[key] = filteredValue;
        }
      } else if (filteredValue !== '' && filteredValue !== null && filteredValue !== undefined) {
        newObj[key] = filteredValue;
      }
    });
    // Return null if the object is empty after filtering
    return Object.keys(newObj).length > 0 ? newObj : undefined;
  } else {
    // Return the data directly if it is not an object or array
    return data !== '' && data !== undefined && JSON.stringify(data) !== 'null' ? data : null;
  }
};

export const formatCoordFlt = (coord) => coord && parseFloat(Number(coord).toFixed(5));

export const formatCoordStr = (coord) => coord && Number(coord).toFixed(7);
