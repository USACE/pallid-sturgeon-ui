import { ValidationMessages } from '@src/utils/enums';
import * as yup from 'yup';

export const notRequiredSpeciesArr = ['NFSH', 'NDNF', 'CNA', 'CNFH'];
export const gearMbArr = ['LDN500', 'LDN750', 'LDN1000'];

export const FishDataEntrySchema = ({ gear, data }) =>
  yup
    .object()
    .shape({
      panelHook: yup
        .string()
        .when('species', {
          is: (species) =>
            species !== null &&
            species !== '' &&
            species !== undefined &&
            (gear?.startsWith('TL') || gear?.startsWith('LDN')) &&
            !notRequiredSpeciesArr.includes(species),
          then: (schema) => schema.required(ValidationMessages.FieldRequired),
          otherwise: (schema) => schema.nullable().notRequired(),
        })
        .test({
          // Panel/Hook field must be a number or 'M' or 'B'
          test: (panelHook) => {
            if (panelHook === undefined || panelHook === null || panelHook === '') return true;
            if (['M', 'B'].includes(panelHook) || Number(panelHook)) return true;
            return false;
          },
          message: 'Value must be a number or M or B',
        }),
      species: yup
        .string()
        .test({
          test: (species) => {
            if (
              (species === null && species === '' && species === undefined) ||
              (gear === null && gear === '') ||
              data?.length < 1
            )
              return true;
            if (!gearMbArr.includes(gear) && species === 'NFSH')
              return !(data?.filter((item) => item.species === 'NFSH')?.length > 1);
            return true;
          },
          message: 'Cannot have more than one record for the species NFSH',
        })
        .test({
          test: (species) => {
            if ((species === null && species === '' && species === undefined) || data?.length < 1) return true;
            if (species === 'CNFH') return !(data?.filter((item) => item.species === 'CNFH')?.length > 1);
            return true;
          },
          message: 'Cannot have more than one record for the species CNFH',
        })
        .test({
          test: (species) => {
            if ((species === null && species === '' && species === undefined) || data?.length < 1) return true;
            if (species === 'CNA') return !(data?.filter((item) => item.species === 'CNA')?.length > 1);
            return true;
          },
          message: 'Cannot have more than one record for the species CNA',
        })
        .test({
          test: (species) => {
            if ((species === null && species === '' && species === undefined) || data?.length < 1) return true;
            if (species === 'NDNF') return !(data?.filter((item) => item.species === 'NDNF')?.length > 1);
            return true;
          },
          message: 'Cannot have more than one record for the species NDNF',
        })
        // If Gear = LDN500, LDN750, or LDN1000, then NFSH can be entered twice, one for each panel/hook value of 'M' or 'B'
        .test({
          test: (species, { parent: { panelHook } }) => {
            // If no species value selected OR one or less fish rows, do not validate
            if (
              (species === null && species === '' && species === undefined) ||
              (gear === null && gear === '') ||
              data?.length === 0
            )
              return true;
            if (gearMbArr.includes(gear) && species === 'NFSH') {
              // If only one NSFH, do not validate
              if (data?.filter((row) => row.species === 'NFSH')?.length === 1) return true;
              // Cannot have more than 2 NFSH species if Gear = LDN500, LDN750 or LDN1000, throw error
              if (data?.filter((row) => row.species === 'NFSH')?.length > 2) return false;
              if (panelHook === 'M') {
                return data?.filter((row) => row.species === 'NFSH' && row.panelHook === 'M')?.length === 1;
              }
              if (panelHook === 'B') {
                return data?.filter((row) => row.species === 'NFSH' && row.panelHook === 'B')?.length === 1;
              }
              return false;
            }
            return true;
          },
          message:
            "Gear = LDN500, LDN750, or LDN1000, NFSH can be entered twice, one for each panel/hook value of 'M' or 'B'",
        })
        .required(ValidationMessages.FieldRequired),
      lengthType: yup.string().when('length', {
        is: (length) => length !== null && length !== undefined && length !== '' && Number(length) !== 0,
        then: (schema) => schema.required(ValidationMessages.FieldRequired),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      length: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .typeError(ValidationMessages.FieldMustBeNumber)
        .min(0, 'Value cannot be negative')
        .max(9999, 'Value cannot exceed 9999')
        .when(['species', 'countF'], {
          is: (species, count) => ['PDSG', 'SNSG', 'SNPD'].includes(species) && Number(count) === 1,
          then: (schema) => schema.required('Length is required for PDSG, SNSG, SNPD'),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
      weight: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .typeError(ValidationMessages.FieldMustBeNumber)
        .min(0, 'Value cannot be negative')
        .nullable()
        .notRequired(),
      countF: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .typeError(ValidationMessages.FieldMustBeNumber)
        .min(0, 'Value cannot be negative')
        .when('species', {
          is: (species) => !['NDNF', 'CNA', 'CNFH', 'NFSH'].includes(species),
          then: (schema) => schema.required(ValidationMessages.FieldRequired),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
      ftPrefix: yup.string().nullable().notRequired(),
      floyTag: yup
        .string()
        .nullable()
        .notRequired()
        .test({
          // The system shall not allow duplicate Floy Tag Prefix & Floy Tag entries for the same mr_fid
          test: (floyTag, { parent: { ftPrefix } }) => {
            if (
              ftPrefix === null ||
              ftPrefix === undefined ||
              ftPrefix === '' ||
              floyTag === null ||
              floyTag === '' ||
              floyTag === undefined
            )
              return true;
            if (data?.filter((item) => item.floyTag === floyTag && item.ftPrefix === ftPrefix)?.length > 1) {
              return false;
            }
            return true;
          },
          message: 'Duplicate Floy Tag entries for the same Missouri River Field ID not allowed.',
        }),
      mR: yup.string().when('floyTag', {
        is: (floyTag) => floyTag !== null && floyTag !== '' && floyTag !== undefined,
        then: (schema) => schema.required(ValidationMessages.FieldRequired),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      geneticsVialNumber: yup.string().when('species', {
        is: (species) => species === 'USG',
        then: (schema) =>
          schema.required(ValidationMessages.FieldRequired).test({
            test: (geneticsVialNumber) => {
              const num = geneticsVialNumber?.split('-')?.[1];
              return num?.length < 5 ? false : true;
            },
            message: 'Genetics Vial Number needs to be a 5 digit number.',
          }),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      tagnumber: yup
        .string()
        .nullable()
        .notRequired()
        // Conditional Length Limits (10 without decimal, 14 with decimal)
        .test('tagNumber-length', 'Invalid tag number length', (value) => {
          if (!value) return true;
          const hasDecimal = value.includes('.');
          const charCount = hasDecimal ? value.replace('.', '').length : value.length;
          const maxLength = hasDecimal ? 14 : 10;
          return charCount === maxLength;
        }),
      finCurl: yup.string().when(['length', 'segment', 'species'], {
        is: (length, segment, species) =>
          species === 'PDSG' && ((length < 425 && segment < 7) || (length < 250 && segment >= 7)),
        then: (schema) => schema.required(ValidationMessages.FieldRequired),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      otolith: yup.string().nullable().notRequired(),
    })
    .test('at-least-one-or-both', 'Both Floy Tag Prefix and Floy Tag are required if one is filled', function (values) {
      const { ftPrefix, floyTag } = values;
      if ((ftPrefix && !floyTag) || (!ftPrefix && floyTag)) {
        return this.createError({
          path: !ftPrefix ? 'ftPrefix' : 'floyTag',
          message: 'Both Floy Tag Prefix and Floy Tag must be filled if one is provided',
        });
      }
      return true;
    })
    .test('digits-only', 'Floy Tag can only accept digits', function (values) {
      const { floyTag } = values;
      const hasValue = floyTag !== null && floyTag !== '' && floyTag !== undefined;
      if (hasValue && isNaN(Number(floyTag))) {
        return this.createError({
          path: 'floyTag',
          message: 'Floy Tag can only accept digits',
        });
      }
      if (hasValue && (floyTag.length < 5 || floyTag.length > 6)) {
        return this.createError({
          path: 'floyTag',
          message: 'Floy Tag cannot be 4 digits or less, and can be 6 digits maximum.',
        });
      }
      return true;
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
  bendrivermile: baseData?.bendRiverMile ?? '',
  siteFid: baseData?.siteFid ?? '',
  siteId: baseData?.siteId ?? '',
});

export const getFishRiverDefaultValues = ({ dataEntryData }) => ({
  panelHook: dataEntryData?.panelHook ?? '',
  species: dataEntryData?.species ?? '',
  lengthType: dataEntryData?.lengthType ?? '',
  length: dataEntryData?.['length'] ?? '',
  weight: dataEntryData?.weight ?? '',
  countF: dataEntryData?.countF ?? 1,
  ftPrefix: dataEntryData?.ftPrefix ?? '',
  floyTag: dataEntryData?.floyTag ?? '',
  mR: dataEntryData?.mR ?? '',
  geneticsVialNumber: dataEntryData?.geneticsVialNumber ?? '',
  condition: dataEntryData?.condition ?? '',
  tagnumber: dataEntryData?.tagnumber ?? '',
  finCurl: dataEntryData?.finCurl ?? '',
  otolith: dataEntryData?.otolith ?? '',
  // NOTE: Not in requirements, but display historic data
  raySpine: dataEntryData?.raySpine ?? '',
  KN: dataEntryData?.KN ?? '',
  RSD: dataEntryData?.RSD ?? '',
  editInitials: dataEntryData?.editInitials ?? '',
  uploadedBy: dataEntryData?.uploadedBy ?? '',
});
