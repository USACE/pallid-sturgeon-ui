export const createProjectOptions = state => {
  const { projects } = state;

  if (!projects) return [];

  return projects.map(project => {
    const { code, description } = project;

    return {
      value: code,
      text: description,
    };
  });
};

export const createSeasonOptions = state => {
  const { seasons } = state;

  if (!seasons) return [];

  return seasons.map(season => {
    const { code, description } = season;

    return {
      value: code,
      text: description,
    };
  });
};
