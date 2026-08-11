import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'redux-bundler-react';
import { debounce } from '../tableCellHelper';
import { decimalNumberRegex } from '@src/utils/regex';
import Icon from '@src/app-components/icon/icon';
import { mdiAlert } from '@mdi/js';

const TagnumberTableCell = connect(({ getValue, row, column, table, cell }) => {
  console.warn('row: ', row);
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [showWarning, setShowWarning] = useState(false);

  const debouncedUpdateRef = useRef();

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

  // Set warning flag
  useEffect(() => {
    const hasDecimal = String(value)?.includes('.');
    // not enough values
    if (hasDecimal) {
      const parseVal = String(value)?.replace('.', '');
      setShowWarning(
        parseVal?.length < 14 && parseVal !== '' ? 'Value cannot be less than or greater than 14 digits' : null
      );
    } else {
      setShowWarning(
        value && String(value)?.length < 10 ? 'Value cannot be less than or greater than 10 digits' : null
      );
    }
  }, [value]);

  return (
    <div>
      <input
        aria-label='Floy Tag'
        disabled={columnMeta?.readOnly}
        id={cell.id}
        onChange={handleChange}
        onBlur={handleBlur}
        style={{
          width: '100%',
          borderColor: 'hsl(0, 0%, 80%)',
          cursor: columnMeta?.readOnly ? 'not-allowed' : 'auto',
        }}
        type='text'
        value={value ?? ''}
        maxLength={String(value)?.includes('.') ? 15 : 10}
        minLength={10}
      />
      {showWarning && (
        <p>
          <Icon path={mdiAlert} style={{ color: '#9e741a' }} />
          {showWarning}
        </p>
      )}
    </div>
  );
});

export default TagnumberTableCell;
