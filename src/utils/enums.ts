export const enum FieldOfficeStrings {
  ZZ = 'All',
  MI = 'MI - Missouri Department of Conservation Missisippi River',
  KC = 'KC - USACE Kansas City District',
  IA = 'IA - Iowa Department of Natural Resources',
  MT = 'MT - Montana Fish Wildlife and Parks',
  MR = 'MR - Missouri River FWMAO',
  GP = 'GP - Great plains FWMAO',
  SD = 'SD - Yankton FWMAO',
  NE = 'NE - Nebraska Game and Parks Commission',
  MO = 'MO - Missouri Department of Conservation',
  CF = 'CF - Columbia Fishery Resource Office',
}

export const fieldOfficeTypes = {
  ZZ: FieldOfficeStrings.ZZ,
  MI: FieldOfficeStrings.MI,
  KC: FieldOfficeStrings.KC,
  IA: FieldOfficeStrings.IA,
  MT: FieldOfficeStrings.MT,
  MR: FieldOfficeStrings.MR,
  GP: FieldOfficeStrings.GP,
  SD: FieldOfficeStrings.SD,
  NE: FieldOfficeStrings.NE,
  MO: FieldOfficeStrings.MO,
  CF: FieldOfficeStrings.CF,
};

export const enum ProjectStrings {
  PSPA = '1 - Pallid Sturgeon Population Assessment',
  HAMP = '2 - Habitat Assessment Program',
  Chute = '3 - Chute Study - Mitigation Project',
  SRE = '4 - Spring Rise Evaluatio',
  Dalby = '5 - Dalbey Bottoms',
  FR = '6 - Focused Research',
}

export const projectTypes = {
  1: ProjectStrings.PSPA,
  2: ProjectStrings.HAMP,
  3: ProjectStrings.Chute,
  4: ProjectStrings.SRE,
  5: ProjectStrings.Dalby,
  6: ProjectStrings.FR,
};

export const enum ValidationMessages {
  FieldRequired = 'Value is required',
  SelectRequired = 'Please select an option',
  IsInteger = 'Value must be an integer',
}

export const enum ApiStatuses {
  Success = 'success',
  Failed = 'error',
}

export const enum OfflineStatuses {
  Queued = 'queued',
}

export const enum DataEntryStatuses {
  Draft = 1,
  Submitted = 2,
}
