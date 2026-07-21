import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { connect } from 'redux-bundler-react';
import { debounce } from '../tableCellHelper';
import { decimalNumberRegex } from '@src/utils/regex';
import { mdiAlert } from '@mdi/js';
import Icon from '@src/app-components/icon/icon';

const LengthTableCell = connect(({ getValue, row, column, table, cell }) => {
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [species, setSpecies] = useState();
  const [count, setCount] = useState();
  const [showWarning, setShowWarning] = useState(false);

  const rowSpecies = useMemo(() => row.getValue('species'), [row]);
  const rowCount = useMemo(() => row.getValue('countF'), [row]);

  const debouncedUpdateRef = useRef();

  const isRequired = ['PDSG', 'SNSG', 'SNPD'].includes(species) && Number(count) === 1;
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

  // Get latest species and countF values
  useEffect(() => {
    setSpecies(rowSpecies);
    setCount(rowCount);
  }, [rowSpecies, rowCount]);

  // Reset cell value if the field is disabled
  useEffect(() => {
    // Avoid clearing during transient mount states before dependent fields are loaded.
    if (species === undefined || count === undefined) return;

    if (isDisabled) {
      setValue(null);
      updateValue(null);
    }
  }, [isDisabled]);

  useEffect(() => {
    if (Number(value) >= 1600) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [value, setShowWarning]);

  return (
    <div>
      <input
        aria-label='Length'
        disabled={columnMeta?.readOnly || isDisabled}
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
      {showWarning && (
        <p>
          <Icon path={mdiAlert} style={{ color: '#9e741a' }} />
          {'Length entered is > 1600'}
        </p>
      )}
    </div>
  );
});

export default LengthTableCell;
