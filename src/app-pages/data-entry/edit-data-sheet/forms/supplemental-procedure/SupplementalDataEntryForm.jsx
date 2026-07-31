import { connect } from 'redux-bundler-react';
import { Button, Grid, Label } from '@trussworks/react-uswds';
import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import TextInput from '@components/new-inputs/text-input/TextInput';
import TextArea from '@components/new-inputs/text-area/TextArea';
import Checkbox from '@components/check-box/Checkbox';
import SelectInput from '@components/new-inputs/select-input/SelectInput';
import PallidIdOverview from './pallid-id-overview/pallidIdOverview';

import { createDropdownOptions, isEmpty } from '@pages/data-entry/dataEntryHelper';

import { OfflineStatuses } from '@src/utils/enums';
import { isOnline } from '@src/app-pages/data-entry/offline/sync';
import { createData, updateData } from '@src/app-pages/data-entry/offline/api';

import '../../../dataentry.scss';

const geneticNeedsCheckboxes = [
  {
    name: 'broodstock',
    label: 'Broodstock',
  },
  {
    name: 'hatchWild',
    label: 'Hatch vs Wild',
  },
  {
    name: 'speciesId',
    label: 'Species ID',
  },
  {
    name: 'archive',
    label: 'Archive',
  },
  {
    name: 'project37',
    label: 'Project 3.7',
  },
];

const allowedScuteValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const scuteOptions = allowedScuteValues.map((val) => ({
  code: val,
  description: val,
}));

const SupplementalDataEntryForm = connect(
  'doGetPallidIdData',
  'selectIsEditForm',
  'selectBaseData',
  'selectLookupData',
  'doModalClose',
  'selectDataEntrySupplemental',
  'selectDataEntryProcedure',
  'doSaveSupplementalDataEntry',
  'doUpdateSupplementalDataEntry',
  'doSaveProcedureDataEntry',
  'doUpdateProcedureDataEntry',
  'selectDataEntryLastParams',
  ({
    doGetPallidIdData,
    isEditForm,
    baseData,
    lookupData,
    doModalClose,
    dataEntrySupplemental,
    doSaveSupplementalDataEntry,
    doUpdateSupplementalDataEntry,
    dataEntryLastParams,
    row: fishData,
  }) => {
    const { projectId } = baseData;
    const { fFid, species } = fishData;

    // The Genetic Y/N field shall be required where species = USG and project = 2
    const isGeneticsRequired = Number(projectId) === 2 && species == 'USG';
    const [isGeneticsVialRequired, setIsGeneticsVialRequired] = useState(
      ['PDSG', 'USG'].includes(species) && genetic == 'Y'
    );
    // The system shall ensure the user cannot edit the Genetics Vial # unless Genetic Y/N = Y
    const [isGeneticsVialReadOnly, setIsGeneticsVialReadOnly] = useState(true);

    // The Pallid Fate field shall be required where project is not equal to 2
    const isPallidFateRequired = Number(projectId) !== 2;
    // The Hatchery Origin field shall be required where project is not equal to 2
    const isHatcheryOriginRequired = Number(projectId) !== 2;

    const supplementalDataExists = !!dataEntrySupplemental?.items?.filter((data) => data.fFid === fFid)?.length;
    const initialSuppData = supplementalDataExists
      ? dataEntrySupplemental?.items?.filter((data) => data.fFid === fFid)[0]
      : null;
    const suppDraftKey = `currentSupplementalDraft:${fFid}`;

    const getIdentifyingData = () => ({
      fid: fishData?.fid,
      fId: fishData?.fId,
      f_id: fishData?.f_id,
      fFid: fishData?.fFid,
      f_fid: fishData?.f_fid,
      mrFid: fishData?.mrFid,
      mr_fid: fishData?.mr_fid,
      mrId: fishData?.mrId ?? dataEntryLastParams?.mrId,
      mr_id: fishData?.mr_id ?? dataEntryLastParams?.mr_id,
    });

    const {
      pitRnzOptions,
      elastomerColorOptions,
      elastomerHvxOptions,
      pallidLocationStatusOptions,
      hatcheryOriginOptions,
      yesNoOptions,
    } = lookupData;

    const schema = {};
    const defaultValues = {};

    const methods = useForm({
      defaultValues: defaultValues,
      resolver: yupResolver(schema),
      mode: 'onSubmit',
      reValidateMode: 'onChange',
      stateOptions: [],
    });

    const {
      formState: { errors, isValid, touchedFields, submitCount, isDirty },
      watch,
      getValues,
      setValue,
      trigger,
      reset,
      clearErrors,
      handleSubmit,
    } = methods;

    const tagnumber = watch('tagnumber');

    const isTouched = Object.keys(touchedFields).length > 0;
    const isShowErrorSummary = !isValid && (isTouched || isDirty || submitCount > 0) && !isEmpty(errors);

    const [isElColorNone, setIsElColorNone] = useState(false);
    const [isErColorNone, setIsErColorNone] = useState(false);

    const elcolor = watch('elcolor');
    const ercolor = watch('ercolor');
    const genetic = watch('genetic');
    const geneticsVialNumber = watch('geneticsVialNumber');

    const geneticsVialPrefix = projectId === 1 ? 'STURG-' : '';

    const ensureGeneticsVialPrefix = (val) => {
      if (val) {
        val = val.toUpperCase();
        if (geneticsVialPrefix.length && !val.startsWith(geneticsVialPrefix)) {
          val = geneticsVialNumber; //keep previous value if user attempts to change prefix value
        }
      }
      setValue('geneticsVial', val);
    };

    const handleChange = (e) => {
      const name = e?.target?.name;
      const val = e?.target?.value;

      if (name === 'tagnumber') {
        setValue(name, val?.toUpperCase());
      } else if (name === 'geneticsVial') {
        ensureGeneticsVialPrefix(val);
      }

      trigger(name);
    };

    const fmtTimeHHMMSS = (val) => {
      const d = val ? new Date(val) : new Date();

      if (Number.isNaN(d.getTime())) {
        console.error('Invalid date:', val);
        return '';
      }

      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      return `${hh}:${mm}:${ss}`;
    };

    const handleGetPallidIdByTagNumber = () => {
      // Load pallid ID data
      doGetPallidIdData(tagnumber);
    };

    // if Supplemental draft exists in sessionStorage (offline mode), load it into the form
    const getOfflineSupplementalDraft = () => {
      const suppDraftJson = sessionStorage.getItem(suppDraftKey);
      // console.warn('getOfflineSupplementalDraft - suppDraftJson:', suppDraftJson);
      if (!suppDraftJson) return null;
      // console.warn('getOfflineSupplementalDraft - supplemental data found in sessionStorage - parsing JSON');
      try {
        const suppDraft = JSON.parse(suppDraftJson);
        if (!suppDraft?.fFid) return null;
        if (String(suppDraft.fFid) !== String(fFid)) {
          return null;
        }
        return suppDraft;
      } catch (err) {
        console.error('Failed to parse offline Supplemental draft for fFid:', fFid, err);
        return null;
      }
    };

    const reloadOfflineDrafts = () => {
      const suppDraft = getOfflineSupplementalDraft();
      if (!suppDraft) return false;

      reset(
        {
          ...defaultValues,
          ...suppDraft,
          // manually set/convert fields that have different names/formats in the form vs the draft object
          ...{
            broodstock: suppDraft?.broodstock === 1 ? true : false,
            hatchWild: suppDraft?.hatchWild === 1 ? true : false,
            speciesId: suppDraft?.speciesId === 1 ? true : false,
            archive: suppDraft?.archive === 1 ? true : false,
            project37: suppDraft?.project37 === 1 ? true : false,
            suppComments: suppDraft?.comments || null,
            pallidFate: suppDraft?.status || null,
          },
        },
        {
          keepDirty: false,
          keepTouched: false,
        }
      );
      return true;
    };

    const formatSuppDataObj = () => {
      const values = getValues();
      // Format any values need for final payload
      return {
        sid: initialSuppData?.sid,
        tagnumber: values?.tagnumber,
        pitrn: values?.pitrn,
        elhv: values?.elhv,
        elcolor: values?.elcolor,
        erhv: values?.erhv,
        ercolor: values?.ercolor,
        lscute: parseFloat(values?.lscute),
        rscute: parseFloat(values?.rscute),
        dscute: parseFloat(values?.dscute),
        cwtyn: values?.cwtyn,
        dangler: values?.dangler,
        genetic: values?.genetic,
        geneticsVialNumber: values?.geneticsVialNumber,
        status: values?.pallidFate,
        hatcheryOrigin: values?.hatcheryOrigin,
        otherTagInfo: values?.otherTagInfo,
        comments: values?.suppComments,
        // Checkbox fields
        broodstock: values?.broodstock === true ? 1 : 0,
        hatchWild: values?.hatchWild === true ? 1 : 0,
        speciesId: values?.speciesId === true ? 1 : 0,
        archive: values?.archive === true ? 1 : 0,
        project37: values?.project37 === true ? 1 : 0,
      };
    };

    const doSubmit = async () => {
      if (saveInProgressRef.current) {
        console.warn('Supplemental save is already in progress.');
        return;
      }
      saveInProgressRef.current = true;
      setIsSaving(true);

      try {
        const valid = await trigger();

        if (!valid) {
          console.warn('Supplemental form validation failed:', errors);
          return;
        }
        // Format any values need for final payload
        const identifyingData = getIdentifyingData();
        const suppDataObj = formatSuppDataObj();
        const suppDraft = getOfflineSupplementalDraft();
        const suppClientId = suppDataObj.clientId ?? suppDraft?.clientId ?? crypto.randomUUID();

        let suppPayload = {
          ...identifyingData,
          ...suppDraft,
          ...suppDataObj,
          clientId: suppClientId,
          f_id: identifyingData?.f_id,
          fId: identifyingData?.fId,
          fid: identifyingData?.fid,
          f_fid: identifyingData?.f_fid,
          fFid: identifyingData?.fFid,
          // Offline values
          _status: OfflineStatuses.Queued,
          version: suppDataObj.version ?? suppDraft?.version ?? 0,
          updatedAt: new Date().toISOString(),
        };

        const hasOfflineSuppDraft = Boolean(suppDraft?.clientId);

        // supp/proc is linked to the offline fFid
        const supplementalFishFid = suppPayload?.fFid ?? suppPayload?.f_fid;
        if (!supplementalFishFid) {
          console.error('Missing fFid. Cannot save draft offline.');
          return;
        }

        if (!isOnline()) {
          if (initialSuppData || hasOfflineSuppDraft) {
            await updateData('supplemental', suppClientId, suppPayload);
          } else {
            await createData('supplemental', suppPayload);
          }
          sessionStorage.setItem(suppDraftKey, JSON.stringify(suppPayload));
          doModalClose();
          return;
        }

        try {
          if (initialSuppData) {
            await doUpdateSupplementalDataEntry(suppPayload);
          } else {
            await doSaveSupplementalDataEntry(suppPayload);
          }
        } catch (error) {
          if (initialSuppData || hasOfflineSuppDraft) {
            // console.warn('Online - Updating existing SUPP data: ', { suppPayload });
            await updateData('supplemental', suppClientId, suppPayload);
          } else {
            // console.warn('Online - Creating SUPP data: ', { suppPayload });
            await createData('supplemental', suppPayload);
          }
        }
        sessionStorage.setItem(suppDraftKey, JSON.stringify(suppPayload));
        doModalClose();
      } catch (error) {
        console.error('Procedure submit failed, queueing offline:', error);
        window.alert(`Supplemental save failed: ${error?.message ?? error}`);
      } finally {
        saveInProgressRef.current = false;
        setIsSaving(false);
      }
    };

    // The system shall reset the EL H/V/X field to null if the user selects None as a value for EL Color
    useEffect(() => {
      if (elcolor == 'N') {
        setValue('elhv', '', { shouldValidate: true });
        setIsElColorNone(true);
      } else {
        setIsElColorNone(false);
      }
    }, [elcolor]);

    // The system shall reset the ER H/V/X field to null if the user selects None as a value for ER Color
    useEffect(() => {
      if (ercolor == 'N') {
        setValue('erhv', '', { shouldValidate: true });
        setIsErColorNone(true);
      } else {
        setIsErColorNone(false);
      }
    }, [ercolor]);

    useEffect(() => {
      if (genetic == 'Y') {
        setValue('geneticsVialNumber', geneticsVialNumber ? geneticsVialNumber : geneticsVialPrefix);
        setIsGeneticsVialReadOnly(false);
      } else {
        if (geneticsVialNumber) {
          // TODO: this confirm dialog is a bit ugly; use a different confirm method?
          const confirmed =
            geneticsVialNumber === geneticsVialPrefix ||
            confirm('This will clear the Genetics Vial textbox. Do you want to make this change?');
          if (confirmed) {
            setValue('geneticsVialNumber', null);
            setIsGeneticsVialReadOnly(true);
          } else {
            setValue('genetic', 'Y');
          }
        } else {
          setIsGeneticsVialReadOnly(true);
        }
      }
    }, [genetic]);

    useEffect(() => {
      reloadOfflineDrafts();
    }, [isEditForm]);

    return (
      <FormProvider {...methods}>
        <Grid row gap='md' className='margin-bottom-1'>
          <Grid tablet={{ col: 4 }}>
            <SelectInput name='pitrn' label='PIT R/N/Z' onChange={handleChange}>
              {createDropdownOptions(pitRnzOptions).map((item, index) => (
                <option key={index + 1} value={item.value}>
                  {item.text}
                </option>
              ))}
            </SelectInput>
          </Grid>
          <Grid tablet={{ col: 3 }}>
            <TextInput name='tagnumber' label='Tag Number' onChange={handleChange} />
          </Grid>
          <Grid tablet={{ col: 2 }}>
            <Button className='primary-btn' onClick={handleGetPallidIdByTagNumber} type='button'>
              Pallid ID
            </Button>
          </Grid>
        </Grid>
        {/* Pallid ID /Data - Readonly */}
        <PallidIdOverview />
        {/* Form continues */}
        <Grid row gap='md' className='margin-top-1'>
          <Grid tablet={{ col: 3 }}>
            <SelectInput name='elcolor' label='EL Color' onChange={handleChange} required>
              {createDropdownOptions(elastomerColorOptions).map((item, index) => (
                <option key={index + 1} value={item.value}>
                  {item.text}
                </option>
              ))}
            </SelectInput>
          </Grid>
          <Grid tablet={{ col: 4 }}>
            <SelectInput name='elhv' label='EL H/V/X' onChange={handleChange} readOnly={isElColorNone}>
              {createDropdownOptions(elastomerHvxOptions).map((item, index) => (
                <option key={index + 1} value={item.value}>
                  {item.text}
                </option>
              ))}
            </SelectInput>
          </Grid>
        </Grid>
        <Grid row gap='md'>
          <Grid tablet={{ col: 3 }}>
            <SelectInput name='ercolor' label='ER Color' onChange={handleChange} required>
              {createDropdownOptions(elastomerColorOptions).map((item, index) => (
                <option key={index + 1} value={item.value}>
                  {item.text}
                </option>
              ))}
            </SelectInput>
          </Grid>
          <Grid tablet={{ col: 4 }}>
            <SelectInput name='erhv' label='ER H/V/X' onChange={handleChange} readOnly={isErColorNone}>
              {createDropdownOptions(elastomerHvxOptions).map((item, index) => (
                <option key={index + 1} value={item.value}>
                  {item.text}
                </option>
              ))}
            </SelectInput>
          </Grid>
        </Grid>
        <Grid row gap='md'>
          <Grid tablet={{ col: 3 }}>
            <SelectInput name='lscute' label='L Scute' onChange={handleChange}>
              {createDropdownOptions(scuteOptions).map((item, index) => (
                <option key={index + 1} value={item.value}>
                  {item.text}
                </option>
              ))}
            </SelectInput>
          </Grid>
          <Grid tablet={{ col: 3 }}>
            <SelectInput name='rscute' label='R Scute' onChange={handleChange}>
              {createDropdownOptions(scuteOptions).map((item, index) => (
                <option key={index + 1} value={item.value}>
                  {item.text}
                </option>
              ))}
            </SelectInput>
          </Grid>
          <Grid tablet={{ col: 3 }}>
            <SelectInput name='dscute' label='D Scute' onChange={handleChange}>
              {createDropdownOptions(scuteOptions).map((item, index) => (
                <option key={index + 1} value={item.value}>
                  {item.text}
                </option>
              ))}
            </SelectInput>
          </Grid>
        </Grid>
        <Grid row gap='md'>
          <Grid tablet={{ col: 3 }}>
            <SelectInput name='cwtyn' label='CWT' onChange={handleChange} required>
              {createDropdownOptions(yesNoOptions).map((item, index) => (
                <option key={index + 1} value={item.value}>
                  {item.text}
                </option>
              ))}
            </SelectInput>
          </Grid>
          <Grid tablet={{ col: 3 }}>
            <SelectInput name='dangler' label='Dangler' onChange={handleChange} required>
              {createDropdownOptions(yesNoOptions).map((item, index) => (
                <option key={index + 1} value={item.value}>
                  {item.text}
                </option>
              ))}
            </SelectInput>
          </Grid>
          <Grid tablet={{ col: 3 }}>
            <SelectInput name='pallidFate' label='Pallid Fate' onChange={handleChange} required={isPallidFateRequired}>
              {createDropdownOptions(pallidLocationStatusOptions).map((item, index) => (
                <option key={index + 1} value={item.value}>
                  {item.text}
                </option>
              ))}
            </SelectInput>
          </Grid>
          <Grid tablet={{ col: 3 }}>
            <SelectInput
              name='hatcheryOrigin'
              label='Hatchery Origin'
              onChange={handleChange}
              required={isHatcheryOriginRequired}
            >
              {createDropdownOptions(hatcheryOriginOptions).map((item, index) => (
                <option key={index + 1} value={item.value}>
                  {item.text}
                </option>
              ))}
            </SelectInput>
          </Grid>
        </Grid>
        <Grid row gap='md'>
          <Grid tablet={{ col: 3 }}>
            <SelectInput name='genetic' label='Genetics Y/N' onChange={handleChange} required={isGeneticsRequired}>
              {createDropdownOptions(yesNoOptions)
                .filter((item) => item.value !== 0)
                .map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.text}
                  </option>
                ))}
            </SelectInput>
          </Grid>
          <Grid tablet={{ col: 4 }}>
            <TextInput
              name='geneticsVialNumber'
              label='Genetics Vial #'
              type='text'
              readOnly={isGeneticsVialReadOnly}
              required={isGeneticsVialRequired}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Grid row gap='md'>
          <Grid tablet={{ col: 4 }}>
            <fieldset className='width-50 padding-0' id='geneticNeeds'>
              <Label className={genetic == 'Y' ? 'required' : ''} htmlFor='geneticNeeds'>
                <span id='geneticNeeds_label'>Genetic Analysis Needs</span>
              </Label>
              {geneticNeedsCheckboxes.map(({ name, label }) => (
                <Checkbox name={name} label={label} onChange={handleChange} tile errorName={errors?.checkboxGroup} />
              ))}
            </fieldset>
          </Grid>
          <Grid tablet={{ col: 8 }}>
            <TextArea name='otherTagInfo' label='Other Tag Info' placeholder='Value' onChange={handleChange}></TextArea>
            <TextArea name='suppComments' label='Comments' placeholder='Value' onChange={handleChange}></TextArea>
          </Grid>
        </Grid>
      </FormProvider>
    );
  }
);

export default SupplementalDataEntryForm;
