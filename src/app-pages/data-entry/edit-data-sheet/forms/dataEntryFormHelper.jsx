export const createDropdownOptions = (data) => {
  if (!data) return [];

  return data.map((item) => {
    const { code, description } = item;

    return {
      value: code,
      text: description,
    };
  });
};

export const fmtTimeHHMMSS = (val) => {
  const date = val ? new Date(val) : new Date();

  if (Number.isNaN(date.getTime())) {
    console.error('Invalid date:', val);
    return '';
  }

  const hh = String(date).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};

export const generateFieldId = (queueLength = 0) => {
  const now = new Date();

  const date =
    now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');

  const time =
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0') +
    String(now.getMilliseconds()).padStart(3, '0');

  const sequence = String(queueLength + 1).padStart(3, '0');

  return `${date}-${time}-${sequence}`;
};
