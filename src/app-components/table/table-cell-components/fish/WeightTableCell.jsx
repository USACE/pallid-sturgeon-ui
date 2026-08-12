import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  const [species, setSpecies] = useState();
  const [showWarning, setShowWarning] = useState(false);

  const project = Number(baseData?.projectId);

  const rowSpecies = useMemo(() => row.getValue('species'), [row]);

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

  // Get latest species values
  useEffect(() => {
    setSpecies(rowSpecies);
  }, [rowSpecies]);

  // Set warning flag
  useEffect(() => {
    // The system shall warn the user if species = PDSG and project = 1 and weight field is null
    if ((value === null || value === undefined) && species === 'PDSG' && Number(project) === 1) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [value, species, project]);

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
          Weight is required for a Pallid Sturgeon
        </p>
      )}
    </div>
  );
});

export default WeightTableCell;
