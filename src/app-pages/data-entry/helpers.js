export const projectMap = {
  1: 'PSPA',
  2: 'HAMP',
};

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
    const { description, sampleUnit } = d;

    if (!description) return null;

    return {
      value: sampleUnit,
      text: description,
    };
  }).filter(e => e);
};

export const createRolesDropdownOptions = data => {
  if (!data) return [];

  return data.data.map(opt => ({
    text: opt.description,
    value: opt.id,
  }));
};

export const createFieldOfficeIdDropdownOptions = data => {
  if (!data) return [];

  return data.map(d => {
    const { id, description } = d;

    return {
      value: id,
      text: description,
    };
  });
};

export const createProjectDropdownOptions = data => {
  if (!data) return [];

  return data.data.map(opt => ({
    text: opt.description,
    value: opt.code,
  }));
};

export const createMesoOptions = data => {
  if (!data) return [];

  return data.map(opt => ({
    text: opt.code,
    value: opt.code,
  }));
};

export const createStructureFlowOptions = data => {
  if (!data) return [];

  return data.map(opt => ({
    text: opt.code,
    value: opt.id,
  }));
};

export const createStructureModOptions = data => {
  if (!data) return [];

  return data.map(opt => ({
    text: opt.description,
    value: opt.code,
  }));
};

export const createAccountsOptions = data => {
  if (!data) return [];

  return data.map(opt => ({
    text: opt.role + ' - Field Office: ' + opt.officeCode + ' - Project: ' + opt.projectCode + ' - ' + projectMap[opt.projectCode],
    value: opt.id,
  }));
};

export const createUsersOptions = data => {
  if (!data) return [];

  return data.map(opt => ({
    text: opt.firstName + ' ' + opt.lastName + ' (' + opt.userName + ')',
    value: opt.userId,
  }));
};

export const createCustomCodeDropdownOptions = data => {
  if (!data) return [];

  return data.map(d => {
    const { code, description } = d;
    return {
      value: code,
      text: `${code} - ${description}`,
    };
  });
};