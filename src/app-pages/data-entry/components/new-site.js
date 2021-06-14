import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button/button';
import Select from 'app-components/select';

import '../dataentry.scss';

const Accordion = connect(
  ({ }) => {
    const currentYear = (new Date()).getFullYear();
    const years = Array.from(new Array(25), (val, index) => currentYear - index);
    
    return (
      <div className='row'>
        <div className='col-md-2'>
          <div className='form-group'>
            <label><small>Select Year</small></label>
            <div className='select'>
              <Select
                onChange={value => doChartUpdateType(value)}
                placeholderText='Select Year'
                data-size='3'
                options={[
                  { value: '2021', text: '2021' },
                  { value: '2020', text: '2020' },
                  { value: '2019', text: '2019' },
                ]}
              />
            </div>
          </div>
        </div>
        <div className='col-md-2 align-self-end pl-0'>
          <div className='form-group'>
            <Button
              size='small'
              variant='dark'
              isOutline
              text='Create New Site'
            />
          </div>
        </div>
      </div>
    );
  }
);

export default Accordion;
