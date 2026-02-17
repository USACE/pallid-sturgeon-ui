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

export const missouriRiverSchema = yup.object().shape(
  {
    setdate: yup.string().required(ValidationMessages.FieldRequired),
    subsample: yup
      .number()
      .integer('Value must be an integer')
      .required(ValidationMessages.FieldRequired)
      .typeError(ValidationMessages.FieldRequired)
      .moreThan(0, 'Value cannot be zero'),
    subsamplepass: yup
      .number()
      .integer('Value must be an integer')
      .required(ValidationMessages.FieldRequired)
      .typeError(ValidationMessages.FieldRequired)
      .moreThan(0, 'Value cannot be zero')
      .max(9, 'The value cannot be greater than 9'),
    subsamplen: yup.string().required(ValidationMessages.FieldRequired),
    gearType: yup.string().required(ValidationMessages.FieldRequired),
    gear: yup.string().required(ValidationMessages.FieldRequired),
    recorder: yup.string().required(ValidationMessages.FieldRequired).max(3, 'Value must be at most 3 characters'),
    macro: yup.string().when('u6', {
      is: (val) => !val,
      then: (schema) => schema.required(ValidationMessages.FieldRequired),
      otherwise: (schema) => schema.nullable(),
    }),
    meso: yup.string().when('u6', {
      is: (val) => !val,
      then: (schema) =>
        schema
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
      otherwise: (schema) => schema.nullable(),
    }),
    micro: yup.string().when(['segment', 'project', 'season'], {
      is: (segment, project, season) =>
        (Number(project) == 1 && microSegmentRequired.includes(segment)) || (Number(project) == 2 && season === 'IRC'),
      then: (schema) =>
        schema.when('u6', {
          is: (val) => !val,
          then: (schema) => schema.required(ValidationMessages.FieldRequired),
          otherwise: (schema) => schema.nullable(),
        }),
      otherwise: (schema) => schema.nullable(),
    }),
    microStructure: yup.string().nullable(),
    structureFlow: yup.string().when('microStructure', {
      is: (val) => val !== null && val !== '',
      then: (schema) => schema.required(ValidationMessages.FieldRequired),
      otherwise: (schema) => schema.nullable(),
    }),
    structureMod: yup.string().when('structureFlow', {
      is: (val) => val !== null && val !== '',
      then: (schema) => schema.required(ValidationMessages.FieldRequired),
      otherwise: (schema) => schema.nullable(),
    }),
    temp: yup
      .number()
      .when('u6', {
        is: (val) => !val,
        then: (schema) => schema.required(ValidationMessages.FieldRequired),
        otherwise: (schema) => schema.nullable(),
      })
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
      .integer('Value must be an integer')
      .min(0, 'Value cannot be negative')
      .max(999, 'Value cannot exceed 999'),
    setSite1: yup.string().when('structureMod', {
      is: (val) => val !== null && val !== '',
      then: (schema) => schema.required(ValidationMessages.FieldRequired),
      otherwise: (schema) => schema.nullable(),
    }),
    setSite2: yup.string().when('setSite1', {
      is: (val) => val !== null && val !== '',
      then: (schema) => schema.required(ValidationMessages.FieldRequired),
      otherwise: (schema) => schema.nullable(),
    }),
    setSite3: yup.string().when('setSite2', {
      is: (val) => val !== null && val !== '',
      then: (schema) => schema.required(ValidationMessages.FieldRequired),
      otherwise: (schema) => schema.nullable(),
    }),
    startTime: yup.string().when(['gear', 'velocitybot1', 'velocity081'], {
      is: (gear, velocitybot1, velocity081) =>
        gear.startsWith('LDN') &&
        (velocitybot1 === null || velocitybot1 === '') &&
        (velocity081 === null || velocity081 === ''),
      then: (schema) => schema.nullable().notRequired(),
      otherwise: (schema) =>
        schema.when('u6', {
          is: (val) => !val,
          then: (schema) => schema.required(ValidationMessages.FieldRequired),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
    }),
    startLatitude: yup
      .string()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .when('u6', {
        is: (val) => !val,
        then: (schema) => schema.required(ValidationMessages.FieldRequired),
        otherwise: (schema) => schema.nullable().notRequired(),
      })
      .test({
        test: (value) => (Number(value) >= 36 && Number(value) <= 50) || Number(value) === 0,
        message: 'Value must be between 36 and 50 degrees. (Enter 0 if unknown)',
      })
      .nullable()
      .notRequired(),
    startLongitude: yup
      .string()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .when('u6', {
        is: (val) => !val,
        then: (schema) => schema.required(ValidationMessages.FieldRequired),
        otherwise: (schema) => schema.nullable().notRequired(),
      })
      .test({
        test: (value) => (Number(value) >= -115 && Number(value) <= -90) || Number(value) === 0,
        message: 'Value must be between -115 and -90 degrees.  Enter 0 if unknown',
      })
      .nullable()
      .notRequired(),
    // stopTime: yup.string().required(ValidationMessages.FieldRequired),
    // stopLatitude: yup
    //   .number()
    //   .required(ValidationMessages.FieldRequired)
    //   .test('latitude-test', 'Value must be between 36 and 50 or 0', function (value) {
    //     return (value >= 36 && value <= 50) || value === 0;
    //   })
    //   .nullable(),
    // stopLongitude: yup
    //   .number()
    //   .required(ValidationMessages.FieldRequired)
    //   .test('longitude-test', 'Value must be between -115 and -90 or 0', function (value) {
    //     return (value >= -115 && value <= -90) || value === 0;
    //   }),
    u1: yup.string().when('project', {
      is: (val) => Number(val) === 3,
      then: (schema) => schema.required(ValidationMessages.FieldRequired),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
    u2: yup.string().when(['gear', 'project'], {
      is: (gear, project) => project === 1 && gear.startsWith('TL'),
      then: (schema) =>
        schema.required(ValidationMessages.FieldRequired).test({
          test: (value, { parent: { distance, gear } }) => gear.startsWith('TL') && Number(value) < Number(distance),
          message: 'Distance cannot be greater than U2 when the gear is trotline',
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
      .integer('Value must be an integer')
      .min(0, 'Value cannot be negative')
      .max(999, 'Value cannot exceed 999'),
    conductivity: yup
      .number()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .nullable()
      .notRequired()
      .integer('Value must be an integer')
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
      .when(['gear', 'u6'], {
        is: (gear, u6) => gearReqFields.distance.includes(gear) && !u6,
        then: (schema) =>
          schema.required(ValidationMessages.FieldRequired).test({
            test: (value, { parent: { gear, u2 } }) => gear.startsWith('TL') && Number(value) < Number(u2),
            message: 'Value cannot be greater than U2 when the gear is trotline.',
          }),
        otherwise: (schema) => schema.nullable().notRequired(),
      })
      .nullable()
      .notRequired()
      .typeError(ValidationMessages.FieldRequired)
      .integer('Value must be an integer')
      .min(0, 'Value cannot be negative')
      .max(999, 'Value cannot exceed 999'),
    // netrivermile: yup.string().nullable(),
    structurenumber: yup.string().when(['project', 'season'], {
      is: (project, season) => Number(project) === 2 && season === 'HS',
      then: (schema) => schema.required(ValidationMessages.FieldRequired),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
    depth1: yup
      .number()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .when(['gear', 'u6'], {
        is: (gear, u6) => gearReqFields.depth1.includes(gear) && !u6,
        then: (schema) =>
          schema.required(ValidationMessages.FieldRequired).test({
            test: (value, { parent: { meso } }) => meso === 'BARS' && value <= 1.2,
            message: 'Value cannot be greater than 1.2 when Meso = BAR',
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
      .when(['gear', 'u6'], {
        is: (gear, u6) => gearReqFields.depth2.includes(gear) && !u6,
        then: (schema) =>
          schema.required(ValidationMessages.FieldRequired).test({
            test: (value, { parent: { meso } }) => meso === 'BARS' && value <= 1.2,
            message: 'Value cannot be greater than 1.2 when Meso = BAR',
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
      .when(['gear', 'u6'], {
        is: (gear, u6) => gearReqFields.depth3.includes(gear) && !u6,
        then: (schema) =>
          schema.required(ValidationMessages.FieldRequired).test({
            test: (value, { parent: { meso } }) => meso === 'BARS' && value <= 1.2,
            message: 'Value cannot be greater than 1.2 when Meso = BAR',
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
      .when(['gear', 'u6'], {
        is: (gear, u6) => gearReqFields.velocitybot1.includes(gear) && !u6,
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
      .when(['depth2', 'gear', 'u6'], {
        is: (depth2, gear, u6) => gearReqFields.velocity081.includes(gear) && depth2 >= 1.2 && !u6,
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
      .when('u6', {
        is: (val) => !val,
        then: (schema) => schema.required(ValidationMessages.FieldRequired),
        otherwise: (schema) => schema.nullable().notRequired(),
      })
      .typeError(ValidationMessages.FieldRequired)
      .min(0, 'Value cannot be negative')
      .test({
        test: (value) => value === undefined || Number.isInteger(value * 100),
        message: 'Must have at most 2 decimal places',
      }),
    velocitybot2: yup
      .number()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .when(['gear', 'u6'], {
        is: (gear, u6) => gearReqFields.velocitybot2.includes(gear) && !u6,
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
      .when(['depth2', 'gear', 'u6'], {
        is: (depth2, gear, u6) => gearReqFields.velocity082.includes(gear) && depth2 >= 1.2 && !u6,
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
      .when(['gear', 'u6'], {
        is: (gear, u6) => gearReqFields.velocity02or062.includes(gear) && !u6,
        then: (schema) => schema.required(ValidationMessages.FieldRequired),
        otherwise: (schema) => schema.nullable().notRequired(),
      })
      .typeError(ValidationMessages.FieldRequired)
      .min(0, 'Value cannot be negative')
      .test({
        test: (value) => value === undefined || Number.isInteger(value * 100),
        message: 'Must have at most 2 decimal places',
      }),
    cobble: yup.string().nullable().notRequired(),
    organic: yup.string().nullable().notRequired(),
    silt: yup
      .number()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .nullable()
      .notRequired()
      .min(0, 'Value cannot be negative'),
    sand: yup
      .number()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .nullable()
      .notRequired()
      .min(0, 'Value cannot be negative'),
    gravel: yup
      .number()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .nullable()
      .notRequired()
      .min(0, 'Value cannot be negative'),
    // comments: yup.string().nullable(),
  },
  [['width', 'width']]
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
  subsamplepass: dataEntryData?.subsamplepass ?? 1,
  subsamplen: dataEntryData?.subsamplen ?? 'R',
  gearType: dataEntryData?.gearType ?? 'S',
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
  cobble: dataEntryData?.cobble ?? '',
  organic: dataEntryData?.organic ?? '',
  silt: dataEntryData?.silt ?? '',
  sand: dataEntryData?.sand ?? '',
  gravel: dataEntryData?.gravel ?? '',
  comments: dataEntryData?.comments ?? '',
});
