import { Button } from '@trussworks/react-uswds';
import Icon from '@components/icon/icon';
import { mdiCloseOctagon, mdiPlus } from '@mdi/js';
import './headerCell.scss';

const HeaderCell = ({ table }) => {
  const meta = table.options.meta;
  const selectedRows = table.getSelectedRowModel().rows;
  const rowCount = table.getRowModel().rows.length;

  const removeRows = () => {
    meta.removeSelectedRows(table.getSelectedRowModel().rows.map((row) => row.index));
    table.resetRowSelection();
  };

  return (
    <div className='d-flex justify-content-start margin-top-1'>
      <div className='d-flex width-full justify-content-end'>
        {rowCount > 0 && (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Button className='primary-btn' onClick={meta?.addRow} size='small' title='Add New Row'>
              <Icon focusable={false} className='margin-right-1' path={mdiPlus} size={'16px'} />
              Add New Row
            </Button>
          </div>
        )}
        {selectedRows?.length > 0 && (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Button className='remove-button' onClick={removeRows} size='small' title='Remove Selected Rows'>
              <Icon focusable={false} path={mdiCloseOctagon} size={'16px'} />
              Remove Selected Rows
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderCell;
