import { useCSVDownloader } from 'react-papaparse';

import { classArray } from '@src/utils';

const ExportButton = ({ size = '', icon = null, isDisabled = false, filename, data, className }) => {
  const { CSVDownloader, Type } = useCSVDownloader();

  const classes = classArray([
    'usa-button',
    'secondary-btn',
    size && size === 'small' ? 'btn-sm' : size === 'large' ? 'btn-lg' : '',
    isDisabled && 'disabled not-allowed',
    'pb-2',
    className,
  ]);

  return (
    <CSVDownloader
      role='button'
      type={Type?.Button}
      filename={filename}
      bom={true}
      data={data}
      className={classes}
      title='Export as CSV'
      disabled={isDisabled}
      aria-disabled={isDisabled}
    >
      {icon}
      <>&nbsp;</>
      Export as CSV
    </CSVDownloader>
  );
};

export default ExportButton;
