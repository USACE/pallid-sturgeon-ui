import * as yup from 'yup';

export const FishDataEntrySchema = yup.object().shape({});

const getBaseDefaultValues = ({ baseData }) => ({
  year: baseData?.year ?? '',
  fieldOffice: baseData?.fieldOffice ?? '',
  project: baseData?.projectId ?? '',
  segment: baseData?.segmentId ?? '',
  season: baseData?.season ?? '',
  bend: baseData?.bend ?? '',
  sampleUnitType: baseData?.sampleUnitType ?? '',
  bendrn: baseData?.bendrn ?? '',
  bendrivermile: baseData?.bendRiverMile ?? '',
  siteFid: baseData?.siteFid ?? '',
  siteId: baseData?.siteId ?? '',
});

export const getFishRiverDefaultValues = ({ baseData, dataEntryData }) => ({
  ...getBaseDefaultValues({ baseData }),
  panelHook: dataEntryData?.panelHook ?? '',
  species: dataEntryData?.species ?? '',
  lengthType: dataEntryData?.lengthType ?? '',
  length: dataEntryData?.length ?? '',
  weight: dataEntryData?.weight ?? '',
  countF: dataEntryData?.countF ?? '',
  ftPrefix: dataEntryData?.ftPrefix ?? '',
  floyTag: dataEntryData?.floyTag ?? '',
  mR: dataEntryData?.mR ?? '',
  geneticsVialNumber: dataEntryData?.geneticsVialNumber ?? '',
  condition: dataEntryData?.condition ?? '',
  tagnumber: dataEntryData?.tagnumber ?? '',
  finCurl: dataEntryData?.finCurl ?? '',
  otolith: dataEntryData?.otolith ?? '',
  commonName: dataEntryData?.commonName ?? '',
  // NOTE: Not in requirements, but display historic data
  raySpine: dataEntryData?.raySpine ?? '',
  KN: dataEntryData?.KN ?? '',
  RSD: dataEntryData?.RSD ?? '',
  editInitials: dataEntryData?.editInitials ?? '',
  uploadedBy: dataEntryData?.uploadedBy ?? '',
});
