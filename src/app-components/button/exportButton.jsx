import { useCSVDownloader } from 'react-papaparse';

import { classArray } from '@src/utils';

const ExportButton = ({
  size = '',
  variant = 'primary',
  icon = null,
  isOutline = false,
  isDisabled = false,
  filename,
  data,
  className,
}) => {
  const { CSVDownloader, Type } = useCSVDownloader();

  const classes = classArray([
    'btn',
    size && size === 'small' ? 'btn-sm' : size === 'large' ? 'btn-lg' : '',
    `btn-${isOutline ? 'outline-' : ''}${variant}`,
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
