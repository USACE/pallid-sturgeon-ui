import React from 'react';
import './fieldApplication.scss';
import Button from '../../app-components/button/button';

const FieldApplication = () => (
  <div className='field-application'>
    <div className='field-application-text mt-2'>
      <span>
        Field Application Update: 4/5/2019 - A new version of the Field Application is now available.
      </span>
      <Button
        isOutline
        size='small'
        variant='light'
        className='ml-2'
        text='Download Template .CSV'
      />
    </div>
  </div>
);

export default FieldApplication;
