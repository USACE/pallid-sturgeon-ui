import React from 'react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import { Input, Row } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';

const Approval = ({
  checkby,
  complete,
  qc,
}) => (
  <Card>
    <Card.Body>
      <Row>
        <div className='col-md-4 col-sm-12' style={{ borderRight: '1px solid lightgray' }}>
          <Row>
            <div className='col-md-5 col-sm-23'>
              <label><small>Checked By</small></label>
              <div>{checkby || '--'}</div>
            </div>
            <div className='col-md-2 text-center col-sm-23'>
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
          </Row>
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
        <div className='col-2 offset-6'>
          <div className='float-right pt-4'>
            <Button
              size='small'
              variant='success'
              text='Save'
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