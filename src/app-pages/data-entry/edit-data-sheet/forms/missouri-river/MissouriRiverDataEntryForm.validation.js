import * as yup from 'yup';
import { ValidationMessages } from '@src/utils/enums';
import { formatDate } from '@src/utils/helpers';

export const microSegmentRequired = [8, 9, 10, 11, 13, 14];

export const gearReqFields = {
  distance: ['OT04', 'TN', 'TLC1', 'TLC2', 'POT02'],
  depth1: ['GN18', 'GN81', 'GN14', 'GN41', 'OT04', 'TN', 'TLC1', 'TLC2', 'LDN500', 'LDN750', 'LDN1000', 'POT02'],
  depth2: ['GN18', 'GN81', 'GN14', 'GN41', 'OT04', 'TN', 'TLC1', 'TLC2', 'POT02'],
  depth3: ['GN18', 'GN81', 'GN14', 'GN41', 'OT04', 'TN', 'TLC1', 'TLC2', 'POT02'],
  velocitybot1: ['LDN500', 'LDN750', 'LDN1000'],
  velocity081: ['LDN500', 'LDN750', 'LDN1000'],
  velocitybot2: ['GN18', 'GN81', 'GN14', 'GN41', 'OT04', 'TN', 'TLC1', 'TLC2', 'LDN500', 'LDN750', 'LDN1000', 'POT02'],
  velocity082: ['GN18', 'GN81', 'GN14', 'GN41', 'OT04', 'TN', 'TLC1', 'TLC2', 'LDN500', 'LDN750', 'LDN1000', 'POT02'],
  velocity02or062: ['GN18', 'GN81', 'GN14', 'GN41', 'OT04', 'TN', 'TLC1', 'TLC2', 'POT02'],
};

export const getMissouriRiverSchema = ({ riverMile }) =>
  yup.object().shape(
    {
      setdate: yup.string().required(ValidationMessages.FieldRequired),
      subsample: yup
        .number()
        .integer(ValidationMessages.IsInteger)
        .required(ValidationMessages.FieldRequired)
        .typeError(ValidationMessages.FieldRequired)
        .moreThan(0, 'Value cannot be zero'),
      subsamplepass: yup
        .number()
        .integer(ValidationMessages.IsInteger)
        .required(ValidationMessages.FieldRequired)
        .typeError(ValidationMessages.FieldRequired)
        .moreThan(0, 'Value cannot be zero'),
      subsamplen: yup.string().required(ValidationMessages.FieldRequired),
      subsampleType: yup.string().required(ValidationMessages.FieldRequired),
      gearType: yup.string().required(ValidationMessages.FieldRequired),
      gear: yup.string().required(ValidationMessages.FieldRequired),
      recorder: yup.string().required(ValidationMessages.FieldRequired).max(3, 'Value must be at most 3 characters'),
      macro: yup.string().required(ValidationMessages.FieldRequired),
      meso: yup
        .string()
        .required(ValidationMessages.FieldRequired)
        .when('gear', {
          is: (val) => val === 'TN' || val?.startsWith('GN'),
          then: (schema) =>
            schema
              .test({
                test: (value) => value !== 'POOL',
                message: "Mesohabitat cannot = 'POOL' when using a trammel net",
              })
              .test({
                test: (value) => value !== 'BARS',
                message: "Mesohabitat cannot = 'BARS' when using a gill net",
              }),
        })
        .when('season', {
          is: (val) => val === 'HW',
          then: (schema) =>
            schema.test({
              test: (value) => value !== 'FMCD',
              message: "Mesohabitat cannot = 'FMCD' during High Water season",
            }),
        }),
      micro: yup
        .string()
        .max(6, 'Values cannot exceed 6 digits')
        .when(['segment', 'project'], {
          is: (segment, project) => Number(project) == 1 && microSegmentRequired.includes(segment),
          then: (schema) =>
            schema.when('u6', {
              is: (val) => !val,
              then: (schema) => schema.required(ValidationMessages.FieldRequired),
              otherwise: (schema) => schema.nullable().notRequired(),
            }),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
      microStructure: yup.string().nullable(),
      structureFlow: yup.string().when('microStructure', {
        is: (val) => val !== null && val !== '',
        then: (schema) => schema.required(ValidationMessages.FieldRequired),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      structureMod: yup.string().when('structureFlow', {
        is: (val) => val !== null && val !== '',
        then: (schema) => schema.required(ValidationMessages.FieldRequired),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      temp: yup
        .number()
        .required(ValidationMessages.FieldRequired)
        .typeError(ValidationMessages.FieldRequired)
        .min(0, 'Value cannot be negative')
        .max(99.9, 'Value cannot exceed 99.9')
        .test({
          test: (value) => value === undefined || /^\-?\d{1,2}(\.\d)?$/.test(value.toString()),
          message: 'Must have at most 1 decimal place',
        }),
      width: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .nullable()
        .notRequired()
        .integer(ValidationMessages.IsInteger)
        .min(0, 'Value cannot be negative')
        .max(999, 'Value cannot exceed 999'),
      setSite1: yup.string().when('structureMod', {
        is: (val) => val !== null && val !== '',
        then: (schema) => schema.required(ValidationMessages.FieldRequired),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      setSite2: yup.string().when('setSite1', {
        is: (val) => val !== null && val !== '',
        then: (schema) => schema.required(ValidationMessages.FieldRequired),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      setSite3: yup.string().when('setSite2', {
        is: (val) => val !== null && val !== '',
        then: (schema) => schema.required(ValidationMessages.FieldRequired),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      startTime: yup.string().when(['gear', 'velocitybot1', 'velocity081'], {
        is: (gear, velocitybot1, velocity081) =>
          gear.startsWith('LDN') &&
          (velocitybot1 === null || velocitybot1 === '') &&
          (velocity081 === null || velocity081 === ''),
        then: (schema) => schema.nullable().notRequired(),
        otherwise: (schema) => schema.required(ValidationMessages.FieldRequired),
      }),
      startLatitude: yup
        .string()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .required(ValidationMessages.FieldRequired)
        .test({
          test: (value) => (Number(value) >= 36 && Number(value) <= 49) || Number(value) === 0,
          message: 'Value must be between 36 and 49 degrees. (Enter 0 if unknown)',
        })
        .nullable()
        .notRequired(),
      startLongitude: yup
        .string()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .required(ValidationMessages.FieldRequired)
        .test({
          test: (value) => (Number(value) >= -111 && Number(value) <= -89) || Number(value) === 0,
          message: 'Value must be between -111 and -89 degrees.  Enter 0 if unknown',
        })
        .nullable()
        .notRequired(),
      stopTime: yup.string().nullable().notRequired(),
      stopLatitude: yup
        .string()
        .when(['deploymentType', 'gear'], {
          is: (deploymentType, gear) => deploymentType === 'a' && !gear.startsWith('LDN'),
          then: (schema) => schema.required(ValidationMessages.FieldRequired),
          otherwise: (schema) => schema.nullable().notRequired(),
        })
        .test({
          test: (value) => (Number(value) >= 36 && Number(value) <= 49) || Number(value) === 0,
          message: 'Value must be between 36 and 49 degrees. (Enter 0 if unknown)',
        })
        .nullable()
        .notRequired(),
      stopLongitude: yup
        .string()
        .when(['deploymentType', 'gear'], {
          is: (deploymentType, gear) => deploymentType === 'a' && !gear.startsWith('LDN'),
          then: (schema) => schema.required(ValidationMessages.FieldRequired),
          otherwise: (schema) => schema.nullable().notRequired(),
        })
        .test({
          test: (value) => (Number(value) >= -111 && Number(value) <= -89) || Number(value) === 0,
          message: 'Value must be between -111 and -89 degrees.  Enter 0 if unknown',
        }),
      u1: yup.string().when('project', {
        is: (val) => Number(val) === 3,
        then: (schema) => schema.required(ValidationMessages.FieldRequired),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      u2: yup.string().when(['gear', 'project'], {
        is: (gear, project) => project === 1 && gear.startsWith('TL'),
        then: (schema) =>
          schema.required(ValidationMessages.FieldRequired).when('distance', {
            is: (val) => ![null, undefined, ''].includes(val),
            then: (schema) =>
              schema.test({
                test: (u2, { parent: { distance, gear } }) => gear.startsWith('TL') && Number(u2) >= Number(distance),
                message: 'Value cannot be less than Distance when the gear is trotline',
              }),
          }),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      u3: yup.string().nullable().notRequired(),
      u4: yup.string().nullable().notRequired(),
      u5: yup.string().nullable().notRequired(),
      u6: yup.string().nullable().notRequired(),
      u7: yup.string().nullable().notRequired(),
      turbidity: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .nullable()
        .notRequired()
        .integer(ValidationMessages.IsInteger)
        .min(0, 'Value cannot be negative')
        .max(999, 'Value cannot exceed 999'),
      conductivity: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .nullable()
        .notRequired()
        .integer(ValidationMessages.IsInteger)
        .min(0, 'Value cannot be negative')
        .max(999, 'Value cannot exceed 999'),
      dissolvedOxygen: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .nullable()
        .notRequired()
        .min(0, 'Value cannot be negative')
        .max(99.9, 'Value cannot exceed 99.9')
        .test({
          test: (value) => value === undefined || /^\-?\d{1,2}(\.\d)?$/.test(value.toString()),
          message: 'Must have at most 1 decimal place',
        }),
      distance: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .when('gear', {
          is: (val) => gearReqFields.distance.includes(val),
          then: (schema) =>
            schema.required(ValidationMessages.FieldRequired).when('u2', {
              is: (val) => ![null, undefined, ''].includes(val),
              then: (schema) =>
                schema.test({
                  test: (distance, { parent: { gear, u2 } }) => gear.startsWith('TL') && Number(distance) <= Number(u2),
                  message: 'Value cannot be greater than U2 when the gear is trotline.',
                }),
            }),
          otherwise: (schema) => schema.nullable().notRequired(),
        })
        .nullable()
        .notRequired()
        .typeError(ValidationMessages.FieldRequired)
        .integer(ValidationMessages.IsInteger)
        .min(0, 'Value cannot be negative')
        .max(999, 'Value cannot exceed 999'),
      netrivermile: yup
        .string()
        .nullable()
        .notRequired()
        .when('netrivermile', {
          is: (val) => val !== null && val !== '',
          then: (schema) =>
            schema.test({
              test: (value) =>
                Number(value) <= Number(riverMile?.upperRiverMile) &&
                Number(value) >= Number(riverMile?.lowerRiverMile),
              message: `Net River Mile must be between (or equal to) the ${riverMile?.lowerRiverMile} and ${riverMile?.upperRiverMile} for this bend.`,
            }),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
      structurenumber: yup.string().when(['project', 'season'], {
        is: (project, season) => Number(project) === 2 && season === 'HS',
        then: (schema) => schema.required(ValidationMessages.FieldRequired),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      depth1: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .when('gear', {
          is: (val) => gearReqFields.depth1.includes(val),
          then: (schema) =>
            schema.required(ValidationMessages.FieldRequired).when('meso', {
              is: (val) => val !== null && val !== '' && val === 'BARS',
              then: (schema) =>
                schema.test({
                  test: (value) => value <= 1.2,
                  message: 'Value cannot be greater than 1.2 when Meso = BAR',
                }),
              otherwise: (schema) => schema.required(ValidationMessages.FieldRequired),
            }),
          otherwise: (schema) => schema.nullable().notRequired(),
        })
        .typeError(ValidationMessages.FieldRequired)
        .min(0, 'Value cannot be negative')
        .max(99.9, 'Value cannot exceed 99.9')
        .test({
          test: (value) => value === undefined || /^\-?\d{1,2}(\.\d)?$/.test(value.toString()),
          message: 'Must have at most 1 decimal place',
        }),
      depth2: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .when('gear', {
          is: (val) => gearReqFields.depth2.includes(val),
          then: (schema) =>
            schema.required(ValidationMessages.FieldRequired).when('meso', {
              is: (val) => val !== null && val !== '' && val === 'BARS',
              then: (schema) =>
                schema.test({
                  test: (value) => value <= 1.2,
                  message: 'Value cannot be greater than 1.2 when Meso = BAR',
                }),
              otherwise: (schema) => schema.required(ValidationMessages.FieldRequired),
            }),
          otherwise: (schema) => schema.nullable().notRequired(),
        })
        .typeError(ValidationMessages.FieldRequired)
        .min(0, 'Value cannot be negative')
        .max(99.9, 'Value cannot exceed 99.9')
        .test({
          test: (value) => value === undefined || /^\-?\d{1,2}(\.\d)?$/.test(value.toString()),
          message: 'Must have at most 1 decimal place',
        }),
      depth3: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .when('gear', {
          is: (val) => gearReqFields.depth3.includes(val),
          then: (schema) =>
            schema.required(ValidationMessages.FieldRequired).when('meso', {
              is: (val) => val !== null && val !== '' && val === 'BARS',
              then: (schema) =>
                schema.test({
                  test: (value) => value <= 1.2,
                  message: 'Value cannot be greater than 1.2 when Meso = BAR',
                }),
              otherwise: (schema) => schema.required(ValidationMessages.FieldRequired),
            }),
          otherwise: (schema) => schema.nullable().notRequired(),
        })
        .typeError(ValidationMessages.FieldRequired)
        .min(0, 'Value cannot be negative')
        .max(99.9, 'Value cannot exceed 99.9')
        .test({
          test: (value) => value === undefined || /^\-?\d{1,2}(\.\d)?$/.test(value.toString()),
          message: 'Must have at most 1 decimal place',
        }),
      velocitybot1: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .when('gear', {
          is: (val) => gearReqFields.velocitybot1.includes(val),
          then: (schema) => schema.required(ValidationMessages.FieldRequired),
          otherwise: (schema) => schema.nullable().notRequired(),
        })
        .typeError(ValidationMessages.FieldRequired)
        .min(0, 'Value cannot be negative')
        .test({
          test: (value) => value === undefined || Number.isInteger(value * 100),
          message: 'Must have at most 2 decimal places',
        }),
      velocity081: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .when(['depth2', 'gear'], {
          is: (depth2, gear) => gearReqFields.velocity081.includes(gear) || depth2 >= 1.2,
          then: (schema) => schema.required(ValidationMessages.FieldRequired),
          otherwise: (schema) => schema.nullable().notRequired(),
        })
        .typeError(ValidationMessages.FieldRequired)
        .min(0, 'Value cannot be negative')
        .test({
          test: (value) => value === undefined || Number.isInteger(value * 100),
          message: 'Must have at most 2 decimal places',
        }),
      velocity02or061: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .nullable()
        .notRequired()
        .typeError(ValidationMessages.FieldRequired)
        .min(0, 'Value cannot be negative')
        .test({
          test: (value) => value === undefined || Number.isInteger(value * 100),
          message: 'Must have at most 2 decimal places',
        }),
      velocitybot2: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .when('gear', {
          is: (val) => gearReqFields.velocitybot2.includes(val),
          then: (schema) => schema.required(ValidationMessages.FieldRequired),
          otherwise: (schema) => schema.nullable().notRequired(),
        })
        .typeError(ValidationMessages.FieldRequired)
        .min(0, 'Value cannot be negative')
        .test({
          test: (value) => value === undefined || Number.isInteger(value * 100),
          message: 'Must have at most 2 decimal places',
        }),
      velocity082: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .when(['depth2', 'gear'], {
          is: (depth2, gear) => gearReqFields.velocity082.includes(gear) || depth2 >= 1.2,
          then: (schema) => schema.required(ValidationMessages.FieldRequired),
          otherwise: (schema) => schema.nullable().notRequired(),
        })
        .typeError(ValidationMessages.FieldRequired)
        .min(0, 'Value cannot be negative')
        .test({
          test: (value) => value === undefined || Number.isInteger(value * 100),
          message: 'Must have at most 2 decimal places',
        }),
      velocity02or062: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .when('gear', {
          is: (val) => gearReqFields.velocity02or062.includes(val),
          then: (schema) => schema.required(ValidationMessages.FieldRequired),
          otherwise: (schema) => schema.nullable().notRequired(),
        })
        .typeError(ValidationMessages.FieldRequired)
        .min(0, 'Value cannot be negative')
        .test({
          test: (value) => value === undefined || Number.isInteger(value * 100),
          message: 'Must have at most 2 decimal places',
        }),
      editInitials: yup.string().max(3, 'Value must be at most 3 characters').nullable().notRequired(),
      comments: yup.string().nullable(),
    },
    [
      ['width', 'width'],
      ['netrivermile', 'netrivermile'],
    ]
  );

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

export const getMissouriRiverDefaultValues = ({ baseData, dataEntryData }) => ({
  ...getBaseDefaultValues({ baseData }),
  mrFid: dataEntryData?.mrFid ?? '',
  seFid: dataEntryData?.seFid ?? '',
  mrId: dataEntryData?.mrId ?? '',
  seId: dataEntryData?.SeId ?? '',
  setdate: dataEntryData?.setdate ? formatDate(dataEntryData?.setdate) : new Date().toISOString().split('T')[0],
  subsample: dataEntryData?.subsample ?? 1,
  subsamplepass: dataEntryData?.subsamplepass ?? 1,
  subsamplen: dataEntryData?.subsamplen ?? 'R',
  subsampleType: dataEntryData?.subsampleType ?? '',
  gearType: dataEntryData?.gearType ?? 'S',
  gear: dataEntryData?.gear ?? '',
  deploymentType: '',
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
  startLatitude: dataEntryData?.startLatitude ?? '',
  startLongitude: dataEntryData?.startLongitude ?? '',
  stopTime: dataEntryData?.stopTime ?? '',
  stopLatitude: dataEntryData?.stopLatitude ?? '',
  stopLongitude: dataEntryData?.stopLongitude ?? '',
  u1: dataEntryData?.u1 ?? '',
  u2: dataEntryData?.u2 ?? '',
  u3: dataEntryData?.u3 ?? '',
  u4: dataEntryData?.u4 ?? '',
  u5: dataEntryData?.u5 ?? '',
  u6: dataEntryData?.u6 ?? '',
  u7: dataEntryData?.u7 ?? '',
  turbidity: dataEntryData?.turbidity ?? '',
  conductivity: dataEntryData?.conductivity ?? '',
  dissolvedOxygen: dataEntryData?.dissolvedOxygen ?? '',
  distance: dataEntryData?.distance ?? '',
  netrivermile: dataEntryData?.netrivermile ?? '',
  structurenumber: dataEntryData?.structurenumber ?? '',
  depth1: dataEntryData?.depth1 ?? '',
  depth2: dataEntryData?.depth2 ?? '',
  depth3: dataEntryData?.depth3 ?? '',
  velocitybot1: dataEntryData?.velocitybot1 ?? '',
  velocity081: dataEntryData?.velocity081 ?? '',
  velocity02or061: dataEntryData?.velocity02or061 ?? '',
  velocitybot2: dataEntryData?.velocitybot2 ?? '',
  velocity082: dataEntryData?.velocity082 ?? '',
  velocity02or062: dataEntryData?.velocity02or062 ?? '',
  editInitials: dataEntryData?.editInitial ?? '',
  comments: dataEntryData?.comments ?? '',
  // Historic Data (Read Only)
  cobble: dataEntryData?.cobble ?? '',
  organic: dataEntryData?.organic ?? '',
  silt: dataEntryData?.silt ?? '',
  sand: dataEntryData?.sand ?? '',
  gravel: dataEntryData?.gravel ?? '',
  usgs: dataEntryData?.usgs ?? '',
  riverstage: dataEntryData?.riverstage ?? '',
  discharge: dataEntryData?.discharge ?? '',
  habitatrn: dataEntryData?.habitatrn ?? '',
  noTurbidity: dataEntryData?.noTurbidity ?? '',
  noVelocity: dataEntryData?.noVelocity ?? '',
  lastEditComment: dataEntryData?.lastEditComment ?? '',
});
