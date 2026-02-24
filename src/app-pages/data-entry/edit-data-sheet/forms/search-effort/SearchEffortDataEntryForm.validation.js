import * as yup from 'yup';
import { ValidationMessages } from '@src/utils/enums';
import { formatDate } from '@src/utils/helpers';

// TODO: set this to the actual value from searchTypeOptions for "River Sweep"

export const getSearchEffortSchema = () =>
  yup.object().shape({
    searchDate: yup.string().required(ValidationMessages.FieldRequired),
    recorder: yup.string().required(ValidationMessages.FieldRequired).max(3, 'Value must be at most 3 characters'),
    searchTypeCode: yup.string().required(ValidationMessages.FieldRequired),
    day: yup.string().when('searchTypeCode', {
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
        test: (value) => (Number(value) >= 36 && Number(value) <= 50) || Number(value) === 0,
        message: 'Value must be between 36 and 50 degrees. (Enter 0 if unknown)',
      })
      .nullable(),
    startLongitude: yup
      .string()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .required(ValidationMessages.FieldRequired)
      .test({
        test: (value) => (Number(value) >= -115 && Number(value) <= -90) || Number(value) === 0,
        message: 'Value must be between -115 and -90 degrees.  Enter 0 if unknown',
      })
      .nullable(),
    stopTime: yup.string().required(ValidationMessages.FieldRequired),
    stopLatitude: yup
      .string()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .required(ValidationMessages.FieldRequired)
      .test({
        test: (value) => (Number(value) >= 36 && Number(value) <= 50) || Number(value) === 0,
        message: 'Value must be between 36 and 50 degrees. (Enter 0 if unknown)',
      })
      .nullable(),
    stopLongitude: yup
      .string()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .required(ValidationMessages.FieldRequired)
      .test({
        test: (value) => (Number(value) >= -115 && Number(value) <= -90) || Number(value) === 0,
        message: 'Value must be between -115 and -90 degrees. (Enter 0 if unknown)',
      })
      .nullable(),
    temp: yup.string().nullable(),
    conductivity: yup.string().nullable(),
  });

export const getSearchEffortDefaultValues = ({ dataEntryData }) => ({
  searchDate: dataEntryData?.searchDate ? formatDate(dataEntryData.searchDate) : '',
  recorder: dataEntryData?.recorder ?? '',
  searchTypeCode: dataEntryData?.searchTypeCode ?? '',

  day: dataEntryData?.day ? formatDate(dataEntryData.day) : '',

  startTime: dataEntryData?.startTime ?? '',
  startLatitude: dataEntryData?.startLatitude ?? '',
  startLongitude: dataEntryData?.startLongitude ?? '',

  stopTime: dataEntryData?.stopTime ?? '',
  stopLatitude: dataEntryData?.stopLatitude ?? '',
  stopLongitude: dataEntryData?.stopLongitude ?? '',

  temp: dataEntryData?.temp ?? '',
  conductivity: dataEntryData?.conductivity ?? '',
});
