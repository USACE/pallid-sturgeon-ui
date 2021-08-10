import React from 'react';
import { CSVLink } from 'react-csv';

import Icon from 'app-components/icon';
import { classArray } from 'utils';

const DownloadAsCSV = ({
  content = [],
  className = '',
}) => {
  const classes = classArray([
    'mb-3',
    'mt-1',
    'float-right',
    'btn',
    'btn-sm',
    'btn-outline-info',
    className,
  ]);

  return (
    <CSVLink
      className={classes}
      filename={`search-results-${new Date().toISOString()}.csv`}
      data={content}
    >
      <Icon icon='download' className='mr-1' />
      Export as CSV
    </CSVLink>
  );
};

export default DownloadAsCSV;
