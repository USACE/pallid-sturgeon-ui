import { ValidationMessages } from '@src/utils/enums';
import * as yup from 'yup';

const currentYear = new Date().getFullYear();

export const sitesValidationSchema = yup.object().shape({
  edit: yup.boolean(),
  year: yup.string().required(ValidationMessages.FieldRequired),
  fieldoffice: yup.string().required(ValidationMessages.FieldRequired),
  projectId: yup.string().required(ValidationMessages.FieldRequired),
  season: yup.string().required(ValidationMessages.FieldRequired),
  segmentId: yup.object().required(ValidationMessages.FieldRequired),
  sampleUnitType: yup.string().required(ValidationMessages.FieldRequired),
  bend: yup.object().required(ValidationMessages.FieldRequired),
  bendrn: yup.string().required(ValidationMessages.FieldRequired),
  last_edit_comment: yup.string().when('edit', {
    is: true,
    then: (schema) => schema.required(ValidationMessages.FieldRequired),
  }),
  editInitials: yup.string().when('edit', {
    is: true,
    then: (schema) => schema.required(ValidationMessages.FieldRequired),
  }),
});

export const getSitesDefaultValues = ({ edit, data, user }) => ({
  edit: edit ?? false,
  siteId: data?.siteId ?? '',
  siteFid: data?.siteFid ?? '',
  year: data?.year ?? String(currentYear),
  fieldoffice: edit ? data?.fieldoffice : user?.officeCode === 'ZZ' ? '' : user?.officeCode,
  projectId: edit ? data?.projectId : user?.projectCode === '2' ? 2 : 1,
  segmentId: data?.segmentId ?? '',
  season: data?.season ?? '',
  sampleUnitType: data?.sampleUnitType ?? 'B',
  bend: data?.bend ?? '',
  bendrn: data?.bendrn ?? '',
  last_edit_comment: data?.last_edit_comment ?? '',
  editInitials: data?.editInitials ?? '',
  bendRiverMile: data?.bendRiverMile ?? '',
});

// Additional fields need to be provided for updating site data
export const getAdditionalValues = ({ data }) => ({
  approved: data?.approved ?? '',
  bendRiverMile: data?.bendRiverMile ?? '',
  bkgColor: data?.bkgColor ?? '',
  brmId: data?.brmId ?? '',
  complete: data?.complete ?? '',
  lastUpdated: data?.lastUpdated ?? '',
  siteFid: data?.siteFid ?? '',
  siteId: data?.siteId ?? '',
  uploadFilename: data?.uploadFilename ?? '',
  uploadSessionId: data?.uploadSessionId ?? '',
  uploadedBy: data?.uploadedBy ?? '',
});
