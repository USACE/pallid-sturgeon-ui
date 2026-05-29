import React, { useCallback, useState, useMemo } from 'react';
import { connect } from 'redux-bundler-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { createColumnHelper } from '@tanstack/react-table';
import _isEqual from 'lodash/isEqual';
import { Button } from '@trussworks/react-uswds';
import classNames from 'classnames';

import DataEntryTable from '@src/app-components/table/data-entry-table/DataEntryTable';
import { TableCell } from '@src/app-components/table/table-cell-components/TableCell';
import PanelHookTableCell from '@src/app-components/table/table-cell-components/fish/PanelHookTableCell';
import LengthTableCell from '@src/app-components/table/table-cell-components/fish/LengthTableCell';
import FinCurlTableCell from '@src/app-components/table/table-cell-components/fish/FinCurlTableCell';
import ConditionTableCell from '@src/app-components/table/table-cell-components/fish/ConditionTableCell';
import GeneticVialNumTableCell from '@src/app-components/table/table-cell-components/fish/GeneticVialNumTableCell';
import FloyTagMrTableCell from '@src/app-components/table/table-cell-components/fish/floy-tag/FloyTagTableCell.mr';
import FloyTagTableCell from '@src/app-components/table/table-cell-components/fish/floy-tag/FloyTagTableCell';
import CountTableCell from '@src/app-components/table/table-cell-components/fish/CountTableCell';
import FloyTagPrefixTableCell from '@src/app-components/table/table-cell-components/fish/floy-tag/FloyTagTableCell.prefix';
import FishLinkTableCell from '@src/app-components/table/table-cell-components/fish/FishLinkTableCell';
import SupplementalProcedureModal from '@src/app-pages/data-entry/edit-data-sheet/forms/supplemental-procedure/SupplementalProcedureModal';

import { FishDataEntrySchema, getBaseDefaultValues, getFishRiverDefaultValues } from './FishDataEntry.validation';
import { yesNoOptions } from '@src/app-pages/data-entry/edit-data-sheet/forms/_shared/selectHelper';
import { CreateComboboxOptions, createDropdownOptions } from '@src/app-pages/data-entry/dataEntryHelper';

import '@pages/data-summaries/data-summary.scss';
import '@pages/data-entry/dataentry.scss';

const saveBtnClasses = classNames('button-small', 'text-normal', 'save-btn');

const getNextSequence = (data, mrFid) => {
  const existing = data.filter((item) => item.mrFid === mrFid);
  return existing.length + 1;
};

const FishDataEntry = connect(
  'doSaveFishDataEntry',
  'doUpdateFishDataEntry',
  'selectDataEntryData',
  'selectDataEntryFishData',
  'selectBaseData',
  'selectLookupData',
  ({ doSaveFishDataEntry, doUpdateFishDataEntry, dataEntryData, dataEntryFishData, baseData, lookupData }) => {
    const { items } = dataEntryFishData;
    const { gear, siteId } = dataEntryData;

    const { fishCodes, fishStructures, floyTagPrefixes, lengthTypes, markRecaptureOptions } = lookupData;

    const rowData = items?.map((item) => ({ ...item, bendRiverMile: baseData?.bendRiverMile }));
    const [tableKey, setTableKey] = useState(0);
    const [tableErrors, setTableErrors] = useState();
    const [data, setData] = useState(rowData);
    const columnHelper = createColumnHelper();

    // Get Missouri River Draft Data
    const moriverDraftKey = `currentMissouriRiverDraft:${siteId}`;
    const savedDraft = sessionStorage.getItem(moriverDraftKey);
    const moriverDraft = savedDraft ? JSON.parse(savedDraft) : null;
    const mrFid = dataEntryData?.mrFid || baseData?.mrFid || moriverDraft?.mrFid;

    const speciesOptions =
      fishCodes?.map((item) => ({
        code: item.alphaCode,
        description: item.commonName,
      })) ?? [];

    const methods = useForm({
      resolver: yupResolver(FishDataEntrySchema({ gear, data })),
      mode: 'onBlur',
      defaultValues: getFishRiverDefaultValues({ baseData: baseData, dataEntryData: dataEntryFishData }),
    });

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
        columnHelper.display({
          header: 'Supp/Proc Link',
          id: 'supplink',
          cell: ({ row }) => (
            <FishLinkTableCell row={row} rowData={rowData} modalComponent={SupplementalProcedureModal} />
          ),
          size: 60,
          enableSorting: false,
          meta: {
            centerText: true,
            optional: true, // These values are set to prevent error styling from rendering when inappropriate.
          },
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
            options: CreateComboboxOptions(speciesOptions),
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
          cell: FloyTagPrefixTableCell,
          size: 200,
          meta: {
            options: createDropdownOptions(floyTagPrefixes),
          },
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
      const sequence = getNextSequence(data, mrFid);

      const parentMrId =
        dataEntryData?.mrId ??
        dataEntryData?.mr_id ??
        dataEntryLastParams?.mrId ??
        dataEntryLastParams?.mr_id ??
        searchEffortDraft?.mrId ??
        searchEffortDraft?.mr_id;

      // Format new row data
      const newRowData = {
        ...base,
        // ...defaultValues,
        mrId: parentMrId,
        mr_id: parentMrId,
        ffid: `${mrFid}-${sequence}`,
        mrFid,
        _status: 'new',
      };

      setData((prev) => (prev ? [...prev, newRowData] : [newRowData]));
    };

    const handleCopyLastRowBtn = () => {
      const sequence = getNextSequence(data, mrFid);
      // Grab last object from data array
      const lastRowData = data.slice(-1)[0];
      // Format new row data
      const newRowData = {
        ...lastRowData,
        fid: null, // Reset fid if copying a save data object
        ffid: `${mrFid}-${sequence}`,
        _status: 'new',
        mrFid: mrFid,
      };
      setData((prev) => (prev ? [...prev, newRowData] : []));
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

    const handleSubmitAll = async () => {
      try {
        data?.forEach(async (item) => {
          const isNew = !item.fId;
          const clientId = item.clientId ?? crypto.randomUUID();

          const payload = {
            ...item,
            clientId,
            // f_id: parentSeId,
            fFid: item.seFid,
            tFid: item.tFid,
            // _status: 'queued',
            // version: row.version ?? 0,
            countF: item.countF ? parseInt(item.countF) : null,
          };

          await FishDataEntrySchema({ gear, data }).validate(item, { abortEarly: false });
          if (isNew) {
            await doSaveFishDataEntry(payload);
          } else {
            await doUpdateFishDataEntry(payload);
          }
        });
      } catch (err) {
        console.error('Submit failed:', err);
      }
    };

    return (
      <FormProvider {...methods}>
        <Button className={saveBtnClasses} onClick={() => handleCopyLastRowBtn()} type='button'>
          Copy Last Row
        </Button>
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
          validationSchema={FishDataEntrySchema({ gear, data })}
        />
        <Button className={saveBtnClasses} onClick={() => handleSubmitAll()} type='button'>
          Submit
        </Button>
      </FormProvider>
    );
  }
);

export default FishDataEntry;
