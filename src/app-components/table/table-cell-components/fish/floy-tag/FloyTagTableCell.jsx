import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { connect } from 'redux-bundler-react';
import { debounce } from '../../tableCellHelper';

const FloyTagTableCell = connect(({ getValue, row, column, table, cell }) => {
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const rowFloyTagPrefix = useMemo(() => row.getValue('ftPrefix'), [row]);

  const debouncedUpdateRef = useRef();

  const isRequired = !!rowFloyTagPrefix;

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
    setValue(val === '' || val === null ? null : val);
    updateValue(val === '' || val === null ? null : val);
  };

  useEffect(() => {
    debouncedUpdateRef.current = debounce((newValue) => {
      if (tableMeta?.updateData) {
        tableMeta?.updateData(row.index, column.id, newValue);
      }
    }, 500);
  }, [row.index, column.id, tableMeta?.updateData, tableMeta]);

  return (
    <input
      aria-label='Floy Tag'
      disabled={columnMeta?.readOnly}
      id={cell.id}
      minLength={4}
      maxLength={4}
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
  );
});

export default FloyTagTableCell;
