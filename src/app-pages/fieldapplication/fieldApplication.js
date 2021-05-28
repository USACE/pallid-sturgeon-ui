import React from 'react';
import './fieldApplication.scss';
import Button from '../../app-components/button/button';

const FieldApplication = () => (
  <div className='fieldApplication'>
    <div className='text'>
      <span>Field Application Update: 4/5/2019 - A new version of the Field Application is now available. </span><Button
        size='small'
        variant='light'
        isOutline
        text='Download Template .CSV'
      />
    </div>
  </div>
);

export default FieldApplication;
