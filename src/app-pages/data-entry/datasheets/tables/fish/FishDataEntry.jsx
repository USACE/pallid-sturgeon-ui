import React, { useCallback, useState, useMemo, useEffect } from 'react';
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
import WeightTableCell from '@src/app-components/table/table-cell-components/fish/WeightTableCell';

import { FishDataEntrySchema, getBaseDefaultValues, getFishRiverDefaultValues } from './FishDataEntry.validation';
import { yesNoOptions } from '@src/app-pages/data-entry/edit-data-sheet/forms/_shared/selectHelper';
import { CreateComboboxOptions, createDropdownOptions } from '@src/app-pages/data-entry/dataEntryHelper';
import { createData, updateData, isOnline } from '@src/app-pages/data-entry/offline/api';
import { db } from '@src/app-pages/data-entry/offline/db';
import { OfflineStatuses } from '@src/utils/enums';

import '@pages/data-summaries/data-summary.scss';
import '@pages/data-entry/dataentry.scss';
import { filterNullEmptyObjects } from '@src/utils/helpers';
import { update, words } from 'lodash';

const saveBtnClasses = classNames('button-small', 'text-normal', 'save-btn');

const getNextSequence = (data, mrFid) => {
  const existing = data.filter((item) => item.mrFid === mrFid);
  return existing.length + 1;
};

const FishDataEntry = connect(
  'doSaveFishDataEntry',
  'doUpdateFishDataEntry',
  'doUpdateCurrentTab',
  'selectDataEntryData',
  'selectDataEntryFishData',
  'selectBaseData',
  'selectLookupData',
  'selectRouteParams',
  ({
    doSaveFishDataEntry,
    doUpdateFishDataEntry,
    doUpdateCurrentTab,
    dataEntryData,
    dataEntryFishData,
    baseData,
    lookupData,
    routeParams,
  }) => {
    const { items } = dataEntryFishData;
    const { gear, siteId } = dataEntryData;
    const siteRouteKey = routeParams?.siteId;

    const { fishCodes, fishStructures, floyTagPrefixes, lengthTypes, markRecaptureOptions } = lookupData;

    const rowData = items?.map((item) => ({ ...item, bendRiverMile: baseData?.bendRiverMile }));
    const [tableKey, setTableKey] = useState(0);
    const [data, setData] = useState(rowData);
    const columnHelper = createColumnHelper();

    // Get Missouri River Draft Data
    const moriverDraftKey = `currentMissouriRiverDraft:${siteRouteKey}`;
    const savedDraft = sessionStorage.getItem(moriverDraftKey);
    const moriverDraft = savedDraft ? JSON.parse(savedDraft) : null;
    const mrFid =
      dataEntryData?.mrFid ??
      dataEntryData?.mr_fid ??
      moriverDraft?.mrFid ??
      moriverDraft?.mr_fid ??
      baseData?.mrFid ??
      baseData?.mr_fid;

    const parentMrId =
      dataEntryData?.mrId ??
      dataEntryData?.mr_id ??
      moriverDraft?.mrId ??
      moriverDraft?.mr_id ??
      baseData?.mrId ??
      baseData?.mr_id;

    const speciesOptions =
      fishCodes?.map((item) => ({
        code: item.alphaCode,
        description: item.commonName,
      })) ?? [];

    const methods = useForm({
      resolver: yupResolver(FishDataEntrySchema({ gear, data })),
      mode: 'onBlur',
    });

    const tableColumns = useMemo(
      () => [
        columnHelper.accessor('fid', {
          header: 'Fish ID',
          cell: ({ cell }) => <span>{cell.getValue()}</span>,
          size: 150,
        }),
        columnHelper.accessor('fFid', {
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
          cell: WeightTableCell,
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
      [columnHelper, data]
    );

    const formatFishRow = (row) => ({
      ...row,
      countF: row?.countF !== null && row?.countF !== '' ? parseInt(row.countF) : null,
      length: row?.length !== null && row?.length !== '' ? Number(row.length) : null,
      condition: row?.condition !== null && row?.condition !== '' ? Number(row.condition) : null,
      weight: row?.weight !== null && row?.weight !== '' ? Number(row.weight) : null,
    });

    const handleAddRow = async () => {
      const parentRowMrFid =
        dataEntryData?.mrFid ??
        dataEntryData?.mr_fid ??
        moriverDraft?.mrFid ??
        moriverDraft?.mr_fid ??
        baseData?.mrFid ??
        baseData?.mr_fid;

      if (!parentMrFid) {
        console.error('Cannot add Fish row: missing parent mrFid.');
        window.alert('Save the Missouri River draft first before adding Fish.');
        return;
      }

      const parentRowMrId =
        dataEntryData?.mrId ??
        dataEntryData?.mr_id ??
        moriverDraft?.mrId ??
        moriverDraft?.mr_id ??
        baseData?.mrId ??
        baseData?.mr_id;

      const base = getBaseDefaultValues({ baseData });
      const localRows = await db.fish.where('mrFid').equals(parentRowMrFid).toArray();
      const currentRows = data?.filter((row) => String(row.mrFid ?? row.mr_fid) === String(parentRowMrFid)) ?? [];
      const existingFids = new Set([
        ...localRows.map((row) => row.fFid ?? row.f_fid),
        ...currentRows.map((row) => row.fFid ?? row.f_fid),
      ]);
      const sequence = existingFids.size + 1;
      const sequenceText = String(sequence).padStart(3, '0');
      const fishFid = `${parentRowMrFid}-${sequenceText}`;

      const newRowData = {
        ...base,
        ...getFishRiverDefaultValues({ dataEntryData }),
        mrId: parentRowMrId,
        mr_id: parentRowMrId,
        mrFid: parentRowMrFid,
        mr_fid: parentRowMrFid,
        fFid: fishFid,
        f_fid: fishFid,
        _status: OfflineStatuses.New,
      };

      setData((prev) => (prev ? [...prev, newRowData] : [newRowData]));
    };

    const handleCopyLastRowBtn = () => {
      const parentRowMrFid =
        dataEntryData?.mrFid ??
        dataEntryData?.mr_fid ??
        moriverDraft?.mrFid ??
        moriverDraft?.mr_fid ??
        baseData?.mrFid ??
        baseData?.mr_fid;

      if (!parentRowMrFid) {
        console.error('Cannot copy Fish row: missing parent mrFid.');
        window.alert('Save the Missouri River draft first before copying Fish.');
        return;
      }
      const lastRowData = data?.slice(-1)[0];

      if (!lastRowData) {
        window.alert('There is no Fish row to copy.');
        return;
      }

      const parentRowMrId =
        dataEntryData?.mrId ??
        dataEntryData?.mr_id ??
        moriverDraft?.mrId ??
        moriverDraft?.mr_id ??
        baseData?.mrId ??
        baseData?.mr_id;

      const sequence = getNextSequence(data ?? [], parentRowMrFid);
      const sequenceText = String(sequence).padStart(3, '0');
      const fishFid = `${parentRowMrFid}-${sequenceText}`;
      // Grab last object from data array

      // Format new row data
      const newRowData = {
        ...lastRowData,
        fid: null, // Reset fid if copying a save data object
        fFid: fishFid,
        mrId: parentRowMrId,
        mr_id: parentRowMrId,
        mrFid: parentRowMrFid,
        species: lastRowData?.species,
        lengthType: lastRowData?.lengthType,
        _status: OfflineStatuses.New,
      };
      setData((prev) => (prev ? [...prev, newRowData] : []));
    };

    const handleAddMultipleRows = (rows) => {
      // Handle any data mapping or formatting here
      setData((oldData) => [...Button(oldData ?? []), ...rows]);
    };

    const handleRemoveMultipleRows = useCallback((indicesToRemove) => {
      setData((oldData) => oldData.filter((_, index) => !indicesToRemove.includes(index)));
      setTableKey((old) => old + 1);
    }, []);

    const handleUpdateData = useCallback(
      (rowIndex, columnId, updatedValue) => {
        setData((oldData) => {
          if (!oldData?.[rowIndex]) {
            return oldData;
          }
          const newData = [...oldData];

          // Update properties
          newData[rowIndex] = {
            ...newData[rowIndex],

            ...(columnId === null && typeof updatedValue === 'object'
              ? updatedValue
              : {
                  [columnId]: updatedValue,
                }),
          };

          if (newData[rowIndex]._status !== OfflineStatuses.New) {
            newData[rowIndex]._status = OfflineStatuses.Edited;
          }
          return newData;
        });
      },
      [setData]
    );

    const handleSubmitAll = async () => {
      try {
        const rowsToProcess =
          data?.filter((row) => row._status === OfflineStatuses.New || row._status === OfflineStatuses.Edited) ?? [];

        if (rowsToProcess.length === 0) {
          console.log('No new or edited Fish rows to submit.');
          return;
        }

        const submittedClientIds = [];

        for (const row of rowsToProcess) {
          // data?.forEach(async (item) => {
          const isNew = !row.fid && !row.fId && !row.f_id;
          const formattedRow = formatFishRow(row);
          const clientId = row.clientId ?? crypto.randomUUID();

          const parentRowMrId =
            row.mr_id ??
            row.mrId ??
            dataEntryData?.mrId ??
            dataEntryData?.mr_id ??
            moriverDraft?.mrId ??
            moriverDraft?.mr_id ??
            baseData?.mrId ??
            baseData?.mr_id;

          const parentRowMrFid =
            row.mrFid ?? row.mr_fid ?? dataEntryData?.mrFid ?? dataEntryData?.mr_fid ?? moriverDraft?.mrFid;
          moriverDraft?.mr_fid ?? baseData?.mrFid ?? baseData?.mr_fid;

          if (!parentRowMrFid) {
            throw new Error(`Fish row ${row.fFid ?? row.f_fid ?? '(unknown)'} is missing its parent mrFid.`);
          }

          const fishFid = row.fFid ?? row.f_fid;

          const payload = {
            ...formattedRow,
            clientId,
            mr_id: parentRowMrId,
            mrId: parentRowMrId,
            mr_fid: parentRowMrFid,
            mrFid: parentRowMrFid,
            f_fid: fishFid,
            fFid: fishFid,
            tFid: row.tFid,
            _status: OfflineStatuses.Queued,
            version: item.version ?? 0,
            updatedAt: new Date().toISOString(),
          };

          await FishDataEntrySchema({ gear, data }).validate(payload, { abortEarly: false });

          try {
            if (isOnline()) {
              if (isNew) {
                await doSaveFishDataEntry(payload);
              } else if (row._status === OfflineStatuses.Edited) {
                await doUpdateFishDataEntry(payload);
              }
            } else if (isNew) {
              await createData('fish', payload);
            } else {
              await updateData('fish', clientId, payload);
            }
          } catch (err) {
            console.error('Fish API failed, queuing offline:', err);

            if (isNew) {
              await createData('fish', payload);
            } else {
              await updateData('fish', clientId, payload);
            }
          }
          submittedClientIds.push(clientId);
        }

        let submittedIndex = 0;

        setData((prev) =>
          prev.map((row) => {
            const wasSubmitted = row._status === OfflineStatuses.New || row._status === OfflineStatuses.Edited;

            if (!wasSubmitted) {
              return row;
            }

            const clientId = submittedClientIds[submittedIndex];

            submittedIndex += 1;

            return {
              ...row,
              _status: OfflineStatuses.Queued,
              clientId,
            };
          })
        );

        const draft = moriverDraft ?? {};
        sessionStorage.setItem(
          moriverDraftKey,
          JSON.stringify({
            ...draft,
            fishCount: 1,
          })
        );

        doUpdateCurrentTab(0);
      } catch (err) {
        console.error('Submit failed:', err);
      }
    };

    useEffect(() => {
      const rowData = items?.map((item) => ({ ...item, bendRiverMile: baseData?.bendRiverMile }));
      setData(rowData);
    }, [items]);

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
          rowErrorCallback={() => {}}
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
