import React, { useState, useEffect, useRef, useMemo } from 'react';
import { connect } from 'redux-bundler-react';
import { debounce } from '../tableCellHelper';

const FinCurlTableCell = connect('selectBaseData', ({ baseData, getValue, row, column, table, cell }) => {
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const initialValue = getValue();
  const initialOptions = columnMeta?.options;
  const [value, setValue] = useState(initialValue);
  const [species, setSpecies] = useState();
  const [length, setLength] = useState();
  const rowSpecies = useMemo(() => row.getValue('species'), [row]);
  const rowLength = useMemo(() => row.getValue('length'), [row]);
  const [options, setOptions] = useState(initialOptions);
  const { segmentId } = baseData;

  const debouncedUpdateRef = useRef();

  const isRequired = species === 'PDSG' && ((length < 425 && segmentId < 7) || (length < 250 && segmentId >= 7));

  useEffect(() => {
    debouncedUpdateRef.current = debounce((newValue) => {
      if (tableMeta?.updateData) {
        tableMeta?.updateData(row.index, column.id, newValue);
      }
    }, 500);
  }, [row.index, column.id, tableMeta?.updateData, columnMeta?.type, tableMeta]);

  useEffect(() => {
    rowSpecies && setSpecies(rowSpecies);
    rowLength && setLength(rowLength);
  }, [rowSpecies, rowLength]);

  return (
    columnMeta?.type === 'select' && (
      <select
        aria-label='Fin Curl'
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
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    )
  );
});

export default FinCurlTableCell;
