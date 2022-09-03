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
        <div className='col-3' style={{ borderRight: '1px solid lightgray' }}>
          <Row>
            <div className='col-4'>
              <label><small>Checked By</small></label>
              <div>{checkby || '--'}</div>
            </div>
            <div className='col-4 text-center'>
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
              />
            </div>
          </Row>
        </div>
        <div className='col-1'>
          <Input
            label='QC'
            name='qc'
            value={qc}
            // onChange={e => dispatch({ type: 'update', field: 'qc', value: e.target.value })}
            // disabled={!formComplete}
          />
        </div>
        <div className='col-2 offset-6'>
          <div className='float-right pt-4'>
            <Button
              isOutline
              size='small'
              className='mr-2'
              variant='secondary'
              text='Cancel'
              href='/find-data-sheet'
            />
            <Button
              size='small'
              variant='success'
              text='Save'
            // handleClick={() => doUpdateMoRiverDataEntry(formData)}
            />
          </div>
        </div>
      </Row>
    </Card.Body>
  </Card>
);

export default Approval;