import { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { mdiCheck, mdiClose, mdiPencil, mdiTrashCanOutline } from '@mdi/js';

import Button from '@components/button';
import ConfirmDelete from '@common/modals/confirmDelete';
import Icon from '@components/icon/icon';

const EditCellRenderer = connect(
  'doModalOpen',
  ({ doModalOpen, api, columnApi, rowIndex, data, type, setIsEditingRow }) => {
    const [isEditing, setIsEditing] = useState(false);

    const dataTypeMapping = {
      missouriRiver: data.mrId,
      fish: data.fid,
      supplemental: data.sId,
      searchEffort: data.seId,
      telemetry: data.tId,
      procedure: data.pId,
    };

    const saveChangesToRow = () => {
      // api.stopEditing(false);
      api.stopEditing(false);

      const rowNode =
        api.getEditingCells()?.[0]?.rowIndex !== undefined
          ? api.getDisplayedRowAtIndex(api.getEditingCells()[0].rowIndex)
          : null;

      if (!rowNode) return;
      // 🔑 Force new object reference
      const updatedData = { ...rowNode.data };
      rowNode.setData(updatedData);

      setIsEditing(false);
    };

    const cancelRowEdits = () => {
      api.stopEditing(true);
      setIsEditing(false);
    };

    useEffect(() => {
      if (isEditing && api && columnApi) {
        const colKey = columnApi.getDisplayedCenterColumns()[1].colId;
        api.startEditingCell({ rowIndex, colKey });
      }
    }, [isEditing, api, rowIndex]);

    useEffect(() => {
      if (setIsEditingRow) {
        setIsEditingRow(isEditing);
      }
    }, [isEditing]);

    return (
      <>
        {isEditing ? (
          <div className='btn-group'>
            <Button
              isOutline
              size='small'
              variant='secondary'
              title='Cancel Changes'
              icon={<Icon path={mdiClose} />}
              handleClick={() => cancelRowEdits()}
            />
            <Button
              size='small'
              variant='success'
              title='Save Changes'
              icon={<Icon path={mdiCheck} />}
              handleClick={() => saveChangesToRow()}
            />
          </div>
        ) : (
          <div className='btn-group'>
            <Button
              isOutline
              size='small'
              variant='info'
              title='Edit'
              icon={<Icon path={mdiPencil} />}
              handleClick={() => setIsEditing(true)}
            />
            {type !== 'user' && (
              <Button
                isOutline
                size='small'
                variant='danger'
                className='ml-1'
                title='Delete'
                icon={<Icon path={mdiTrashCanOutline} />}
                handleClick={() =>
                  doModalOpen(ConfirmDelete, {
                    value: dataTypeMapping[type] ?? 'Unknown data type.',
                    data: data,
                    type: type,
                  })
                }
              />
            )}
          </div>
        )}
      </>
    );
  }
);

export default EditCellRenderer;
