import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button/button';
import Select from 'app-components/select';

import '../../dataentry.scss';

const NewSite = connect(
  ({ }) => {
    const [year, setYear] = useState('');
    
    return (
      <div className='row'>
        <div className='col-3'>
          <label><small>Select Year...</small></label>
          <Select
            onChange={value => setYear(value)}
            value={year}
            placeholderText='Select Year'
            options={[
              { value: '2021', text: '2021' },
              { value: '2020', text: '2020' },
              { value: '2019', text: '2019' },
            ]}
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
