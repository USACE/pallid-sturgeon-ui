import { ValidationMessages } from '@src/utils/enums';
import * as yup from 'yup';

const optionalField = () =>
  yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null || originalValue === undefined) {
        return null;
      }
      return value;
    })
    .nullable();

export const telemetryDataEntrySchema = ({ isSearchTypeRs }) =>
  yup.object().shape({
    seFid: yup.string().nullable(),
    tFid: yup.string().nullable(),
    bend: yup.number().test({
      test: (bend) => {
        if (isSearchTypeRs === false) return true;
        if (bend === undefined && isSearchTypeRs === true) return false;
        return true;
      },
      message: 'Value is required when Search Type = "River Sweep (RS)"',
    }),
    bendRiverMile: yup.string().nullable(),
    radioTagNum: yup.number().required(ValidationMessages.FieldRequired),
    frequencyIdCode: yup.string().required(ValidationMessages.SelectRequired),
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
        test: (value) => (Number(value) >= -110 && Number(value) <= -89) || Number(value) === 0,
        message: 'Value must be between -110 and -89 degrees. Enter 0 if unknown',
      }),
    suspectedSpawningActivity: yup.string().nullable(),
    positionConfidence: yup.string().required(ValidationMessages.FieldRequired),
    mesoId: yup.string().nullable(),
    depth: optionalField(),
    macroId: yup.string().nullable(),
    temp: optionalField(),
    conductivity: optionalField(),
    turbidity: optionalField(),
    silt: optionalField(),
    sand: optionalField(),
    gravel: optionalField(),
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
  sampleUnitType: baseData?.sampleUnitType ?? '',
  bendrn: baseData?.bendrn ?? '',
  bendRiverMile: baseData?.bendRiverMile ?? '',
  siteFid: baseData?.siteFid ?? '',
  siteId: baseData?.siteId ?? '',
});

export const getTelemetryDefaultValues = ({ dataEntryData }) => ({
  seFid: dataEntryData?.seFid ?? '',
  tFid: dataEntryData?.tFid ?? '',
  bend: dataEntryData?.bend ?? '',
  radioTagNum: dataEntryData?.radioTagNum ?? '',
  frequencyIdCode: dataEntryData?.frequencyIdCode ?? '',
  captureTime: dataEntryData?.captureTime ?? '',
  captureLatitude: dataEntryData?.captureLatitude ?? '',
  captureLongitude: dataEntryData?.captureLongitude ?? '',
  suspectedSpawningActivity: dataEntryData?.suspectedSpawningActivity ?? '',
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
