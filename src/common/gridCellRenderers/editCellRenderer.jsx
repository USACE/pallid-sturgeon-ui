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

    const saveChangesToRow = () => {
      api.stopEditing(false);
      setIsEditing(false);
    };

    const cancelRowEdits = () => {
      api.stopEditing(true);
      setIsEditing(false);
    };

    const getType = () => {
      switch (type) {
        case 'missouriRiver':
          return data.mrId;
        case 'fish':
          return data.fid;
        case 'supplemental':
          return data.sId;
        case 'searchEffort':
          return data.seId;
        case 'telemetry':
          return data.tId;
        case 'procedure':
          return data.pId;
        default:
          return <>Unknown data type.</>;
      }
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
                    value: getType(),
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
