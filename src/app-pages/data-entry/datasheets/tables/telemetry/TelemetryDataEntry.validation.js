import { ValidationMessages } from '@src/utils/enums';
import * as yup from 'yup';

export const telemetryDataEntrySchema = yup.object().shape({
  seFid: yup.string().nullable(),
  tFid: yup.string().nullable(),
  bend: yup.string().when('searchTypeCode', {
    is: (searchTypeCode) => searchTypeCode === 'RS',
    then: (schema) => schema.required(ValidationMessages.FieldRequired),
    otherwise: (schema) => schema.nullable(),
  }),
  radioTagNum: yup.number().required(ValidationMessages.FieldRequired),
  frequencyIdCode: yup.number().required(ValidationMessages.SelectRequired),
  captureTime: yup.string().required(ValidationMessages.FieldRequired),
  captureLatitude: yup
    .string()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required(ValidationMessages.FieldRequired)
    .test({
      test: (value) => (Number(value) >= 36 && Number(value) <= 49) || Number(value) === 0,
      message: 'Value must be between 36 and 49 degrees. (Enter 0 if unknown)',
    }),
  captureLongitude: yup
    .string()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required(ValidationMessages.FieldRequired)
    .test({
      test: (value) => (Number(value) >= -100 && Number(value) <= -89) || Number(value) === 0,
      message: 'Value must be between -100 and -89 degrees.  Enter 0 if unknown',
    }),
  spawnBehavior: yup.string().nullable(),
  positionConfidence: yup.number().required(ValidationMessages.FieldRequired),
  mesoId: yup.string().nullable(),
  depth: yup.number().nullable(),
  macroId: yup.string().nullable(),
  temp: yup.number().nullable(),
  conductivity: yup.number().nullable(),
  turbidity: yup.number().nullable(),
  silt: yup.number().nullable(),
  sand: yup.number().nullable(),
  gravel: yup.number().nullable(),
  comments: yup.string().nullable(),
  editInitials: yup.string().nullable(),
  lastEditComment: yup.string().nullable(),
  checkby: yup.string().nullable(),
});

export const getBaseDefaultValues = ({ baseData }) => ({
  year: baseData?.year ?? '',
  fieldOffice: baseData?.fieldOffice ?? '',
  project: baseData?.projectId ?? '',
  segment: baseData?.segmentId ?? '',
  season: baseData?.season ?? '',
  // bend: baseData?.bend ?? '',
  sampleUnitType: baseData?.sampleUnitType ?? '',
  bendrn: baseData?.bendrn ?? '',
  bendrivermile: baseData?.bendRiverMile ?? '',
  siteFid: baseData?.siteFid ?? '',
  siteId: baseData?.siteId ?? '',
});

export const getTelemetryDefaultValues = ({ dataEntryData }) => ({
  seFid: dataEntryData?.seFid ?? '',
  tFid: dataEntryData?.fFid ?? '',
  bend: dataEntryData?.bend ?? '',
  radioTagNum: dataEntryData?.radioTagNum ?? '',
  frequencyIdCode: dataEntryData?.frequencyIdCode ?? '',
  captureTime: dataEntryData?.captureTime ?? '',
  captureLatitude: dataEntryData?.captureLatitude ?? '',
  captureLongitude: dataEntryData?.captureLongitude ?? '',
  spawnBehavior: dataEntryData?.spawnBehavior ?? '',
  positionConfidence: dataEntryData?.positionConfidence ?? '',
  mesoId: dataEntryData?.mesoId ?? '',
  depth: dataEntryData?.depth ?? '',
  macroId: dataEntryData?.macroId ?? '',
  temp: dataEntryData?.temp ?? '',
  conductivity: dataEntryData?.conductivity ?? '',
  turbidity: dataEntryData?.turbidity ?? '',
  silt: dataEntryData?.silt ?? '',
  sand: dataEntryData?.sand ?? '',
  gravel: dataEntryData?.gravel ?? '',
  comments: dataEntryData?.comments ?? '',
  editInitials: dataEntryData?.editInitials ?? '',
  lastEditComment: dataEntryData?.lastEditComment ?? '',
  checkby: dataEntryData?.checkby ?? '',
});
