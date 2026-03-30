import React, { useEffect, useRef, useMemo, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { debounce } from '../tableCellHelper';

const FloyTagMrTableCell = connect(({ getValue, row, column, table, cell }) => {
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const initialOptions = columnMeta?.options;
  const [floyTag, setFloyTag] = useState();
  const rowFloyTag = useMemo(() => row.getValue('floyTag'), [row]);

  const debouncedUpdateRef = useRef();

  const isRequired = floyTag !== null && floyTag !== '' && floyTag !== undefined;

  useEffect(() => {
    debouncedUpdateRef.current = debounce((newValue) => {
      if (tableMeta?.updateData) {
        tableMeta?.updateData(row.index, column.id, newValue);
      }
    }, 500);
  }, [row.index, column.id, tableMeta?.updateData, columnMeta?.type, tableMeta]);

  useEffect(() => {
    rowFloyTag && setFloyTag(rowFloyTag);
  }, [rowFloyTag]);

  return (
    columnMeta?.type === 'select' && (
      <select
        aria-label='Floy Tag MR'
        disabled={columnMeta?.readOnly}
        id={cell.id}
        onChange={() => {}}
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
    )
  );
});

export default FloyTagMrTableCell;
