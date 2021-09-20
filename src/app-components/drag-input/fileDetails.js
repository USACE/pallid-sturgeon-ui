import React from 'react';

import { formatBytes } from 'utils';

const FileDetails = ({ file }) => {
  const { name, lastModified, size } = file || {};

  return (
    <div className='d-inline'>
      <p className='text-primary d-inline mr-3'>File Name: <b>{name || '--'}</b></p>
      <p className='text-primary d-inline mr-3'>Last Modified: <b>{lastModified ? new Date(lastModified).toDateString() : '--'}</b></p>
      <p className='text-primary d-inline mr-3'>File Size: <b>{size ? formatBytes(size) : '--'}</b></p>
    </div>
  );
};

export default FileDetails;
