import { mdiHelpCircle } from '@mdi/js';

import Button from '@components/button';
import Card from '@components/card';
import Select from '@components/select';
import Icon from '@components/icon/icon';
import RoleFilter from '@components/role-filter';

import { dropdownYearsToNow } from '@src/utils';
import { NoRoleAccessMessage } from './helper';
import Breadcrumb from '@src/app-components/breadcrumb';

const breadcrumbLinks = [
  {
    text: 'Multiple Record Approval',
    current: true,
  },
];

const MultipleRecordApproval = () => (
  <RoleFilter allowRoles={['ADMINISTRATOR']} alt={() => <NoRoleAccessMessage className='p-2' />}>
    <div className='container-fluid'>
      <Breadcrumb paths={breadcrumbLinks} />
      <Card>
        <Card.Header text='Multiple Record Approval Filters' />
        <Card.Body>
          <Icon path={mdiHelpCircle} />
          <span className='info-message ml-2'>Multiple record approval is a two-step process:</span>
          <div className='info-message mt-2'>
            1. Select a year and select a date for which records will be approved for that date and earlier, for the
            selected year (these 2 fields are required). Optionally, enter a list of comma delimited MR_ID values to
            exclude specific records. Click the "Determine # of Records" to see a display of the number of records that
            will be approved given the year and date selected.
          </div>
          <div className='info-message mt-2'>
            2. Once you have displayed the number of records that will be approved, an "Approve Records" button will
            appear. Click this button to approve the records.
          </div>
          <div className='info-message mt-2'>
            Note: Records with unresolved errors in the error log are not included.
          </div>
          <div className='row mt-3'>
            <div className='col-2'>
              <Select label='Select Site Year:' options={dropdownYearsToNow(2002)} />
            </div>
            <div className='col-2'>
              <label>
                <small>Select Date:</small>
              </label>
              <input className='form-control input-group-prepend-input mt-1' type='date' />
            </div>
            <div className='col-2'>
              <label>
                <small>Exclude Table IDs:</small>
              </label>
              <input className='form-control input-group-prepend-input mt-1' />
            </div>
          </div>
          <div className='mt-2'>
            <Button
              isOutline
              variant='info'
              size='small'
              className='mr-2'
              text='Apply Filters'
              // handleClick={() => doDatasheetFetch()}
            />
            <Button
              isOutline
              variant='secondary'
              size='small'
              text='Clear All Filters'
              // handleClick={() => clearAllFilters()}
            />
          </div>
        </Card.Body>
      </Card>
      <Card className='mt-3'>
        <Card.Header text='Query Results' />
        <Card.Body>
          <p>Number of Records that will be approved: --</p>
          <div className='mt-2'>
            <Button
              isOutline
              variant='info'
              size='small'
              className='mr-2'
              text='Approve Records'
              // handleClick={() => doDatasheetFetch()}
            />
          </div>
        </Card.Body>
      </Card>
    </div>
  </RoleFilter>
);

export default MultipleRecordApproval;
