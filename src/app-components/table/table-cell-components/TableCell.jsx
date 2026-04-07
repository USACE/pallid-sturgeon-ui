import React, { useCallback, useState, useEffect, useRef } from 'react';
import { decimalNumberRegex } from '@src/utils/regex';
import Select from 'react-select';
import { hasValueChanged } from './tableCellHelper';

const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const formatSelectValue = (value, options) => {
  if (!value || !options) return '';
  return options?.find((option) => option.value === value) || { value: value, label: value };
};

const getSelectOptionValue = (option) => {
  if (!option) return null;
  return option.value;
};

export const TableCell = ({ getValue, row, column, table, cell, cellError }) => {
  const columnMeta = column.columnDef.meta;
  const type = columnMeta?.type ?? 'text';
  const tableMeta = table.options.meta;
  const initialValue = getValue();
  const [value, setValue] = useState(
    type === 'combobox' ? formatSelectValue(initialValue, columnMeta?.options) : initialValue
  );
  const previousValueRef = useRef(
    type === 'combobox' ? formatSelectValue(initialValue, columnMeta?.options) : initialValue
  );

  const debouncedUpdateRef = useRef();

  useEffect(() => {
    debouncedUpdateRef.current = debounce((newValue) => {
      if (tableMeta?.updateData) {
        tableMeta?.updateData(row.index, column.id, type === 'number' ? Number(newValue) : (newValue ?? newValue));
      }
    }, 500);
  }, [row.index, column.id, tableMeta?.updateData, type, tableMeta]);

  const updateValue = useCallback((newValue) => {
    debouncedUpdateRef.current(newValue);
  }, []);

  const handleBlur = async (e) => {
    const blurValue = e?.target?.value;
    const valueBeforeBlur = previousValueRef.current?.toString();

    // Check to see if field value has changed
    if (hasValueChanged(valueBeforeBlur, blurValue)) {
      // @TODO: handle any data formatting
      // Clear field if value is 0 or is a negative number
      if (String(blurValue) === '0' && column.id !== 'longitude' && column.id !== 'latitude') {
        setValue('');
        updateValue('');
      }
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
      } else if (columnMeta?.isNumber === true) {
        if (decimalNumberRegex.test(inputValue)) {
          setValue(inputValue);
          updateValue(inputValue);
        }
      } else {
        setValue(inputValue);
        updateValue(inputValue);
      }
    }
  };

  const handleComboboxChange = async (option) => {
    const optionValue = getSelectOptionValue(option);
    const optionValueBeforeBlur = value?.value;

    if (hasValueChanged(optionValueBeforeBlur, optionValue)) {
      setValue(option);
      updateValue(optionValue);
    }
  };

  const handleComboboxBlur = async (option) => {
    const optionValue = getSelectOptionValue(option);
    const optionValueBeforeBlur = previousValueRef.current;

    if (hasValueChanged(optionValueBeforeBlur, optionValue)) {
      previousValueRef.current = optionValue;
    }
  };

  const getMaxLength = () => {
    if (type === 'text') {
      return columnMeta?.maxLength || 256;
    }
    return null;
  };

  return type === 'combobox' ? (
    <Select
      value={value}
      id={cell.id}
      className={`width-full ${cellError ? 'cell-error' : ''}`}
      onChange={handleComboboxChange}
      onBlur={handleComboboxBlur}
      options={columnMeta?.options}
      menuPortalTarget={document.body}
      menuPosition='fixed'
      menuPlacement='auto'
      placeholder='Select...'
      isDisabled={columnMeta?.readOnly}
      isRequired={columnMeta?.required}
      isClearable={!columnMeta?.required}
      aria-label={columnMeta?.label || 'Select an option'}
      components={{
        IndicatorSeparator: () => null,
      }}
      styles={{
        control: (provided, state) => ({
          ...provided,
          minHeight: 30,
          minWidth: 200,
          height: 30,
          fontFamily: 'inherit',
          borderColor: 'hsl(0, 0%, 80%)',
          ':hover': { borderColor: 'hsl(0, 0%, 80%)' },
          boxShadow: 'none',
          ...(state.isFocused && {
            outline: '0.25rem solid #2491ff',
            outlineOffset: '0rem',
          }),
        }),
        valueContainer: (provided) => ({
          ...provided,
          height: 30,
          padding: '0 8px',
        }),
        input: (provided) => ({
          ...provided,
          margin: 0,
          padding: 0,
          lineHeight: 1.15,
          height: 30,
          color: 'black',
        }),
        singleValue: (provided) => ({
          ...provided,
          lineHeight: '30px',
          height: 30,
          color: 'black',
        }),
        indicatorsContainer: (provided) => ({
          ...provided,
          height: 30,
          paddingLeft: 0,
          color: 'black',
        }),
        clearIndicator: (provided) => {
          return {
            ...provided,
            height: 30,
            paddingTop: 5,
            paddingLeft: 5,
            paddingRight: 0,
            margin: 0,
            color: cellError ? 'hsl(0, 0%, 25%)' : 'hsl(0, 0%, 80%)',
            ':hover': {
              color: 'red',
              cursor: 'pointer',
            },
          };
        },
        dropdownIndicator: (provided) => ({
          ...provided,
          height: 30,
          paddingTop: 5,
          paddingLeft: 0,
          paddingRight: 2,
          color: cellError ? 'hsl(0, 0%, 25%)' : 'hsl(0, 0%, 80%)',
          ':hover': {
            color: 'black',
            cursor: 'pointer',
          },
        }),
        menu: (provided) => ({
          ...provided,
          width: 'auto',
          minWidth: 200,
          fontFamily: 'inherit',
        }),
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999,
        }),
        placeholder: (provided) => ({
          ...provided,
          color: 'hsl(0, 0%, 25%)',
        }),
      }}
      menuShouldScrollIntoView={false}
    />
  ) : type === 'select' ? (
    <select
      aria-label={columnMeta?.label || 'Select an option'}
      disabled={columnMeta?.readOnly}
      id={cell.id}
      onBlur={handleBlur}
      onChange={handleChange}
      required={columnMeta?.required}
      style={{ width: '100%', borderColor: 'hsl(0, 0%, 80%)', minWidth: 200 }}
      value={value ?? ''}
    >
      <option key={0} value='' className='none' style={{ display: 'none' }}>
        -- Select a value --
      </option>
      {columnMeta?.options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.text}
        </option>
      ))}
    </select>
  ) : (
    <input
      aria-label={columnMeta?.label || 'Enter value'}
      id={cell.id}
      max={type === 'date' ? endDate : undefined}
      maxLength={getMaxLength()}
      min={type === 'date' ? columnMeta?.min : undefined}
      onBlur={handleBlur}
      onChange={handleChange}
      readOnly={columnMeta?.readOnly}
      required={columnMeta?.required}
      style={{ width: '100%', borderColor: 'hsl(0, 0%, 80%)', minWidth: 200 }}
      type={type}
      value={value ?? ''}
    />
  );
};
