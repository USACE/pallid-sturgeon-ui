import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../app-components/button/button';

import './fieldApplication.scss';

const formatDate = date => {
  if (!date) return '';

  try {
    const jsDate = new Date(date);
    return `${jsDate.getMonth() + 1}/${jsDate.getDate()}/${jsDate.getFullYear()} - `;
  } catch (e) {
    return '';
  }
};

const FieldApplication = connect(
  'doFetchDownloadZip',
  'selectDownloadInfo',
  ({
    doFetchDownloadZip,
    downloadInfo,
  }) => {
    const { displayName, lastUpdated } = downloadInfo;
  
    return (
      <>
        {displayName && (
          <div className='field-application'>
            <div className='field-application-text mt-2'>
              <span>
                Field Application Update: {formatDate(lastUpdated)} A new version of the Field Application is now available.
              </span>
              <Button
                isOutline
                size='small'
                variant='light'
                className='ml-2'
                title={`Download ${displayName}`}
                text={displayName}
                handleClick={() => doFetchDownloadZip()}
              />
            </div>
          </div>
        )}
      </>
      
    );
  }
);

export default FieldApplication;
