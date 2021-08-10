import React, { useState, useEffect } from 'react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

const SearchInput = ({
  placeholder = 'Enter Search Text...',
  handleChange = () => {},
  handleSearch = () => {},
}) => {
  const [input, setInput] = useState('');

  const onChange = (e) => {
    const val = e.target.value;
    setInput(val);
  };

  useEffect(() => {
    handleChange(input);
  }, [input]);

  return (
    <div className='input-group'>
      <label className='sr-only' >Search Input</label>
      <input
        disabled
        type='text'
        className='form-control'
        placeholder={placeholder}
        onChange={onChange}
        value={input}
      />
      <Button
        isOutline
        isDisabled
        size='small'
        variant='info'
        title='Search Reports'
        icon={<Icon icon='magnify' />}
      />
    </div>

  );
};

export default SearchInput;
