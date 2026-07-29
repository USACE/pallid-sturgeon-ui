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

const createBlankFishRow = () => ({
  _isPlaceholderRow: true,
  _isTouched: false,
});

const isUntouchedPlaceholderFishRow = (row) => row?._isPlaceholderRow === true && row?._isTouched !== true;

const ensureTrailingBlankFishRow = (rows) => {
  const normalizedRows = rows ?? [];

  if (normalizedRows.length === 0) {
    return [createBlankFishRow()];
  }

  const lastRow = normalizedRows[normalizedRows.length - 1];
  if (isUntouchedPlaceholderFishRow(lastRow)) {
    return normalizedRows;
  }

  return [...normalizedRows, createBlankFishRow()];
};


// Calculate the next sequence number for a new fish row based on the parent mrFid and existing rows in the data array.
// localRows never seems to return anything(?) - feel free to change if there is an issue.
// const localRows = await db.fish.where('mrFid').equals(parentMrFid).toArray();
// const dbRows = data?.filter((row) => row.mrFid === parentMrFid) ?? [];
// const sequence = localRows.length + dbRows.length + 1;
const getNextFishFid = (data, parentMrFid) => {
  const existing = data?.filter((row) => row.mrFid === parentMrFid) ?? [];

  const maxSequence = existing.reduce((currentMax, row) => {
    const fieldId = row?.fFid ?? '';
    const sequencePart = String(fieldId).split('-').pop();
    const sequenceNumber = Number(sequencePart);

    if (Number.isFinite(sequenceNumber) && sequenceNumber > currentMax) {
      return sequenceNumber;
    }

    return currentMax;
  }, 0);

  const nextSequence = maxSequence + 1;
  const sequenceText = String(nextSequence).padStart(3, '0');
  const fishFid = `${parentMrFid}-${sequenceText}`;

  return fishFid;
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
    const siteRouteKey = routeParams?.siteId;
    const { gear } = dataEntryData;
    const {
      fishCodes: onlineFishCodes,
      fishStructures: onlineFishStructures,
      floyTagPrefixes: onlineFloyTagPrefixes,
      lengthTypes: onlineLengthTypes,
      markRecaptureOptions: onlineMarkRecaptureOptions,
    } = lookupData;
    const [offlineLookups, setOfflineLookups] = useState({
      fishCodes: [],
      fishStructures: [],
      floyTagPrefixes: [],
      lengthTypes: [],
      markRecaptureOptions: [],
    });
    const rowData = items?.map((item) => ({ ...item, bendRiverMile: baseData?.bendRiverMile }));
    const [tableKey, setTableKey] = useState(0);
    const [data, setData] = useState(ensureTrailingBlankFishRow(rowData));
    const [validationErrorRowCount, setValidationErrorRowCount] = useState(0);
    const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);

    // Get Missouri River Draft Data
    const moriverDraftKey = `currentMissouriRiverDraft:${siteRouteKey}`;
    const savedDraft = sessionStorage.getItem(moriverDraftKey);
    const moriverDraft = savedDraft ? JSON.parse(savedDraft) : null;
    const parentMrFid = dataEntryData?.mrFid ?? dataEntryData?.mr_fid ?? moriverDraft?.mrFid ?? moriverDraft?.mr_fid;
    const parentMrId = dataEntryData?.mrId ?? dataEntryData?.mr_id ?? moriverDraft?.mrId ?? moriverDraft?.mr_id;
    const online = !!isOnline();

    const fishCodes = onlineFishCodes?.length > 0 ? onlineFishCodes : offlineLookups.fishCodes;
    const fishStructures = onlineFishStructures?.length > 0 ? onlineFishStructures : offlineLookups.fishStructures;
    const floyTagPrefixes = onlineFloyTagPrefixes?.length > 0 ? onlineFloyTagPrefixes : offlineLookups.floyTagPrefixes;
    const lengthTypes = onlineLengthTypes?.length > 0 ? onlineLengthTypes : offlineLookups.lengthTypes;
    const markRecaptureOptions =
      onlineMarkRecaptureOptions?.length > 0 ? onlineMarkRecaptureOptions : offlineLookups.markRecaptureOptions;

    const dataForValidation = (data ?? []).filter((row) => !isUntouchedPlaceholderFishRow(row));
    const schema = FishDataEntrySchema({ gear, data: dataForValidation });
    const tableValidationSchema = {
      validate: (row, options) => {
        if (isUntouchedPlaceholderFishRow(row)) {
          return Promise.resolve(row);
        }

        return schema.validate(row, options);
      },
    };

    const speciesOptions =
      fishCodes?.map((item) => ({
        code: item.alphaCode,
        description: item.commonName,
      })) ?? [];

    const methods = useForm({
      resolver: yupResolver(schema),
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
      setData((prev) => ensureTrailingBlankFishRow(prev));
    };

    const handleCopyLastRowBtn = () => {
      if (!parentMrFid) {
        console.error('Cannot copy Fish row: missing parent mrFid.');
        window.alert('Save the Missouri River draft first before copying Fish.');
        return;
      }
      const fishFid = getNextFishFid(data ?? [], parentMrFid);
      // Grab last object from data array
      const lastRowData = (data ?? []).slice().reverse().find((row) => !isUntouchedPlaceholderFishRow(row));
      if (!lastRowData) {
        window.alert('No existing Fish row found to copy.');
        return;
      }

      // Format new row data
      const newRowData = {
        // ...lastRowData,
        fid: null, // Reset fid if copying a save data object
        fFid: fishFid,
        mrId: parentMrId,
        mr_id: parentMrId,
        mrFid: parentMrFid,
        species: lastRowData?.species,
        lengthType: lastRowData?.lengthType,
        countF: 1,
        _status: OfflineStatuses.New,
      };
      setData((prev) => {
        const existingRows = (prev ?? []).filter((row) => !isUntouchedPlaceholderFishRow(row));
        return ensureTrailingBlankFishRow([...existingRows, newRowData]);
      });
    };

    const handleAddMultipleRows = (rows) => {
      // Handle any data mapping or formatting here
      setData((oldData) => {
        const existingRows = (oldData ?? []).filter((row) => !isUntouchedPlaceholderFishRow(row));
        return ensureTrailingBlankFishRow([...existingRows, ...rows]);
      });
    };

    const handleRemoveMultipleRows = useCallback((indicesToRemove) => {
      setData((oldData) => {
        const remainingRows = oldData.filter((_, index) => !indicesToRemove.includes(index));
        return ensureTrailingBlankFishRow(remainingRows);
      });
      setTableKey((old) => old + 1);
    }, []);

    const handleUpdateData = useCallback(
      (rowIndex, columnId, updatedValue) => {
        setData((oldData) => {
          const newData = oldData ? [...oldData] : [];
          if (newData[rowIndex]) {
            const currentRow = newData[rowIndex];
            const isPlaceholderRow = isUntouchedPlaceholderFishRow(currentRow);

            let nextRow = currentRow;
            if (isPlaceholderRow) {
              const fishFid = parentMrFid ? getNextFishFid(newData, parentMrFid) : undefined;

              nextRow = {
                ...getBaseDefaultValues({ baseData }),
                ...getFishRiverDefaultValues({ dataEntryData }),
                ...(parentMrId != null ? { mrId: parentMrId, mr_id: parentMrId } : {}),
                ...(parentMrFid
                  ? {
                      mrFid: parentMrFid,
                      mr_fid: parentMrFid,
                      fFid: fishFid,
                      f_fid: fishFid,
                    }
                  : {}),
                _status: OfflineStatuses.New,
                _isPlaceholderRow: false,
                _isTouched: true,
              };
            }

            newData[rowIndex] = {
              ...nextRow,
              ...(columnId === null && typeof updatedValue === 'object' ? updatedValue : { [columnId]: updatedValue }),
              _isTouched: true,
            };

            if (!isPlaceholderRow && newData[rowIndex]._status !== OfflineStatuses.New) {
              newData[rowIndex]._status = OfflineStatuses.Edited;
            }

            return ensureTrailingBlankFishRow(newData);
          }
          return oldData;
        });
      },
      [baseData, dataEntryData, parentMrFid, parentMrId]
    );

    const handleSubmitAll = async () => {
      setIsSubmitAttempted(true);
      setValidationErrorRowCount(0);

      const rowsToProcess = data?.filter(
        (row) => row._status === OfflineStatuses.New || row._status === OfflineStatuses.Edited
      );

      try {
        const rowPayloads =
          rowsToProcess?.map((item) => {
            const isNew = !item.fid;
            const clientId = item.clientId ?? crypto.randomUUID();
            const parentRowMrId = item.mrId ?? item.mr_id;
            const parentRowMrFid = item.mrFid ?? item.mr_fid;
            const fishFid = item.fFid ?? item.f_fid;

            const payload = {
              ...item,
              clientId: clientId,
              mr_id: parentRowMrId,
              mrId: parentRowMrId,
              mr_fid: parentRowMrFid,
              mrFid: parentRowMrFid,
              fFid: fishFid,
              _status: OfflineStatuses.Queued,
              version: item.version ?? 0,
              updatedAt: new Date().toISOString(),
              // Format values
              countF: item?.countF == null || item?.countF === '' ? null : Number(item?.countF),
              length: item?.['length'] == null || item?.['length'] === '' ? null : Number(item?.['length']),
              condition: item?.condition == null || item?.condition === '' ? null : Number(item?.condition),
              weight: item?.weight == null || item?.weight === '' ? null : Number(item?.weight),
            };

            return { item, payload, isNew };
          }) ?? [];

        // Validate all rows first; if any fail, stay on Fish and do not submit any rows.
        const validationResults = await Promise.all(
          rowPayloads.map(async ({ payload }) => {
            try {
              await schema.validate(payload, { abortEarly: false });
              return true;
            } catch {
              return false;
            }
          })
        );
        const invalidRowCount = validationResults.filter((isValid) => !isValid).length;

        if (invalidRowCount > 0) {
          setValidationErrorRowCount(invalidRowCount);
          return;
        }

        for (const { item, payload, isNew } of rowPayloads) {
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
        }

        setData((prev) =>
          prev.map((row) =>
            row._status === OfflineStatuses.New || row._status === OfflineStatuses.Edited
              ? { ...row, _status: OfflineStatuses.Queued, clientId: row.clientId ?? crypto.randomUUID() }
              : row
          )
        );

        const draft = savedDraft ? JSON.parse(savedDraft) : {};
        sessionStorage.setItem(moriverDraftKey, JSON.stringify({ ...draft, fishCount: 1 }));
        doUpdateCurrentTab(0);
      } catch (err) {
        console.error('Submit failed:', err);
      }
    };

    useEffect(() => {
      const rowData = items?.map((item) => ({ ...item, bendRiverMile: baseData?.bendRiverMile }));
      setData(ensureTrailingBlankFishRow(rowData));
    }, [baseData?.bendRiverMile, items]);

    // useEffect(() => {
    //   const loadOfflineLookups = async () => {
    //     try {
    //       const [fishCodes, fishStructures, floyTagPrefixes, lengthTypes, markRecaptureOptions] = await Promise.all([
    //         getLookupOptions('fishCodes'),
    //         getLookupOptions('fishStructures'),
    //         getLookupOptions('floyTagPrefixes'),
    //         getLookupOptions('lengthTypes'),
    //         getLookupOptions('markRecaptureOptions'),
    //       ]);

    //       setOfflineLookups({
    //         fishCodes,
    //         fishStructures,
    //         floyTagPrefixes,
    //         lengthTypes,
    //         markRecaptureOptions,
    //       });
    //     } catch (err) {
    //       console.error('Failed to load Fish offline lookups:', err);
    //     }
    //   };

    //   void loadOfflineLookups();
    // }, []);

    return (
      <FormProvider {...methods}>
        <DataEntryTable
          addRow={handleAddRow}
          columns={tableColumns}
          data={data}
          enablePagination={false}
          initialTableState={{}}
          key={tableKey}
          placeholderClick={handleAddRow}
          placeholderText='No Fish Data found.'
          removeMultipleRows={handleRemoveMultipleRows}
          addMultipleRows={handleAddMultipleRows}
          rowErrorCallback={() => {}}
          showAddRowButton={false}
          showValidationErrors={isSubmitAttempted}
          tableVersion='FishTable'
          updateSourceData={handleUpdateData}
          validationSchema={tableValidationSchema}
        />
        <Button className={saveBtnClasses} onClick={() => handleCopyLastRowBtn()} type='button'>
          Copy Last Row
        </Button>
        <Button className={saveBtnClasses} onClick={() => handleSubmitAll()} type='button'>
          Submit
        </Button>
        {validationErrorRowCount > 0 && (
          <p aria-live='polite' className='margin-y-1 text-secondary-dark'>
            {validationErrorRowCount} row{validationErrorRowCount === 1 ? '' : 's'}
            {validationErrorRowCount === 1 ? ' has ' : ' have '}validation errors that must be corrected before data can
            be submitted.
          </p>
        )}
      </FormProvider>
    );
  }
);

export default FishDataEntry;
