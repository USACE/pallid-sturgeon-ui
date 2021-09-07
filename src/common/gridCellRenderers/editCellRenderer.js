import React, { useEffect, useState } from 'react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

const EditCellRenderer = (props) => {
  const { api, columnApi, rowIndex } = props;

  const [isEditing, setIsEditing] = useState(false);

  const saveChangesToRow = () => {
    // TODO: save changes to API
    api.stopEditing(false);
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
        <Button
          isOutline
          size='small'
          variant='info'
          title='Edit Site'
          icon={<Icon icon='pencil' />}
          handleClick={() => setIsEditing(true)}
        />
      )}
    </>
  );
};

export default EditCellRenderer;
