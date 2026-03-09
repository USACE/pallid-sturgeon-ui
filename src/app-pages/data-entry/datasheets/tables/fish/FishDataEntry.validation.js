import { ValidationMessages } from '@src/utils/enums';
import * as yup from 'yup';

export const notRequiredSpeciesArr = ['NFSH', 'NDNF', 'CAN', 'CNFH'];

export const FishDataEntrySchema = yup.object().shape({
  panelHook: yup.string().when('species', {
    is: (val) => !notRequiredSpeciesArr.includes(val),
    then: (schema) => schema.required(ValidationMessages.FieldRequired),
    otherwise: (schema) => schema.nullable().notRequired(),
  }),
  species: yup.string().nullable().notRequired(),
  lengthType: yup.string().required(ValidationMessages.FieldRequired),
  length: yup.number().when(['species', 'countF'], {
    is: (species, count) => ['PDSG', 'SNSG', 'SNPD'].includes(species) && count > 1,
    then: (schema) => schema.required(ValidationMessages.FieldRequired),
    otherwise: (schema) => schema.nullable().notRequired(),
  }),
  weight: yup.number().nullable().notRequired(),
  countF: yup.number().nullable().notRequired(),
  ftPrefix: yup.string().required(ValidationMessages.FieldRequired),
  floyTag: yup.string().when('ftPrefix', {
    is: (val) => !val && val !== null && val !== '',
    then: (schema) => schema.required(ValidationMessages.FieldRequired),
    otherwise: (schema) => schema.nullable().notRequired(),
  }),
  mR: yup.string().when('floyTag', {
    is: (val) => !val && val !== null && val !== '',
    then: (schema) => schema.required(ValidationMessages.FieldRequired),
    otherwise: (schema) => schema.nullable().notRequired(),
  }),
  geneticsVialNumber: yup.string().when('species', {
    is: (val) => val === 'USG',
    then: (schema) => schema.string().required(ValidationMessages.FieldRequired),
    otherwise: (schema) => schema.nullable().notRequired(),
  }),
  tagnumber: yup.string().nullable().notRequired(),
  finCurl: yup.string().required(ValidationMessages.FieldRequired),
  otolith: yup.string().nullable().notRequired(),
});

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
  countF: dataEntryData?.countF ?? 1,
  ftPrefix: dataEntryData?.ftPrefix ?? '',
  floyTag: dataEntryData?.floyTag ?? '',
  mR: dataEntryData?.mR ?? '',
  geneticsVialNumber: dataEntryData?.geneticsVialNumber ?? '',
  condition: dataEntryData?.condition ?? '',
  tagnumber: dataEntryData?.tagnumber ?? '',
  finCurl: dataEntryData?.finCurl ?? '',
  otolith: dataEntryData?.otolith ?? '',
  // NOTE: Not in requirements, but display historic data
  raySpine: dataEntryData?.raySpine ?? '',
  KN: dataEntryData?.KN ?? '',
  RSD: dataEntryData?.RSD ?? '',
  editInitials: dataEntryData?.editInitials ?? '',
  uploadedBy: dataEntryData?.uploadedBy ?? '',
});
