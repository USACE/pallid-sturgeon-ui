import Card from '@components/card';
import { Row } from '@pages/data-entry/edit-data-sheet/forms/_shared/helper';
import { Button, Label, TextInput } from '@trussworks/react-uswds';

import './approval.scss';

const Approval = ({ checkby, complete, qc }) => (
  <Card className='test-approval'>
    <Card.Body>
      <Row>
        <div className='col-md-1'>
          <Label>Checked By</Label>
          <TextInput name='checkby' className='test-approval-inputs' disabled />
        </div>
        <div className='col-md-1 text-center col-sm-2'>
          <Label>Approved</Label>
          <input
            type='checkbox'
            title='complete'
            className='form-control mt-1'
            style={{ height: '15px', width: '15px', margin: 'auto' }}
            checked={!!complete}
            // onClick={() => dispatch({ type: 'update', field: 'complete', value: !!complete ? '' : '1' })}
            onChange={() => {}}
            // disabled={!formComplete}
            disabled
          />
        </div>
        <div className='col-md-1 col-sm-6'>
          <Label>QC</Label>
          <TextInput name='qc' className='test-approval-inputs' disabled />
        </div>
        <div className='col-md-2 offset-6'>
          <div className='float-right pt-4'>
            {/* <Button
              size='small'
              variant='success'
              text='Save'
              className='btn-width'
              // handleClick={() => doUpdateMoRiverDataEntry(formData)}
              isDisabled
            /> */}
            <Button type='button'>Save</Button>
          </div>
        </div>
      </Row>
    </Card.Body>
  </Card>
);

export default Approval;
