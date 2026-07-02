import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import _isEqual from 'lodash/isEqual';
import { Button } from '@trussworks/react-uswds';
import classNames from 'classnames';

import DataEntryTable from '@src/app-components/table/data-entry-table/DataEntryTable';

import { FishDataEntrySchema, getBaseDefaultValues, getFishRiverDefaultValues } from './FishDataEntry.validation';
import { yesNoOptions } from '@src/app-pages/data-entry/edit-data-sheet/forms/_shared/selectHelper';

import { db } from '@src/app-pages/data-entry/offline/db';
import { OfflineStatuses } from '@src/utils/enums';
import { isOnline } from '@src/app-pages/data-entry/offline/sync';
import { createData, updateData } from '@src/app-pages/data-entry/offline/api';
import { getFishColumns } from './helpers.fish';

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
    const { gear } = dataEntryData;
    const { siteId } = routeParams;
    const { fishCodes, fishStructures, floyTagPrefixes, lengthTypes, markRecaptureOptions } = lookupData;

    const rowData = items?.map((item) => ({ ...item, bendRiverMile: baseData?.bendRiverMile }));
    const [tableKey, setTableKey] = useState(0);
    const [data, setData] = useState(rowData);

    // Get Missouri River Draft Data
    const moriverDraftKey = `currentMissouriRiverDraft:${siteId}`;
    const savedDraft = sessionStorage.getItem(moriverDraftKey);
    const moriverDraft = savedDraft ? JSON.parse(savedDraft) : null;
    const mrFid = dataEntryData?.mrFid || moriverDraft?.mrFid;

    const parentMrId = dataEntryData?.mrId ?? dataEntryData?.mr_id ?? moriverDraft?.mrId ?? moriverDraft?.mr_id;
    const online = !!isOnline();

    const speciesOptions =
      fishCodes?.map((item) => ({
        code: item.alphaCode,
        description: item.commonName,
      })) ?? [];

    const methods = useForm({
      resolver: yupResolver(FishDataEntrySchema({ gear, data })),
      mode: 'onBlur',
    });

    const tableColumns = getFishColumns({
      gear,
      speciesOptions,
      lengthTypes,
      floyTagPrefixes,
      markRecaptureOptions,
      yesNoOptions,
      fishStructures,
    });

    const handleAddRow = async () => {
      // Add default values here
      const base = getBaseDefaultValues({ baseData });

      const localRows = await db.fish.where('mrFid').equals(mrFid).toArray();

      const dbRows = data?.filter((row) => row.mrFid === mrFid) ?? [];
      const sequence = localRows.length + dbRows.length + 1;
      const sequenceText = String(sequence).padStart(3, '0');

      // Format new row data
      const newRowData = {
        ...base,
        ...getFishRiverDefaultValues({ dataEntryData }),
        mrId: parentMrId,
        mr_id: parentMrId,
        fFid: `${mrFid}-${sequenceText}`,
        mrFid: mrFid,
        _status: OfflineStatuses.New,
      };

      setData((prev) => (prev ? [...prev, newRowData] : [newRowData]));
    };

    const handleCopyLastRowBtn = () => {
      const sequence = getNextSequence(data, mrFid);
      const sequenceText = String(sequence).padStart(3, '0');
      // Grab last object from data array
      const lastRowData = data.slice(-1)[0];
      // Format new row data
      const newRowData = {
        fid: null, // Reset fid if copying a save data object
        fFid: `${mrFid}-${sequenceText}`,
        mrId: parentMrId,
        mr_id: parentMrId,
        mrFid: mrFid,
        species: lastRowData?.species,
        lengthType: lastRowData?.lengthType,
        _status: OfflineStatuses.New,
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
              ...(columnId === null && typeof updatedValue === 'object' ? updatedValue : { [columnId]: updatedValue }),
            };
            if (newData[rowIndex]._status !== OfflineStatuses.New) {
              newData[rowIndex]._status = OfflineStatuses.Edited;
            }
            return newData;
          }
          return oldData;
        });
      },
      [setData]
    );

    const handleSubmitAll = async () => {
      const rowsToProcess = data?.filter(
        (row) => row._status === OfflineStatuses.New || row._status === OfflineStatuses.Edited
      );

      try {
        rowsToProcess?.forEach(async (item) => {
          const isNew = !item.fid;
          const clientId = item.clientId ?? crypto.randomUUID();
          const parentRowMrId = parentMrId ?? item.mrId ?? item.mr_id;

          const payload = {
            ...item,
            clientId: clientId,
            mr_id: parentRowMrId,
            mrFid: item.mrFid,
            fFid: item.fFid,
            _status: OfflineStatuses.Queued,
            version: item.version ?? 0,
            // Format values
            countF: item?.countF !== null && item?.countF !== '' ? Number(item?.countF) : null,
            length: item?.['length'] !== null && item?.['length'] !== '' ? Number(item?.['length']) : null,
            condition: item?.condition !== null && item?.condition !== '' ? Number(item?.condition) : null,
            weight: item?.weight !== null && item?.weight !== '' ? Number(item?.weight) : null,
          };

          await FishDataEntrySchema({ gear, data }).validate(payload, { abortEarly: false });

          try {
            if (online) {
              if (isNew) {
                await doSaveFishDataEntry(payload);
              } else if (item.fid && item._status === OfflineStatuses.Edited) {
                await doUpdateFishDataEntry(payload);
              }
            } else {
              isNew ? await createData('fish', payload) : await updateData('fish', payload);
            }
          } catch (error) {
            console.error('Fish API failed, queuing offline:', error);
            isNew ? await createData('fish', payload) : await updateData('fish', payload);
          }
        });

        setData((prev) =>
          prev.map((row) =>
            row._status === OfflineStatuses.New || row._status === OfflineStatuses.Edited
              ? { ...row, _status: OfflineStatuses.Queued, clientId: row.clientId ?? crypto.randomUUID() }
              : row
          )
        );

        const draft = savedDraft ? JSON.parse(savedDraft) : {};
        sessionStorage.setItem(moriverDraftKey, JSON.stringify({ ...draft }));
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
