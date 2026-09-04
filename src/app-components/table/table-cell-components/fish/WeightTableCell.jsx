import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'redux-bundler-react';
import { debounce } from '../tableCellHelper';
import { decimalNumberRegex } from '@src/utils/regex';
import { mdiAlert } from '@mdi/js';
import Icon from '@src/app-components/icon/icon';

const WeightTableCell = connect('selectBaseData', ({ baseData, getValue, row, column, table, cell }) => {
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const project = Number(baseData?.projectId);
  const species = String(row.getValue('species') ?? '').toUpperCase();
  const isWeightMissing = value === null || value === undefined || value === '';
  const showWarning = isWeightMissing && species === 'PDSG' && project === 1;

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

  // Sync value state when initialValue changes (for loading new records)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div>
      <input
        aria-label='Weight'
        disabled={columnMeta?.readOnly}
        id={cell.id}
        maxLength={4000}
        onBlur={handleBlur}
        onChange={handleChange}
        required={() => {}}
        style={{
          width: '100%',
          borderColor: 'hsl(0, 0%, 80%)',
          cursor: columnMeta?.readOnly ? 'not-allowed' : 'auto',
        }}
        type='text'
        value={value ?? ''}
      />
      {showWarning && (
        <p>
          <Icon path={mdiAlert} style={{ color: '#9e741a' }} />
          Weight is required when Species is PDSG and Project is 1
        </p>
      )}
    </div>
  );
});

export default WeightTableCell;
