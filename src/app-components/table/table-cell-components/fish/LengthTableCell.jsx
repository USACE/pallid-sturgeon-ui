import React, { useState, useEffect, useRef, useMemo } from 'react';
import { connect } from 'redux-bundler-react';
import { debounce } from '../tableCellHelper';

const speciesArr = ['PDSG', 'SNSG', 'SNPD'];

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

  const isRequired = speciesArr.includes(species) && count > 1;

  useEffect(() => {
    debouncedUpdateRef.current = debounce((newValue) => {
      if (tableMeta?.updateData) {
        tableMeta?.updateData(
          row.index,
          column.id,
          columnMeta?.type === 'number' ? Number(newValue) : (newValue ?? newValue)
        );
      }
    }, 500);
  }, [row.index, column.id, tableMeta?.updateData, columnMeta?.type, tableMeta]);

  useEffect(() => {
    rowSpecies && setSpecies(rowSpecies);
  }, [rowSpecies]);

  useEffect(() => {
    rowCount && setCount(rowCount);
  }, [rowCount]);

  return (
    <input
      aria-label={'PanelHook'}
      disabled={columnMeta?.readOnly || !isRequired}
      id={cell.id}
      maxLength={4000}
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

export default LengthTableCell;
