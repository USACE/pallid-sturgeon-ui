import { ValidationMessages } from '@src/utils/enums';
import * as yup from 'yup';

// const currentYear = new Date().getFullYear();

export const supplementalValidationSchema = ({ projectId, species }) =>
  yup.object().shape({
    edit: yup.boolean(),
    pitRnz: yup.string().notRequired(),
    tagNumber: yup
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
      then: (schema) => schema.required(ValidationMessages.FieldRequired),
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
  });

export const getSuppDefaultValues = ({ edit, data, user }) => ({
  edit: edit ?? false,
  pitRnz: data?.pitRnz ?? '',
  tagNumber: data?.tagNumber ?? '',
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
});
