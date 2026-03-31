import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { connect } from 'redux-bundler-react';
import { debounce } from '../tableCellHelper';
import { decimalNumberRegex } from '@src/utils/regex';

const LengthTableCell = connect(({ getValue, row, column, table, cell }) => {
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [species, setSpecies] = useState();
  const [count, setCount] = useState();

  const rowSpecies = useMemo(() => row.getValue('species'), [row]);
  const rowCount = useMemo(() => row.getValue('countF'), [row]);

  const debouncedUpdateRef = useRef();

  const isRequired = ['PDSG', 'SNSG', 'SNPD'].includes(species) && Number(count) === 1;

  useEffect(() => {
    debouncedUpdateRef.current = debounce((newValue) => {
      if (tableMeta?.updateData) {
        tableMeta?.updateData(row.index, column.id, Number(newValue));
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

  // Get latest species and countF values
  useEffect(() => {
    rowSpecies && setSpecies(rowSpecies);
    rowCount && setCount(rowCount);
  }, [rowSpecies, rowCount]);

  // Reset cell value if the field is disabled
  useEffect(() => {
    const isDisabled = !isRequired;
    if (isDisabled) {
      setValue(null);
      updateValue(null);
    }
  }, [isRequired]);

  return (
    <input
      aria-label='Length'
      disabled={columnMeta?.readOnly || !isRequired}
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
      type='number'
      value={value ?? ''}
    />
  );
});

export default LengthTableCell;
