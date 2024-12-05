export const getLabelTextById = (id) => {
  const label = document.querySelector(
    `label.usa-label span[id="${id}_label"]`
  );
  const text = label?.textContent;

  return label ? text : undefined;
};
