import React from 'react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

const DownloadAsCSV = ({
  content = null,
}) => {
  const downloadCSV = () => {
    console.log('download as .csv: ', content);
  };

  return (
    <Button
      isOutline
      size='small'
      variant='info'
      className='mb-3'
      text='Export as CSV'
      icon={<Icon icon='download' />}
      handleClick={downloadCSV}
    />
  );
};

export default DownloadAsCSV;
