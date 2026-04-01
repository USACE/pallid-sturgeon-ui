import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { connect } from 'redux-bundler-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { createColumnHelper } from '@tanstack/react-table';
import _isEqual from 'lodash/isEqual';

import DataEntryTable from '@src/app-components/table/data-entry-table/DataEntryTable';
import { TableCell } from '@src/app-components/table/table-cell-components/TableCell';
import { Button, Alert, Grid } from '@trussworks/react-uswds';
import classNames from 'classnames';

import { frequencyIdOptions } from '../../../edit-data-sheet/forms/_shared/selectHelper';
import {
  telemetryDataEntrySchema,
  getBaseDefaultValues,
  getTelemetryDefaultValues,
} from './TelemetryDataEntry.validation';

import '@pages/data-summaries/data-summary.scss';
import '@pages/data-entry/dataentry.scss';
import { update } from 'lodash';
// import { createDropdownOptions } from '@src/app-pages/data-entry/helpers';

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

    const defaultValues = { seId: dataEntryLastParams.seId };

    useEffect(() => {
      if (items) {
        const mapped = items.map((item) => ({
          ...item,
          bendRiverMile: baseData?.bendRiverMile,
        }));
        setData(mapped);
      }
    }, [items, baseData]);

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

                handleUpdateData(row.index, null, {
                  radioTagNum: prevRow.radioTagNum,
                  frequencyId: prevRow.frequencyId,
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
          size: 200,
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
            <Button
              className={saveBtnClasses}
              onClick={() => {
                const computedValues = {
                  captureDate: 'captureDate',
                  captureLatitude: 'captureLatitude',
                  captureLongitude: 'captureLongitude',
                };
                handleUpdateData(row.index, computedValues);
              }}
              type='button'
            >
              Capture Button
            </Button>
          ),
          size: 200,
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
          header: 'Check By',
          cell: ({ cell }) => <span>{cell.getValue()}</span>,
          size: 190,
        }),
      ],
      [columnHelper]
    );

    const handleAddRow = () => {
      // Add default values here
      const base = getBaseDefaultValues({ baseData });
      const newRowData = {
        ...base,
        countF: 1,
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

    const handleUpdateData = useCallback(
      (rowIndex, columnId, value) => {
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

          // if (newData && newData[rowIndex]) {
          //   // Update properties
          //   newData[rowIndex] = {
          //     ...newData[rowIndex],
          //     [columnId]: updatedValue,
          //   };
          return newData;
        });
      },
      // [setData]
      []
    );

    const handleSubmitAll = async () => {
      try {
        for (let i = 0; i < data.length; i++) {
          await telemetryDataEntrySchema.validate(data, { abortEarly: false });
        }

        await doSaveTelemetryDataEntry(data);
        console.log('Submitted:', data);
      } catch (err) {
        console.error('Validation failed:', err);
      }
    };

    useEffect(() => {
      const tableDataChanged = !_isEqual(data, prevTableDataRef.current);
      tableDataChanged && setTableIsDirty(true);
    }, [data]);

    //Reset the dirty states of the fields after a save.
    // useResetDirtyFields(isTouched, requestAPIData, reset, trigger);

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
          <Button className={saveBtnClasses} onClick={handleSubmitAll} type='button'>
            Submit
          </Button>
        </>
      </FormProvider>
    );
  }
);

export default TelemetryDataEntry;
