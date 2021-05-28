import React from 'react';
import { connect } from 'redux-bundler-react';

import Select from '../../app-components/select';
import Button from '../../app-components/button/button';

export default connect(
  ({  }) => (
    <div>
      <h5>Missouri River Data Sheet</h5>
      <span>Click the "Download Data" link at the bottom left of the report to download the Missouri River Data Sheets for the year selected. The displayed report below only shows a portion of the fields that are included in the downloaded report.</span>
      <div className='row pt-2'>
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
        </div>
      </div>
    </div>
  )
);
