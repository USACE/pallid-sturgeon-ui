import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'redux-bundler-react';
import { debounce, hasValueChanged } from '../tableCellHelper';

const FinCurlTableCell = connect('selectBaseData', ({ getValue, row, column, table, cell }) => {
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const options = columnMeta?.options ?? [];

  const debouncedUpdateRef = useRef();
  const previousValueRef = useRef(initialValue);

  const updateValue = useCallback((newValue) => {
    debouncedUpdateRef.current(newValue);
  }, []);

  const handleBlur = async (e) => {
    const blurValue = e?.target?.value;
    const valueBeforeBlur = previousValueRef.current?.toString();

    // Check to see if field value has changed
    if (hasValueChanged(valueBeforeBlur, blurValue)) {
      previousValueRef.current = blurValue;
    }
  };

  const handleChange = async (e) => {
    const inputValue = e?.target?.value ?? '';
    const prevInputValue = value?.toString() ?? '';

    if (hasValueChanged(prevInputValue, inputValue)) {
      if (inputValue === '') {
        setValue(null);
        updateValue(null);
      } else {
        setValue(inputValue);
        updateValue(inputValue);
      }
    }
  };

  useEffect(() => {
    debouncedUpdateRef.current = debounce((newValue) => {
      if (tableMeta?.updateData) {
        tableMeta?.updateData(row.index, column.id, newValue);
      }
    }, 500);
  }, [row.index, column.id, tableMeta?.updateData, columnMeta?.type, tableMeta]);

  useEffect(() => {
    setValue(initialValue);
    previousValueRef.current = initialValue;
  }, [initialValue]);

  return (
    <select
      aria-label='Fin Curl'
      disabled={columnMeta?.readOnly}
      id={cell.id}
      onBlur={handleBlur}
      onChange={handleChange}
      required={false}
      style={{ width: '100%', borderColor: 'hsl(0, 0%, 80%)' }}
      value={value ?? ''}
    >
      <option key={0} value=''>
        -- Select a value --
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.text}
        </option>
      ))}
    </select>
  );
});

export default FinCurlTableCell;
