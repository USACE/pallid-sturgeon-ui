export const getLabelTextById = (id) => {
  const label = document.querySelector(`label.usa-label span[id="${id}_label"]`);
  const text = label?.textContent;

  return label ? text : undefined;
};

export const formatDate = (dateStr) => {
  const subStr = 'T';
  if (dateStr.includes(subStr)) {
    return dateStr.split('T')[0];
  }
  return dateStr;
};

export const defaultColDef = { width: 150, sortable: true, unSortIcon: true };
