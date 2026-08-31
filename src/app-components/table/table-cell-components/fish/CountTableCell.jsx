import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { connect } from 'redux-bundler-react';
import { debounce } from '../tableCellHelper';
import { decimalNumberRegex } from '@src/utils/regex';

const CountTableCell = connect(({ getValue, row, column, table, cell }) => {
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [species, setSpecies] = useState();

  const rowSpecies = useMemo(() => row.getValue('species'), [row]);

  const debouncedUpdateRef = useRef();

  const hasSpecies = species != null && species !== '';
  const isRequired = hasSpecies && !['NDNF', 'CNA', 'CNFH', 'NFSH'].includes(species);
  const isDisabled = !isRequired;

  useEffect(() => {
    debouncedUpdateRef.current = debounce((newValue) => {
      if (tableMeta?.updateData) {
        tableMeta?.updateData(row.index, column.id, newValue ? Number(newValue) : '');
      }
    }, 500);
  }, [row.index, column.id, tableMeta?.updateData, tableMeta]);

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
    const val = e?.target?.value ?? '';
    if (decimalNumberRegex.test(val) || val === '') {
      setValue(val === '' ? null : val);
      updateValue(val === '' ? null : val);
    }
  };

  // Get latest species values
  useEffect(() => {
    setSpecies(rowSpecies);
  }, [rowSpecies]);

  // Sync value state when initialValue changes (for loading new records)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    // Do not auto-populate count for untouched placeholder rows.
    // Wait until species is actually selected.
    if (species == null || species === '') {
      return;
    }

    if (species === 'NFSH') {
      setValue(0);
      updateValue(0);
    } else if (['NDNF', 'CNA', 'CNFH'].includes(species)) {
      setValue(null);
      updateValue(null);
    } else if (value === null || value === undefined || value === 0) {
      setValue(1);
      updateValue(1);
    }
  }, [species]);

  return (
    <input
      aria-label='Floy Tag'
      disabled={columnMeta?.readOnly || isDisabled}
      id={cell.id}
      onChange={handleChange}
      onBlur={handleBlur}
      required={isRequired}
      style={{
        width: '100%',
        borderColor: 'hsl(0, 0%, 80%)',
        cursor: columnMeta?.readOnly ? 'not-allowed' : 'auto',
      }}
      type='text'
      value={value ?? ''}
    />
  );
});

export default CountTableCell;
