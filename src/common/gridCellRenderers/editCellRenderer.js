import React from 'react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

const EditCellRenderer = (props) => {
  console.log('cell props: ', props);

  return (
    <Button
      isOutline
      size='small'
      variant='info'
      title='edit-datasheet'
      icon={<Icon icon='pencil' />}
    />
  );
};

export default EditCellRenderer;
