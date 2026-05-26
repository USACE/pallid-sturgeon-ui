import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { connect } from 'redux-bundler-react';
import { debounce, hasValueChanged } from '../../tableCellHelper';

const FloyTagMrTableCell = connect(({ getValue, row, column, table, cell }) => {
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const initialValue = getValue();
  const initialOptions = columnMeta?.options;

  const debouncedUpdateRef = useRef();
  const previousValueRef = useRef(initialValue);

  const [value, setValue] = useState(initialValue);

  const rowFloyTag = useMemo(() => row.getValue('floyTag'), [row]);

  // const isRequired = rowFloyTag !== null && rowFloyTag !== '' && rowFloyTag !== undefined;
  const isRequired = !!rowFloyTag;

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
  }, [row.index, column.id, tableMeta?.updateData, tableMeta]);

  return (
    <select
      aria-label='Floy Tag MR'
      disabled={columnMeta?.readOnly}
      id={cell.id}
      onBlur={handleBlur}
      onChange={handleChange}
      required={columnMeta?.required || isRequired}
      style={{ width: '100%', borderColor: 'hsl(0, 0%, 80%)' }}
      value={value ?? ''}
    >
      <option key={0} value=''>
        -- Select a value --
      </option>
      {initialOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.text}
        </option>
      ))}
    </select>
  );
});

export default FloyTagMrTableCell;
