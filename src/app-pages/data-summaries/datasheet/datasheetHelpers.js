export const createDropdownOptions = data => {
  if (!data) return [];

  return data.map(d => {
    const { code, description } = d;

    return {
      value: code,
      text: description,
    };
  });
};
