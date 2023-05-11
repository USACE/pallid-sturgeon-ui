import React from 'react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import { Input, Row } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';

import '../../../data-summaries/data-summary.scss';
import '../../dataentry.scss';

const Approval = ({
  checkby,
  complete,
  qc,
}) => (
  <Card>
    <Card.Body>
      <Row>
        <div className='col-md-1'>
          <Input
            label='Checked By'
            name='checkby'
            value={checkby}
            isDisabled
          />
        </div>
        <div className='col-md-1 text-center col-sm-2'>
          <label><small>Approved?</small></label>
          <input
            type='checkbox'
            title='complete'
            className='form-control mt-1'
            style={{ height: '15px', width: '15px', margin: 'auto' }}
            checked={!!complete}
            // onClick={() => dispatch({ type: 'update', field: 'complete', value: !!complete ? '' : '1' })}
            onChange={() => { }}
            // disabled={!formComplete}
            disabled
          />
        </div>
        <div className='col-md-1 col-sm-6'>
          <Input
            label='QC'
            name='qc'
            value={qc}
            // onChange={e => dispatch({ type: 'update', field: 'qc', value: e.target.value })}
            // disabled={!formComplete}
            isDisabled
          />
        </div>
        <div className='col-md-2 offset-6'>
          <div className='float-right pt-4'>
            <Button
              size='small'
              variant='success'
              text='Save'
              className='btn-width'
              // handleClick={() => doUpdateMoRiverDataEntry(formData)}
              isDisabled
            />
          </div>
        </div>
      </Row>
    </Card.Body>
  </Card>
);

export default Approval;