import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';
import ConfirmDelete from 'common/modals/confirmDelete';

const EditCellRenderer = connect(
  'doModalOpen',
  ({ 
    doModalOpen,
    api, 
    columnApi, 
    rowIndex, 
    data, 
    type, 
    setIsEditingRow
  }) => {
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
              icon={<Icon icon='close' />}
              handleClick={() => cancelRowEdits()}
            />
            <Button
              size='small'
              variant='success'
              title='Save Changes'
              icon={<Icon icon='check' />}
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
              icon={<Icon icon='pencil' />}
              handleClick={() => setIsEditing(true)}
            />
            {type !== 'user' && 
            <Button
              isOutline
              size='small'
              variant='danger'
              className='ml-1'
              title='Delete'
              icon={<Icon icon='trash-can-outline' />}
              handleClick={() => doModalOpen(ConfirmDelete, { value: getType(), data: data, type: type })}
            />}
          </div> 
        )}
      </>
    );
  }
);

export default EditCellRenderer;