import { connect } from 'redux-bundler-react';
import { Button, Grid, Label, GridContainer, Fieldset } from '@trussworks/react-uswds';
import { useEffect, useState, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import classNames from 'classnames';
import { mdiMinus, mdiPlus } from '@mdi/js';
import { yupResolver } from '@hookform/resolvers/yup';

import ModalContent from '@src/app-components/modal/primary-modal/PrimaryModal.content';
import ModalFooter from '@src/app-components/modal/primary-modal/PrimaryModal.footer';
import DataHeader from '@src/app-pages/data-entry/datasheets/components/data-header/dataHeader';
import TextInput from '@components/new-inputs/text-input/TextInput';
import TextArea from '@components/new-inputs/text-area/TextArea';
import Checkbox from '@components/check-box/Checkbox';
import SelectInput from '@components/new-inputs/select-input/SelectInput';
import PallidIdOverview from './pallid-id-overview/pallidIdOverview';
import ErrorSummary from '@components/error-summary/ErrorSummary';
import Icon from '@components/icon/icon';

import { getSuppProcDefaultValues, suppProcValidationSchema } from './SupplementalProcedureModal.validation';
import { createDropdownOptions, isEmpty } from '@pages/data-entry/dataEntryHelper';

// import {
//   getOfflineDraft,
//   reloadOfflineDraft,
// } from '@src/app-pages/data-entry/offline/offlineHelper';
import { ApiStatuses, DataEntryStatuses, OfflineStatuses } from '@src/utils/enums';
import { isOnline } from '@src/app-pages/data-entry/offline/sync';
import { createData, updateData } from '@src/app-pages/data-entry/offline/api';

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

const SupplementalProcedureModal = connect(
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
  'selectUserRole',
  ({
    doGetPallidIdData,
    isEditForm,
    baseData,
    lookupData,
    doModalClose,
    dataEntrySupplemental,
    dataEntryProcedure,
    doSaveSupplementalDataEntry,
    doUpdateSupplementalDataEntry,
    doSaveProcedureDataEntry,
    doUpdateProcedureDataEntry,
    dataEntryLastParams,
    userRole,
    row: fishData,
  }) => {
    const { projectId } = baseData;
    // const { fid, mrFid, fFid, species } = fishData;

    // const supplementalDataExists = !!dataEntrySupplemental?.items?.filter((data) => data.fFid === fFid)?.length;
    // const procedureDataExists = !!dataEntryProcedure?.items?.filter((data) => data.fFid === fFid)?.length;

    // const initialSuppData = supplementalDataExists
    //   ? dataEntrySupplemental?.items?.filter((data) => data.fFid === fFid)[0]
    //   : null;
    // const initialProcData = procedureDataExists
    //   ? dataEntryProcedure?.items?.filter((data) => data.fFid === fFid)[0]
    //   : null;
    const fid = fishData?.fid ?? fishData?.fId ?? fishData?.f_id;
    const fFid = fishData?.fFid ?? fishData?.f_fid ?? fishData?.ffid;
    const mrFid = fishData?.mrFid ?? fishData?.mr_fid;
    const species = fishData?.species;

    const matchesFish = (row) => {
      const rowFid = row?.fid ?? row?.fId ?? row?.f_id;
      const rowFFid = row?.fFid ?? row?.f_fid ?? row?.ffid;

      return (
        (fid != null && rowFid != null && String(rowFid) === String(fid)) ||
        (fFid && rowFFid && String(rowFFid) === String(fFid))
      );
    };

    const initialSuppData = dataEntrySupplemental?.items?.find(matchesFish) ?? null;

    const suppId = initialSuppData?.sid ?? initialSuppData?.sId ?? initialSuppData?.s_id;
    const initialProcData =
      dataEntryProcedure?.items?.find((row) => {
        const procSuppId = row?.sid ?? row?.sId ?? row?.s_id;
        const matchesSupp = suppId != null && procSuppId != null && String(procSuppId) === String(suppId);

        return matchesSupp || matchesFish(row);
      }) ?? null;

    const supplementalDataExists = Boolean(initialSuppData);
    const procedureDataExists = Boolean(initialProcData);

    const suppDraftKey = `currentSupplementalDraft:${fFid}`;
    const procDraftKey = `currentProcedureDraft:${fFid}`;

    const saveBtnClasses = classNames('button-small', 'text-normal', 'save-btn');

    const {
      pitRnzOptions,
      elastomerColorOptions,
      elastomerHvxOptions,
      pallidLocationStatusOptions,
      hatcheryOriginOptions,
      purposeOptions,
      evalLocationOptions,
      sexOptions,
      reproductiveStatusOptions,
      frequencyId,
      spawnBehavior,
      yesNoOptions,
    } = lookupData;

    const [showProcedureSection, setShowProcedureSection] = useState(procedureDataExists);
    const [isSaving, setIsSaving] = useState(false);
    const saveInProgressRef = useRef(false);

    const schema = suppProcValidationSchema({
      projectId: projectId,
      species: species,
    });

    const defaultValues = {
      ...getSuppProcDefaultValues({
        edit: true,
        suppData: initialSuppData ?? {},
        procData: initialProcData ?? {},
        showProcedureSection: showProcedureSection,
      }),
    };

    const methods = useForm({
      defaultValues: defaultValues,
      resolver: yupResolver(schema),
      mode: 'onSubmit',
      reValidateMode: 'onChange',
      stateOptions: [],
      // shouldUnregister: true,
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

    const toggleProcedureSection = () => {
      setShowProcedureSection(!showProcedureSection);
      setValue('showProcedureSection', !showProcedureSection, { shouldValidate: true });
      clearErrors();
    };

    const tagnumber = watch('tagnumber');
    const pitrn = watch('pitrn');
    const isTagNumberRequired = pitrn !== null && pitrn !== undefined && pitrn !== '';

    const isTouched = Object.keys(touchedFields).length > 0;
    const isShowErrorSummary = !isValid && (isTouched || isDirty || submitCount > 0) && !isEmpty(errors);

    const [isElColorNone, setIsElColorNone] = useState(false);
    const [isErColorNone, setIsErColorNone] = useState(false);

    const elcolor = watch('elcolor');
    const ercolor = watch('ercolor');
    const genetic = watch('genetic');
    const geneticsVialNumber = watch('geneticsVialNumber');
    const purpose = watch('purpose');

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

    // Set Procedure Date to current date.
    const fillCurrentDate = () => {
      const today = new Date().toISOString().slice(0, 10);
      setValue('procedureDate', today, { shouldValidate: true });
    };
    // Set target field to current time.
    const fillCurrentTime = (field) => {
      const time = fmtTimeHHMMSS();
      setValue(field, time, { shouldValidate: true });
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

    // The Genetic Y/N field shall be required where species = USG and project = 2
    const isGeneticsRequired = Number(projectId) === 2 && species == 'USG';
    const [isGeneticsVialRequired, setIsGeneticsVialRequired] = useState(
      ['PDSG', 'USG'].includes(species) && genetic == 'Y'
    );

    // The system shall ensure the user cannot edit the Genetics Vial # unless Genetic Y/N = Y
    const [isGeneticsVialReadOnly, setIsGeneticsVialReadOnly] = useState(true);
    useEffect(() => {
      if (genetic == 'Y') {
        setValue('geneticsVialNumber', geneticsVialNumber ? geneticsVialNumber : geneticsVialPrefix);
        setIsGeneticsVialReadOnly(false);
        // ['PDSG', 'USG'].includes(species) && setIsGeneticsVialRequired(true);
      } else {
        if (geneticsVialNumber) {
          // TODO: this confirm dialog is a bit ugly; use a different confirm method?
          const confirmed =
            geneticsVialNumber === geneticsVialPrefix ||
            confirm('This will clear the Genetics Vial textbox. Do you want to make this change?');
          if (confirmed) {
            setValue('geneticsVialNumber', null);
            setIsGeneticsVialReadOnly(true);
            // ['PDSG', 'USG'].includes(species) && setIsGeneticsVialRequired(false);
          } else {
            setValue('genetic', 'Y');
          }
        } else {
          setIsGeneticsVialReadOnly(true);
        }
      }
    }, [genetic]);

    // The Pallid Fate field shall be required where project is not equal to 2
    const isPallidFateRequired = Number(projectId) !== 2;

    // The Hatchery Origin field shall be required where project is not equal to 2
    const isHatcheryOriginRequired = Number(projectId) !== 2;

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

    // if Procedure draft exists in sessionStorage (offline mode), load it into the form
    const getOfflineProcedureDraft = () => {
      const procDraftJson = sessionStorage.getItem(procDraftKey);
      // console.warn('getOfflineProcedureDraft - procDraftJson:', procDraftJson);
      if (!procDraftJson) return null;
      // console.warn('getOfflineProcedureDraft - procedure data found in sessionStorage - parsing JSON');
      try {
        const procDraft = JSON.parse(procDraftJson);
        if (!procDraft?.fFid) return null;
        if (String(procDraft.fFid) !== String(fFid)) {
          return null;
        }
        return procDraft;
      } catch (err) {
        console.error('Failed to parse offline Procedure draft for fFid:', fFid, err);
        return null;
      }
    };

    const reloadOfflineDrafts = () => {
      // if (isEditForm) return false;

      const suppDraft = getOfflineSupplementalDraft();
      const procDraft = getOfflineProcedureDraft();

      // console.warn('reloadOfflineDrafts - offline supplemental draft:', suppDraft, 'offline procedure draft:', procDraft);
      if (!suppDraft) return false;

      reset(
        {
          ...defaultValues,
          ...suppDraft,
          ...procDraft,
          // manually set/convert fields that have different names/formats in the form vs the draft object
          ...{
            broodstock: suppDraft?.broodstock === 1 ? true : false,
            hatchWild: suppDraft?.hatchWild === 1 ? true : false,
            speciesId: suppDraft?.speciesId === 1 ? true : false,
            archive: suppDraft?.archive === 1 ? true : false,
            project37: suppDraft?.project37 === 1 ? true : false,
            suppComments: suppDraft?.comments || null,
            pallidFate: suppDraft?.status || null,
            //proc data fields
            procComments: procDraft?.comments || null,
            antibioticInjection: procDraft?.antibioticInjection === 1 ? true : false,
            pVentral: procDraft?.pVentral === 1 ? true : false,
            pDorsal: procDraft?.pDorsal === 1 ? true : false,
            pLeft: procDraft?.pLeft === 1 ? true : false,
            dstReimplant: procDraft?.dstReimplant === 1 ? true : false,
            pi: procDraft?.pi === 1 ? true : false,
            bloodSample: procDraft?.bloodSample === 1 ? true : false,
            eggSample: procDraft?.eggSample === 1 ? true : false,
          },
        },
        {
          keepDirty: false,
          keepTouched: false,
        }
      );
      setShowProcedureSection(procDraft?.showProcedureSection ?? false);
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

    const formatProcDataObj = () => {
      const values = getValues();
      // Format any values need for final payload
      return {
        showProcedureSection: values?.showProcedureSection,
        id: initialProcData?.id,
        sid: initialSuppData?.sid,
        procedureDate: values?.procedureDate,
        procedureStartTime: values?.procedureStartTime,
        procedureEndTime: values?.procedureEndTime,
        purpose: values?.purpose,
        procedureBy: values?.procedureBy,
        antibioticInjection: values?.antibioticInjection === true ? 1 : 0,
        pVentral: values?.pVentral === true ? 1 : 0,
        pDorsal: values?.pDorsal === true ? 1 : 0,
        pLeft: values?.pLeft === true ? 1 : 0,
        fishHealthComment: values?.fishHealthComment,
        oldRadioTagNum: parseFloat(values?.oldRadioTagNum),
        oldFrequencyId: parseFloat(values?.oldFrequencyId),
        oldRtSerial: parseFloat(values?.oldRtSerial),
        oldDstSerial: parseFloat(values?.oldDstSerial),
        dstSerialNum: parseFloat(values?.dstSerialNum),
        dstStartDate: values?.dstStartDate,
        dstStartTime: values?.dstStartTime,
        dstReimplant: values?.dstReimplant === true ? 1 : 0,
        newRadioTagNum: parseFloat(values?.newRadioTagNum),
        newFreqId: parseFloat(values?.newFreqId),
        newRtSerial: parseFloat(values?.newRtSerial),
        sex: values?.sex,
        pi: values?.pi === true ? 1 : 0,
        bloodSample: values?.bloodSample === true ? 1 : 0,
        eggSample: values?.eggSample === true ? 1 : 0,
        spawnStatus: values?.spawnStatus,
        evalLocation: values?.evalLocation,
        visualReproStatus: values?.visualReproStatus,
        ultrasoundReproStatus: values?.ultrasoundReproStatus,
        expectedSpawnYear: parseFloat(values?.expectedSpawnYear),
        ultrasoundGonadLength: parseFloat(values?.ultrasoundGonadLength),
        gonadCondition: values?.gonadCondition,
        comments: values?.procComments,
      };
    };

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

    const doSubmit = async () => {
      if (saveInProgressRef.current) {
        console.warn('Supplemental/Procedure save is already in progress.');
        return;
      }
      saveInProgressRef.current = true;
      setIsSaving(true);

      try {
        const valid = await trigger();

        if (!valid) {
          console.warn('Supplemental/Procedure form validation failed:', errors);
          return;
        }
        // Format any values need for final payload
        const identifyingData = getIdentifyingData();
        const suppDataObj = formatSuppDataObj();
        const procDataObj = formatProcDataObj();
        // TODO: Maybe, unsure if necessary? Filter out any null/empty values for final payload
        // const suppPayload = filterNullEmptyObjects(suppDataObj);
        // const procPayload = filterNullEmptyObjects(procDataObj);

        const suppDraft = getOfflineSupplementalDraft();
        const suppClientId = suppDataObj.clientId ?? suppDraft?.clientId ?? crypto.randomUUID();

        const procDraft = getOfflineProcedureDraft();
        const procClientId = procDataObj.clientId ?? procDraft?.clientId ?? crypto.randomUUID();

        // TODO: the way we construct the payload in this block may be clunky; maybe refactor
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
        // console.warn('suppPayload', suppPayload);

        let procPayload = {
          ...identifyingData,
          ...procDraft,
          ...procDataObj,
          clientId: procClientId,
          f_id: identifyingData?.f_id,
          fId: identifyingData?.fId,
          fid: identifyingData?.fid,
          f_fid: identifyingData?.f_fid,
          fFid: identifyingData?.fFid,
          sid: procDataObj.sid ?? procDraft?.sid ?? initialSuppData?.sid,
          s_id: procDataObj.s_id ?? procDraft?.s_id ?? initialSuppData?.s_id,
          // Offline values
          _status: OfflineStatuses.Queued,
          version: procDataObj.version ?? procDraft?.version ?? 0,
          updatedAt: new Date().toISOString(),
        };
        // console.warn('procPayload', procPayload);

        const hasOfflineSuppDraft = Boolean(suppDraft?.clientId);
        const hasOfflineProcDraft = Boolean(procDraft?.clientId);

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

          if (showProcedureSection) {
            if (initialProcData || hasOfflineProcDraft) {
              await updateData('procedure', procClientId, procPayload);
            } else {
              await createData('procedure', procPayload);
            }
            sessionStorage.setItem(procDraftKey, JSON.stringify(procPayload));
          }
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

        // save procedure data if the section is visible (user has added procedure data)
        if (showProcedureSection) {
          try {
            if (initialProcData) {
              // console.warn('Online - Updating existing PROC data: ', { procPayload });
              await doUpdateProcedureDataEntry(procPayload);
            } else {
              // console.warn('Online - Creating PROC data: ', { procPayload });
              await doSaveProcedureDataEntry(procPayload);
            }
          } catch (error) {
            if (initialProcData || hasOfflineProcDraft) {
              // console.warn('OFFLINE - Updating existing PROC data: ', { procPayload });
              await updateData('procedure', procClientId, procPayload);
            } else {
              console.warn('OFFLINE - Creating PROC data: ', { procPayload });
              await createData('procedure', procPayload);
            }
          }
          // console.warn('done with PROC data save');
          // console.warn('procClientId', procClientId);
          // console.warn('procDraftKey', procDraftKey);

          // setValue('suppClientId', suppClientId);
          sessionStorage.setItem(procDraftKey, JSON.stringify(procPayload));
        }
        doModalClose();
      } catch (error) {
        console.error('Procedure submit failed, queueing offline:', error);
        window.alert(`Supplemental/Procedure save failed: ${error?.message ?? error}`);
      } finally {
        saveInProgressRef.current = false;
        setIsSaving(false);
      }
    };

    useEffect(() => {
      // console.warn('useEffect - isEditForm changed, reloading offline drafts');
      reloadOfflineDrafts();
    }, [isEditForm]);

    // TODO: this confirm dialog is a bit ugly
    const handleCancel = () => {
      if (isDirty) {
        const confirmed = confirm('Any changes will not be saved. Is this okay?');
        if (confirmed) {
          doModalClose();
        }
      } else {
        doModalClose();
      }
    };

    const checkboxAlignToInputStyle = { paddingTop: '2rem' };

    const allowedScuteValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const scuteOptions = allowedScuteValues.map((val) => ({
      code: val,
      description: val,
    }));

    const getTagnumberWarning = () => {
      const hasDecimal = String(tagnumber)?.includes('.');
      if (hasDecimal) {
        const parseVal = String(tagnumber)?.replace('.', '');
        return parseVal?.length < 14 && parseVal !== '' ? 'Value cannot be less than or greater than 14 digits' : null;
      } else {
        return tagnumber && String(tagnumber)?.length < 10
          ? 'Value cannot be less than or greater than 10 digits'
          : null;
      }
    };

    const tagNumberMaxLength = () => {
      const hasDecimal = String(tagnumber)?.includes('.');
      if (hasDecimal) {
        return 15;
      } else {
        return 10;
      }
    };

    return (
      <ModalContent size='lg' title='Supplemental & Procedure Data Entry'>
        {isShowErrorSummary && (
          <ErrorSummary
            errors={errors}
            // modalID='suppProcFormModal'
            type='modal'
            isValid={isValid}
            isExpandedInitially={false}
          />
        )}
        {/* may need to add to DataHeader */}
        <section className='modal-body' id='suppProcFormModal'>
          <DataHeader type='supp-proc' />
        </section>

        {/* <SupplementalDataEntryForm /> */}
        <FormProvider {...methods}>
          <GridContainer>
            <Grid row gap='md' className='padding-bottom-1'>
              <Grid tablet>
                <h3>
                  {isEditForm ? '' : 'Create'} Supplemental Data Entry {isEditForm ? 'Overview' : ''}
                </h3>
              </Grid>
            </Grid>
            <Grid row gap='md' className='padding-bottom-3'>
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
                <TextInput
                  name='tagnumber'
                  label='Tag Number'
                  onChange={handleChange}
                  required={isTagNumberRequired}
                  warning={getTagnumberWarning()}
                  maxLength={tagNumberMaxLength()}
                />
              </Grid>
              <Grid tablet={{ col: 2 }}>
                <Button className={saveBtnClasses} onClick={handleGetPallidIdByTagNumber} type='button'>
                  Pallid ID
                </Button>
              </Grid>
            </Grid>
          </GridContainer>
          {/* Pallid ID Data - Readonly */}
          <PallidIdOverview />
          {/* Form continues */}
          <GridContainer>
            <Grid row gap='md' className='padding-bottom-3'>
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
                <SelectInput
                  name='elhv'
                  label='EL H/V/X'
                  onChange={handleChange}
                  readOnly={isElColorNone}
                  required={elcolor !== null && elcolor !== '' && elcolor !== 'N'}
                >
                  {createDropdownOptions(elastomerHvxOptions).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
            </Grid>
            <Grid row gap='md' className='padding-bottom-3'>
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
                <SelectInput
                  name='erhv'
                  label='ER H/V/X'
                  onChange={handleChange}
                  readOnly={isErColorNone}
                  required={ercolor !== null && ercolor !== '' && ercolor !== 'N'}
                >
                  {createDropdownOptions(elastomerHvxOptions).map((item, index) => (
                    <option key={index + 1} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </SelectInput>
              </Grid>
            </Grid>
            <Grid row gap='md' className='padding-bottom-3'>
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
            <Grid row gap='md' className='padding-bottom-3'>
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
                <SelectInput
                  name='pallidFate'
                  label='Pallid Fate'
                  onChange={handleChange}
                  required={isPallidFateRequired}
                >
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
            <Grid row gap='md' className='padding-bottom-3'>
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
            <Grid row gap='md' className='padding-bottom-3'>
              <Grid tablet={{ col: 4 }}>
                <fieldset className='margin-left-1 width-50 padding-0' id='geneticNeeds'>
                  <Label className={genetic == 'Y' ? 'required' : ''} htmlFor='geneticNeeds'>
                    <span id='geneticNeeds_label'>Genetic Analysis Needs</span>
                  </Label>
                  {geneticNeedsCheckboxes.map(({ name, label }) => (
                    <Checkbox
                      name={name}
                      label={label}
                      onChange={handleChange}
                      tile
                      errorName={errors?.checkboxGroup}
                    />
                  ))}
                </fieldset>
              </Grid>
              <Grid tablet={{ col: 8 }}>
                <TextArea
                  name='otherTagInfo'
                  label='Other Tag Info'
                  placeholder='Value'
                  onChange={handleChange}
                ></TextArea>
                <TextArea name='suppComments' label='Comments' placeholder='Value' onChange={handleChange}></TextArea>
              </Grid>
            </Grid>
          </GridContainer>{' '}
          <GridContainer>
            <Grid row gap='md' className='padding-bottom-1'>
              <Grid tablet>
                <h3>Procedure Data</h3>
              </Grid>
              <Grid tablet={{ col: 3 }}>
                <Button
                  onClick={() => toggleProcedureSection()}
                  type='button'
                  accentStyle={showProcedureSection ? 'warm' : ''}
                >
                  <Icon
                    focusable={false}
                    className='margin-right-1'
                    path={showProcedureSection ? mdiMinus : mdiPlus}
                    size={'16px'}
                  />
                  {showProcedureSection ? 'Remove' : 'Add'} Procedure Data
                </Button>
              </Grid>
            </Grid>
          </GridContainer>
          {showProcedureSection && (
            <GridContainer>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='procedureDate' label='Procedure Date' type='date' onChange={handleChange} required />
                  <Button onClick={() => fillCurrentDate()} type='button'>
                    Capture Procedure Date
                  </Button>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='procedureStartTime' label='Start Time' onChange={handleChange} required />
                  <Button onClick={() => fillCurrentTime('procedureStartTime')} type='button'>
                    Capture Start Time
                  </Button>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='procedureEndTime' label='End Time' onChange={handleChange} required />
                  <Button onClick={() => fillCurrentTime('procedureEndTime')} type='button'>
                    Capture End Time
                  </Button>
                </Grid>
              </Grid>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 6 }}>
                  <SelectInput name='purpose' label='Purpose' onChange={handleChange} required>
                    {createDropdownOptions(purposeOptions).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
              </Grid>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 2 }}>
                  <TextInput name='procedureBy' label='Procedure By' onChange={handleChange} required />
                </Grid>
                <Grid tablet={{ col: 1 }}></Grid>
                <Grid tablet={{ col: 3 }} style={checkboxAlignToInputStyle}>
                  <Checkbox
                    // id='antibiotic-injection'
                    label='Antibiotic Injection'
                    name='antibioticInjection'
                    onChange={handleChange}
                    tile
                  />
                </Grid>
              </Grid>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 3 }}>
                  <Fieldset>
                    <Label htmlFor='procPhotosCheckboxGroup'>Photographs</Label>
                    <Checkbox name='pVentral' label='Head (Ventral)' onChange={handleChange} tile />
                    <Checkbox name='pDorsal' label='Head (Dorsal)' onChange={handleChange} tile />
                    <Checkbox name='pLeft' label='Head (Left Side)' onChange={handleChange} tile />
                  </Fieldset>
                </Grid>
                <Grid tablet={{ col: 6 }}>
                  <TextArea name='fishHealthComment' label='Fish Health Comments' onChange={handleChange} />
                </Grid>
              </Grid>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='oldRadioTagNum'
                    label='Old Radio Tag #'
                    type='text'
                    onChange={handleChange}
                    required={Number(purpose) === 2 || Number(purpose) === 5}
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput
                    name='oldFrequencyId'
                    label='Old Frequency ID'
                    onChange={handleChange}
                    required={Number(purpose) === 2 || Number(purpose) === 5}
                  >
                    {createDropdownOptions(frequencyId).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='oldRtSerial' label='Old RT Serial #' type='text' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 2 }}>
                  <TextInput name='oldDstSerial' label='Old DST Serial #' type='text' onChange={handleChange} />
                </Grid>
              </Grid>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='dstSerialNum' label='New/Current DST Serial #' type='text' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='dstStartDate' label='DST Start Date' type='date' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 2 }}>
                  <TextInput name='dstStartTime' label='DST Start Time' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 3 }} style={checkboxAlignToInputStyle}>
                  <Fieldset>
                    <Checkbox name='dstReimplant' label='DST Reimplanted' onChange={handleChange} tile />
                  </Fieldset>
                </Grid>
              </Grid>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='newRadioTagNum'
                    label='New/Current Radio Tag #'
                    type='text'
                    onChange={handleChange}
                    required={Number(purpose) !== 5 || Number(purpose) !== 6}
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput
                    name='newFreqId'
                    label='New/Current Frequency ID'
                    onChange={handleChange}
                    required={Number(purpose) !== 5 || Number(purpose) !== 6}
                  >
                    {createDropdownOptions(frequencyId).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='newRtSerial'
                    label='New/Current RT Serial #'
                    type='text'
                    onChange={handleChange}
                    required={Number(purpose) !== 5 || Number(purpose) !== 6}
                  />
                </Grid>
              </Grid>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='sex' label='Sex' onChange={handleChange}>
                    {createDropdownOptions(sexOptions).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 2 }} style={checkboxAlignToInputStyle}>
                  <Fieldset>
                    <Checkbox name='pi' label='PI' onChange={handleChange} tile />
                  </Fieldset>
                </Grid>
                <Grid tablet={{ col: 3 }} style={checkboxAlignToInputStyle}>
                  <Fieldset>
                    <Checkbox name='bloodSample' label='Blood Sample' onChange={handleChange} tile />
                  </Fieldset>
                </Grid>
                <Grid tablet={{ col: 3 }} style={checkboxAlignToInputStyle}>
                  <Fieldset>
                    <Checkbox name='eggSample' label='Egg Sample' onChange={handleChange} tile />
                  </Fieldset>
                </Grid>
              </Grid>
              <div className='border border-base-lighter radius-md padding-2 margin-bottom-3'>
                <h5>Spawned Evaluation</h5>
                <Grid row gap='md' className='padding-bottom-3'>
                  <Grid tablet={{ col: 4 }}>
                    <SelectInput
                      name='spawnStatus'
                      label='Spawn Evaluation'
                      onChange={handleChange}
                      readOnly={isElColorNone}
                    >
                      {createDropdownOptions(spawnBehavior).map((item, index) => (
                        <option key={index + 1} value={item.value}>
                          {item.text}
                        </option>
                      ))}
                    </SelectInput>
                  </Grid>
                  <Grid tablet={{ col: 4 }}>
                    <SelectInput name='evalLocation' label='Evaluation for Location' onChange={handleChange}>
                      {createDropdownOptions(evalLocationOptions).map((item, index) => (
                        <option key={index + 1} value={item.value}>
                          {item.text}
                        </option>
                      ))}
                    </SelectInput>
                  </Grid>
                </Grid>
              </div>
              <div className='border border-base-lighter radius-md padding-2 margin-bottom-3'>
                <h5>Reproductive Status</h5>
                <Grid row gap='md' className='padding-bottom-3'>
                  <Grid tablet={{ col: 6 }}>
                    <SelectInput name='visualReproStatus' label='Visual Assessment' onChange={handleChange}>
                      {createDropdownOptions(reproductiveStatusOptions).map((item, index) => (
                        <option key={index + 1} value={item.value}>
                          {item.text}
                        </option>
                      ))}
                    </SelectInput>
                  </Grid>
                </Grid>
                <Grid row gap='md' className='padding-bottom-3'>
                  <Grid tablet={{ col: 6 }}>
                    <SelectInput name='ultrasoundReproStatus' label='Ultrasound Assessment' onChange={handleChange}>
                      {createDropdownOptions(reproductiveStatusOptions).map((item, index) => (
                        <option key={index + 1} value={item.value}>
                          {item.text}
                        </option>
                      ))}
                    </SelectInput>
                  </Grid>
                </Grid>
                <Grid row gap='md' className='padding-bottom-3'>
                  <Grid tablet={{ col: 3 }}>
                    <TextInput name='expectedSpawnYear' label='Expected Spawn Year' />
                  </Grid>
                  <Grid tablet={{ col: 3 }}>
                    <TextInput name='ultrasoundGonadLength' label='Ultrasound Gonad Length' />
                  </Grid>
                  <Grid tablet={{ col: 3 }}>
                    <TextInput name='gonadCondition' label='Gonad Condition' />
                  </Grid>
                </Grid>
              </div>
              <Grid row gap='md' className='padding-bottom-3'>
                <Grid tablet={{ col: 8 }}>
                  <TextArea name='procComments' label='Comments' placeholder='Value'></TextArea>
                </Grid>
              </Grid>
            </GridContainer>
          )}
        </FormProvider>

        <ModalFooter showCancelButton onSave={() => doSubmit()} onCancel={() => handleCancel()} customClosingLogic />
      </ModalContent>
    );
  }
);

export default SupplementalProcedureModal;
