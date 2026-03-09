import React, { useState, useEffect, useRef, useMemo } from 'react';
import { connect } from 'redux-bundler-react';
import { debounce } from '../tableCellHelper';

// Calculate Condition

const conditionFormula = (weight, length, x, y) => weight / Math.pow(10, x + y * Math.log10(length));

const calculateCondition = (length, segment, species, weight) => {
  if (!length && !weight) return;

  if (species === 'SNSG' && length > 170 && weight > 0) {
    return conditionFormula(weight, length, -6.287, 3.33) * 100;
  }

  if (segment <= 6 && weight > 0 && ((species === 'PDSG' && length > 0) || (species === 'USG' && length > 170))) {
    return conditionFormula(weight, length, -6.2561, 3.2932);
  }

  if (segment > 6 && weight > 0 && ((species === 'PDSG' && length > 0) || (species === 'USG' && length > 170))) {
    return conditionFormula(weight, length, -5.9205, 3.1574);
  }
};

const ConditionTableCell = connect('selectBaseData', ({ baseData, getValue, row, column, table, cell }) => {
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [species, setSpecies] = useState();
  const [weight, setWeight] = useState();
  const [length, setLength] = useState();
  const rowSpecies = useMemo(() => row.getValue('species'), [row]);
  const rowWeight = useMemo(() => row.getValue('weight'), [row]);
  const rowLength = useMemo(() => row.getValue('length'), [row]);

  const { segmentId } = baseData;

  const debouncedUpdateRef = useRef();

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

  // Set row values to state
  useEffect(() => {
    rowSpecies && setSpecies(rowSpecies);
    rowWeight && setWeight(rowWeight);
    rowLength && setLength(rowLength);
  }, [rowSpecies, rowWeight, rowLength]);
  f;
  return <span>{calculateCondition(length, segmentId, species, weight)}</span>;
});

export default ConditionTableCell;
