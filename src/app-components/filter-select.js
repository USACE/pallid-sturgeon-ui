
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import isEqual from 'lodash.isequal';

import Dropdown from './dropdown';
import Icon from './icon';
import usePrevious from '../customHooks/usePrevious';

const getDisplay = elem => {
  const { value, text } = elem;
  return text ? text : value;
};

/**
 * A component that provides the ability for a user to filter a dropdown list via an input field.
 * 
 * @param {Array} items - a list of items to populate the dropdown list with. Each item must be an object with the shape: `{value: '', text: ''}`
 * @param {string} placeholder - a string to be displayed in the input field when it is empty
 * @param {boolean} hasClearButton - whether or not there should be a button to clear the input field, default `false`
 * @param {Function} onChange - callback function that supplies the consumer with the filtered list, current input value, value of element if input matches an element
 * @param {Function} handleInputChange - callback function that supplies the consumer with the current input value to handle the input from a parent component, only use in conjuction with `value`
 * @param {string} value - the displayed value of the input field, used in conjunction with `handleInputChange`
 * @param {string} className - a string of custom class(es) to be applied to the dropdown container
 */
const FilterSelect = ({
  items,
  placeholder = 'Filter...',
  hasClearButton = false,
  onChange = null,
  handleInputChange = null,
  value = '',
  className,
  ...customProps
}, ref) => {
  const [filteredList, setFilteredList] = useState(items);
  const [inputVal, setInputVal] = useState('');
  const previousVal = usePrevious(inputVal);
  const previousItems = usePrevious(items);
  const inputRef = useRef();

  const handleChange = val => {
    if (!!handleInputChange) {
      handleInputChange(val);
    }
    setInputVal(val);
  };

  useImperativeHandle(ref, () => ({
    clear: () => setInputVal(''),
  }));

  useEffect(() => {
    if (inputVal !== previousVal) {
      const newSet = items.filter(elem => {
        const val = getDisplay(elem);

        return (String(val).toLowerCase()).indexOf(inputVal.toLowerCase()) !== -1;
      });

      setFilteredList(newSet);

      if (onChange) onChange(newSet, inputVal, (items.find(e => e.text === inputVal) || {}).value);
    }
  }, [inputVal, previousVal, items, onChange, setFilteredList]);

  useEffect(() => {
    if (!isEqual(items, previousItems)) {
      setFilteredList(items);
    }
  }, [items, previousItems, setFilteredList]);

  return (
    <Dropdown.Menu
      dropdownClasses={[className]}
      customContent={(
        <div className='input-group' {...customProps}>
          <input
            ref={inputRef}
            className='form-control'
            placeholder={placeholder}
            onChange={e => handleChange(e.target.value)}
            value={!!handleInputChange ? value : inputVal}
          />
          {hasClearButton && (
            <div className='input-group-append'>
              <span
                title='Clear Filter'
                className='input-group-text pointer'
                onClick={() => setInputVal('')}
              >
                <Icon icon='close' />
              </span>
            </div>
          )}
        </div>
      )}
    >
      {filteredList.length ? filteredList.map(elem => {
        const display = getDisplay(elem);

        return <Dropdown.Item key={display} onClick={() => handleChange(display)}>{display}</Dropdown.Item>;
      }) : <Dropdown.Item key='No items' onClick={() => {}}>No Items Match Your Search</Dropdown.Item>}
    </Dropdown.Menu>
  );
};

export default forwardRef(FilterSelect);
