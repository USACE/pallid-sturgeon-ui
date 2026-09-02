import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { connect } from 'redux-bundler-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import _isEqual from 'lodash/isEqual';
import { Alert, Button } from '@trussworks/react-uswds';
import { mdiContentCopy } from '@mdi/js';
import { toast } from 'react-toastify';

import DataEntryTable from '@src/app-components/table/data-entry-table/DataEntryTable';
import Icon from '@src/app-components/icon/icon';

import { FishDataEntrySchema, getBaseDefaultValues, getFishRiverDefaultValues } from './FishDataEntry.validation';
import { yesNoOptions } from '@src/app-pages/data-entry/edit-data-sheet/forms/_shared/selectHelper';
import { OfflineStatuses } from '@src/utils/enums';
import { createData, updateData } from '@src/app-pages/data-entry/offline/api';
import { getFishColumns } from './helpers.fish';
import { ensureTrailingBlankRow, isUntouchedPlaceholderRow } from '@src/app-pages/data-entry/dataEntryHelper';
import { getLookupOptions } from '@src/app-pages/data-entry/offline/lookup-cache';

import '@pages/data-summaries/data-summary.scss';
import '@pages/data-entry/dataentry.scss';

const lookupTableNames = ['fishCodes', 'fishStructures', 'floyTagPrefixes', 'lengthTypes', 'markRecaptureOptions'];

const normalizeFishRow = (row = {}) => ({
  ...row,
  fid: row?.fid ?? row?.fId ?? row?.f_id,
  fFid: row?.fFid ?? row?.f_fid,
  mrId: row?.mrId ?? row?.mr_id,
  mrFid: row?.mrFid ?? row?.mr_fid,
  panelHook: row?.panelHook ?? row?.panelhook ?? '',
  lengthType: row?.lengthType ?? row?.length_type ?? '',
  countF: row?.countF ?? row?.fishCount ?? '',
  ftPrefix: row?.ftPrefix ?? row?.ftprefix ?? '',
  floyTag: row?.floyTag ?? row?.ftnum ?? '',
  mR: row?.mR ?? row?.ftmr ?? '',
  geneticsVialNumber: row?.geneticsVialNumber ?? row?.genetics_vial_number ?? '',
  finCurl: row?.finCurl ?? row?.fin_curl ?? '',
  raySpine: row?.raySpine ?? row?.rayspine ?? '',
  KN: row?.KN ?? row?.kn ?? '',
  RSD: row?.RSD ?? row?.rsd ?? '',
  editInitials: row?.editInitials ?? row?.edit_initials ?? row?.edit_initial ?? '',
  uploadedBy: row?.uploadedBy ?? row?.uploaded_by ?? '',
});

// Calculate the next sequence number for a new fish row based on the parent mrFid and existing rows in the data array.
const getNextFishId = (data, parentMrId, parentMrFid) => {
  const existing = (data ?? []).filter((row) => !isUntouchedPlaceholderRow(row));
  const parentRows = existing.filter((row) => {
    if (parentMrFid) {
      const rowMrFid = row?.mrFid ?? row?.mr_fid;

      return rowMrFid && String(rowMrFid) === String(parentMrFid);
    }
    const rowMrId = row?.mrId ?? row?.mr_id;

    return parentMrId != null && rowMrId != null && String(rowMrId) === String(parentMrId);
  });

  let maxSequence = 0;

  parentRows.forEach((row) => {
    const id = row?.fFid ?? row?.f_fid ?? row?.localDisplayId ?? '';
    const sequencePart = String(id).split('-').pop();
    const sequenceNumber = Number(sequencePart);

    if (Number.isFinite(sequenceNumber) && sequenceNumber > maxSequence) {
      maxSequence = sequenceNumber;
    }
  });

  const sequenceText = String(maxSequence + 1).padStart(3, '0');

  return {
    fishFid: parentMrFid ? `${parentMrFid}-${sequenceText}` : undefined,
    localDisplayId: !parentMrFid && parentMrId ? `MR-${parentMrId}-${sequenceText}` : undefined,
  };
};

const FishDataEntry = connect(
  'doSaveFishDataEntry',
  'doUpdateFishDataEntry',
  'doUpdateCurrentTab',
  'doMoRiverDatasheetLoadData',
  'selectDataEntryData',
  'selectDataEntryFishData',
  'selectBaseData',
  'selectLookupData',
  'selectRouteParams',
  ({
    doSaveFishDataEntry,
    doUpdateFishDataEntry,
    doUpdateCurrentTab,
    doMoRiverDatasheetLoadData,
    dataEntryData,
    dataEntryFishData,
    baseData,
    lookupData,
    routeParams,
  }) => {
    const { items } = dataEntryFishData;
    const siteRouteKey = routeParams?.siteId;
    const { gear } = dataEntryData;

    // Default lookups to online data, otherwise will be overwritten by offline cached lookup data if network status = offline
    const [lookups, setLookups] = useState(
      lookupTableNames.reduce((accumulator, currentKey) => {
        accumulator[currentKey] = lookupData?.[currentKey] ?? [];
        return accumulator;
      }, {})
    );

    // Get Missouri River Draft Data
    const moriverDraftKey = `currentMissouriRiverDraft:${siteRouteKey}`;
    const savedDraft = sessionStorage.getItem(moriverDraftKey);
    const moriverDraft = savedDraft ? JSON.parse(savedDraft) : null;
    const parentMrFid = dataEntryData?.mrFid ?? dataEntryData?.mr_fid ?? moriverDraft?.mrFid ?? moriverDraft?.mr_fid;
    const parentMrId = dataEntryData?.mrId ?? dataEntryData?.mr_id ?? moriverDraft?.mrId ?? moriverDraft?.mr_id;
    const isOnline = navigator.onLine;

    const rowData = items?.map((item) => ({ ...normalizeFishRow(item), bendRiverMile: baseData?.bendRiverMile }));
    const [tableKey, setTableKey] = useState(0);
    const [data, setData] = useState(ensureTrailingBlankRow(rowData));
    const [validationErrorRowCount, setValidationErrorRowCount] = useState(0);
    const [validationErrorRows, setValidationErrorRows] = useState([]);
    const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);

    const dataForValidation = (data ?? []).filter((row) => !isUntouchedPlaceholderRow(row));
    const schema = useMemo(() => FishDataEntrySchema({ gear, data: dataForValidation }), [gear, dataForValidation]);
    const tableValidationSchema = {
      validate: (row, options) => {
        if (isUntouchedPlaceholderRow(row)) {
          return Promise.resolve(row);
        }

        return schema.validate(row, options);
      },
    };

    const speciesOptions =
      lookups?.fishCodes?.map((item) => ({
        code: item.alphaCode,
        description: item.commonName,
      })) ?? [];

    const methods = useForm({
      resolver: yupResolver(schema),
      mode: 'onBlur',
    });

    const isFishCellRequired = useCallback(
      (row, columnId) => {
        if (!row || isUntouchedPlaceholderRow(row)) {
          return false;
        }

        const hasFloyTagPrefix = row?.ftPrefix != null && String(row.ftPrefix).trim() !== '';
        const hasFloyTag = row?.floyTag != null && String(row.floyTag).trim() !== '';

        if (columnId === 'ftPrefix' || columnId === 'floyTag') {
          return hasFloyTagPrefix || hasFloyTag;
        }

        try {
          const description = schema.describe({ value: row });
          const tests = description?.fields?.[columnId]?.tests ?? [];

          return tests.some((test) => test?.name === 'required');
        } catch {
          return false;
        }
      },
      [schema]
    );

    const tableColumns = getFishColumns({
      gear,
      speciesOptions,
      lengthTypes: lookups?.lengthTypes,
      floyTagPrefixes: lookups?.floyTagPrefixes,
      markRecaptureOptions: lookups?.markRecaptureOptions,
      yesNoOptions,
      fishStructures: lookups?.fishStructures,
      isOnline,
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

    const scrollToBottom = useCallback(() => {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      });
    }, []);

    const handleAddRow = async () => {
      setData((prev) => ensureTrailingBlankRow(prev));
      scrollToBottom();
    };

    const handleCopyLastRowBtn = () => {
      if (!parentMrFid && !parentMrId) {
        console.error('Cannot copy Fish row: missing parent ID.');
        window.alert('Save the Missouri River draft first before copying Fish.');
        return;
      }
      const rows = (data ?? []).filter((row) => !isUntouchedPlaceholderRow(row));

      if (rows.length === 0) {
        window.alert('No existing Fish row found to copy.');
        return;
      }
      // Grab last object from data array
      const lastRowData = rows[rows.length - 1];
      const { fishFid, localDisplayId } = getNextFishId(rows, parentMrId, parentMrFid);
      const resolvedFishFid = fishFid ?? localDisplayId;

      // Format new row data
      const newRowData = {
        // ...lastRowData,
        fid: null, // Reset fid if copying a save data object
        clientId: crypto.randomUUID(),
        ...(parentMrId != null
          ? {
              mrId: Number(parentMrId),
              mr_id: Number(parentMrId),
            }
          : {}),
        ...(parentMrFid
          ? {
              mrFid: parentMrFid,
              mr_fid: parentMrFid,
            }
          : {}),
        ...(resolvedFishFid
          ? {
              fFid: resolvedFishFid,
              f_fid: resolvedFishFid,
            }
          : {}),
        ...(localDisplayId
          ? {
              localDisplayId,
            }
          : {}),
        species: lastRowData?.species,
        lengthType: lastRowData?.lengthType,
        countF: 1,
        _status: OfflineStatuses.New,
        _isPlaceholderRow: false,
        _isTouched: true,
      };
      setData((prev) => {
        const existingRows = (prev ?? []).filter((row) => !isUntouchedPlaceholderRow(row));
        return ensureTrailingBlankRow([...existingRows, newRowData]);
      });
      scrollToBottom();
    };

    const handleAddMultipleRows = (rows) => {
      // Handle any data mapping or formatting here
      setData((oldData) => {
        const existingRows = (oldData ?? []).filter((row) => !isUntouchedPlaceholderRow(row));
        return ensureTrailingBlankRow([...existingRows, ...rows]);
      });
      scrollToBottom();
    };

    const handleRemoveMultipleRows = useCallback((indicesToRemove) => {
      setData((oldData) => {
        const remainingRows = oldData.filter((_, index) => !indicesToRemove.includes(index));
        return ensureTrailingBlankRow(remainingRows);
      });
      setTableKey((old) => old + 1);
    }, []);

    const handleUpdateData = useCallback(
      (rowIndex, columnId, updatedValue) => {
        const touchedPlaceholderRow = isUntouchedPlaceholderRow(data?.[rowIndex]);

        setData((oldData) => {
          const newData = oldData ? [...oldData] : [];
          if (newData[rowIndex]) {
            const currentRow = newData[rowIndex];
            const isPlaceholderRow = isUntouchedPlaceholderRow(currentRow);

            let nextRow = currentRow;
            if (isPlaceholderRow) {
              const { fishFid, localDisplayId } = getNextFishId(newData, parentMrId, parentMrFid);
              const resolvedFishFid = fishFid ?? localDisplayId;

              nextRow = {
                ...getBaseDefaultValues({ baseData }),
                ...getFishRiverDefaultValues({ dataEntryData }),
                clientId: crypto.randomUUID(),
                ...(parentMrId != null ? { mrId: Number(parentMrId), mr_id: Number(parentMrId) } : {}),
                ...(parentMrFid
                  ? {
                      mrFid: parentMrFid,
                      mr_fid: parentMrFid,
                    }
                  : {}),
                ...(resolvedFishFid
                  ? {
                      fFid: resolvedFishFid,
                      f_fid: resolvedFishFid,
                    }
                  : {}),
                ...(localDisplayId
                  ? {
                      localDisplayId,
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

            return ensureTrailingBlankRow(newData);
          }
          return oldData;
        });

        if (touchedPlaceholderRow) {
          scrollToBottom();
        }
      },
      [baseData, data, dataEntryData, parentMrFid, parentMrId, scrollToBottom]
    );

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
            const isNew = !item.fid;
            const clientId = item.clientId ?? crypto.randomUUID();
            const parentRowMrId = item.mrId ?? item.mr_id;
            const parentRowMrFid = item.mrFid ?? item.mr_fid;
            const fishFid = item.fFid ?? item.f_fid ?? item.localDisplayId;

            const payload = {
              ...item,
              clientId: clientId,
              mr_id: parentRowMrId,
              mrId: parentRowMrId,
              mr_fid: parentRowMrFid,
              mrFid: parentRowMrFid,
              fFid: fishFid,
              f_fid: fishFid,
              _status: OfflineStatuses.Queued,
              version: item.version ?? 0,
              updatedAt: new Date().toISOString(),
              // Format values
              countF: item?.countF == null || item?.countF === '' ? null : Number(item?.countF),
              length: item?.['length'] == null || item?.['length'] === '' ? null : Number(item?.['length']),
              condition: item?.condition == null || item?.condition === '' ? null : Number(item?.condition),
              weight: item?.weight == null || item?.weight === '' ? null : Number(item?.weight),
            };

            return { item, payload, isNew, clientId, rowNumber };
          }) ?? [];

        // Validate all rows first; if any fail, stay on Fish and do not submit any rows.
        const validationResults = await Promise.all(
          rowPayloads.map(async ({ payload, rowNumber }) => {
            try {
              await schema.validate(payload, { abortEarly: false });
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
              isNew ? await doSaveFishDataEntry(payload) : await doUpdateFishDataEntry(payload);
            } else {
              isNew ? await createData('fish', payload) : await updateData('fish', clientId, payload);
            }
          } catch (error) {
            console.error('Fish save failed, queuing offline:', error);
            isNew ? await createData('fish', payload) : await updateData('fish', clientId, payload);
          }
        }

        setData((prev) => {
          const existingRows = (prev ?? []).filter((row) => !isUntouchedPlaceholderRow(row));
          const updatedRows = existingRows.map((row) => {
            const matchingPayloadEntry = rowPayloads.find(({ item }) => item === row);

            if (!matchingPayloadEntry) {
              return row;
            }
            return {
              ...matchingPayloadEntry.payload,
              _status: OfflineStatuses.Queued,
            };
          });
          return ensureTrailingBlankRow(updatedRows);
        });

        toast.success('Datasheet successfully updated!');

        const draft = savedDraft ? JSON.parse(savedDraft) : {};
        const fishCount = (data ?? []).filter((row) => !isUntouchedPlaceholderRow(row)).length;
        sessionStorage.setItem(moriverDraftKey, JSON.stringify({ ...draft, fishCount: fishCount }));
        const hasRecoveryRow = rowsToProcess.some((row) => row._syncRecoveryError && row.clientId);
        if (!hasRecoveryRow) {
          await doMoRiverDatasheetLoadData(parentMrId ?? parentMrFid);
        }
      } catch (err) {
        console.error('Submit failed:', err);
      }
    };

    const handleSaveAndClose = () => {
      // Submit Data
      handleSubmitAll();
      // Navigate to Missouri Entry Form Tab
      doUpdateCurrentTab(0);
    };

    useEffect(() => {
      const rowData = items?.map((item) => ({ ...normalizeFishRow(item), bendRiverMile: baseData?.bendRiverMile }));
      setData(ensureTrailingBlankRow(rowData));
    }, [baseData?.bendRiverMile, items]);

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
          enablePagination={false}
          initialTableState={{}}
          isCellRequired={isFishCellRequired}
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
        <Button className='margin-top-2 secondary-btn' onClick={() => handleCopyLastRowBtn()} type='button'>
          <Icon focusable={false} className='margin-right-1' path={mdiContentCopy} />
          Copy Last Row
        </Button>
        <Button className='margin-top-2 add-btn' onClick={() => handleSubmitAll()} type='button'>
          Submit
        </Button>
        <Button className='margin-top-2 add-btn' onClick={() => handleSaveAndClose()} type='button'>
          Save & Close Datasheet
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
                    Row {rowError.rowNumber}:{' '}
                    {rowError.errors?.length > 0
                      ? rowError.errors.map((errorItem, index) => (
                          <React.Fragment
                            key={`row-${rowError.rowNumber}-${errorItem.columnName}-${errorItem.message}-${index}`}
                          >
                            {index > 0 ? '; ' : ''}
                            <u>{errorItem.columnName}</u>: {errorItem.message}
                          </React.Fragment>
                        ))
                      : 'Validation error'}
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

export default FishDataEntry;
