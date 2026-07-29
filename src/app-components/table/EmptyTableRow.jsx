import Icon from '@components/icon/icon';
import { mdiPlusBox } from '@mdi/js';
import { Button } from '@trussworks/react-uswds';

const EmptyTableRow = ({
  addButtonText = 'Add New Row',
  onAddClick,
  isReadOnly = false,
  placeholderText = 'No records found.',
}) => (
  <tr>
    <td colSpan={100}>
      <div className='margin-1'>
        {placeholderText}
        {onAddClick && (
          <div className='margin-top-1'>
            <Button className='primary-btn' disabled={isReadOnly} onClick={() => onAddClick()} type='button'>
              <Icon className='margin-right-1' focusable={false} path={mdiPlusBox} size='16px' />
              {addButtonText}
            </Button>
          </div>
        )}
      </div>
    </td>
  </tr>
);

export default EmptyTableRow;
