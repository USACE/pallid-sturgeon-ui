import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../app-components/button/button';

import './fieldApplication.scss';

const FieldApplication = connect(
  'doFetchDownloadZip',
  'selectDownloadInfoVersionInfo',
  ({
    doFetchDownloadZip,
    downloadInfoVersionInfo,
  }) => {
    const { displayName } = downloadInfoVersionInfo;
  
    return (
      <>
        {displayName && (
          <div className='field-application'>
            <div className='field-application-text mt-2'>
              <span>
                Field Application Update: 4/5/2019 - A new version of the Field Application is now available.
              </span>
              <Button
                isOutline
                size='small'
                variant='light'
                className='ml-2'
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
