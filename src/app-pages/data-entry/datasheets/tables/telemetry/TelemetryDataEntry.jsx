import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import _isEqual from 'lodash/isEqual';
import { mdiContentCopy } from '@mdi/js';
import { Alert, Button } from '@trussworks/react-uswds';

import { useGpsCapture } from '@src/app-components/gps/gpsCapture';
import { useSharedUbloxGps } from '@src/app-pages/data-entry/offline/UbloxGpsContent';
import { getLookupOptions } from '@src/app-pages/data-entry/offline/lookup-cache';
import { createData, updateData } from '@src/app-pages/data-entry/offline/api';

import DataEntryTable from '@src/app-components/table/data-entry-table/DataEntryTable';
import Icon from '@src/app-components/icon/icon';

import {
  telemetryDataEntrySchema,
  getBaseDefaultValues,
  getTelemetryDefaultValues,
} from './TelemetryDataEntry.validation';
import { getTelemetryColumns } from './helpers.telemetry';
import { db } from '@src/app-pages/data-entry/offline/db';
import {
  displayValidationTableErrors,
  ensureTrailingBlankRow,
  fmtTimeHHMMSS,
  formatGpsCoordinate,
  isUntouchedPlaceholderRow,
} from '@src/app-pages/data-entry/dataEntryHelper';
import { DataEntryStatuses, OfflineStatuses } from '@src/utils/enums';
import { GPS_OPTIONS, USE_UBLOX_POC } from '@src/app-pages/data-entry/offline/offlineHelper';
import { formatCoordFlt } from '@src/utils/helpers';

import '@pages/data-summaries/data-summary.scss';
import '@pages/data-entry/dataentry.scss';

const lookupTableNames = ['frequencyId', 'spawnBehavior', 'macros', 'mesos', 'positionConfidence'];

const getNextTelemetryId = (rows, parentSeId, parentSeFid) => {
  const telRows = (rows ?? []).filter((row) => !isUntouchedPlaceholderRow(row));
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

const normalizeTelemetryRow = (row = {}) => ({
  ...row,
  seFid: row?.seFid ?? '',
  tFid: row?.tFid ?? '',
  bend: row?.bend ?? '',
  radioTagNum: row?.radioTagNum ?? '',
  frequencyIdCode: row?.frequencyIdCode ?? '',
  captureTime: row?.captureTime ?? '',
  captureLatitude: row?.captureLatitude ?? '',
  captureLongitude: row?.captureLongitude ?? '',
  suspectedSpawningActivity: row?.suspectedSpawningActivity ?? '',
  positionConfidence: row?.positionConfidence ?? '',
  mesoId: row?.mesoId ?? '',
  depth: row?.depth ?? '',
  macroId: row?.macroId ?? '',
  temp: row?.temp ?? '',
  conductivity: row?.conductivity ?? '',
  turbidity: row?.turbidity ?? '',
  silt: row?.silt ?? '',
  sand: row?.sand ?? '',
  gravel: row?.gravel ?? '',
  comments: row?.comments ?? '',
  editInitials: row?.editInitials ?? '',
  lastEditComment: row?.lastEditComment ?? '',
  checkby: row?.checkby ?? '',
});

const formatRow = (row) => {
  return {
    siteId: !isNaN(Number(row.siteId)) ? Number(row.siteId) : '',
    bendRiverMile: parseFloat(row.bendRiverMile) ?? '',
    frequencyIdCode: !isNaN(Number(row.frequencyIdCode)) ? Number(row.frequencyIdCode) : '',
    captureLatitude: formatCoordFlt(row.captureLatitude) ?? '',
    captureLongitude: formatCoordFlt(row.captureLongitude) ?? '',
    positionConfidence: !isNaN(Number(row.positionConfidence)) ? Number(row.positionConfidence) : '',
    suspectedSpawningActivity: !isNaN(Number(row.suspectedSpawningActivity))
      ? Number(row.suspectedSpawningActivity)
      : '',
  };
};

const TelemetryDataEntry = connect(
  'doSaveTelemetryDataEntry',
  'doUpdateTelemetryDataEntry',
  'doSearchEffortDatasheetLoadData',
  'selectDataEntryTelemetryData',
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
    baseData,
    dataEntryData,
    lookupData,
    doUpdateCurrentTab,
    routeParams,
    doUpdateUrl,
  }) => {
    // Initialize GPS
    const browserGps = useGpsCapture(GPS_OPTIONS);
    const ubloxGps = useSharedUbloxGps();
    const { items } = dataEntryTelemetryData;
    const rowData = items?.map((item) => ({ ...normalizeTelemetryRow(item) }));
    const [tableKey, setTableKey] = useState(0);
    const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
    const [data, setData] = useState(ensureTrailingBlankRow(rowData));
    const [validationErrorRowCount, setValidationErrorRowCount] = useState(0);
    const [validationErrorRows, setValidationErrorRows] = useState([]);
    const siteId = routeParams?.siteId;
    const searchTypeCode = dataEntryData?.searchTypeCode;
    const isSearchTypeRs = searchTypeCode === 'RS';

    // Get Search Effort Draft Data
    const searchDraftKey = `currentSearchEffortDraft:${siteId}`;
    const savedDraft = sessionStorage.getItem(searchDraftKey);
    const searchEffortDraft = savedDraft ? JSON.parse(savedDraft) : null;
    const seId = dataEntryData?.seId ?? dataEntryData?.se_id ?? searchEffortDraft?.seId ?? searchEffortDraft?.se_id;
    const seFid =
      dataEntryData?.seFid ?? dataEntryData?.se_fid ?? searchEffortDraft?.seFid ?? searchEffortDraft?.se_fid;
    const isOnline = navigator.onLine;
    const recoveryOutboxId = sessionStorage.getItem('syncRecoveryOutboxId');

    // Default lookups to online data, otherwise will be overwritten by offline cached lookup data if network status = offline
    const [lookups, setLookups] = useState(
      lookupTableNames.reduce((accumulator, currentKey) => {
        accumulator[currentKey] = lookupData?.[currentKey] ?? [];
        return accumulator;
      }, {})
    );

    const captureGpsFix = async () => {
      if (USE_UBLOX_POC && ubloxGps.isConnected) {
        if (!ubloxGps.latestFix) {
          throw new Error('u-blox GPS is connected but a satellite fix is not available yet.');
        }
        console.log('[GPS SOURCE] using u-blox satellite serial GPS');
        return ubloxGps.captureOnce();
      }

      console.log('[GPS SOURCE] using browser geolocation fallback');
      return browserGps.captureOnce();
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
      resolver: yupResolver(telemetryDataEntrySchema({ isSearchTypeRs })),
      mode: 'onBlur',
      defaultValues: getTelemetryDefaultValues({ baseData: baseData, dataEntryData: dataEntryTelemetryData }),
    });
    const {
      formState: { errors },
    } = methods;

    const scrollToBottom = useCallback(() => {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      });
    }, []);

    const handleAddRow = () => {
      setData((prev) => ensureTrailingBlankRow(prev));
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
      const rows = (data ?? []).filter((row) => !isUntouchedPlaceholderRow(row));

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
        bendRiverMile: '',
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
        const existingRows = (prev ?? []).filter((row) => !isUntouchedPlaceholderRow(row));
        return ensureTrailingBlankRow([...existingRows, newRowData]);
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

    const tableColumns = getTelemetryColumns({
      frequencyId: lookups?.frequencyId,
      positionConfidence: lookups?.positionConfidence,
      spawnBehavior: lookups?.spawnBehavior,
      mesos: lookups?.mesos,
      macros: lookups?.macros,
      handleCaptureRow,
      online: isOnline,
      isSearchTypeRs,
    });

    const columnHeaderById = useMemo(() => {
      const headers = {};

      tableColumns.forEach((column) => {
        const key = column?.id ?? column?.accessorKey;
        if (!key) {
          return;
        }

        headers[String(key)] = typeof column?.header === 'string' ? column.header : String(key);
      });

      return headers;
    }, [tableColumns]);

    const handleUpdateData = useCallback(
      (rowIndex, columnId, updatedValue) => {
        setData((oldData) => {
          const newData = oldData ? [...oldData] : null;
          if (!newData[rowIndex]) return oldData;
          const currentRow = newData[rowIndex];
          const isPlaceholderRow = isUntouchedPlaceholderRow(currentRow);

          let nextRow = currentRow;
          if (isPlaceholderRow) {
            const { telemetryFid, localDisplayId } = getNextTelemetryId(newData, seId, seFid);

            nextRow = {
              ...getBaseDefaultValues({ baseData }),
              bendRiverMile: '',
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
          return ensureTrailingBlankRow(newData);
        });
      },
      [baseData, dataEntryData, seId, seFid]
    );

    const tableValidationSchema = {
      validate: (row, options) => {
        if (row?._isPlaceholderRow === true) {
          return Promise.resolve(row);
        }
        return telemetryDataEntrySchema({ isSearchTypeRs }).validate(row, options);
      },
    };

    const handleSubmitAll = async () => {
      setIsSubmitAttempted(true);
      setValidationErrorRowCount(0);
      setValidationErrorRows([]);

      let nonPlaceholderRowNumber = 0;
      const rowsToProcess = (data ?? []).reduce((acc, row) => {
        if (isUntouchedPlaceholderRow(row)) {
          return acc;
        }

        nonPlaceholderRowNumber += 1;

        if (row._status === OfflineStatuses.New || row._status === OfflineStatuses.Edited) {
          acc.push({ item: row, rowNumber: nonPlaceholderRowNumber });
        }

        return acc;
      }, []);

      try {
        const rowPayloads =
          rowsToProcess?.map(({ item, rowNumber }) => {
            const isNew = !item.tId;
            const clientId = item.clientId ?? crypto.randomUUID();
            const parentRowSeId = item.seId ?? item.se_id;
            const parentRowSeFid = item.seFid ?? item.se_fid;
            const telemetryFid = item.tFid ?? item.t_fid ?? item.localDisplayId;

            if (isOnline && !parentRowSeId) {
              throw new Error('Search Effort ID is missing.');
            }

            const formattedValues = formatRow(item);
            const payload = {
              ...item,
              clientId: clientId,
              se_id: parentRowSeId,
              seId: parentRowSeId,
              se_fid: parentRowSeFid,
              seFid: parentRowSeFid,
              tFid: telemetryFid,
              t_fid: telemetryFid,
              _status: OfflineStatuses.Queued,
              version: item.version ?? 0,
              updatedAt: new Date().toISOString(),
              // Format values
              ...formattedValues,
            };

            return { item, payload, isNew, clientId, rowNumber };
          }) ?? [];

        // Validate all rows first; if any fail, stay on Fish and do not submit any rows.
        const validationResults = await Promise.all(
          rowPayloads.map(async ({ payload, rowNumber }) => {
            try {
              await telemetryDataEntrySchema({ isSearchTypeRs }).validate(payload, { abortEarly: false });
              return { isValid: true, rowNumber, errors: [] };
            } catch (error) {
              const validationErrors = error?.inner?.length ? error.inner : [error];
              const seen = new Set();
              const errors = validationErrors
                .map((item) => {
                  const message = item?.message;
                  if (!message) {
                    return null;
                  }

                  const columnId =
                    String(item?.path ?? '')
                      .split('.')
                      .pop() || '';
                  const columnName = (columnHeaderById[columnId] ?? columnId) || 'Row';
                  const key = `${columnName}|${message}`;
                  if (seen.has(key)) {
                    return null;
                  }

                  seen.add(key);
                  return { columnName, message };
                })
                .filter(Boolean);

              return {
                isValid: false,
                rowNumber,
                errors,
              };
            }
          })
        );
        const invalidRows = validationResults.filter((result) => !result.isValid);
        const invalidRowCount = invalidRows.length;
        if (invalidRowCount > 0) {
          setValidationErrorRowCount(invalidRowCount);
          setValidationErrorRows(invalidRows);
          scrollToBottom();
          return;
        }

        for (const { payload, isNew, clientId } of rowPayloads) {
          try {
            // Sync Recovery Logic
            if (payload?._syncRecoveryError && payload?.clientId) {
              await updateData('telemetry', payload.clientId, payload);
              setData((currentRows) => {
                const updatedRows = (currentRows ?? []).map((currentRow) => {
                  if (String(currentRow?.clientId) !== String(payload.clientId)) {
                    return currentRow;
                  }
                  return {
                    ...currentRow,
                    ...payload,
                    _syncRecoveryError: false,
                    _syncRecoveryMessage: undefined,
                    _status: DataEntryStatuses.Queued,
                    _isPlaceholderRow: false,
                    _isTouched: true,
                  };
                });
                return ensureTrailingBlankRow(updatedRows);
              });
              continue;
            }
            // Execute Submit
            if (isOnline) {
              isNew ? await doSaveTelemetryDataEntry(payload) : await doUpdateTelemetryDataEntry(payload);
            } else {
              isNew ? await createData('telemetry', payload) : await updateData('telemetry', clientId, payload);
            }
          } catch (error) {
            console.error('Telemetry save failed, queuing offline:', error);
            isNew ? await createData('telemetry', payload) : await updateData('telemetry', clientId, payload);
          }
        }

        setData((prev) => {
          const existingRows = (prev ?? []).filter((row) => !isUntouchedPlaceholderRow(row));
          const updatedRows = existingRows.map((row) => {
            const matchingPayloadEntry = rowPayloads.find(({ item }) => item === row);

            if (!matchingPayloadEntry) return row;
            return {
              ...matchingPayloadEntry.payload,
              _status: OfflineStatuses.Queued,
            };
          });
          return ensureTrailingBlankRow(updatedRows);
        });

        const draft = savedDraft ? JSON.parse(savedDraft) : {};
        const telemetryCount = (data ?? []).filter((row) => !isUntouchedPlaceholderRow(row)).length;
        sessionStorage.setItem(searchDraftKey, JSON.stringify({ ...draft, telemetryCount: telemetryCount }));
        const hasRecoveryRow = rowsToProcess.some(({ item }) => item?._syncRecoveryError && item?.clientId);
        if (!hasRecoveryRow) {
          const telemetryParentId = isOnline ? seId || seFid : seFid || seId;
          await doSearchEffortDatasheetLoadData(telemetryParentId);
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
      const refreshRows =
        items?.map((item) => ({
          ...item,
          captureTime: item?.captureTime ?? '',
          suspectedSpawningActivity: item?.suspectedSpawningActivity ?? '',
        })) ?? [];
      setData(ensureTrailingBlankRow(refreshRows));
    }, [items]);

    // Load Recovery Rows
    useEffect(() => {
      const loadRecoveryRow = async () => {
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
          captureTime: recoveryRow?.captureTime ?? '',
          suspectedSpawningActivity: recoveryRow?.suspectedSpawningActivity ?? '',
          _status: outboxItem.syncError ? 'edited' : 'queued',
          _syncRecoveryError: Boolean(outboxItem.syncError),
          _syncRecoveryMessage: outboxItem.syncError ?? undefined,
          _isPlaceholderRow: false,
          _isTouched: true,
        };

        setData((currentRows) => {
          const realRows = (currentRows ?? []).filter((row) => !isUntouchedPlaceholderRow(row));
          const existingIndex = realRows.findIndex(
            (row) => row?.clientId && recoveryRow?.clientId && String(row.clientId) === String(recoveryRow.clientId)
          );

          if (existingIndex >= 0) {
            realRows[existingIndex] = formattedRecoveryRow;
          } else {
            realRows.push(formattedRecoveryRow);
          }

          return ensureTrailingBlankRow(realRows);
        });
      };
      loadRecoveryRow();
    }, [items, seId, seFid]);

    // Load offline lookups
    useEffect(() => {
      const loadOfflineLookups = async () => {
        const entries = await Promise.all(lookupTableNames.map(async (name) => [name, await getLookupOptions(name)]));
        setLookups(Object.fromEntries(entries));
      };

      !isOnline && loadOfflineLookups();
    }, [isOnline]);

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
          rowErrorCallback={() => {}}
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
        <Button className='margin-top-2 add-btn' onClick={() => handleSubmitAll()} type='button'>
          Submit
        </Button>
        <Button className='margin-top-2 add-btn' onClick={() => handleSaveAndClose()} type='button'>
          Save & Close
        </Button>
        <Button className='margin-top-2 add-btn' onClick={() => handleSaveAndOpenMoriver()} type='button'>
          Save & Open MR Datasheet
        </Button>
        {validationErrorRowCount > 0 && (
          <Alert aria-live='polite' className='margin-y-1' headingLevel='h4' noIcon slim type='error'>
            <p className='margin-y-0'>
              {validationErrorRowCount} row{validationErrorRowCount === 1 ? '' : 's'}
              {validationErrorRowCount === 1 ? ' has ' : ' have '}validation errors that must be corrected before data
              can be submitted.
            </p>
            {validationErrorRows.length > 0 && (
              <ul className='margin-top-1 margin-bottom-0 padding-left-3'>
                {validationErrorRows.map((rowError) => (
                  <li key={`row-${rowError.rowNumber}`}>
                    Row {rowError.rowNumber}: {displayValidationTableErrors(rowError)}
                  </li>
                ))}
              </ul>
            )}
          </Alert>
        )}
      </FormProvider>
    );
  }
);

export default TelemetryDataEntry;
