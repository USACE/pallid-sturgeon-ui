import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { connect } from 'redux-bundler-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { createColumnHelper } from '@tanstack/react-table';
import _isEqual from 'lodash/isEqual';

import DataEntryTable from '@src/app-components/table/data-entry-table/DataEntryTable';
import { TableCell } from '@src/app-components/table/table-cell-components/TableCell';
import { FishDataEntrySchema, getBaseDefaultValues, getFishRiverDefaultValues } from './FishDataEntry.validation';

import '@pages/data-summaries/data-summary.scss';
import '@pages/data-entry/dataentry.scss';
import { yesNoOptions } from '@src/app-pages/data-entry/edit-data-sheet/forms/_shared/selectHelper';
import PanelHookTableCell from '@src/app-components/table/table-cell-components/fish/PanelHookTableCell';
import LengthTableCell from '@src/app-components/table/table-cell-components/fish/LengthTableCell';
import FinCurlTableCell from '@src/app-components/table/table-cell-components/fish/FinCurlTableCell';
import ConditionTableCell from '@src/app-components/table/table-cell-components/fish/ConditionTableCell';
import GeneticVialNumTableCell from '@src/app-components/table/table-cell-components/fish/GeneticVialNumTableCell';
import FloyTagMrTableCell from '@src/app-components/table/table-cell-components/fish/FloyTagMrTableCell';
import FloyTagTableCell from '@src/app-components/table/table-cell-components/fish/FloyTagTableCell';
import CountTableCell from '@src/app-components/table/table-cell-components/fish/CountTableCell';

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

const createComboboxOptions = (data) => {
  if (!data) return [];

  return data.map((item) => {
    const { code, description } = item;

    return {
      value: code,
      label: `${code} - ${description}`,
    };
  });
};

// @TODO: Need to pull gear code from Missouri River Data

const FishDataEntry = connect(
  'selectDataEntryData',
  'selectDataEntryFishData',
  'selectBaseData',
  'selectLookupData',
  ({ dataEntryData, dataEntryFishData, baseData, lookupData }) => {
    const { items } = dataEntryFishData;
    const { projectId } = baseData;
    const { gear } = dataEntryData;

    const { fishCodes, fishStructures, floyTagPrefixes, lengthTypes, markRecaptureOptions, recaptureData } = lookupData;

    const rowData = items?.map((item) => ({ ...item, bendRiverMile: baseData?.bendRiverMile }));
    const [tableKey, setTableKey] = useState(0);
    const [tableErrors, setTableErrors] = useState();
    const [data, setData] = useState(rowData);
    const [tableIsDirty, setTableIsDirty] = useState(false);
    const prevTableDataRef = useRef([]);
    const columnHelper = createColumnHelper();

    console.warn('data: ', data);
    console.warn('baseData: ', baseData);

    const speciesOptions =
      fishCodes?.map((item) => ({
        code: item.alphaCode,
        description: item.commonName,
      })) ?? [];

    const methods = useForm({
      resolver: yupResolver(FishDataEntrySchema({ gear, data, recaptureData })),
      mode: 'onBlur',
      defaultValues: getFishRiverDefaultValues({ baseData: baseData, dataEntryData: dataEntryFishData }),
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
        columnHelper.accessor('fid', {
          header: 'Fish ID',
          cell: ({ cell }) => <span>{cell.getValue()}</span>,
          size: 150,
        }),
        columnHelper.accessor('ffid', {
          header: 'Field ID',
          cell: ({ cell }) => <span>{cell.getValue()}</span>,
          size: 150,
        }),
        columnHelper.accessor('supplink', {
          header: 'Supp Link',
          cell: ({ cell }) => <span>Button</span>,
          size: 200,
        }),
        columnHelper.accessor('panelHook', {
          header: 'Panel/Hook',
          cell: PanelHookTableCell,
          size: 190,
          meta: {
            gear: gear,
          },
        }),
        columnHelper.accessor('species', {
          header: 'Species',
          cell: TableCell,
          size: 200,
          meta: {
            type: 'combobox',
            options: createComboboxOptions(speciesOptions),
          },
        }),
        columnHelper.accessor('lengthType', {
          header: 'Length Type',
          cell: TableCell,
          size: 200,
          meta: {
            type: 'select',
            required: true,
            options: createDropdownOptions(lengthTypes),
          },
        }),
        columnHelper.accessor('length', {
          header: 'Length(mm)',
          cell: LengthTableCell,
          size: 200,
          meta: { type: 'number' },
        }),
        columnHelper.accessor('weight', {
          header: 'Weight(grams)',
          cell: TableCell,
          size: 200,
          meta: { type: 'number' },
        }),
        columnHelper.accessor('countF', {
          header: 'Count',
          cell: CountTableCell,
          size: 200,
        }),
        columnHelper.accessor('ftPrefix', {
          header: 'Floy Tag Prefix',
          cell: TableCell,
          size: 200,
        }),
        columnHelper.accessor('floyTag', {
          header: 'Floy Tag',
          cell: FloyTagTableCell,
          size: 200,
        }),
        columnHelper.accessor('mR', {
          header: 'Floy Tag M/R',
          cell: FloyTagMrTableCell,
          size: 200,
          meta: {
            type: 'select',
            options: createDropdownOptions(markRecaptureOptions),
          },
        }),
        columnHelper.accessor('geneticsVialNumber', {
          header: 'Genetics Vial #',
          cell: GeneticVialNumTableCell,
          size: 250,
        }),
        columnHelper.accessor('condition', {
          header: 'Condition',
          cell: ConditionTableCell,
          size: 200,
        }),
        columnHelper.accessor('tagnumber', {
          header: 'Tag Number',
          cell: TableCell,
          size: 200,
        }),
        columnHelper.accessor('finCurl', {
          header: 'Fin Curl',
          cell: FinCurlTableCell,
          size: 200,
          meta: {
            type: 'select',
            options: yesNoOptions,
          },
        }),
        columnHelper.accessor('otolith', {
          header: 'Otolith',
          cell: TableCell,
          size: 200,
          meta: {
            type: 'select',
            options: createDropdownOptions(fishStructures),
          },
        }),
        // NOTE: Not in requirements, but display historic data
        columnHelper.accessor('raySpine', {
          header: 'Ray Spine',
          cell: ({ cell }) => <span>{cell.getValue()}</span>,
          size: 200,
        }),
        columnHelper.accessor('KN', {
          header: 'KN',
          cell: ({ cell }) => <span>{cell.getValue()}</span>,
          size: 200,
        }),
        columnHelper.accessor('RSD', {
          header: 'RSD',
          cell: ({ cell }) => <span>{cell.getValue()}</span>,
          size: 200,
        }),
        columnHelper.accessor('editInitials', {
          header: 'Edit Initials',
          cell: ({ cell }) => <span>{cell.getValue()}</span>,
          size: 200,
        }),
        columnHelper.accessor('uploadedBy', {
          header: 'Uploaded By',
          cell: ({ cell }) => <span>{cell.getValue()}</span>,
          size: 200,
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
          addRow={handleAddRow}
          columns={tableColumns}
          data={data}
          initialTableState={{}}
          key={tableKey}
          placeholderClick={handleAddRow}
          placeholderText='No Fish Data found.'
          removeMultipleRows={handleRemoveMultipleRows}
          addMultipleRows={handleAddMultipleRows}
          rowErrorCallback={setTableErrors}
          tableVersion='FishTable'
          updateSourceData={handleUpdateData}
          validationSchema={FishDataEntrySchema({ gear, data, recaptureData })}
        />
      </FormProvider>
    );
  }
);

export default FishDataEntry;
