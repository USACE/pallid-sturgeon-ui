import { ValidationMessages } from '@src/utils/enums';
import { formatDate } from '@src/utils/helpers';
import * as yup from 'yup';

export const suppProcValidationSchema = ({ projectId, species }) =>
  yup
    .object()
    .shape({
      edit: yup.boolean(),
      showProcedureSection: yup.boolean(),
      //Supplemental fields
      pitrn: yup.string().notRequired(),
      tagnumber: yup
        .string()
        .transform((value) => (value ? value.toUpperCase() : value))
        .matches(/^[A-NP-Z0-9.]*$/, "Must be alphanumeric, cannot contain 'O', and be uppercase.")
        .when('pitrn', {
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
      elcolor: yup.string().required(ValidationMessages.FieldRequired),
      elhv: yup.string().when('elcolor', {
        is: (value) => value != 'N',
        then: (schema) => schema.required('This field is required when EL Color is not "N".'),
      }),
      ercolor: yup.string().required(ValidationMessages.FieldRequired),
      erhv: yup.string().when('ercolor', {
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
      cwtyn: yup.string().required(ValidationMessages.FieldRequired),
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
      genetic: yup.string().when(['species', 'projectId'], {
        is: (species, projectId) => species === 'USG' && Number(projectId) !== 2,
        then: (schema) => schema.required('Required when Species is "USG" and Project = 2'),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      geneticsVialNumber: yup.string().when(['species', 'genetic'], {
        is: (species, genetic) => ['PDSG', 'USG'].includes(species) && genetic == 'Y',
        then: (schema) => schema.required('Required when Species is "USG" or "PDSG" and Genetics = Yes'),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      broodstock: yup.boolean(),
      hatchWild: yup.boolean(),
      speciesId: yup.boolean(),
      archive: yup.boolean(),
      project37: yup.boolean(),
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //Procedure fields
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      oldRadioTagNum: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .when('showProcedureSection', {
          is: true,
          then: (schema) =>
            schema.when('purpose', {
              is: (purpose) => ['2', '5'].includes(purpose),
              then: (schema) => schema.required('Required when Purpose is "Reimplant" or "Retired"'),
              otherwise: (schema) => schema.nullable().notRequired(),
            }),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
      oldFrequencyId: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .when('showProcedureSection', {
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
      procedureStartTime: yup.string().when('showProcedureSection', {
        is: true,
        then: (schema) =>
          schema
            .required(ValidationMessages.FieldRequired)
            .matches(/^\d{2}:\d{2}:\d{2}$/, 'Must be in the format HH:MM:SS.'),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      procedureEndTime: yup.string().when('showProcedureSection', {
        is: true,
        then: (schema) =>
          schema
            .required(ValidationMessages.FieldRequired)
            .matches(/^\d{2}:\d{2}:\d{2}$/, 'Must be in the format HH:MM:SS.'),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      oldRtSerial: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .nullable()
        .notRequired(),
      oldDstSerial: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .nullable()
        .notRequired(),
      dstSerialNum: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .when('showProcedureSection', {
          is: true,
          then: (schema) => schema.required(ValidationMessages.FieldRequired),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
      dstStartDate: yup.string().when('showProcedureSection', {
        is: true,
        then: (schema) =>
          schema.when('dstSerialNum', {
            is: (value) => value !== null && value !== undefined && value !== '',
            then: (schema) => schema.required('This field is required when "New/Current DST Serial #" is populated.'),
            otherwise: (schema) => schema.nullable().notRequired(),
          }),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      dstStartTime: yup.string().when('showProcedureSection', {
        is: true,
        then: (schema) =>
          schema.when('dstSerialNum', {
            is: (value) => value !== null && value !== undefined && value !== '',
            then: (schema) => schema.required('This field is required when "New/Current DST Serial #" is populated.'),
            otherwise: (schema) => schema.nullable().notRequired(),
          }),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      dstReimplant: yup.boolean(),
      purpose: yup.string().nullable().notRequired(),
      procedureBy: yup.string().max(3, 'Must not exceed 3 characters.').nullable().notRequired(),
      antibioticInjection: yup.boolean(),
      pVentral: yup.boolean(),
      pDorsal: yup.boolean(),
      pLeft: yup.boolean(),
      fishHealthComment: yup.string().nullable().notRequired(),
      newRadioTagNum: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .when('showProcedureSection', {
          is: true,
          then: (schema) =>
            schema.when(['purpose'], {
              is: (purpose) => !['5', '6'].includes(purpose),
              then: (schema) => schema.required('Required when Purpose is not "Retired" or "?????"'),
              otherwise: (schema) => schema.nullable().notRequired(),
            }),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
      newFreqId: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .when('showProcedureSection', {
          is: true,
          then: (schema) =>
            schema.when(['purpose'], {
              is: (purpose) => !['5', '6'].includes(purpose),
              then: (schema) => schema.required('Required when Purpose is not "Retired" or "?????"'),
              otherwise: (schema) => schema.nullable().notRequired(),
            }),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
      newRtSerial: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .when('showProcedureSection', {
          is: true,
          then: (schema) =>
            schema.when(['purpose'], {
              is: (purpose) => !['5', '6'].includes(purpose),
              then: (schema) => schema.required('Required when Purpose is not "Retired" or "?????"'),
              otherwise: (schema) => schema.nullable().notRequired(),
            }),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
      evalLocation: yup.string().when('showProcedureSection', {
        is: true,
        then: (schema) =>
          schema.when('spawnStatus', {
            is: (value) => value !== null && value !== undefined && value !== '',
            then: (schema) => schema.required('This field is required when "Spawn Evaluation" is populated.'),
            otherwise: (schema) => schema.nullable().notRequired(),
          }),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      visualReproStatus: yup.string().nullable().notRequired(),
      ultrasoundReproStatus: yup.string().nullable().notRequired(),
      sex: yup.string().when('showProcedureSection', {
        is: true,
        then: (schema) =>
          schema.when(['visualReproStatus', 'ultrasoundReproStatus'], {
            is: (visualReproStatus, ultrasoundReproStatus) =>
              (visualReproStatus !== null && visualReproStatus !== undefined && visualReproStatus !== '') ||
              (ultrasoundReproStatus !== null && ultrasoundReproStatus !== undefined && ultrasoundReproStatus !== ''),
            then: (schema) =>
              schema.required(
                'This field is required when "Visual Assessment" or "Ultrasound Assessment" is populated.'
              ),
            otherwise: (schema) => schema.nullable().notRequired(),
          }),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      expectedSpawnYear: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .integer(ValidationMessages.IsInteger)
        .when('showProcedureSection', {
          is: true,
          then: (schema) =>
            schema.when(['visualReproStatus', 'ultrasoundReproStatus'], {
              is: (visualReproStatus, ultrasoundReproStatus) =>
                (visualReproStatus !== null && visualReproStatus !== undefined && visualReproStatus !== '') ||
                (ultrasoundReproStatus !== null && ultrasoundReproStatus !== undefined && ultrasoundReproStatus !== ''),
              then: (schema) =>
                schema
                  .required('This field is required when "Visual Assessment" or "Ultrasound Assessment" is populated.')
                  .test(
                    'expectedSpawnYear-valid-year',
                    'Expected Spawn Year must be the current year or current year + 1.',
                    (value) => {
                      if (!value) return true;
                      const currentYear = new Date().getFullYear();
                      const year = parseInt(value, 10);
                      return year === currentYear || year === currentYear + 1;
                    }
                  ),
              otherwise: (schema) => schema.nullable().notRequired(),
            }),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
    })
    .test(
      'gan-checkbox-group-required',
      'At least one Genetic Analysis Needs option must be selected when Genetics is set to "Yes"',
      function (values) {
        const { genetic, broodstock, hatchWild, speciesId, archive, project37 } = values || {};
        if (genetic == 'Y' && !broodstock && !hatchWild && !speciesId && !archive && !project37) {
          return this.createError({
            path: 'checkboxGroup',
            message: 'Genetic Analysis Needs: At least one option must be selected when Genetics is set to "Yes"',
          });
        }

        return true;
      }
    );

export const getSuppProcDefaultValues = ({ edit, suppData, procData, user, showProcedureSection }) => ({
  edit: edit ?? false,
  showProcedureSection: showProcedureSection ?? false,
  // Supplemental fields
  pitrn: suppData?.pitrn ?? '',
  tagnumber: suppData?.tagnumber ?? '',
  elcolor: suppData?.elcolor ?? '',
  elhv: suppData?.elhv ?? '',
  ercolor: suppData?.ercolor ?? '',
  erhv: suppData?.erhv ?? '',
  lscute: suppData?.lscute ?? '',
  rscute: suppData?.rscute ?? '',
  dscute: suppData?.dscute ?? '',
  cwtyn: suppData?.cwtyn ?? '',
  dangler: suppData?.dangler ?? '',
  pallidFate: suppData?.status ?? '', // mapped from status field
  hatcheryOrigin: suppData?.hatcheryOrigin ?? '',
  genetic: suppData?.genetic ?? '',
  geneticsVialNumber: suppData?.geneticsVialNumber ?? '',
  broodstock: suppData?.broodstock === 1 ? true : false,
  hatchWild: suppData?.hatchWild === 1 ? true : false,
  speciesId: suppData?.speciesId === 1 ? true : false,
  archive: suppData?.archive === 1 ? true : false,
  project37: suppData?.project37 === 1 ? true : false,
  otherTagInfo: suppData?.otherTagInfo ?? '',
  suppComments: suppData?.comments ?? '', //mapped from supplemental table comments
  // Procedure fields
  procedureDate: procData?.procedureDate ? formatDate(procData?.procedureDate) : new Date().toISOString().split('T')[0],
  procedureStartTime: procData?.procedureStartTime ?? '',
  procedureEndTime: procData?.procedureEndTime ?? '',
  purpose: procData?.purpose ?? '',
  procedureBy: procData?.procedureBy ?? '',
  antibioticInjection: procData?.antibioticInjection === 1 ? true : false,
  pVentral: procData?.pVentral === 1 ? true : false,
  pDorsal: procData?.pDorsal === 1 ? true : false,
  pLeft: procData?.pLeft === 1 ? true : false,
  fishHealthComment: procData?.fishHealthComment ?? '',
  oldRadioTagNum: procData?.oldRadioTagNum ?? '',
  oldFrequencyId: procData?.oldFrequencyId ?? '',
  oldRtSerial: procData?.oldRtSerial ?? '', // TODO: Confirm which database field this maps to, cannot find match in DS_PROCEDURE table
  oldDstSerial: procData?.oldDstSerial ?? '', // TODO: Confirm which database field this maps to, cannot find match in DS_PROCEDURE table
  dstSerialNum: procData?.dstSerialNum ?? '',
  dstStartDate: procData?.dstStartDate ? formatDate(procData?.dstStartDate) : new Date().toISOString().split('T')[0],
  dstStartTime: procData?.dstStartTime ?? '',
  dstReimplant: procData?.dstReimplant === 1 ? true : false,
  newRadioTagNum: procData?.newRadioTagNum ?? '',
  newFreqId: procData?.newFreqId ?? '',
  newRtSerial: procData?.newRtSerial ?? '', // TODO: Confirm which database field this maps to, cannot find match in DS_PROCEDURE table
  sex: procData?.sex ?? '',
  pi: procData?.pi === 1 ? true : false, //TODO: Confirm which database field this maps to, cannot find match in DS_PROCEDURE table
  bloodSample: procData?.bloodSample === 1 ? true : false,
  eggSample: procData?.eggSample === 1 ? true : false,
  spawnStatus: procData?.spawnStatus ?? '',
  evalLocation: procData?.evalLocation ?? '',
  visualReproStatus: procData?.visualReproStatus ?? '',
  ultrasoundReproStatus: procData?.ultrasoundReproStatus ?? '',
  expectedSpawnYear: procData?.expectedSpawnYear ?? '',
  ultrasoundGonadLength: procData?.ultrasoundGonadLength ?? '',
  gonadCondition: procData?.gonadCondition ?? '',
  procComments: procData?.comments ?? '', //mapped from procedure table comments
});
