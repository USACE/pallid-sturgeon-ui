import { ValidationMessages } from '@src/utils/enums';
import * as yup from 'yup';

export const supplementalValidationSchema = ({ projectId, species }) =>
  yup.object().shape({
    edit: yup.boolean(),
    showProcedureSection: yup.boolean(),
    //Supplemental fields
    pitRnz: yup.string().notRequired(),
    tagnumber: yup
      .string()
      .transform((value) => (value ? value.toUpperCase() : value))
      .matches(/^[A-NP-Z0-9.]*$/, "Must be alphanumeric, cannot contain 'O', and be uppercase.")
      .when('pitRnz', {
        is: (value) => value !== null && value !== undefined && value !== '',
        then: (schema) => schema.required('This field is required when Pit R/N/Z is selected.'),
        otherwise: (schema) => schema.notRequired(),
      })
      // Conditional Length Limits (10 without decimal, 14 with decimal)
      .test('tagNumber-length', 'Length exceeds the allowed limit', (value) => {
        if (!value) return true;
        const hasDecimal = value.includes('.');
        const maxLength = hasDecimal ? 14 : 10;
        return value.length <= maxLength;
      }),
    elColor: yup.string().required(ValidationMessages.FieldRequired),
    elHvx: yup.string().when('elColor', {
      is: (value) => value != 'N',
      then: (schema) => schema.required('This field is required when EL Color is not "N".'),
    }),
    erColor: yup.string().required(ValidationMessages.FieldRequired),
    erHvx: yup.string().when('erColor', {
      is: (value) => value != 'N',
      then: (schema) => schema.required('This field is required when ER Color is not "N".'),
    }),
    lScute: yup
      .number()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .nullable()
      .notRequired()
      .integer(ValidationMessages.IsInteger)
      .min(0, 'Value must be exactly 1 digit')
      .max(9, 'Value must be exactly 1 digit'),
    rScute: yup
      .number()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .nullable()
      .notRequired()
      .integer(ValidationMessages.IsInteger)
      .min(0, 'Value must be exactly 1 digit')
      .max(9, 'Value must be exactly 1 digit'),
    dScute: yup
      .number()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .nullable()
      .notRequired()
      .integer(ValidationMessages.IsInteger)
      .min(0, 'Value must be exactly 1 digit')
      .max(9, 'Value must be exactly 1 digit'),
    cwt: yup.string().required(ValidationMessages.FieldRequired),
    dangler: yup.string().when('projectId', {
      is: (val) => Number(val) !== 2,
      then: (schema) => schema.required(ValidationMessages.FieldRequired),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
    pallidFate: yup.string().when('projectId', {
      is: (val) => Number(val) !== 2,
      then: (schema) => schema.required('Required when Project is not 2'),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
    hatcheryOrigin: yup.string().when('projectId', {
      is: (val) => Number(val) !== 2,
      then: (schema) => schema.required(ValidationMessages.FieldRequired),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
    genetics: yup.string().when(['species', 'projectId'], {
      is: (species, projectId) => species === 'USG' && Number(projectId) !== 2,
      then: (schema) => schema.required('Required when Species is "USG" and Project = 2'),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
    geneticVial: yup.string().when(['species', 'genetics'], {
      is: (species, genetics) => ['PDSG', 'USG'].includes(species) && genetics == 'Y',
      then: (schema) => schema.required('Required when Species is "USG" or "PDSG" and Genetics = Yes'),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
    geneticVialNum: yup.string().when(['species', 'genetics'], {
      is: (species, genetics) => ['PDSG', 'USG'].includes(species) && genetics == 'Y',
      then: (schema) => schema.required('Required when Species is "USG" or "PDSG" and Genetics = Yes'),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
    ganCheckboxGroup: yup
      .object()
      .when(['genetics', 'ganBroodstock', 'ganHatchVsWild', 'ganSpeciesId', 'ganArchive', 'ganProject37'], {
        is: (genetics, ganBroodstock, ganHatchVsWild, ganSpeciesId, ganArchive, ganProject37) =>
          genetics == 'Y' && !ganBroodstock && !ganHatchVsWild && !ganSpeciesId && !ganArchive && !ganProject37,
        then: (schema) =>
          schema.required('At least one Genetic Analysis Needs option must be selected when Genetics is set to "Yes"'),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
    broodstock: yup.string().nullable().notRequired(),
    // .transform((originalValue) => (originalValue === 'on' ? 1 : 0)),
    hatchWild: yup.string().nullable().notRequired(),
    // .transform((originalValue) => (originalValue === 'on' ? 1 : 0)),
    speciesId: yup.string().nullable().notRequired(),
    // .transform((originalValue) => (originalValue === 'on' ? 1 : 0)),
    archive: yup.string().nullable().notRequired(),
    // .transform((originalValue) => (originalValue === 'on' ? 1 : 0)),
    project37: yup.string().nullable().notRequired(),
    // .transform((originalValue) => (originalValue === 'on' ? 1 : 0)),
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Procedure fields
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    oldRadioTag: yup.string().when('showProcedureSection', {
      is: true,
      then: (schema) =>
        schema.when('purpose', {
          is: (purpose) => ['2', '5'].includes(purpose),
          then: (schema) => schema.required('Required when Purpose is "Reimplant" or "Retired"'),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
    oldFrequencyId: yup.string().when('showProcedureSection', {
      is: true,
      then: (schema) =>
        schema.when(['purpose'], {
          is: (purpose) => ['2', '5'].includes(purpose),
          then: (schema) => schema.required('Required when Purpose is "Reimplant" or "Retired"'),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
    procedureDate: yup.string().when('showProcedureSection', {
      is: true,
      then: (schema) => schema.required(ValidationMessages.FieldRequired),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
    startTime: yup.string().when('showProcedureSection', {
      is: true,
      then: (schema) =>
        schema
          .required(ValidationMessages.FieldRequired)
          .matches(/^\d{2}:\d{2}:\d{2}$/, 'Must be in the format HH:MM:SS.'),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
    endTime: yup.string().when('showProcedureSection', {
      is: true,
      then: (schema) =>
        schema
          .required(ValidationMessages.FieldRequired)
          .matches(/^\d{2}:\d{2}:\d{2}$/, 'Must be in the format HH:MM:SS.'),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
    dstStartDate: yup.string().when('showProcedureSection', {
      is: true,
      then: (schema) =>
        schema.when('dstSerial', {
          is: (value) => value !== null && value !== undefined && value !== '',
          then: (schema) => schema.required('This field is required when "New/Current DST Serial #" is populated.'),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
    dstStartTime: yup.string().when('showProcedureSection', {
      is: true,
      then: (schema) =>
        schema.when('dstSerial', {
          is: (value) => value !== null && value !== undefined && value !== '',
          then: (schema) => schema.required('This field is required when "New/Current DST Serial #" is populated.'),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
    newRadioTag: yup.string().when('showProcedureSection', {
      is: true,
      then: (schema) =>
        schema.when(['purpose'], {
          is: (purpose) => !['5', '6'].includes(purpose),
          then: (schema) => schema.required('Required when Purpose is not "Retired" or "?????"'),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
    newFrequencyId: yup.string().when('showProcedureSection', {
      is: true,
      then: (schema) =>
        schema.when(['purpose'], {
          is: (purpose) => !['5', '6'].includes(purpose),
          then: (schema) => schema.required('Required when Purpose is not "Retired" or "?????"'),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
    newRtSerial: yup.string().when('showProcedureSection', {
      is: true,
      then: (schema) =>
        schema.when(['purpose'], {
          is: (purpose) => !['5', '6'].includes(purpose),
          then: (schema) => schema.required('Required when Purpose is not "Retired" or "?????"'),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
    evalForLocation: yup.string().when('showProcedureSection', {
      is: true,
      then: (schema) =>
        schema.when('spawnEval', {
          is: (value) => value !== null && value !== undefined && value !== '',
          then: (schema) => schema.required('This field is required when "Spawn Evaluation" is populated.'),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
  });

export const getSuppDefaultValues = ({ edit, data, user, showProcedureSection }) => ({
  edit: edit ?? false,
  showProcedureSection: showProcedureSection ?? false,
  pitRnz: data?.pitRnz ?? '',
  tagnumber: data?.tagnumber ?? '',
  elColor: data?.elColor ?? '',
  elHvx: data?.elHvx ?? '',
  erColor: data?.erColor ?? '',
  erHvx: data?.erHvx ?? '',
  lScute: data?.lScute ?? '',
  rScute: data?.rScute ?? '',
  dScute: data?.dScute ?? '',
  cwt: data?.cwt ?? '',
  dangler: data?.dangler ?? '',
  pallidFate: data?.pallidFate ?? '',
  hatcheryOrigin: data?.hatcheryOrigin ?? '',
  genetics: data?.genetics ?? '',
  geneticVial: data?.geneticVial ?? '',
  geneticVialNum: data?.geneticVialNum ?? '',
  // Checkbox fields
  broodstock: data?.broodstock ?? false,
  hatchWild: data?.hatchWild ?? false,
  speciesId: data?.speciesId ?? false,
  archive: data?.archive ?? false,
  project37: data?.project37 ?? false,
});
