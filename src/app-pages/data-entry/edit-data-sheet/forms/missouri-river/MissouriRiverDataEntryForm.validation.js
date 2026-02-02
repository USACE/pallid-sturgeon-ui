import * as yup from 'yup';
import { ValidationMessages } from '@src/utils/enums';
import { formatDate } from '@src/utils/helpers';

const isNstsValidation = yup.lazy((_, context) => {
  const isNsts = context?.parent?.u6 === 'NSTS';
  if (isNsts) {
    return yup.string().required(ValidationMessages.FieldRequired);
  }
  return yup.string().nullable();
});

export const getMissouriRiverSchema = ({ microSegmentRequired, segmentId, projectId }) =>
  yup.object().shape({
    setdate: yup.string().required(ValidationMessages.FieldRequired),
    // Cannot have duplicate subsample numbers with same site_id and pass
    subsample: yup
      .number()
      .required(ValidationMessages.FieldRequired)
      .typeError(ValidationMessages.FieldRequired)
      .moreThan(0, 'Value cannot be zero'),
    subsamplepass: yup
      .number()
      .required(ValidationMessages.FieldRequired)
      .typeError(ValidationMessages.FieldRequired)
      .moreThan(0, 'Value cannot be zero')
      .max(9, 'The value cannot be greater than 9'),
    subsamplen: yup.string().required(ValidationMessages.FieldRequired),
    gearType: yup.string().required(ValidationMessages.FieldRequired),
    gear: yup.string().required(ValidationMessages.FieldRequired),
    recorder: yup.string().required(ValidationMessages.FieldRequired).max(3, 'Value must be at most 3 characters'),
    macro: isNstsValidation,
    meso: isNstsValidation,
    micro: yup.number().when(['segment', 'project'], {
      is: (segment, project) => microSegmentRequired.includes(segment) || project === 2,
      then: (schema) => schema.required(ValidationMessages.FieldRequired),
      otherwise: (schema) => schema.nullable(),
    }),
    microStructure: yup.string().nullable(),
    structureFlow: yup.string().nullable(),
    structureMod: yup
      .string()
      .test('structure-mod-required', ValidationMessages.FieldRequired, function () {
        return microSegmentRequired.includes(segmentId) && projectId === 1;
      })
      .nullable(),
    temp: yup
      .number()
      .required(ValidationMessages.FieldRequired)
      .typeError(ValidationMessages.FieldRequired)
      .positive('Value must be a positive number')
      .max(99.99, 'Value cannot exceed 99.9'),
    width: yup.number().nullable(),
    setSite1: yup.string().nullable(),
    setSite2: yup.string().nullable(),
    setSite3: yup.string().nullable(),
    startTime: yup.string().required(ValidationMessages.FieldRequired),
    startlatitude: yup
      .number()
      .required(ValidationMessages.FieldRequired)
      .test('latitude-test', 'Value must be between 36 and 50 or 0', function (value) {
        return (value >= 36 && value <= 50) || value === 0;
      })
      .nullable(),
    startlongitude: yup
      .number()
      .required(ValidationMessages.FieldRequired)
      .test('longitude-test', 'Value must be between -115 and -90 or 0', function (value) {
        return (value >= -115 && value <= -90) || value === 0;
      }),
    u1: yup.string().nullable(),
    u2: yup.string().nullable(),
    u3: yup.string().nullable(),
    u4: yup.string().nullable(),
    u5: yup.string().nullable(),
    u6: yup.string().nullable(),
    u7: yup.string().nullable(),
  });

export const getBaseDefaultValues = ({ baseData }) => ({
  year: baseData?.year ?? '',
  fieldOffice: baseData?.fieldOffice ?? '',
  project: baseData?.projectId ?? '',
  segment: baseData?.segmentId ?? '',
  season: baseData?.season ?? '',
  bend: baseData?.bend ?? '',
  sampleUnitType: baseData?.sampleUnitType ?? '',
  bendrn: baseData?.bendrn ?? '',
  bendrivermile: baseData?.bendrivermile ?? '',
  siteFid: '',
  siteId: '',
  mrFid: '',
  seFid: '',
  mrId: '',
  seId: '',
});

export const getMissouriRiverDefaultValues = ({ baseData, dataEntryData }) => ({
  ...getBaseDefaultValues({ baseData }),
  setdate: dataEntryData?.setdate ? formatDate(dataEntryData?.setdate) : '',
  subsample: dataEntryData?.subsample ?? 1,
  subsamplepass: dataEntryData?.subsamplepass ?? '',
  subsamplen: dataEntryData?.subsamplen ?? 'R',
  gearType: dataEntryData?.gearType ?? '',
  gear: dataEntryData?.gear ?? '',
  recorder: dataEntryData?.recorder ?? '',
  macro: dataEntryData?.macro ?? '',
  meso: dataEntryData?.meso ?? '',
  micro: dataEntryData?.micro ?? '',
  microStructure: dataEntryData?.microStructure ?? '',
  structureFlow: dataEntryData?.structureFlow ?? '',
  structureMod: dataEntryData?.structureMod ?? '',
  temp: dataEntryData?.temp ?? '',
  width: dataEntryData?.width ?? '',
  setSite1: dataEntryData?.setSite1 ?? '',
  setSite2: dataEntryData?.setSite2 ?? '',
  setSite3: dataEntryData?.setSite3 ?? '',
  startTime: dataEntryData?.startTime ?? '',
  startlatitude: dataEntryData?.startlatitude ?? '',
  startlongitude: dataEntryData?.startlongitude ?? '',
  u1: dataEntryData?.u1 ?? '',
  u2: dataEntryData?.u2 ?? '',
  u3: dataEntryData?.u3 ?? '',
  u4: dataEntryData?.u4 ?? '',
  u5: dataEntryData?.u5 ?? '',
  u6: dataEntryData?.u6 ?? '',
  u7: dataEntryData?.u7 ?? '',
});
