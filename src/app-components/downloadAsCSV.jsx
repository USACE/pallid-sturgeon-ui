import { CSVLink } from 'react-csv';

import { classArray } from '@src/utils';
import { mdiDownload } from '@mdi/js';
import Icon from '@components/icon/icon';

const DownloadAsCSV = ({ content = [], className = '', filePrefix = '', headers }) => {
  const classes = classArray(['mb-3', 'mt-1', 'btn', 'btn-sm', 'btn-outline-info', className]);

  return (
    <CSVLink
      className={classes}
      filename={`${filePrefix}-${new Date().toISOString()}.csv`}
      data={content}
      headers={headers}
    >
      <Icon className='mr-1' focusable={false} path={mdiDownload} />
      Export as CSV
    </CSVLink>
  );
};

export default DownloadAsCSV;
