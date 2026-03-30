import React, { useState, useEffect, useRef, useMemo } from 'react';
import { connect } from 'redux-bundler-react';
import { debounce } from '../tableCellHelper';

const FloyTagTableCell = connect(({ getValue, row, column, table, cell }) => {
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [floyTagPrefix, setFloyTagPrefix] = useState();
  const rowFloyTagPrefix = useMemo(() => row.getValue('ftPrefix'), [row]);

  const debouncedUpdateRef = useRef();

  const isRequired = floyTagPrefix !== null && floyTagPrefix !== '' && floyTagPrefix !== undefined;

  useEffect(() => {
    debouncedUpdateRef.current = debounce((newValue) => {
      if (tableMeta?.updateData) {
        tableMeta?.updateData(row.index, column.id, newValue);
      }
    }, 500);
  }, [row.index, column.id, tableMeta?.updateData, columnMeta?.type, tableMeta]);

  useEffect(() => {
    rowFloyTagPrefix && setFloyTagPrefix(rowFloyTagPrefix);
  }, [rowFloyTagPrefix]);

  return (
    <input
      aria-label='Floy Tag'
      disabled={columnMeta?.readOnly}
      id={cell.id}
      minLength={4}
      maxLength={4}
      onChange={() => {}}
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
