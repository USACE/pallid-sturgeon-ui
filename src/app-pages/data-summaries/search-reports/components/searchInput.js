import React, { useState, useEffect } from 'react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

const SearchInput = ({
  placeholder = 'Enter Search Text...',
  handleChange = () => {},
  handleSearch = (_filterString) => {},
}) => {
  const [input, setInput] = useState('');

  const onChange = (e) => {
    const val = e.target.value;
    setInput(val);
  };

  const searchOnEnter = e => {
    if (e.keyCode === 13) handleSearch(input);
  };

  useEffect(() => {
    handleChange(input);
  }, [input]);

  return (
    <div className='input-group'>
      <label className='sr-only'>Search Input</label>
      <input
        className='form-control input-group-prepend-input'
        placeholder={placeholder}
        onChange={onChange}
        value={input}
        onKeyDown={searchOnEnter}
      />
      <div className='input-group-append'>
        <Button
          isOutline
          size='small'
          variant='info'
          title='Search Reports'
          icon={<Icon icon='magnify' />}
          handleClick={() => handleSearch(input)}
        />
      </div>
    </div>

  );
};

export default SearchInput;
