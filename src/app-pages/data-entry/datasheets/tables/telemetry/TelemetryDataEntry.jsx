import React, { useRef, useCallback, useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import _isEqual from 'lodash/isEqual';
import { mdiContentCopy } from '@mdi/js';
import { Button } from '@trussworks/react-uswds';

import { useGpsCapture } from '@src/app-components/gps/gpsCapture';
import { useUbloxSerialGps } from '@src/customHooks/useUbloxSerialGps';
import { getLookupOptions } from '@src/app-pages/data-entry/offline/lookup-cache';
import { createData, updateData, isOnline } from '@src/app-pages/data-entry/offline/api';

import DataEntryTable from '@src/app-components/table/data-entry-table/DataEntryTable';
import Icon from '@src/app-components/icon/icon';

import {
  telemetryDataEntrySchema,
  getBaseDefaultValues,
  getTelemetryDefaultValues,
} from './TelemetryDataEntry.validation';
import { getTelemetryColumns } from './helpers.telemetry';
import { db } from '@src/app-pages/data-entry/offline/db';

import '@pages/data-summaries/data-summary.scss';
import '@pages/data-entry/dataentry.scss';
import { formatGpsCoordinate } from '@src/app-pages/data-entry/dataEntryHelper';

const USE_UBLOX_POC = import.meta.env.VITE_USE_UBLOX_POC === 'true';
console.log('GPS POC flag', import.meta.env.VITE_USE_UBLOX_POC, USE_UBLOX_POC);

const GPS_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

const createBlankTelemetryRow = () => ({
  _isPlaceholderRow: true,
  _isTouched: false,
});

const isUntouchedPlaceholderTelemetryRow = (row) => row?._isPlaceholderRow === true && row?._isTouched !== true;

const ensureTrailingBlankTelemetryRow = (rows) => {
  const normalizedRows = rows ?? [];

  if (normalizedRows.length === 0) {
    return [createBlankTelemetryRow()];
  }

  const lastRow = normalizedRows[normalizedRows.length - 1];
  if (isUntouchedPlaceholderTelemetryRow(lastRow)) {
    return normalizedRows;
  }

  return [...normalizedRows, createBlankTelemetryRow()];
};

const getNextTelemetryId = (rows, parentSeId, parentSeFid) => {
  const telRows = (rows ?? []).filter((row) => !isUntouchedPlaceholderTelemetryRow(row));
  let maxSequence = 0;
  telRows.forEach((row) => {
    const id = row?.tFid ?? row?.t_fid ?? row?.localDisplayId ?? '';
    const sequencePart = String(id).split('-').pop();
    const sequenceNumber = Number(sequencePart);

    if (Number.isFinite(sequenceNumber) && sequenceNumber > maxSequence) {
      maxSequence = sequenceNumber;
    }
  });

  const sequenceText = String(maxSequence + 1).padStart(3, '0');

  return {
    telemetryFid: parentSeFid ? `${parentSeFid}-${sequenceText}` : undefined,
    localDisplayId: !parentSeFid && parentSeId ? `SE-${parentSeId}-${sequenceText}` : undefined,
  };
};

const TelemetryDataEntry = connect(
  'doSaveTelemetryDataEntry',
  'doUpdateTelemetryDataEntry',
  'doSearchEffortDatasheetLoadData',
  'selectDataEntryTelemetryData',
  'selectDataEntryLastParams',
  'selectBaseData',
  'selectDataEntryData',
  'selectLookupData',
  'doUpdateCurrentTab',
  'selectRouteParams',
  'doUpdateUrl',
  ({
    doSaveTelemetryDataEntry,
    doUpdateTelemetryDataEntry,
    doSearchEffortDatasheetLoadData,
    dataEntryTelemetryData,
    dataEntryLastParams,
    baseData,
    dataEntryData,
    lookupData,
    doUpdateCurrentTab,
    routeParams,
    doUpdateUrl,
  }) => {
    const { frequencyId, spawnBehavior, macros, mesos, positionConfidence } = lookupData;
    const { items } = dataEntryTelemetryData;

    const rowData = items?.map((item) => ({
      ...item,
      captureTime: item.captureDate ?? '',
      spawnBehavior: item.suspectedSpawningActivity ?? '',
    }));
    const [tableKey, setTableKey] = useState(0);
    const [tableErrors, setTableErrors] = useState();
    const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
    const [data, setData] = useState(ensureTrailingBlankTelemetryRow(rowData));
    const [tableIsDirty, setTableIsDirty] = useState(false);
    const [online, setOnline] = useState(isOnline());
    const prevTableDataRef = useRef([]);
    const siteId = routeParams?.siteId;
    const searchDraftKey = `currentSearchEffortDraft:${siteId}`;
    const savedDraft = sessionStorage.getItem(searchDraftKey);
    const searchEffortDraft = savedDraft ? JSON.parse(savedDraft) : null;
    const seId =
      dataEntryData?.seId ??
      dataEntryData?.se_id ??
      baseData?.seId ??
      baseData?.se_id ??
      dataEntryLastParams?.seId ??
      dataEntryLastParams?.se_id ??
      dataEntryLastParams?.tableId ??
      routeParams?.seId ??
      searchEffortDraft?.seId ??
      searchEffortDraft?.se_id;
    const seFid =
      dataEntryData?.seFid ??
      dataEntryData?.se_fid ??
      baseData?.seFid ??
      baseData?.se_fid ??
      searchEffortDraft?.seFid ??
      searchEffortDraft?.se_fid;

    const [offlineLookups, setOfflineLookups] = useState({
      frequencyId: [],
      spawnBehavior: [],
      macros: [],
      mesos: [],
      positionConfidence: [],
    });

    const defaultValues = { seId: dataEntryLastParams?.seId };

    useEffect(() => {
      async function loadOfflineLookups() {
        const [offlineFrequencyId, offlineSpawnBehavior, offlineMacros, offlineMesos, offlinePositionConfidence] =
          await Promise.all([
            getLookupOptions('frequencyId'),
            getLookupOptions('spawnBehavior'),
            getLookupOptions('macros'),
            getLookupOptions('mesos'),
            getLookupOptions('positionConfidence'),
          ]);

        setOfflineLookups({
          frequencyId: offlineFrequencyId,
          spawnBehavior: offlineSpawnBehavior,
          macros: offlineMacros,
          mesos: offlineMesos,
          positionConfidence: offlinePositionConfidence,
        });
      }

      loadOfflineLookups();
    }, []);

    useEffect(() => {
      const handleOnline = () => setOnline(true);
      const handleOffline = () => setOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }, []);

    const browserGps = useGpsCapture(GPS_OPTIONS);
    const ubloxGps = useUbloxSerialGps();

    const captureGpsFix = async () => {
      if (USE_UBLOX_POC && ubloxGps.isConnected && ubloxGps.latestFix) {
        console.log('[GPS SOURCE] using u-blox satellite serial GPS');
        return ubloxGps.captureOnce();
      }

      console.log('[GPS SOURCE] using browser geolocation fallback');
      return browserGps.captureOnce();
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

    const handleCaptureRow = async (rowIndex) => {
      try {
        console.log('GPS capturing for row', rowIndex);

        const fix = await captureGpsFix();
        const time = fmtTimeHHMMSS();

        console.log('GPS result:', { fix, time });

        const latitude = formatGpsCoordinate(fix?.lat);
        const longitude = formatGpsCoordinate(fix?.lng);

        const computedValues = {
          captureTime: time,
          captureLatitude: latitude,
          captureLongitude: longitude,
        };

        handleUpdateData(rowIndex, null, computedValues);
      } catch (err) {
        console.error('GPS error', err);
        window.alert(`GPS capture failed: ${err?.message || err}`);
      }
    };

    const methods = useForm({
      resolver: yupResolver(telemetryDataEntrySchema),
      mode: 'onBlur',
      defaultValues: getTelemetryDefaultValues({ baseData: baseData, dataEntryData: dataEntryTelemetryData }),
    });
    const {
      formState: { errors },
    } = methods;

    console.warn('Check errors:', errors);

    const handleAddRow = () => {
      setData((prev) => ensureTrailingBlankTelemetryRow(prev));
      // try {
      //   const parentSeId =
      //     seId || dataEntryLastParams?.seId || dataEntryLastParams?.se_id || dataEntryLastParams?.tableId;
      //   const parentSeFid = seFid || undefined;

      //   if (!parentSeId && !parentSeFid) {
      //     window.alert('Save the Search Effort draft before adding Telemetry.');
      //     return;
      //   }
      //   // Add default values here
      //   const base = getBaseDefaultValues({ baseData });

      //   if (parentSeFid) {
      //     const existingRows = (data ?? []).filter((row) => {
      //       const rowSeFid = row?.seFid ?? row?.se_fid;

      //       return rowSeFid && String(rowSeFid) === String(parentSeFid);
      //     });

      //     const sequence = localRows.length + dbRows.length + 1;
      //     const sequenceText = String(sequence).padStart(3, '0');

      //     const newRowData = {
      //       ...base,
      //       ...defaultValues,
      //       clientId: crypto.randomUUID(),
      //       ...(parentSeId ? { seId: parentSeId, se_id: parentSeId } : {}),
      //       seFid: seFid,
      //       se_fid: seFid,
      //       tFid: `${parentSeFid}-${sequenceText}`,
      //       _status: 'new',
      //     };
      //     setData((prev) => [...(prev ?? []), newRowData]);
      //     return;
      // }

      // const localRows = await db.telemetry
      //   .filter((row) => {
      //     const rowSeId = [row?.seId, row?.se_id, row?.seFid, row?.se_fid];
      //     return rowSeId.some(
      //       (value) =>
      //         value !== undefined &&
      //         value !== null &&
      //         value !== '' &&
      //         (String(value) === String(seId) || String(value) === String(seFid))
      //     );
      //   })
      //   .toArray();

      // const dbRows =
      //   data?.filter((row) => {
      //     const rowSeId = [row?.seId, row?.se_id, row?.seFid, row?.se_fid];
      //     return rowSeId.some(
      //       (value) =>
      //         value !== undefined &&
      //         value !== null &&
      //         value !== '' &&
      //         (String(value) === String(seId) || String(value) === String(seFid))
      //     );
      //   }) ?? [];

      //   if (parentSeId) {
      //     const newRowData = {
      //       ...base,
      //       ...defaultValues,
      //       clientId: crypto.randomUUID(),
      //       seId: Number(parentSeId),
      //       se_id: Number(parentSeId),
      //       _status: 'new',
      //     };
      //     setData((prev) => [...(prev ?? []), newRowData]);
      //   }
      // } catch (err) {
      //   console.error('Unable to add Telemetry row:', err);
      //   window.alert(`Unable to add Telemetry row: ${err?.message || err}`);
      // }
    };

    const handleAddMultipleRows = (rows) => {
      // Handle any data mapping or formatting here
      setData((oldData) => {
        const newRows = [...oldData, ...rows];
        return newRows;
      });
    };

    const handleCopyLastRowBtn = () => {
      if (!seFid && !seId) {
        console.error('Cannot copy Telemetry row: missing parent ID.');
        window.alert('Save the Search Effort draft first before copying Telemetry.');
        return;
      }
      const rows = (data ?? []).filter((row) => !isUntouchedPlaceholderTelemetryRow(row));

      if (rows.length === 0) {
        window.alert('No existing Telemetry row found to copy.');
        return;
      }
      // Grab last object from data array
      const lastRowData = rows[rows.length - 1];
      const { telemetryFid, localDisplayId } = getNextTelemetryId(rows, seId, seFid);

      // Format new row data
      const newRowData = {
        ...getBaseDefaultValues({ baseData }),
        tId: null, // Reset tId if copying a save data object
        t_id: null,
        clientId: crypto.randomUUID(),
        ...(seId != null
          ? {
              seId: Number(seId),
              se_id: Number(seId),
            }
          : {}),
        ...(seFid
          ? {
              seFid,
              se_fid: seFid,
              tFid: telemetryFid,
              t_fid: telemetryFid,
            }
          : {}),
        ...(localDisplayId
          ? {
              localDisplayId,
            }
          : {}),
        radioTagNum: lastRowData?.radioTagNum ?? '',
        frequencyIdCode: lastRowData?.frequencyIdCode ?? '',
        _status: 'new',
        serverId: undefined,
        version: 0,
        updatedAt: undefined,
        _isPlaceholderRow: false,
        _isTouched: true,
      };
      setData((prev) => {
        const existingRows = (prev ?? []).filter((row) => !isUntouchedPlaceholderTelemetryRow(row));
        return ensureTrailingBlankTelemetryRow([...existingRows, newRowData]);
      });
    };

    const handleRemoveMultipleRows = useCallback(
      (indicesToRemove) => {
        setData((oldData) => {
          const newRows = oldData && oldData.filter((_, index) => !indicesToRemove.includes(index));
          return newRows;
        });
        setTableKey((old) => old + 1);
      },
      [setData, setTableKey]
    );

    const frequencyIdOptions = frequencyId?.length > 0 ? frequencyId : offlineLookups.frequencyId;
    const positionConfidenceOptions =
      positionConfidence?.length > 0 ? positionConfidence : offlineLookups.positionConfidence;
    const spawnBehaviorOptions = spawnBehavior?.length > 0 ? spawnBehavior : offlineLookups.spawnBehavior;
    const mesoOptions = mesos?.length > 0 ? mesos : offlineLookups.mesos;
    const macroOptions = macros?.length > 0 ? macros : offlineLookups.macros;

    const tableColumns = getTelemetryColumns({
      frequencyId: frequencyIdOptions,
      positionConfidence: positionConfidenceOptions,
      spawnBehavior: spawnBehaviorOptions,
      mesos: mesoOptions,
      macros: macroOptions,
      handleCaptureRow,
      online,
    });

    const handleUpdateData = useCallback(
      (rowIndex, columnId, updatedValue) => {
        setData((oldData) => {
          const newData = oldData ? [...oldData] : null;
          if (!newData[rowIndex]) return oldData;
          const currentRow = newData[rowIndex];
          const isPlaceholderRow = isUntouchedPlaceholderTelemetryRow(currentRow);

          let nextRow = currentRow;
          if (isPlaceholderRow) {
            const { telemetryFid, localDisplayId } = getNextTelemetryId(newData, seId, seFid);

            nextRow = {
              ...getBaseDefaultValues({ baseData }),
              clientId: crypto.randomUUID(),
              ...(seId != null ? { seId: Number(seId), se_id: Number(seId) } : {}),
              ...(seFid
                ? {
                    seFid,
                    se_fid: seFid,
                    tFid: telemetryFid,
                    t_fid: telemetryFid,
                  }
                : {}),
              ...(localDisplayId
                ? {
                    localDisplayId,
                  }
                : {}),
              _status: 'new',
              _isPlaceholderRow: false,
              _isTouched: true,
            };
          }
          // Update properties
          newData[rowIndex] = {
            ...nextRow,
            ...(columnId === null && typeof updatedValue === 'object' ? updatedValue : { [columnId]: updatedValue }),
            _isTouched: true,
          };
          if (!isPlaceholderRow && newData[rowIndex]._status !== 'new') {
            newData[rowIndex]._status = 'edited';
          }
          return ensureTrailingBlankTelemetryRow(newData);
        });
      },
      [baseData, dataEntryData, seId, seFid]
    );

    const formatRow = (row) => {
      return {
        ...row,
        bendRiverMile:
          row?.bendRiverMile === null || row?.bendRiverMile === undefined || row?.bendRiverMile === ''
            ? null
            : Number(row.bendRiverMile),
        frequencyIdCode:
          row.frequencyIdCode !== null
            ? Number(typeof row.frequencyIdCode === 'object' ? row.frequencyIdCode.value : row.frequencyIdCode)
            : null,
        captureLatitude:
          row.captureLatitude !== null && row.captureLatitude !== '' ? Number(row.captureLatitude) : null,
        captureLongitude:
          row.captureLongitude !== null && row.captureLongitude !== '' ? Number(row.captureLongitude) : null,
        positionConfidence:
          row.positionConfidence !== null && row.positionConfidence !== '' ? Number(row.positionConfidence) : null,
        captureDate: row.captureTime,
        suspectedSpawningActivity:
          row.spawnBehavior !== null && row.spawnBehavior !== '' ? Number(row.spawnBehavior) : null,
      };
    };

    const tableValidationSchema = {
      validate: (row, options) => {
        if (row?._isPlaceholderRow === true) {
          return Promise.resolve(row);
        }
        return telemetryDataEntrySchema.validate(row, options);
      },
    };

    const handleSubmitAll = async () => {
      setIsSubmitAttempted(true);
      try {
        const rowsToProcess = (data ?? []).filter(
          (row) => !isUntouchedPlaceholderTelemetryRow(row) && (row._status === 'new' || row._status === 'edited')
        );

        for (let i = 0; i < rowsToProcess.length; i++) {
          const row = rowsToProcess[i];

          const isNew = !row.tId;

          const formattedRow = formatRow(row);

          const clientId = row.clientId ?? crypto.randomUUID();

          const parentSeId =
            row.se_id ??
            row.seId ??
            dataEntryData?.seId ??
            dataEntryData?.se_id ??
            dataEntryLastParams?.seId ??
            dataEntryLastParams?.se_id ??
            searchEffortDraft?.seId ??
            searchEffortDraft?.se_id ??
            baseData?.seId ??
            baseData?.se_id;

          if (!parentSeId && isOnline()) {
            throw new Error('Search Effort ID is missing.');
          }

          const payload = {
            ...formattedRow,
            clientId,
            ...(parentSeId != null
              ? {
                  seId: parentSeId,
                  se_id: parentSeId,
                }
              : {}),
            ...(row?.seFid
              ? {
                  seFid: row.seFid,
                  tFid: row.tFid,
                }
              : {}),
            ...(row?.tFid
              ? {
                  tFid: row.tFid,
                }
              : {}),
            _status: 'queued',
            version: row.version ?? 0,
          };

          await telemetryDataEntrySchema.validate(payload, { abortEarly: false });

          try {
            if (row._syncRecoveryError && row.clientId) {
              await updateData('telemetry', row.clientId, payload);
              setData((currentRows) => {
                const updatedRows = (currentRows ?? []).map((currentRow) => {
                  if (String(currentRow?.clientId) !== String(row.clientId)) {
                    return currentRow;
                  }
                  return {
                    ...currentRow,
                    ...payload,
                    clientId: row.clientId,
                    _syncRecoveryError: false,
                    _syncRecoveryMessage: undefined,
                    _status: 'queued',
                    _isPlaceholderRow: false,
                    _isTouched: true,
                  };
                });
                return ensureTrailingBlankTelemetryRow(updatedRows);
              });
              continue;
            }

            if (isOnline()) {
              if (isNew) {
                console.log('Creating row online:', payload);
                await doSaveTelemetryDataEntry(payload);
              } else if (row.tId && row._status === 'edited') {
                console.log('Updating row online:', payload);
                await doUpdateTelemetryDataEntry(payload);
              }
            } else {
              if (isNew) {
                console.log('Creating row offline:', payload);
                await createData('telemetry', payload);
              } else {
                console.log('Updating row offline:', payload);
                await updateData('telemetry', clientId, payload);
              }
            }
          } catch (error) {
            console.error('Telemetry save failed', error);

            if (isOnline()) {
              throw error;
            }

            console.log('Connection was lost. Queuing Telemetry row offline.');

            if (isNew) {
              await createData('telemetry', payload);
            } else {
              await updateData('telemetry', clientId, payload);
            }
          }
        }

        setData((prev) =>
          ensureTrailingBlankTelemetryRow(
            (prev ?? []).map((row) =>
              row._status === 'new' || row._status === 'edited'
                ? { ...row, _status: 'queued', clientId: row.clientId ?? crypto.randomUUID() }
                : row
            )
          )
        );
        const draftKey = `currentSearchEffortDraft:${siteId}`;
        const savedDraft = sessionStorage.getItem(draftKey);
        const draft = savedDraft ? JSON.parse(savedDraft) : {};

        const telemetryCount = (data ?? []).filter((row) => !isUntouchedPlaceholderTelemetryRow(row)).length;
        sessionStorage.setItem(draftKey, JSON.stringify({ ...draft, telemetryCount: telemetryCount }));
        const hasRecoveryRow = rowsToProcess.some((row) => row._syncRecoveryError && row.clientId);
        if (!hasRecoveryRow) {
          const telemetryParentId = isOnline() ? seId || seFid : seFid || seId;
          await doSearchEffortDatasheetLoadData(telemetryParentId);
          doUpdateCurrentTab(0);
        }
      } catch (err) {
        console.error('Submit failed:', err);
      }
    };

    const handleSaveAndClose = () => {
      // Submit Data
      handleSubmitAll();
      // Navigate to Search Effort Entry Form Tab
      doUpdateCurrentTab(0);
    };

    const handleSaveAndOpenMoriver = () => {
      // Submit Data
      handleSubmitAll();
      // Navigate to Missouri Entry Form Tab
      doUpdateCurrentTab(0);
      doUpdateUrl(`/sites-list/${siteId}/missouri-river`);
    };

    useEffect(() => {
      const tableDataChanged = !_isEqual(data, prevTableDataRef.current);
      tableDataChanged && setTableIsDirty(true);
    }, [data]);

    useEffect(() => {
      const refreshRows =
        items?.map((item) => ({
          ...item,
          captureTime: item?.captureTime ?? item?.captureDate ?? '',
          spawnBehavior: item?.spawnBehavior ?? item?.suspectedSpawningActivity ?? '',
        })) ?? [];
      setData(ensureTrailingBlankTelemetryRow(refreshRows));
    }, [items]);

    useEffect(() => {
      const loadRecoveryRow = async () => {
        const recoveryOutboxId = sessionStorage.getItem('syncRecoveryOutboxId');
        if (!recoveryOutboxId) return;

        const outboxItem = await db.outbox.get(Number(recoveryOutboxId));
        if (!outboxItem || outboxItem.tableName !== 'ds_telemetry_fish') {
          sessionStorage.removeItem('syncRecoveryOutboxId');
          return;
        }

        const localRow = await db.telemetry.get(outboxItem.clientId);
        const recoveryRow = localRow ?? outboxItem.payload;
        if (!recoveryRow) return;

        const recoverySeKeys = [recoveryRow?.seId, recoveryRow?.se_id, recoveryRow?.seFid, recoveryRow?.se_fid]
          .filter((value) => value !== undefined && value !== null && value !== '')
          .map(String);

        const currentSeKeys = [seId, seFid]
          .filter((value) => value !== undefined && value !== null && value !== '')
          .map(String);

        const belongsToCurrentSearch = recoverySeKeys.some((key) => currentSeKeys.includes(key));
        if (!belongsToCurrentSearch) {
          console.warn('Recovery Telemetry row does not match current Search Effort.', {
            recoveryRow,
            seId,
            seFid,
          });
          return;
        }

        const formattedRecoveryRow = {
          ...recoveryRow,
          captureTime: recoveryRow?.captureTime ?? recoveryRow?.captureDate ?? '',
          spawnBehavior: recoveryRow?.spawnBehavior ?? recoveryRow?.suspectedSpawningActivity ?? '',
          _status: outboxItem.syncError ? 'edited' : 'queued',
          _syncRecoveryError: Boolean(outboxItem.syncError),
          _syncRecoveryMessage: outboxItem.syncError ?? undefined,
          _isPlaceholderRow: false,
          _isTouched: true,
        };

        setData((currentRows) => {
          const realRows = (currentRows ?? []).filter((row) => !isUntouchedPlaceholderTelemetryRow(row));
          const existingIndex = realRows.findIndex(
            (row) => row?.clientId && recoveryRow?.clientId && String(row.clientId) === String(recoveryRow.clientId)
          );

          if (existingIndex >= 0) {
            realRows[existingIndex] = formattedRecoveryRow;
          } else {
            realRows.push(formattedRecoveryRow);
          }

          return ensureTrailingBlankTelemetryRow(realRows);
        });
      };
      loadRecoveryRow();
    }, [items, seId, seFid]);

    return (
      <FormProvider {...methods}>
        <DataEntryTable
          addRow={handleAddRow}
          columns={tableColumns}
          data={data}
          initialTableState={{}}
          key={tableKey}
          placeholderClick={handleAddRow}
          placeholderText='No Telemetry Data found.'
          removeMultipleRows={handleRemoveMultipleRows}
          addMultipleRows={handleAddMultipleRows}
          rowErrorCallback={setTableErrors}
          showAddRowButton={false}
          tableVersion='TelemetryTable'
          updateSourceData={handleUpdateData}
          validationSchema={tableValidationSchema}
          showValidationErrors={isSubmitAttempted}
        />
        <Button className='margin-top-2 secondary-btn' onClick={() => handleCopyLastRowBtn()} type='button'>
          <Icon focusable={false} className='margin-right-1' path={mdiContentCopy} />
          Copy Last Row
        </Button>
        <Button
          className='margin-top-2 add-btn'
          onClick={() => {
            handleSubmitAll();
          }}
          type='button'
        >
          Submit
        </Button>
        <Button className='margin-top-2 add-btn' onClick={() => handleSaveAndClose()} type='button'>
          Save & Close
        </Button>
        <Button className='margin-top-2 add-btn' onClick={() => handleSaveAndOpenMoriver()} type='button'>
          Save & Open MR Datasheet
        </Button>
      </FormProvider>
    );
  }
);

export default TelemetryDataEntry;
