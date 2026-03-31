import { ValidationMessages } from '@src/utils/enums';
import * as yup from 'yup';

export const notRequiredSpeciesArr = ['NFSH', 'NDNF', 'CAN', 'CNFH'];

export const FishDataEntrySchema = ({ gear, data }) =>
  yup
    .object()
    .shape({
      panelHook: yup
        .string()
        .when('species', {
          is: (species) =>
            gear?.startsWith('TL') || gear?.startsWith('LDN') || !notRequiredSpeciesArr.includes(species),
          then: (schema) => schema.required(ValidationMessages.FieldRequired),
          otherwise: (schema) => schema.nullable().notRequired(),
        })
        .test({
          test: (value) => value && (['M', 'B'].includes(value) || Number(value)),
          message: 'Value must be a number or M or B',
        }),
      species: yup
        .string()
        .test({
          test: (species) => {
            if (species && species === 'NFSH' && data?.length > 0) {
              data?.filter((row) => row.species === 'NFSH').length > 1;
            }
            return true;
          },
          message: 'Cannot have more than one record for the species NFSH',
        })
        .test({
          test: (species) => {
            if (species && species === 'CNFH' && data?.length > 1) {
              return data?.filter((row) => row.species === 'CNFH').length > 1;
            }
            return true;
          },
          message: 'Cannot have more than one record for the species CNFH',
        })
        .test({
          test: (species) => {
            if (species && species === 'CAN' && data?.length > 1) {
              return data?.filter((row) => row.species === 'CAN').length > 1;
            }
            return true;
          },
          message: 'Cannot have more than one record for the species CAN',
        })
        .test({
          test: (species) => {
            if (species && species === 'NDNF' && data?.length > 1) {
              return data?.filter((row) => row.species === 'NDNF').length <= 1;
            }
            return true;
          },
          message: 'Cannot have more than one record for the species NDNF',
        })
        .test({
          test: (species, { parent: { panelHook } }) => {
            if (species === 'NFSH' && panelHook === 'M' && data?.length > 1) {
              return data?.filter((row) => row.species === 'NFSH' && row.panelHook === 'M')?.length <= 1;
            }
            return true;
          },
          message: 'Cannot have more than one record for species = NFSH where Panel/Hook = M',
        })
        .test({
          test: (species, { parent: { panelHook } }) => {
            if (species === 'NFSH' && panelHook === 'B' && data?.length > 1) {
              return data?.filter((row) => row.species === species && row.panelHook === 'B')?.length <= 1;
            }
            return true;
          },
          message: 'Cannot have more than one record for species = NFSH where Panel/Hook = B',
        }),
      lengthType: yup.string().required(ValidationMessages.FieldRequired),
      length: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .typeError(ValidationMessages.FieldRequired)
        .min(0, 'Value cannot be negative')
        .max(9999, 'Value cannot exceed 9999')
        .when(['species', 'countF'], {
          is: (species, count) => ['PDSG', 'SNSG', 'SNPD'].includes(species) && Number(count) === 1,
          then: (schema) => schema.required(ValidationMessages.FieldRequired),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
      weight: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .typeError()
        .min(0, 'Value cannot be negative')
        .nullable()
        .notRequired(),
      countF: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .typeError()
        .min(0, 'Value cannot be negative')
        .when('species', {
          is: (species) => !['NDNF', 'CAN', 'CNFH'].includes(species),
          then: (schema) => schema.required(ValidationMessages.FieldRequired),
          otherwise: (schema) => schema.nullable().notRequired(),
        }),
      ftPrefix: yup.string().nullable().notRequired(),
      floyTag: yup.string().nullable().notRequired().matches(/^\d+$/, 'Must contain only digits'),
      mR: yup.string().when('floyTag', {
        is: (floyTag) => floyTag !== null && floyTag !== '' && floyTag !== undefined,
        then: (schema) => schema.required(ValidationMessages.FieldRequired),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      // @TODO: Might need to add some safe guards here for masking prefix and number values
      geneticsVialNumber: yup.string().when('species', {
        is: (species) => species === 'USG',
        then: (schema) => schema.required(ValidationMessages.FieldRequired),
        otherwise: (schema) => schema.nullable().notRequired(),
      }),
      tagnumber: yup.string().nullable().notRequired(),
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

export const getFishRiverDefaultValues = ({ baseData, dataEntryData }) => ({
  ...getBaseDefaultValues({ baseData }),
  panelHook: dataEntryData?.panelHook ?? '',
  species: dataEntryData?.species ?? '',
  lengthType: dataEntryData?.lengthType ?? '',
  length: dataEntryData?.length ?? '',
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
