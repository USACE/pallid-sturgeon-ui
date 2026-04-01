import * as yup from 'yup';
import { ValidationMessages } from '@src/utils/enums';
import { formatDate } from '@src/utils/helpers';

// TODO: set this to the actual value from searchTypeOptions for "River Sweep"

export const getSearchEffortSchema = () =>
  yup.object().shape({
    seId: yup.mixed().nullable(),
    seFid: yup.string().nullable(),
    telemetryCount: yup.string().nullable(),
    searchDate: yup.string().required(ValidationMessages.FieldRequired),
    recorder: yup.string().required(ValidationMessages.FieldRequired).max(3, 'Value must be at most 3 characters'),
    searchTypeCode: yup.string().required(ValidationMessages.FieldRequired),
    searchDay: yup.string().when('searchTypeCode', {
      is: (v) => v === 'RS',
      then: (schema) => schema.required(ValidationMessages.FieldRequired),
      otherwise: (schema) => schema.nullable(),
    }),
    startTime: yup.string().required(ValidationMessages.FieldRequired),
    startLatitude: yup
      .string()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .required(ValidationMessages.FieldRequired)
      .test({
        test: (value) => (Number(value) >= 36 && Number(value) <= 49) || Number(value) === 0,
        message: 'Value must be between 36 and 49 degrees. (Enter 0 if unknown)',
      }),
    startLongitude: yup
      .string()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .required(ValidationMessages.FieldRequired)
      .test({
        test: (value) => (Number(value) >= -100 && Number(value) <= -89) || Number(value) === 0,
        message: 'Value must be between -100 and -89 degrees.  Enter 0 if unknown',
      }),
    stopTime: yup.string().when('telemetryCount', {
      is: (val) => Number(val) > 0,
      then: (schema) => schema.required(ValidationMessages.FieldRequired),
      otherwise: (schema) => schema.notRequired(),
    }),
    stopLatitude: yup
      .string()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .when('telemetryCount', {
        is: (val) => Number(val) > 0,
        then: (schema) =>
          schema
            .required(ValidationMessages.FieldRequired)
            // .test('valid-lat', 'Value must be between 36 and 50 degrees. (Enter 0 if unknown)', (value) => {
            //   if (value === undefined) return false;
            //   const num = Number(value);
            //   return (num >= 36 && num <= 50) || num === 0;
            // }),
            .test({
              test: (val) => (Number(val) >= 36 && Number(val) <= 50) || Number(val) === 0,
              message: 'Value must be between 36 and 50 degrees. (Enter 0 if unknown)',
            }),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
    stopLongitude: yup
      .string()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .when('telemetryCount', {
        is: (val) => Number(val) > 0,
        then: (schema) =>
          schema
            .required(ValidationMessages.FieldRequired)
            // .test('valid-lng', 'Value must be between -115 and -88 degrees.  Enter 0 if unknown', (value) => {
            //   if (value === undefined) return false;
            //   const num = Number(value);
            //   return (num >= -115 && num <= -88) || num === 0;
            // }),
            .test({
              test: (val) => (Number(val) >= -115 && Number(val) <= -88) || Number(val) === 0,
              message: 'Value must be between -115 and -88 degrees. (Enter 0 if unknown)',
            }),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
    temp: yup.string().nullable(),
    conductivity: yup.string().nullable(),
  });

export const getSearchEffortDefaultValues = ({ dataEntryData, telemetryCount = 0 }) => ({
  seId: dataEntryData?.seId ?? '',
  seFid: dataEntryData?.seFid ?? '',
  telemetryCount: Number(telemetryCount || 0),
  searchDate: dataEntryData?.searchDate ? formatDate(dataEntryData.searchDate) : new Date().toISOString().split('T')[0],
  recorder: dataEntryData?.recorder ?? '',
  searchTypeCode: dataEntryData?.searchTypeCode ?? '',
  searchDay: dataEntryData?.searchDay ? formatDate(dataEntryData.searchDay) : '',
  startTime: dataEntryData?.startTime ?? '',
  startLatitude: dataEntryData?.startLatitude ?? '',
  startLongitude: dataEntryData?.startLongitude ?? '',
  stopTime: dataEntryData?.stopTime ?? '',
  stopLatitude: dataEntryData?.stopLatitude ?? '',
  stopLongitude: dataEntryData?.stopLongitude ?? '',
  temp: dataEntryData?.temp ?? '',
  conductivity: dataEntryData?.conductivity ?? '',
});
