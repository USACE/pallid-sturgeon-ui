import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { connect } from 'redux-bundler-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { createColumnHelper } from '@tanstack/react-table';
import _isEqual from 'lodash/isEqual';
import { useGpsCapture } from '@src/app-components/gps/gpsCapture';
import { useGpsCapture } from '@src/app-components/gps/gpsCapture';

import DataEntryTable from '@src/app-components/table/data-entry-table/DataEntryTable';
import { TableCell } from '@src/app-components/table/table-cell-components/TableCell';
import { Button, Alert, Grid } from '@trussworks/react-uswds';
import classNames from 'classnames';

import {
  telemetryDataEntrySchema,
  getBaseDefaultValues,
  getTelemetryDefaultValues,
} from './TelemetryDataEntry.validation';

import '@pages/data-summaries/data-summary.scss';
import '@pages/data-entry/dataentry.scss';
import { createData, updateData, isOnline } from '@src/app-pages/data-entry/offline/api';
import { getLookupOptions } from '@src/app-pages/data-entry/offline/lookup-cache';
import { db } from '@src/app-pages/data-entry/offline/db';

const saveBtnClasses = classNames('button-small', 'text-normal', 'save-btn');

const createDropdownOptions = (data) => {
  if (!data) return [];

  return data.map((item) => {
    const { code, description } = item;

    return {
      value: code,
      text: description,
    };
  });
};

const TelemetryDataEntry = connect(
  'doModalOpen',
  'doSaveTelemetryDataEntry',
  'doUpdateTelemetryDataEntry',
  'selectDataEntryTelemetryData',
  'selectDataEntryLastParams',
  'selectUserRole',
  'selectBaseData',
  'selectDataEntryData',
  'selectLookupData',
  'doUpdateCurrentTab',
  'selectRouteParams',
  ({
    doModalOpen,
    doSaveTelemetryDataEntry,
    doUpdateTelemetryDataEntry,
    dataEntryTelemetryData,
    dataEntryLastParams,
    userRole,
    baseData,
    dataEntryData,
    lookupData,
    doUpdateCurrentTab,
    routeParams,
  }) => {
    const { frequencyId, spawnBehavior, macros, mesos, positionConfidence } = lookupData;
    const { items } = dataEntryTelemetryData;

    const rowData = items?.map((item) => ({ ...item, bendRiverMile: baseData?.bendRiverMile }));
    const [tableKey, setTableKey] = useState(0);
    const [tableErrors, setTableErrors] = useState();
    const [data, setData] = useState([]);
    const [tableIsDirty, setTableIsDirty] = useState(false);
    const prevTableDataRef = useRef([]);
    const columnHelper = createColumnHelper();
    const { captureOnce } = useGpsCapture();
    const siteId = routeParams?.siteId;
    const searchDraftKey = `currentSearchEffortDraft:${siteId}`;
    const savedDraft = sessionStorage.getItem(searchDraftKey);
    const searchEffortDraft = savedDraft ? JSON.parse(savedDraft) : null;
    const seFid = dataEntryData?.seFid || baseData?.seFid || searchEffortDraft?.seFid;

    const [offlineLookups, setOfflineLookups] = useState({
      frequencyId: [],
      spawnBehavior: [],
      macros: [],
      mesos: [],
      positionConfidence: [],
    });

    const defaultValues = { seId: dataEntryLastParams?.seId };

    const frequencyIdOptions = frequencyId?.length > 0 ? frequencyId : offlineLookups.frequencyId;
    const spawnBehaviorOptions = spawnBehavior?.length > 0 ? spawnBehavior : offlineLookups.spawnBehavior;
    const macroOptions = macros?.length > 0 ? macros : offlineLookups.macros;
    const mesoOptions = mesos?.length > 0 ? mesos : offlineLookups.mesos;
    const positionConfidenceOptions =
      positionConfidence?.length > 0 ? positionConfidence : offlineLookups.positionConfidence;

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
      if (items) {
        console.log('Fetched items:', items);
        items.forEach((item, index) => {
          console.log(
            'row',
            index,
            'captureTime:',
            item.captureTime,
            'spawnBehavior:',
            item.spawnBehavior,
            'frequencyId:',
            item.frequencyIdCode
          );
        });

        const idOptions = createDropdownOptions(frequencyId);

        const mapped = items.map((item) => {
          const match = idOptions?.find((opt) => String(opt.value) === String(item.frequencyIdCode));

          return {
            ...item,
            bendRiverMile: baseData?.bendRiverMile,
            captureTime: item.captureDate ?? '',
            spawnBehavior: item.suspectedSpawningActivity ?? '',
            frequencyIdCode: item.frequencyIdCode != null ? match || null : null,
          };
        });
        setData(mapped);
      }
    }, [items, baseData, frequencyId]);

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

        const fix = await captureOnce();
        const time = fmtTimeHHMMSS();

        console.log('GPS result:', { fix, time });

        const computedValues = {
          captureTime: time,
          captureLatitude: fix.lat,
          captureLongitude: fix.lng,
        };

        handleUpdateData(rowIndex, null, computedValues);
      } catch (err) {
        console.error('GPS error', err);
      }
    };

    const methods = useForm({
      resolver: yupResolver(telemetryDataEntrySchema),
      mode: 'onBlur',
      defaultValues: getTelemetryDefaultValues({ baseData: baseData, dataEntryData: dataEntryTelemetryData }),
    });
    const {
      formState: { errors, dirtyFields },
      setValue,
      watch,
      setError,
      clearErrors,
      trigger,
      reset,
    } = methods;

    console.warn('Check errors:', errors);

    const tableColumns = useMemo(
      () => [
        columnHelper.accessor('tId', {
          header: 'ID',
          cell: ({ cell }) => <span>{cell.getValue()}</span>,
          size: 150,
        }),
        columnHelper.accessor('tFid', {
          header: 'Field ID',
          cell: ({ cell }) => <span>{cell.getValue()}</span>,
          size: 150,
        }),
        columnHelper.accessor('copy', {
          header: 'Copy Data',
          cell: ({ row }) => (
            <Button
              className={saveBtnClasses}
              onClick={() => {
                if (row.index === 0) return;

                const prevRow = data[row.index - 1];
                console.log('Previous row:', prevRow);

                handleUpdateData(row.index, null, {
                  radioTagNum: prevRow.radioTagNum ?? '',
                  frequencyIdCode:
                    prevRow.frequencyIdCode && typeof prevRow.frequencyIdCode === 'object'
                      ? prevRow.frequencyIdCode
                      : prevRow.frequencyIdCode != null
                        ? {
                            value: prevRow.frequencyIdCode,
                            text:
                              createDropdownOptions(frequencyId).find(
                                (opt) => String(opt.value) === String(prevRow.frequencyIdCode)
                              )?.text || '',
                          }
                        : null,
                });
              }}
              type='button'
            >
              Copy Data
            </Button>
          ),
        }),
        columnHelper.accessor('bend', {
          header: 'Bend',
          cell: TableCell,
          size: 100,
          meta: { readOnly: true },
        }),
        columnHelper.accessor('bendRiverMile', {
          header: 'Bend River Mile',
          cell: ({ cell }) => <span>{cell.getValue()}</span>,
          size: 190,
        }),
        columnHelper.accessor('radioTagNum', {
          header: 'Radio Tag #',
          cell: TableCell,
          size: 200,
          meta: { type: 'number', required: true },
        }),
        columnHelper.accessor('frequencyIdCode', {
          header: 'Frequency ID',
          cell: TableCell,
          size: 200,
          meta: {
            type: 'select',
            required: true,
            options: createDropdownOptions(frequencyId),
          },
        }),
        columnHelper.accessor('captureButton', {
          header: 'Capture Button',
          cell: ({ row }) => (
            <Button className={saveBtnClasses} onClick={() => handleCaptureRow(row.index)} type='button'>
              Capture Button
            </Button>
          ),
          size: 200,
        }),
        columnHelper.accessor('captureTime', {
          header: 'Capture Time',
          cell: TableCell,
          size: 200,
          meta: { type: 'text' },
        }),
        columnHelper.accessor('captureLatitude', {
          header: 'Capture Latitude',
          cell: TableCell,
          size: 200,
          meta: { type: 'text', required: true },
        }),
        columnHelper.accessor('captureLongitude', {
          header: 'Capture Longitude',
          cell: TableCell,
          size: 200,
          meta: { type: 'text', required: true },
        }),
        columnHelper.accessor('positionConfidence', {
          // select?
          header: 'Position Confidence',
          cell: TableCell,
          size: 200,
          meta: {
            type: 'select',
            required: true,
            options: createDropdownOptions(positionConfidence),
          },
        }),
        columnHelper.accessor('spawnBehavior', {
          header: 'Spawn Behavior',
          cell: TableCell,
          size: 200,
          meta: {
            type: 'select',
            required: true,
            options: createDropdownOptions(spawnBehavior),
          },
        }),
        columnHelper.accessor('mesoId', {
          // select?
          header: 'Meso',
          cell: TableCell,
          size: 200,
          meta: {
            type: 'select',
            required: true,
            options: createDropdownOptions(mesos),
          },
        }),
        columnHelper.accessor('macroId', {
          // select?
          header: 'Macro',
          cell: TableCell,
          size: 200,
          meta: {
            type: 'select',
            required: true,
            options: createDropdownOptions(macros),
          },
        }),
        columnHelper.accessor('depth', {
          header: 'Depth',
          cell: TableCell,
          size: 200,
          meta: { type: 'number' },
        }),
        columnHelper.accessor('temp', {
          header: 'Temp',
          cell: TableCell,
          size: 200,
          meta: { type: 'number' },
        }),
        columnHelper.accessor('conductivity', {
          header: 'Conductivity',
          cell: TableCell,
          size: 200,
          meta: { type: 'number' },
        }),
        columnHelper.accessor('turbidity', {
          header: 'Turbidity',
          cell: TableCell,
          size: 200,
          meta: { type: 'number' },
        }),
        columnHelper.accessor('silt', {
          header: 'Silt',
          cell: TableCell,
          size: 200,
          meta: { type: 'number' },
        }),
        columnHelper.accessor('sand', {
          header: 'Sand',
          cell: TableCell,
          size: 200,
          meta: { type: 'number' },
        }),
        columnHelper.accessor('gravel', {
          header: 'Gravel',
          cell: TableCell,
          size: 200,
          meta: { type: 'number' },
        }),
        columnHelper.accessor('comments', {
          header: 'Comments',
          cell: TableCell,
          size: 200,
          meta: { type: 'text' },
        }),
        columnHelper.accessor('editInitials', {
          header: 'Edit Initials',
          cell: TableCell,
          size: 200,
          meta: { type: 'text' },
        }),
        columnHelper.accessor('lastEditComment', {
          header: 'Last Edit Comment',
          cell: TableCell,
          size: 200,
          meta: { type: 'text' },
        }),
        columnHelper.accessor('checkby', {
          header: 'Check By',
          cell: TableCell,
          size: 200,
          meta: { type: 'text' },
        }),
        columnHelper.accessor('uploadedBy', {
          header: 'Uploaded By',
          cell: ({ cell }) => <span>{cell.getValue()}</span>,
          size: 190,
        }),
      ],
      [columnHelper]
    );

    const handleAddRow = async () => {
      // Add default values here
      const base = getBaseDefaultValues({ baseData });

      const localRows = await db.telemetry.where('seFid').equals(seFid).toArray();

      const dbRows = data?.filter((row) => row.seFid === seFid) ?? [];
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
        se_id: parentSeId,
        tFid: `${seFid}-${sequenceText}`,
        seFid,
        ...defaultValues,
        _status: 'new',
        // countF: 1,
      };
      setData((prev) => (prev ? [...prev, newRowData] : [newRowData]));
    };

    const handleAddMultipleRows = (rows) => {
      // Handle any data mapping or formatting here
      setData((oldData) => {
        const newRows = [...oldData, ...rows];
        return newRows;
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

    const handleUpdateData = useCallback((rowIndex, columnId, value) => {
      setData((oldData) => {
        if (!oldData) return [];

        const newData = [...oldData];
        if (!newData[rowIndex]) return oldData;

        if (typeof value === 'object' && columnId === null) {
          newData[rowIndex] = {
            ...newData[rowIndex],
            ...value,
          };
        } else {
          newData[rowIndex] = {
            ...newData[rowIndex],
            [columnId]: value,
          };
        }

        if (newData[rowIndex]._status !== 'new') {
          newData[rowIndex]._status = 'edited';
        }
        return newData;
      });
    }, []);

    const formatRow = (row) => {
      return {
        ...row,
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

          const payload = {
            ...formattedRow,
            clientId,
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
            console.error('Telemetry API failed, queuing offline:', error);

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
        doUpdateCurrentTab(0);
      } catch (err) {
        console.error('Submit failed:', err);
      }
    };

    useEffect(() => {
      const tableDataChanged = !_isEqual(data, prevTableDataRef.current);
      tableDataChanged && setTableIsDirty(true);
    }, [data]);

    return (
      <FormProvider {...methods}>
        <>
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
          <Button
            className={saveBtnClasses}
            onClick={() => {
              handleSubmitAll();
            }}
            type='button'
          >
            Submit
          </Button>
        </>
      </FormProvider>
    );
  }
);

export default TelemetryDataEntry;
