import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button/button';
import Select from 'app-components/select';

import { dropdownYearsToNow } from 'utils';

import '../../dataentry.scss';

const NewSite = connect(
  ({ }) => {
    const [year, setYear] = useState('');
    
    return (
      <div className='row'>
        <div className='col-3'>
          <Select
            label='Select Year'
            placeholderText='Select Year...'
            onChange={value => setYear(value)}
            value={year}
            options={dropdownYearsToNow()}
          />
        </div>
        <div className='col-2 align-self-end pl-0'>
          <Button
            isOutline
            isDisabled={!year}
            size='small'
            variant='success'
            text='Create New Site'
            href='/sites-list/create-new-site'
          />
        </div>
      </div>
    );
  }
);

export default NewSite;
