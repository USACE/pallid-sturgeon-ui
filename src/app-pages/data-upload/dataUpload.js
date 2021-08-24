import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import DragInput from 'app-components/drag-input';
import Select from 'app-components/select';
import { keyAsText } from 'utils';

const requiredFiles = {
  '4.0.4': ['siteFile', 'searchEffortFile', 'telemetryFishFile', 'missouriRiverFile', 'fishFile', 'supplementalFile', 'proceduresFile'],
  '3.7.1': ['siteFile', 'missouriRiverFile', 'fishFile', 'supplementalFile'],
};

const getIsRequired = (key, version) => requiredFiles[version].includes(key);

export default connect(
  'doUploadFetch',
  ({
    doUploadFetch,
  }) => {
    const [version, setVersion] = useState(null);
    const [files, setFiles] = useState({
      'siteFile': null,
      'searchEffortFile': null,
      'telemetryFishFile': null,
      'missouriRiverFile': null,
      'fishFile': null,
      'supplementalFile': null,
      'proceduresFile': null,
    });

    const fileKeys = Object.keys(files);

    const setFile = (key, file) => {
      setFiles({
        ...files,
        [key]: file,
      });
    };

    const submitIsDisabled = () => {
      let isDisabled = false;

      fileKeys.forEach(key => {
        if (getIsRequired(key, version)) {
          if (!files[key]) isDisabled = true;
        }
      });

      return isDisabled;
    };

    return (
      <div className='container-fluid'>
        <Card>
          <Card.Header text='File Upload' />
          <Card.Body>
            Select the version of the Field App used to generate your datasheets.
            <Select
              className='w-25 d-block mt-2'
              onChange={value => setVersion(value)}
              options={[
                { value: '3.7.1' },
                { value: '4.0.4' },
              ]}
            />
            {version && (
              <>
                <hr />
                <p>Upload files to each of the required fields denoted by an asterisk (*):</p>
                {fileKeys.map(key => {
                  const isRequired = getIsRequired(key, version);

                  return (
                    <div key={key} className='row'>
                      <div className='col-2 pt-2'>
                        <p className='pt-1'>
                          {isRequired ? '* ' : ''}{keyAsText(key)}:
                        </p>
                      </div>
                      <div className='col-10'>
                        <DragInput onChange={file => setFile(key, file)} />
                      </div>
                    </div>
                  );
                })}
                <hr />
                <Button
                  isOutline
                  variant='info'
                  text='Submit Files'
                  handleClick={() => {}}
                  isDisabled={submitIsDisabled()}
                />
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }
);
