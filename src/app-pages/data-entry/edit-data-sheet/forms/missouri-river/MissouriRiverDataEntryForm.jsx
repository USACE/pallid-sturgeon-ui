import { useCallback, useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, Grid } from '@trussworks/react-uswds';
import { mdiCrosshairsGps } from '@mdi/js';

import ErrorSummary from '@src/app-components/error-summary/ErrorSummary';
import SelectInput from '@src/app-components/new-inputs/select-input/SelectInput';
import TextInput from '@src/app-components/new-inputs/text-input/TextInput';
import TextArea from '@src/app-components/new-inputs/text-area/TextArea';
import Icon from '@src/app-components/icon/icon';

import {
  getMissouriRiverDefaultValues,
  getMissouriRiverSchema,
  gearReqFields,
} from './MissouriRiverDataEntryForm.validation';
import { filterNullEmptyObjects, formatCoordFlt } from '@src/utils/helpers';
import Checkbox from '@src/app-components/check-box/Checkbox';
import { useGpsCapture } from '@src/app-components/gps/gpsCapture';
import {
  createDropdownOptions,
  currentDate,
  fmtTimeHHMMSS,
  isEmpty,
  removeDuplicates,
} from '@src/app-pages/data-entry/dataEntryHelper';
import { useUbloxSerialGps } from '@src/customHooks/useUbloxSerialGps';
import { captureGpsBest, GPS_OPTIONS } from '@src/app-pages/data-entry/offline/offlineHelper';
import { ApiStatuses, DataEntryStatuses, OfflineStatuses } from '@src/utils/enums';
import { createData, updateData } from '@src/app-pages/data-entry/offline/api';
import { db } from '@src/app-pages/data-entry/offline/db';
import { refreshSiteDatasheet } from '@src/app-pages/data-entry/offline/datasheet-refresh';

import '../../../dataentry.scss';
import NavigateWarningModal from '@src/common/modals/NavigateWarningModal';
import MicroBuilder from './MicroBuilder';

const MissouriRiverDataEntryForm = connect(
  'doModalOpen',
  'doUpdateBaseData',
  'doAddMoRiverDataEntry',
  'doUpdateMoRiverDataEntry',
  'doUpdateCurrentTab',
  'doUpdateUrl',
  'selectBaseData',
  'selectDataEntryData',
  'selectLookupData',
  'selectRouteParams',
  'selectDataEntryFishData',
  'selectDataEntryFishTotalCount',
  'selectCurrentTab',
  'selectMoriverSitesDraftDatasheetTotalResults',
  ({
    doModalOpen,
    doUpdateBaseData,
    doAddMoRiverDataEntry,
    doUpdateMoRiverDataEntry,
    doUpdateCurrentTab,
    doUpdateUrl,
    baseData,
    dataEntryData,
    lookupData,
    routeParams,
    dataEntryFishData,
    dataEntryFishTotalCount,
    currentTab,
    moriverSitesDraftDatasheetTotalResults,
  }) => {
    // Initialize GPS
    const { browserGps } = useGpsCapture(GPS_OPTIONS);
    const ubloxGps = useUbloxSerialGps();
    const {
      bendRiverMile: onlineBendRiverMile,
      bendSelections: onlineBendSelections,
      gearCodes: onlineGearCodes,
      filteredGearCodes: onlineFilteredGearCodes,
      gearTypes: onlineGearTypes,
      macros: onlineMacros,
      mesos: onlineMesos,
      macroMesos: onlineMacroMesos,
      microHabitats: onlineMicroHabitats,
      microStructures: onlineMicroStructures,
      u6Options: onlineU6Options,
      u7Options: onlineU7Options,
      microSetSite: onlineMicroSetSite,
      setSite1Options: onlineSetSite1Options,
      setSite2Options: onlineSetSite2Options,
      setSite3Options: onlineSetSite3Options,
      structureFlows: onlineStructureFlows,
      structureMods: onlineStructureMods,
      subsampleTypes: onlineSubsampleTypes,
    } = lookupData;
    const { bend, fieldoffice, season, projectId, segmentId } = baseData;
    const siteRouteKey = routeParams?.siteId;
    const isOfflineSite = String(siteRouteKey).startsWith('SITE-');
    const isOnline = navigator.onLine;

    const [gearCodeOptions, setGearCodeOptions] = useState(onlineGearCodes);
    const [mesoOptions, setMesoOptions] = useState(onlineMesos);
    const [offlineLookups, setOfflineLookups] = useState({
      bendRiverMile: [],
      bendSelections: [],
      gearCodes: [],
      filteredGearCodes: [],
      gearTypes: [],
      macros: [],
      mesos: [],
      macroMesos: [],
      microHabitats: [],
      microStructures: [],
      u6Options: [],
      u7Options: [],
      microSetSite: [],
      setSite1Options: [],
      setSite2Options: [],
      setSite3Options: [],
      structureFlows: [],
      structureMods: [],
      subsampleTypes: [],
    });
    const [submitMessage, setSubmitMessage] = useState(null);
    const [fishData, setFishData] = useState(dataEntryFishData?.items ?? []);

    // Fetch Offline Draft Data
    const moriverDraftKey = `currentMissouriRiverDraft:${siteRouteKey}`;
    const getOfflineDraft = () => {
      const savedDraft = sessionStorage.getItem(moriverDraftKey);
      if (!savedDraft) return null;

      try {
        const draft = JSON.parse(savedDraft);
        const draftMrId = draft?.mrId ?? draft?.mr_id;
        const draftMrFid = draft?.mrFid ?? draft?.mr_fid;
        if (!draftMrId && !draftMrFid) return null;

        const checkSiteId =
          String(draft?.siteRouteKey || draft?.siteFid || draft?.site_fid || draft?.siteId) !== String(siteRouteKey);
        if (checkSiteId) return null;

        return draft;
      } catch (err) {
        console.error('Failed to parse offline Missouri River draft:', err);
        return null;
      }
    };

    const draft = getOfflineDraft();

    const newForm = () => {
      if (isOnline) {
        return dataEntryData?.mrId ? false : true;
      } else {
        // check draft/submitted state
        return draft?.mrFid || dataEntryData?.mrFid ? false : true;
      }
    };

    const resolveLookup = (onlineRows, offlineRows) =>
      Array.isArray(onlineRows) && onlineRows.length > 0 ? onlineRows : (offlineRows ?? []);

    const bendRiverMile = resolveLookup(onlineBendRiverMile, offlineLookups.bendRiverMile);
    const bendSelections = resolveLookup(onlineBendSelections, offlineLookups.bendSelections);
    const gearCodes = resolveLookup(onlineGearCodes, offlineLookups.gearCodes);
    const filteredGearCodes = resolveLookup(onlineFilteredGearCodes, offlineLookups.filteredGearCodes);
    const gearTypes = resolveLookup(onlineGearTypes, offlineLookups.gearTypes);
    const macros = resolveLookup(onlineMacros, offlineLookups.macros);
    const mesos = resolveLookup(onlineMesos, offlineLookups.mesos);
    const macroMesos = resolveLookup(onlineMacroMesos, offlineLookups.macroMesos);
    const microHabitats = resolveLookup(onlineMicroHabitats, offlineLookups.microHabitats);
    const microStructures = resolveLookup(onlineMicroStructures, offlineLookups.microStructures);
    const u6Options = resolveLookup(onlineU6Options, offlineLookups.u6Options);
    const u7Options = resolveLookup(onlineU7Options, offlineLookups.u7Options);
    const microSetSite = resolveLookup(onlineMicroSetSite, offlineLookups.microSetSite);
    const setSite1Options = resolveLookup(onlineSetSite1Options, offlineLookups.setSite1Options);
    const setSite2Options = resolveLookup(onlineSetSite2Options, offlineLookups.setSite2Options);
    const setSite3Options = resolveLookup(onlineSetSite3Options, offlineLookups.setSite3Options);
    const structureFlows = resolveLookup(onlineStructureFlows, offlineLookups.structureFlows);
    const structureMods = resolveLookup(onlineStructureMods, offlineLookups.structureMods);
    const subsampleTypes = resolveLookup(onlineSubsampleTypes, offlineLookups.subsampleTypes);

    const ss3Options = removeDuplicates(
      setSite3Options?.map((item) => ({
        code: item.code,
        description: item.description,
      }))
    );

    const getUpperLowerRiverMile = (bend, segment) =>
      bendRiverMile?.filter((item) => item.bend === bend && item.segment === segment)?.[0];

    const getSeasonGearOfficeOptions = (season, fieldOffice, project) => {
      const options = filteredGearCodes.filter(
        (item) => item.fieldOfficeCode === fieldOffice && item.seasonCode === season && item.projectCode === project
      );
      return options.map((item) => ({
        code: item.gearCode,
        description: item.gear,
      }));
    };

    const getMacroMesoOptions = (macro) => {
      const options = macroMesos.filter((item) => item.macroHabitatCode === macro);
      return options.map((item) => ({ code: item.mesoHabitatCode }));
    };

    const handleMesoOptions = useCallback(
      (mesosData, gearType, gearCode, macro, season) => {
        let options = gearType === 'S' ? getMacroMesoOptions(macro) : mesosData;
        if (gearCode === 'TN') {
          options = options.filter((item) => item.code !== 'POOL');
        }
        if (gearCode.startsWith('GN')) {
          options = options.filter((item) => item.code !== 'BARS');
        }
        if (season !== 'HW') {
          options = options.filter((item) => item.code !== 'FMCD');
        }
        setMesoOptions(options);
      },
      [getMacroMesoOptions, setMesoOptions]
    );

    const defaultValues = getMissouriRiverDefaultValues({
      baseData,
      dataEntryData,
      fishCount: dataEntryFishTotalCount,
      moriverCount: moriverSitesDraftDatasheetTotalResults,
    });
    const hasPDSG =
      fishData.some(
        (item) =>
          String(item?.species || '')
            .trim()
            .toUpperCase() === 'PDSG'
      ) ?? false;

    const schema = getMissouriRiverSchema({
      riverMile: getUpperLowerRiverMile(bend, segmentId),
      hasPDSG,
    });

    // RHF Methods Config
    const methods = useForm({
      defaultValues: defaultValues,
      resolver: yupResolver(schema),
      mode: 'onSubmit',
      reValidateMode: 'onChange',
    });
    const {
      formState: { errors, isValid, touchedFields, submitCount, isDirty },
      setFocus,
      watch,
      getValues,
      trigger,
      setValue,
      handleSubmit,
      reset,
    } = methods;

    const shouldAutoValidate = submitCount > 0;

    const isTouched = Object.keys(touchedFields).length > 0;
    const isShowErrorSummary = !isValid && (isTouched || isDirty || submitCount > 0) && !isEmpty(errors);

    const deploymentType = watch('deploymentType');
    const macro = watch('macro');
    const gearCode = watch('gear');
    const gearType = watch('gearType');
    const setdate = watch('setdate');
    const subsamplepass = watch('subsamplepass');
    const netrivermile = watch('netrivermile');
    const stopTime = watch('stopTime');
    const temp = watch('temp');
    const depth1 = watch('depth1');
    const depth2 = watch('depth2');
    const depth3 = watch('depth3');
    const velocitybot1 = watch('velocitybot1');
    const velocity081 = watch('velocity081');
    const u7 = watch('u7');
    const mrFid = watch('mrFid');
    const seFid = watch('seFid');

    const hasFishRecords = isOnline ? dataEntryFishTotalCount > 0 : fishData?.length > 0;

    const isStartTimeDisabled =
      gearCode.startsWith('LDN') &&
      (velocitybot1 === null || velocitybot1 === '' || velocity081 === null || velocity081 === '');

    const getTempWarning = () => {
      if (temp > 30) {
        return 'Temp is greater than 30';
      } else if (temp >= 12.8 && gearCode.startsWith('GN')) {
        return 'Temp >= 12.8 for a gill net gear code';
      } else {
        return;
      }
    };

    const getDepthWarning = (depth) => {
      if (depth > 10) {
        return 'Depth is greater than 10';
      }
      return;
    };

    const formatDataObj = () => {
      const values = getValues();
      // Format any values need for final payload
      return {
        ...values,
        bendrivermile: parseFloat(values?.bendrivermile),
        depth1: parseFloat(values?.depth1),
        depth2: parseFloat(values?.depth2),
        depth3: parseFloat(values?.depth3),
        distance: parseFloat(values?.distance),
        startLatitude: formatCoordFlt(values.startLatitude) ?? '',
        startLongitude: formatCoordFlt(values.startLongitude) ?? '',
        stopLatitude: formatCoordFlt(values.stopLatitude) ?? '',
        stopLongitude: formatCoordFlt(values.stopLongitude) ?? '',
        subsample: parseFloat(values?.subsample),
        subsamplepass: parseFloat(values?.subsample),
        temp: parseFloat(values?.temp),
        u2: String(values?.u2),
        velocitybot1: parseFloat(values?.velocitybot1),
        velocity081: parseFloat(values?.velocity081),
        velocity02or061: parseFloat(values?.velocity02or061),
        velocitybot2: parseFloat(values?.velocitybot2),
        velocity082: parseFloat(values?.velocity082),
        velocity02or062: parseFloat(values?.velocity02or062),
      };
    };

    // Capture Start and Stop Lat, Long, Time
    const handleCapture = async (type) => {
      try {
        const { best } = await captureGpsBest({ browserGps, ubloxGps });

        setValue(`${type}Latitude`, best.lat, { shouldValidate: shouldAutoValidate });
        setValue(`${type}Longitude`, best.lng, { shouldValidate: shouldAutoValidate });
        setValue(`${type}Time`, fmtTimeHHMMSS(best.capturedAt), { shouldValidate: shouldAutoValidate });

        window.alert(
          `Captured ${type === 'start' ? 'START' : 'STOP'}\nlat=${best.lat}\nlng=${best.lng}\nacc=${Math.round(best.accuracy)}m`
        );
      } catch (e) {
        console.error(e);
        window.alert(`GPS capture failed: ${e?.message || e}`);
      }
    };

    const handleChange = (e) => {
      const name = e?.target?.name;
      const val = e?.target?.value;
      name === 'recorder' && setValue('recorder', val?.toUpperCase());
    };

    const doSaveDraft = async () => {
      if (!isValid) return;

      const dataObj = formatDataObj();
      const clientId = dataObj?.clientId ?? dataEntryData?.clientId ?? crypto.randomUUID();

      const mrFid = dataObj?.mrFid ?? dataObj?.mr_fid;

      const payload = filterNullEmptyObjects({
        ...dataObj,
        clientId,
        mrFid,
        mr_fid: mrFid,
        siteId: isOfflineSite ? undefined : Number(siteRouteKey),
        site_id: isOfflineSite ? undefined : Number(siteRouteKey),
        siteFid: isOfflineSite ? siteRouteKey : dataObj?.siteFid,
        site_fid: isOfflineSite ? siteRouteKey : dataObj?.site_fid,
        siteRouteKey,
        status: DataEntryStatuses.Draft,
        _status: 'draft',
        version: dataObj.version ?? 0,
        updatedAt: new Date().toISOString(),
      });

      const finalMrId = payload?.mrId ?? payload?.mr_id;
      const finalMrFid = payload?.mrFid ?? payload?.mr_fid;

      if (!finalMrId && !finalMrFid) {
        console.error('Missing mrFid. Cannot save Missouri River draft.');
        return;
      }

      try {
        if (isOnline) {
          newForm() ? doAddMoRiverDataEntry(payload) : doUpdateMoRiverDataEntry(payload);
        } else {
          await db.moriver.put(payload);
        }
        sessionStorage.setItem(moriverDraftKey, JSON.stringify(payload));

        setValue('clientId', clientId);
        setValue('mrFid', payload?.mrFid);
        setValue('status', DataEntryStatuses.Draft);
      } catch (error) {
        console.error('Save draft failed:', error);

        if (!isOnline) {
          await db.moriver.put(payload);
          sessionStorage.setItem(moriverDraftKey, JSON.stringify(payload));
        }
      }
    };

    const doSubmit = async () => {
      setValue('status', DataEntryStatuses.Submitted);
      const dataObj = formatDataObj();
      if (isOnline) {
        // Submit online
        const payload = filterNullEmptyObjects(dataObj);
        if (!payload.mrFid) {
          console.error('Missing mrFid. Cannot submit Missouri River form.');
          return;
        }
        newForm() ? doAddMoRiverDataEntry(payload) : doUpdateMoRiverDataEntry(payload);
      } else {
        // Submit offline
        const clientId = dataObj.clientId ?? draft?.clientId ?? dataEntryData?.clientId ?? crypto.randomUUID();
        const formattedValues = {
          ...draft,
          ...dataObj,
          clientId,
          siteId: isOfflineSite ? undefined : Number(dataObj.siteId ?? draft?.siteId ?? siteRouteKey),
          site_id: isOfflineSite
            ? undefined
            : Number(dataObj.site_id ?? dataObj.siteId ?? draft?.site_id ?? draft?.siteId ?? siteRouteKey),
          siteFid: isOfflineSite ? siteRouteKey : (dataObj.siteFid ?? draft?.siteFid ?? baseData?.siteFid),
          site_fid: isOfflineSite ? siteRouteKey : (dataObj.site_fid ?? draft?.site_fid ?? baseData?.site_fid),
          siteRouteKey,
          status: DataEntryStatuses.Submitted,
          _status: OfflineStatuses.Queued,
          version: dataObj.version ?? draft?.version ?? 0,
          updatedAt: new Date().toISOString(),
        };
        const payload = filterNullEmptyObjects(formattedValues);
        const finalMrId = payload?.mrId ?? payload?.mr_id;
        const finalMrFid = payload?.mrFid ?? payload?.mr_fid;
        if (!finalMrId && !finalMrFid) {
          console.error('Missing mrFid. Cannot submit Missouri River form.');
          return;
        }

        try {
          newForm() ? await createData('moriver', payload) : await updateData('moriver', clientId, payload);
        } catch (error) {
          console.error('Submit failed, queueing offline:', error);
          newForm() ? await createData('moriver', payload) : await updateData('moriver', clientId, payload);
        }
        setValue('clientId', clientId);
        setValue('status', DataEntryStatuses.Submitted);
        setValue('mrFid', payload.mrFid ?? payload.mr_fid);
        sessionStorage.removeItem(moriverDraftKey);
      }
      refreshSiteDatasheet();
      setSubmitMessage({
        type: ApiStatuses.Success,
        text: isOnline
          ? 'Missouri River form submitted successfully.'
          : 'Missouri River form saved offline successfully. It will sync when you are back online.',
      });
    };

    const handleSaveAndClose = (isSubmit = false) => {
      // Save/Submit Form
      isSubmit ? doSubmit() : doSaveDraft();
      // Navigate to Fish Data Entry Form Tab
      doUpdateUrl(`/sites-list/${siteRouteKey}`);
    };

    const handleSaveAndFish = (isSubmit = false) => {
      // Save/Submit Form
      isSubmit ? doSubmit() : doSaveDraft();
      // Navigate to Fish Data Entry Form Tab
      doUpdateCurrentTab(1);
    };

    const handleClose = () => doModalOpen(NavigateWarningModal, { url: `/sites-list/${siteRouteKey}` });

    const reloadOfflineDraft = () => {
      if (!draft) return false;
      reset(
        {
          ...defaultValues,
          ...draft,
          fishCount: Number(draft.fishCount || dataEntryFishTotalCount || fishData?.length || 0),
        },
        {
          keepDirty: false,
          keepTouched: false,
        }
      );
      return true;
    };

    useEffect(() => {
      reloadOfflineDraft();
    }, [dataEntryFishTotalCount, currentTab]);

    // Set R/N value
    useEffect(() => {
      setValue('subsamplen', subsamplepass > 1 || u7 === 'BS' ? 'N' : 'R');
    }, [subsamplepass]);

    // Set Gear Code options and reset Gear Code value when necessary
    useEffect(() => {
      setValue('gear', '');
      setGearCodeOptions(gearType === 'S' ? getSeasonGearOfficeOptions(season, fieldoffice, projectId) : gearCodes);
    }, [gearType]);

    // Set Meso options and reset Meso value when necessary
    useEffect(() => {
      setValue('meso', '');
      handleMesoOptions(mesos, gearType, gearCode, macro, season);
    }, [mesos, gearType, gearCode, macro, season]);

    // Both Velocity (bot) 1 and Velocity (0.8 or 0.5) 1 must be filled out before setting the start time when using a Larval Drift Net gear.
    useEffect(() => {
      if (gearCode.startsWith('LDN') && velocitybot1 === null && velocity081 === null) {
        // Reset start time under these conditions
        setValue('startTime', '', { shouldValidate: shouldAutoValidate });
      }
    }, [gearCode, velocitybot1, velocity081, shouldAutoValidate]);

    useEffect(() => {
      if (gearCode) {
        setValue('deploymentType', gearCodes.filter((gear) => gear.code === gearCode)?.[0]?.deploymentType);
        if (newForm()) {
          if (gearCode === 'TLC1') {
            setValue('u2', 20);
          }
          if (gearCode === 'TLC2') {
            setValue('u2', 40);
          }
        }
      }
    }, [gearCode]);

    // Populate Gear Code Dropdown Value from Existing API Data
    useEffect(() => {
      if (gearCodeOptions.length > 0) {
        if (dataEntryData?.gear) {
          setValue('gear', dataEntryData?.gear);
        }
      }
    }, [dataEntryData, gearCodeOptions]);

    // Populate Meso Dropdown Value from Existing API Data
    useEffect(() => {
      if (mesoOptions.length > 0) {
        if (dataEntryData?.meso) {
          setValue('meso', dataEntryData?.meso);
        }
      }
    }, [dataEntryData, mesoOptions]);

    // netrivermile in baseData
    useEffect(() => {
      doUpdateBaseData('netrivermile', netrivermile);
    }, [netrivermile]);

    useEffect(() => {
      setFocus(errors?.[Object.keys(errors)[0]]?.['ref']?.['id']);
    }, [errors, setFocus]);

    // Get Offline Fish Data
    useEffect(() => {
      const populateOfflineFishData = async (id) => {
        const cachedData = await db.fish.toArray();
        // Determine whether to search via Table ID or Field ID
        const filteredCachedData = cachedData.filter((item) => String(item?.mrFid) === String(id));
        setFishData(filteredCachedData);
      };
      // Only run when offline in offline status and mrFid exists
      !isOnline && mrFid !== '' && populateOfflineFishData(mrFid);
      isOnline && setFishData(dataEntryFishData?.items);
    }, [mrFid, , isOnline, currentTab, dataEntryFishData, setFishData]);

    return (
      <FormProvider {...methods}>
        {isShowErrorSummary && <ErrorSummary errors={errors} type='form' isValid={isValid} />}
        {submitMessage && (
          <div className={`usa-alert usa-alert--${submitMessage.type}`} role='status'>
            <div className='usa-alert__body'>
              <p className='usa-alert__text'>{submitMessage.text}</p>
            </div>
          </div>
        )}
        <div className='container-fluid test-moriver margin-top-1'>
          <Grid row gap='md'>
            <Grid tablet={{ col: 2 }}>
              <p>
                MR Field ID (Date-Time-SE#):<br></br>
                <span className='text-bold'>{mrFid}</span>
              </p>
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <p>
                SE Field ID (Date-Time-SE#):<br></br>
                <span className='text-bold'>{seFid !== '' ? seFid : '--'}</span>
              </p>
            </Grid>
            <Grid tablet={{ col: 8 }}>
              {!hasFishRecords ? (
                <Button className='add-btn save-btn' onClick={handleSubmit(doSaveDraft)} type='button'>
                  Save as Draft
                </Button>
              ) : (
                <Button className='add-btn save-btn' onClick={handleSubmit(doSubmit)} type='button'>
                  Submit
                </Button>
              )}
              <Button
                className='add-btn save-btn'
                onClick={handleSubmit(() => handleSaveAndClose(hasFishRecords))}
                type='button'
              >
                Save & Close
              </Button>
              <Button
                className='add-btn save-btn'
                onClick={handleSubmit(() => handleSaveAndFish(hasFishRecords))}
                type='button'
              >
                Save & Open Fish Datasheet
              </Button>
              <Button className='close-btn save-btn' onClick={handleClose} type='button'>
                Close
              </Button>
            </Grid>
          </Grid>

          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 2 }}>
              <TextInput
                name='setdate'
                label='Set Date'
                type='date'
                onChange={handleChange}
                disabled={deploymentType === 'p' && setdate !== currentDate}
                required
              />
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <TextInput name='subsample' label='Subsample' type='number' onChange={handleChange} required />
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <TextInput name='subsamplepass' label='Pass' type='number' onChange={handleChange} required />
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <SelectInput name='subsamplen' label='Subsample R/N' onChange={handleChange} required>
                {createDropdownOptions(bendSelections).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </SelectInput>
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <SelectInput name='subsampleType' label='Subsample Type' onChange={handleChange} required>
                {createDropdownOptions(subsampleTypes).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </SelectInput>
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <SelectInput name='gearType' label='Gear Type' onChange={handleChange} required>
                {createDropdownOptions(gearTypes).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.text}
                  </option>
                ))}
              </SelectInput>
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <SelectInput name='gear' label='Gear Code' onChange={handleChange} required>
                {createDropdownOptions(gearCodeOptions).map((item, index) => (
                  <option key={index + 1} value={item.value}>
                    {item.value}
                  </option>
                ))}
              </SelectInput>
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <TextInput
                name='recorder'
                label='Recorder'
                maxLength={3}
                onChange={handleChange}
                style={{ textTransform: 'uppercase' }}
                required
              />
            </Grid>
          </Grid>

          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 4 }} className='border-right'>
              <Grid row gap='md'>
                <Grid tablet={{ col: 6 }}>
                  <SelectInput name='macro' label='Macro' onChange={handleChange} required>
                    {createDropdownOptions(macros).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.value}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 6 }}>
                  <SelectInput name='meso' label='Meso' onChange={handleChange} required>
                    {createDropdownOptions(mesoOptions).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.value}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 6 }}>
                  <TextInput
                    name='temp'
                    label='Temp (c)'
                    type='number'
                    onChange={handleChange}
                    required
                    warning={getTempWarning()}
                  />
                </Grid>
                <Grid tablet={{ col: 6 }}>
                  <TextInput
                    name='width'
                    label='Width'
                    type='number'
                    onChange={handleChange}
                    isMuted={gearType === 'S'}
                  />
                </Grid>
              </Grid>
            </Grid>

            <MicroBuilder shouldAutoValidate={shouldAutoValidate} />
          </Grid>

          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 5 }} className='border-right'>
              <Grid row gap='md'>
                <Grid tablet={{ col: 4 }}>
                  <TextInput
                    name='startTime'
                    label='Start Time'
                    onChange={handleChange}
                    required={!isStartTimeDisabled}
                    readOnly={isStartTimeDisabled}
                  />
                </Grid>
                <Grid tablet={{ col: 4 }}>
                  <TextInput
                    name='startLatitude'
                    label='Start Latitude'
                    type='number'
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid tablet={{ col: 4 }}>
                  <TextInput
                    name='startLongitude'
                    label='Start Longitude'
                    type='number'
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid row gap='md' table={{ col: 3 }}>
                  <Button
                    onClick={() => handleCapture('start')}
                    type='button'
                    className='primary-btn margin-left-1 margin-top-1'
                  >
                    <Icon path={mdiCrosshairsGps} className='margin-right-1' />
                    Capture Start GPS
                  </Button>
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='distance'
                    label='Distance'
                    type='number'
                    onChange={handleChange}
                    required={gearType === 'S' && gearReqFields.distance.includes(gearCode) ? true : false}
                    isMuted={gearType === 'S' && gearReqFields.distance.includes(gearCode) ? false : true}
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='depth1'
                    label='1-Depth'
                    onChange={handleChange}
                    required={gearType === 'S' && gearReqFields.depth1.includes(gearCode) ? true : false}
                    isMuted={gearType === 'S' && gearReqFields.depth1.includes(gearCode) ? false : true}
                    type='number'
                    warning={getDepthWarning(depth1)}
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='depth2'
                    label='2-Depth'
                    onChange={handleChange}
                    required={gearType === 'S' && gearReqFields.depth2.includes(gearCode) ? true : false}
                    isMuted={gearType === 'S' && gearReqFields.depth2.includes(gearCode) ? false : true}
                    type='number'
                    warning={getDepthWarning(depth2)}
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='depth3'
                    label='3-Depth'
                    onChange={handleChange}
                    required={gearType === 'S' && gearReqFields.depth3.includes(gearCode) ? true : false}
                    isMuted={gearType === 'S' && gearReqFields.depth3.includes(gearCode) ? false : true}
                    type='number'
                    warning={getDepthWarning(depth3)}
                  />
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 4 }}>
                  <TextInput
                    name='stopTime'
                    label='Stop Time'
                    onChange={handleChange}
                    warning={
                      deploymentType === 'p' && (stopTime === null || stopTime === '') && !hasFishRecords
                        ? 'Deployment type = p but the stop time is not filled in'
                        : null
                    }
                    required={deploymentType === 'p' && hasFishRecords}
                  />
                </Grid>
                <Grid tablet={{ col: 4 }}>
                  <TextInput
                    name='stopLatitude'
                    label='Stop Latitude'
                    onChange={handleChange}
                    required={deploymentType === 'a' && gearCode.startsWith('LDN')}
                  />
                </Grid>
                <Grid tablet={{ col: 4 }}>
                  <TextInput
                    name='stopLongitude'
                    label='Stop Longitude'
                    onChange={handleChange}
                    required={deploymentType === 'a' && gearCode.startsWith('LDN')}
                  />
                </Grid>
                <Grid row gap='md' table={{ col: 3 }}>
                  <Button
                    onClick={() => handleCapture('stop')}
                    type='button'
                    className='primary-btn margin-left-1 margin-top-1'
                  >
                    <Icon path={mdiCrosshairsGps} className='margin-right-1' />
                    Capture Stop GPS
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid tablet={{ col: 7 }}>
              <Grid row gap='md'>
                <Grid tablet={{ col: 1 }}>
                  <TextInput name='u1' label='U1' required={Number(projectId) === 3} onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 1 }}>
                  <TextInput
                    name='u2'
                    label='U2'
                    onChange={handleChange}
                    required={Number(projectId) === 1 && gearCode.startsWith('TL')}
                    type={gearCode.startsWith('TL') ? 'number' : 'text'}
                  />
                </Grid>
                <Grid tablet={{ col: 1 }}>
                  <TextInput name='u3' label='U3' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 1 }}>
                  <TextInput name='u4' label='U4' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 2 }}>
                  <TextInput name='u5' label='U5' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='u6' label='U6' onChange={handleChange}>
                    {u6Options.map((item, index) => (
                      <option key={index + 1} value={item.code}>
                        {item.description}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <SelectInput name='u7' label='U7' onChange={handleChange}>
                    {createDropdownOptions(u7Options).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 3 }}>
                  <TextInput
                    name='structurenumber'
                    label='Structure Number'
                    onChange={handleChange}
                    required={Number(projectId) === 2 && season === 'HS'}
                  />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='netrivermile' label='Net River Mile' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='conductivity' label='Conductivity' onChange={handleChange} />
                </Grid>
                <Grid tablet={{ col: 3 }}>
                  <TextInput name='dissolvedOxygen' label='Dissolved Oxygen (D.O.)' onChange={handleChange} />
                </Grid>
              </Grid>
              {isOnline && (
                <Grid row gap='md'>
                  <Grid tablet={{ col: 3 }}>
                    <TextInput name='usgs' label='USGS' isMuted />
                  </Grid>
                  <Grid tablet={{ col: 3 }}>
                    <TextInput name='riverstage' label='River Stage' isMuted />
                  </Grid>
                  <Grid tablet={{ col: 3 }}>
                    <TextInput name='discharge' label='Discharge' isMuted />
                  </Grid>
                  <Grid tablet={{ col: 3 }}>
                    <TextInput name='habitatrn' label='Habitat R/N' isMuted />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 4 }} className='border-right'>
              <Grid row gap='md'>
                <Grid tablet={{ col: 4 }}>
                  <TextInput
                    name='velocitybot1'
                    label='1-Velocity (bot)'
                    onChange={handleChange}
                    required={
                      hasPDSG && gearType === 'S' && gearReqFields.velocitybot1.includes(gearCode) ? true : false
                    }
                    isMuted={
                      hasPDSG && gearType === 'S' && gearReqFields.velocitybot1.includes(gearCode) ? false : true
                    }
                    type='number'
                  />
                </Grid>
                <Grid tablet={{ col: 4 }}>
                  <TextInput
                    name='velocity081'
                    label='1-Velocity (0.8 or 0.5)'
                    onChange={handleChange}
                    required={
                      hasPDSG &&
                      gearType === 'S' &&
                      gearReqFields.velocity081.includes(gearCode) &&
                      Number(depth2) >= 1.2
                        ? true
                        : false
                    }
                    isMuted={
                      hasPDSG &&
                      gearType === 'S' &&
                      gearReqFields.velocity081.includes(gearCode) &&
                      Number(depth2) >= 1.2
                        ? false
                        : true
                    }
                    type='number'
                  />
                </Grid>
                <Grid tablet={{ col: 4 }}>
                  <TextInput
                    name='velocity02or061'
                    label='1-Velocity (0.2 or 0.6)'
                    type='number'
                    onChange={handleChange}
                    isMuted={true}
                  />
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 4 }}>
                  <TextInput
                    name='velocitybot2'
                    label='2-Velocity (bot)'
                    onChange={handleChange}
                    required={
                      hasPDSG && gearType === 'S' && gearReqFields.velocitybot2.includes(gearCode) ? true : false
                    }
                    isMuted={
                      hasPDSG && gearType === 'S' && gearReqFields.velocitybot2.includes(gearCode) ? false : true
                    }
                    type='number'
                  />
                </Grid>
                <Grid tablet={{ col: 4 }}>
                  <TextInput
                    name='velocity082'
                    label='2-Velocity (0.8 or 0.5)'
                    onChange={handleChange}
                    required={
                      hasPDSG &&
                      gearType === 'S' &&
                      gearReqFields.velocity082.includes(gearCode) &&
                      Number(depth2) >= 1.2
                        ? true
                        : false
                    }
                    isMuted={
                      hasPDSG &&
                      gearType === 'S' &&
                      gearReqFields.velocity082.includes(gearCode) &&
                      Number(depth2) >= 1.2
                        ? false
                        : true
                    }
                    type='number'
                  />
                </Grid>
                <Grid tablet={{ col: 4 }}>
                  <TextInput
                    name='velocity02or062'
                    label='2-Velocity (0.2 or 0.6)'
                    onChange={handleChange}
                    required={
                      hasPDSG && gearType === 'S' && gearReqFields.velocity02or062.includes(gearCode) ? true : false
                    }
                    isMuted={
                      hasPDSG && gearType === 'S' && gearReqFields.velocity02or062.includes(gearCode) ? false : true
                    }
                    type='number'
                  />
                </Grid>
              </Grid>
            </Grid>
            {isOnline && (
              <Grid tablet={{ col: 4 }}>
                <Grid row gap='md'>
                  <Grid tablet={{ col: 5 }}>
                    <TextInput name='cobble' label='Cobble' isMuted />
                  </Grid>
                  <Grid tablet={{ col: 5 }}>
                    <TextInput name='silt' label='Silt' isMuted />
                  </Grid>
                </Grid>
                <Grid row gap='md'>
                  <Grid tablet={{ col: 5 }}>
                    <TextInput name='organic' label='Organic' isMuted />
                  </Grid>
                  <Grid tablet={{ col: 5 }}>
                    <TextInput name='sand' label='Sand' isMuted />
                  </Grid>
                </Grid>
                <Grid row gap='md'>
                  <Grid tablet={{ col: 5 }}>
                    <TextInput name='gravel' label='Gravel' isMuted />
                  </Grid>
                </Grid>
              </Grid>
            )}
            <Grid tablet={{ col: 2 }}>
              <Grid row gap='md'>
                <Grid tablet={{ col: 6 }}>
                  <TextInput name='turbidity' label='Turbidity' type='number' onChange={handleChange} />
                </Grid>
              </Grid>
              {/* @TODO: Hide No Turbidity and No Velocity fields in Offline Mode */}
              <Grid row gap='md' className='margin-top-2'>
                <Grid tablet={{ col: 12 }}>
                  <Checkbox disabled id='no-turbidity' label='No Turbidity' name='noTurbidity' tile value='Y' />
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 12 }}>
                  <Checkbox disabled id='no-velocity' label='No Velocity' name='noVelocity' tile value='Y' />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid row gap='md' className='padding-bottom-3'>
            <Grid tablet={{ col: 4 }} offset={6}>
              <Grid row gap='md'>
                <Grid tablet={{ col: 12 }}>
                  <TextArea name='comments' label='Comments' onChange={handleChange} />
                </Grid>
              </Grid>
            </Grid>
            <Grid tablet={{ col: 1 }}>
              <Grid row gap='md'>
                <Grid tablet={{ col: 12 }}>
                  <TextInput name='editInitials' label='Edit Initials' maxLength={3} onChange={handleChange} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </FormProvider>
    );
  }
);

export default MissouriRiverDataEntryForm;
