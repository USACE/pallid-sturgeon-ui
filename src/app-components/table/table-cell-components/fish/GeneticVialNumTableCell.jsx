import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { connect } from 'redux-bundler-react';
import { debounce } from '../tableCellHelper';
import { decimalNumberRegex } from '@src/utils/regex';

const setPrefixValue = (species, project, value) => {
  if (species === 'USG') {
    return Number(project) === 1 ? 'STURG' : (value?.split('-')?.[0] ?? '');
  }
  return '';
};

const GeneticVialNumTableCell = connect('selectBaseData', ({ baseData, getValue, row, column, table, cell }) => {
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [species, setSpecies] = useState();

  const rowSpecies = useMemo(() => row.getValue('species'), [row]);

  const { projectId } = baseData;
  const project = Number(projectId);

  const debouncedUpdateRef = useRef();

  const prefix = setPrefixValue(species, project, value);
  const number = value?.split('-')?.[1] ?? null;
  const isRequired = species === 'USG';

  const isPrefixRequired = () => {
    if (species === 'USG') {
      if (Number(project) === 1) return false;
      if (number !== null || number !== '' || number !== undefined) return true;
    }
    return false;
  };

  const updateValue = useCallback((newValue) => {
    debouncedUpdateRef.current(newValue);
  }, []);

  const handleBlur = (e) => {
    // Clear field if value is 0 or is a negative number
    if (String(e?.target?.value) === '0' || String(e?.target?.value)[0] === '-') {
      setValue(`${prefix}-`);
      updateValue(`${prefix}-`);
    }
  };

  const handlePrefixChange = (e) => {
    // Convert the input value to uppercase and update the state
    const val = e?.target?.value;
    const uppercaseValue = val?.toUpperCase();
    setValue(`${uppercaseValue}-${number}`);
    updateValue(`${uppercaseValue}-${number}`);
  };

  const handleNumberChange = (e) => {
    const val = e?.target?.value ?? '';
    if (decimalNumberRegex.test(val) || val === '') {
      setValue(val === '' ? `${prefix}-` : `${prefix}-${val}`);
      updateValue(val === '' ? `${prefix}-` : `${prefix}-${val}`);
    }
  };

  useEffect(() => {
    debouncedUpdateRef.current = debounce((newValue) => {
      if (tableMeta?.updateData) {
        tableMeta?.updateData(row.index, column.id, newValue ?? newValue);
      }
    }, 500);
  }, [row.index, column.id, tableMeta?.updateData, columnMeta?.type, tableMeta]);

  useEffect(() => {
    setSpecies(rowSpecies);
  }, [rowSpecies]);

  return (
    <>
      {/* Formatting Genetic Vial Number */}
      {/* Prefix */}
      {/* Default to STURG in appropriate conditionals */}
      {project === 1 && species === 'USG' ? (
        <span>STURG</span>
      ) : (
        <input
          aria-label='Genetic Vial Number Prefix'
          disabled={columnMeta?.readOnly || !isRequired || Number(project) === 1}
          id={cell.id}
          maxLength={10}
          onChange={handlePrefixChange}
          required={isPrefixRequired()}
          style={{
            width: '100%',
            borderColor: 'hsl(0, 0%, 80%)',
            cursor: columnMeta?.readOnly ? 'not-allowed' : 'auto',
          }}
          type='text'
          value={prefix}
        />
      )}
      <div className='text-bold' style={{ fontSize: '20px' }}>
        -
      </div>
      <input
        aria-label='Genetic Vial Number'
        disabled={!isRequired}
        id={cell.id}
        maxLength={5}
        onBlur={handleBlur}
        onChange={handleNumberChange}
        required={isRequired}
        style={{
          width: '100%',
          borderColor: 'hsl(0, 0%, 80%)',
          cursor: columnMeta?.readOnly ? 'not-allowed' : 'auto',
        }}
        type='text'
        value={number ?? ''}
      />
    </>
  );
});

export default GeneticVialNumTableCell;
