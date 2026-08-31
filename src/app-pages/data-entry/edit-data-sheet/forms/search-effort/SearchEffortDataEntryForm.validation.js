import * as yup from 'yup';
import { ValidationMessages } from '@src/utils/enums';
import { formatDate } from '@src/utils/helpers';

export const getSearchEffortSchema = () =>
  yup.object().shape({
    seId: yup.mixed().nullable(),
    seFid: yup.string().nullable(),
    telemetryCount: yup.number().nullable(),
    searchDate: yup.string().required(ValidationMessages.FieldRequired),
    recorder: yup.string().required(ValidationMessages.FieldRequired).max(3, 'Value must be at most 3 characters'),
    searchTypeCode: yup.string().required(ValidationMessages.FieldRequired),
    searchDay: yup.string().when('searchTypeCode', {
      is: (searchTypeCode) => searchTypeCode === 'RS',
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
        test: (value) => (Number(value) >= -110 && Number(value) <= -89) || Number(value) === 0,
        message: 'Value must be between -110 and -89 degrees.  Enter 0 if unknown',
      }),
    stopTime: yup.string().when('telemetryCount', {
      is: (val) => Number(val) > 0,
      then: (schema) =>
        schema.required(ValidationMessages.FieldRequired).test({
          test: (stopTime, { parent: { startTime } }) => {
            if (!startTime || !stopTime) return true;
            const toSeconds = (time) => {
              const [hours, minutes, seconds] = time.split(':').map(Number);
              return hours * 3600 + minutes * 60 + seconds;
            };
            return toSeconds(stopTime) > toSeconds(startTime);
          },
          message: 'Stop Time must be after Start Time',
        }),
      otherwise: (schema) =>
        schema
          .transform((value, originalValue) => (originalValue === '' ? null : value))
          .nullable()
          .notRequired(),
    }),
    stopLatitude: yup
      .number()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .typeError('Value must be a number')
      .when('telemetryCount', {
        is: (val) => Number(val) > 0,
        then: (schema) =>
          schema.required(ValidationMessages.FieldRequired).test({
            test: (val) => (Number(val) >= 36 && Number(val) <= 49) || Number(val) === 0,
            message: 'Value must be between 36 and 49 degrees. (Enter 0 if unknown)',
          }),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
    stopLongitude: yup
      .number()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .typeError('Value must be a number')
      .when('telemetryCount', {
        is: (val) => Number(val) > 0,
        then: (schema) =>
          schema.required(ValidationMessages.FieldRequired).test({
            test: (val) => (Number(val) >= -110 && Number(val) <= -89) || Number(val) === 0,
            message: 'Value must be between -110 and -89 degrees. (Enter 0 if unknown)',
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
  searchDay: dataEntryData?.searchDay ?? '',
  startTime: dataEntryData?.startTime ?? '',
  startLatitude: dataEntryData?.startLatitude ?? '',
  startLongitude: dataEntryData?.startLongitude ?? '',
  stopTime: dataEntryData?.stopTime ?? '',
  stopLatitude: dataEntryData?.stopLatitude ?? '',
  stopLongitude: dataEntryData?.stopLongitude ?? '',
  temp: dataEntryData?.temp ?? '',
  conductivity: dataEntryData?.conductivity ?? '',
  checkby: dataEntryData?.checkby ?? '',
});
