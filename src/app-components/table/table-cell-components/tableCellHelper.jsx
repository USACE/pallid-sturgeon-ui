export const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const hasValueChanged = (prevValue, newValue) => {
  if (prevValue === null && newValue === null) return false;
  if (prevValue === undefined && newValue === undefined) return false;
  return prevValue !== newValue;
};
