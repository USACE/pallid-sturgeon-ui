import { ValidationMessages } from '@src/utils/enums';
import { latRegex, lngRegex } from '@src/utils/regex';
import * as yup from 'yup';

export const telemetryDataEntrySchema = yup.object().shape({
  bend: yup.string().nullable(),
  radioTagNum: yup.number().required(ValidationMessages.FieldRequired),
  frequencyIdCode: yup.number().required(ValidationMessages.SelectRequired),
  captureDate: yup.string().nullable(),
  captureLatitude: yup
    .string()
    .test(
      'latFormat',
      'Latitude format is incorrect. Must be +-XX.XXXXXX and include at least 6 decimal places.',
      (val) => latRegex.test(val)
    )
    .required(ValidationMessages.FieldRequired),
  captureLongitude: yup
    .string()
    .test(
      'lngFormat',
      'Longitude format is incorrect. Must be +-XXX.XXXXXX and include at least 6 decimal places.',
      (val) => lngRegex.test(val)
    )
    .required(ValidationMessages.FieldRequired),
  positionConfidence: yup.number().required(ValidationMessages.FieldRequired),
  mesoId: yup.string().nullable(),
  depth: yup.number().nullable(),
  macroId: yup.string().nullable(),
  temp: yup.number().nullable(),
  conductivity: yup.number().nullable(),
  turbidity: yup.number().nullable(),
  silt: yup.number().nullable(),
  sand: yup.number().nullable(),
  gravel: yup.number().nullable(),
  comments: yup.string().nullable(),
  editInitials: yup.string().nullable(),
  lastEditComment: yup.string().nullable(),
  checkby: yup.string().nullable(),
});
