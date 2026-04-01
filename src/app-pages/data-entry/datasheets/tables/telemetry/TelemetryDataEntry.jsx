import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { connect } from 'redux-bundler-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { createColumnHelper } from '@tanstack/react-table';
import _isEqual from 'lodash/isEqual';

import DataEntryTable from '@src/app-components/table/data-entry-table/DataEntryTable';
import { TableCell } from '@src/app-components/table/table-cell-components/TableCell';

import { frequencyIdOptions } from '../../../edit-data-sheet/forms/_shared/selectHelper';
import { telemetryDataEntrySchema } from './TelemetryDataEntry.validation';

import '@pages/data-summaries/data-summary.scss';
import '@pages/data-entry/dataentry.scss';

const TelemetryDataEntry = connect(
  'doModalOpen',
  'doSaveTelemetryDataEntry',
  'doUpdateTelemetryDataEntry',
  'selectDataEntryTelemetryData',
  'selectDataEntryLastParams',
  'selectUserRole',
  'selectBaseData',
  ({
    doModalOpen,
    doSaveTelemetryDataEntry,
    doUpdateTelemetryDataEntry,
    dataEntryTelemetryData,
    dataEntryLastParams,
    userRole,
    baseData,
  }) => {
    const { items } = dataEntryTelemetryData;

    const rowData = items?.map((item) => ({ ...item, bendRiverMile: baseData?.bendRiverMile }));
    const [tableKey, setTableKey] = useState(0);
    const [tableErrors, setTableErrors] = useState();
    const [data, setData] = useState(rowData);
    const [tableIsDirty, setTableIsDirty] = useState(false);
    const prevTableDataRef = useRef([]);
    const columnHelper = createColumnHelper();

    const defaultValues = { seId: dataEntryLastParams?.seId };

    const methods = useForm({
      resolver: yupResolver(telemetryDataEntrySchema),
      mode: 'onBlur',
      defaultValues: defaultValues,
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
        columnHelper.accessor('bend', {
          header: 'Bend',
          cell: TableCell,
          size: 200,
          meta: { type: 'text' },
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
            options: frequencyIdOptions,
          },
        }),
        columnHelper.accessor('captureDate', {
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
          meta: { type: 'number', required: true },
        }),
        columnHelper.accessor('mesoId', {
          // select?
          header: 'Meso',
          cell: TableCell,
          size: 200,
          meta: { type: 'text' },
        }),
        columnHelper.accessor('depth', {
          header: 'Depth',
          cell: TableCell,
          size: 200,
          meta: { type: 'number' },
        }),
        columnHelper.accessor('macroId', {
          // select?
          header: 'Macro',
          cell: TableCell,
          size: 200,
          meta: { type: 'text' },
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
          header: 'Check By',
          cell: ({ cell }) => <span>{cell.getValue()}</span>,
          size: 190,
        }),
      ],
      [columnHelper]
    );

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

    const handleUpdateData = useCallback(
      (rowIndex, columnId, updatedValue) => {
        setData((oldData) => {
          const newData = oldData ? [...oldData] : null;
          if (newData && newData[rowIndex]) {
            // Update properties
            newData[rowIndex] = {
              ...newData[rowIndex],
              [columnId]: updatedValue,
            };
            return newData;
          }
        });
      },
      [setData]
    );

    useEffect(() => {
      const tableDataChanged = !_isEqual(data, prevTableDataRef.current);
      tableDataChanged && setTableIsDirty(true);
    }, [data]);

    //Reset the dirty states of the fields after a save.
    // useResetDirtyFields(isTouched, requestAPIData, reset, trigger);

    return (
      <FormProvider {...methods}>
        <DataEntryTable
          addRow={() => setData((prev) => (prev ? [...prev, {}] : [{}]))}
          columns={tableColumns}
          data={data}
          initialTableState={{}}
          key={tableKey}
          placeholderClick={() => setData((prev) => (prev ? [...prev, {}] : [{}]))}
          placeholderText='No Telemetry Data found.'
          removeMultipleRows={handleRemoveMultipleRows}
          addMultipleRows={handleAddMultipleRows}
          rowErrorCallback={setTableErrors}
          tableVersion='TelemetryTable'
          updateSourceData={handleUpdateData}
          validationSchema={telemetryDataEntrySchema}
        />
      </FormProvider>
    );
  }
);

export default TelemetryDataEntry;
