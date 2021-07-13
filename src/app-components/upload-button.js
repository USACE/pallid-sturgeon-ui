import React, { useRef } from 'react';

import Button from './button';
import Icon from './icon';

const UploadButton = ({
  text = 'Choose File',
  icon = 'cloud-upload',
  buttonClass = '',
  handleChange = () => {},
}) => {
  const inputEl = useRef(null);

  const handleClick = (_e) => {
    inputEl.current.click();
  };

  const handleInputChange = (_e) => {
    handleChange(inputEl.current.files[0]);
  };

  return (
    <>
      <Button
        className={buttonClass}
        handleClick={handleClick}
        variant='success'
        size='small'
        text={text}
        icon={<Icon icon={icon} className='pr-2' />}
      />
      <input
        accept='.csv'
        style={{ display: 'none' }}
        ref={inputEl}
        type='file'
        onChange={handleInputChange}
      />
    </>
  );
};

export default UploadButton;
