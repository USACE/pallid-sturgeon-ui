const formatNumber = number => {
  if (number === undefined || number === null || number === '') return '';
  return Math.floor(number)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

export const percentageFormatter = params => {
  const { value } = params;
  if (value === undefined || value === null || value === '') return '';
  return `${value} %`;
};

export const nameFormatter = params => {
  const { value } = params;

  if (!value) return '';

  return value.replace(',', ', ');
};

export const dateFormatter = date => date ? date.split('T')[0] : '';

export const rowDataGetter = params => params.data;