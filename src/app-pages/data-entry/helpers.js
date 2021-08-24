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

export const createBendsDropdownOptions = data => {
  if (!data) return [];

  return data.map(d => {
    const { description, id, lowerRiverMile, upperRiverMile } = d;

    if (!description) return null;

    return {
      value: id,
      text: `${description} - ${lowerRiverMile}/${upperRiverMile}`,
    };
  }).filter(e => e);
};