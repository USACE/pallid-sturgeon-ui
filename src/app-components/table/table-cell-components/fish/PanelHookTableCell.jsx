import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { connect } from 'redux-bundler-react';
import { debounce } from '../tableCellHelper';
import { notRequiredSpeciesArr } from '@src/app-pages/data-entry/datasheets/tables/fish/FishDataEntry.validation';

const PanelHookTableCell = connect(({ getValue, row, column, table, cell }) => {
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [species, setSpecies] = useState();
  const rowSpecies = useMemo(() => row.getValue('species'), [row]);
  const isPlaceholderRow = row?.original?._isPlaceholderRow === true && row?.original?._isTouched !== true;

  const debouncedUpdateRef = useRef();

  const isRequired =
    !isPlaceholderRow &&
    (columnMeta?.gear?.startsWith('TL') || columnMeta?.gear?.startsWith('LDN')) &&
    !notRequiredSpeciesArr.includes(species);

  const updateValue = useCallback((newValue) => {
    debouncedUpdateRef.current(newValue);
  }, []);

  const handleBlur = (e) => {
    // Clear field if value is 0 or is a negative number
    if (String(e?.target?.value)[0] === '-') {
      setValue(null);
      updateValue(null);
    }
  };

  const handleChange = (e) => {
    const val = (e?.target?.value ?? '').toUpperCase();
    setValue(val === '' ? null : val);
    updateValue(val === '' ? null : val);
  };

  useEffect(() => {
    debouncedUpdateRef.current = debounce((newValue) => {
      if (tableMeta?.updateData) {
        tableMeta?.updateData(row.index, column.id, newValue);
      }
    }, 500);
  }, [row.index, column.id, tableMeta?.updateData, tableMeta]);

  useEffect(() => {
    rowSpecies && setSpecies(rowSpecies);
  }, [rowSpecies]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div
      id={cell.id}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <input
        aria-label='PanelHook'
        disabled={columnMeta?.readOnly}
        id={cell.id}
        maxLength={4000}
        onBlur={handleBlur}
        onChange={handleChange}
        required={isRequired}
        style={{
          width: '100%',
          borderColor: 'hsl(0, 0%, 80%)',
          cursor: columnMeta?.readOnly ? 'not-allowed' : 'auto',
        }}
        type='text'
        value={value ?? ''}
      />
    </div>
  );
});

export default PanelHookTableCell;
