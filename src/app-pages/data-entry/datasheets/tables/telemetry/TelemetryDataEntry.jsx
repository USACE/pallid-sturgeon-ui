import React, { useRef, useCallback, useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import _isEqual from 'lodash/isEqual';
import { mdiContentCopy } from '@mdi/js';
import { Button } from '@trussworks/react-uswds';

import { useGpsCapture } from '@src/app-components/gps/gpsCapture';
import { useUbloxSerialGps } from '@src/customHooks/useUbloxSerialGps';
import { db } from '@src/app-pages/data-entry/offline/db';
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

import '@pages/data-summaries/data-summary.scss';
import '@pages/data-entry/dataentry.scss';

const USE_UBLOX_POC = import.meta.env.VITE_USE_UBLOX_POC === 'true';
console.log('GPS POC flag', import.meta.env.VITE_USE_UBLOX_POC, USE_UBLOX_POC);

const GPS_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

const getNextSequence = (data, seFid) => {
  const existing = data.filter((item) => item.seFid === seFid);
  return existing.length + 1;
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
    const [data, setData] = useState(rowData);
    const [tableIsDirty, setTableIsDirty] = useState(false);
    const [online, setOnline] = useState(isOnline());
    const prevTableDataRef = useRef([]);
    const siteId = routeParams?.siteId;
    const searchDraftKey = `currentSearchEffortDraft:${siteId}`;
    const savedDraft = sessionStorage.getItem(searchDraftKey);
    const searchEffortDraft = savedDraft ? JSON.parse(savedDraft) : null;
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

        const computedValues = {
          captureTime: time,
          captureLatitude: Number(fix.lat),
          captureLongitude: Number(fix.lng),
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

    const handleAddRow = async () => {
      try {
        if (!seFid) {
          console.error('Cannot add Telemetry row: missing Search Effort Field ID.', {
            dataEntryData,
            baseData,
            searchEffortDraft,
          });
          window.alert('Save the Search Effort draft before adding Telemetry.');
          return;
        }
        // Add default values here
        const base = getBaseDefaultValues({ baseData });

        const localRows = await db.telemetry
          .filter((row) => {
            const rowSeFid = row?.seFid ?? row?.se_fid;
            return String(rowSeFid) === String(seFid);
          })
          .toArray();

        const dbRows =
          data?.filter((row) => {
            const rowSeFid = row?.seFid ?? row?.se_fid;
            return String(rowSeFid) === String(seFid);
          }) ?? [];

        const sequence = localRows.length + dbRows.length + 1;
        const sequenceText = String(sequence).padStart(3, '0');

        const parentSeId =
          dataEntryData?.seId ??
          dataEntryData?.se_id ??
          dataEntryLastParams?.seId ??
          dataEntryLastParams?.se_id ??
          searchEffortDraft?.seId ??
          searchEffortDraft?.se_id;

        const newRowData = {
          ...base,
          seId: parentSeId,
          se_id: parentSeId,
          tFid: `${seFid}-${sequenceText}`,
          seFid: seFid,
          ...defaultValues,
          _status: 'new',
        };
        setData((prev) => [...(prev ?? []), newRowData]);
      } catch (err) {
        console.error('Unable to add Telemetry row:', err);
      }
    };

    const handleAddMultipleRows = (rows) => {
      // Handle any data mapping or formatting here
      setData((oldData) => {
        const newRows = [...oldData, ...rows];
        return newRows;
      });
    };

    const handleCopyLastRowBtn = () => {
      const sequence = getNextSequence(data, seFid);
      const sequenceText = String(sequence).padStart(3, '0');
      // Grab last object from data array
      const lastRowData = data.slice(-1)[0];
      // Format new row data
      const newRowData = {
        ...lastRowData,
        tId: null, // Reset fid if copying a save data object
        tFid: `${seFid}-${sequenceText}`,
        _status: 'new',
        seFid: seFid,
      };
      setData((prev) => (prev ? [...prev, newRowData] : []));
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

    const handleUpdateData = useCallback((rowIndex, columnId, updatedValue) => {
      setData((oldData) => {
        const newData = oldData ? [...oldData] : null;
        if (newData && newData[rowIndex]) {
          // Update properties
          newData[rowIndex] = {
            ...newData[rowIndex],
            ...(columnId === null && typeof updatedValue === 'object' ? updatedValue : { [columnId]: updatedValue }),
          };
          if (newData[rowIndex]._status !== 'new') {
            newData[rowIndex]._status = 'edited';
          }
          return newData;
        }
        return oldData;
      });
    }, []);

    const formatRow = (row) => {
      return {
        ...row,
        bendRiverMile: parseFloat(row.bendRiverMile) ?? null,
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

    const handleSubmitAll = async () => {
      try {
        const rowsToProcess = data.filter((row) => row._status === 'new' || row._status === 'edited');

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
            seId: parentSeId,
            se_id: parentSeId,
            seFid: row.seFid,
            tFid: row.tFid,
            _status: 'queued',
            version: row.version ?? 0,
          };

          await telemetryDataEntrySchema.validate(payload, { abortEarly: false });

          try {
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
          prev.map((row) =>
            row._status === 'new' || row._status === 'edited'
              ? { ...row, _status: 'queued', clientId: row.clientId ?? crypto.randomUUID() }
              : row
          )
        );
        const draftKey = `currentSearchEffortDraft:${siteId}`;
        const savedDraft = sessionStorage.getItem(draftKey);
        const draft = savedDraft ? JSON.parse(savedDraft) : {};

        sessionStorage.setItem(draftKey, JSON.stringify({ ...draft, telemetryCount: 1 }));
        const telemetryParentId = dataEntryData?.seId ?? dataEntryData?.se_id ?? seFid;
        await doSearchEffortDatasheetLoadData(telemetryParentId);
        doUpdateCurrentTab(0);
      } catch (err) {
        console.error('Submit failed:', err);
      }
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
      setData(refreshRows);
    }, [items]);

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
          tableVersion='TelemetryTable'
          updateSourceData={handleUpdateData}
          validationSchema={telemetryDataEntrySchema}
        />
        <div style={{ justifyContent: 'space-between', display: 'flex' }}>
          <Button
            className='margin-top-2 add-btn'
            onClick={() => {
              handleSubmitAll();
            }}
            type='button'
          >
            Submit
          </Button>
          <Button className='margin-top-2 secondary-btn' onClick={() => handleCopyLastRowBtn()} type='button'>
            <Icon focusable={false} className='margin-right-1' path={mdiContentCopy} />
            Copy Last Row
          </Button>
        </div>
      </FormProvider>
    );
  }
);

export default TelemetryDataEntry;
