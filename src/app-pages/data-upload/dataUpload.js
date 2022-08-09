import React, { useReducer, useState } from 'react';
import { connect } from 'redux-bundler-react';
import Papa from 'papaparse';

import Button from 'app-components/button';
import Card from 'app-components/card';
import DragInput from 'app-components/drag-input';
import Select from 'app-components/select';
import { keyAsText } from 'utils';

import { getIsRequired, reduceCsvState,  formatAsNumber, formatJsonKey } from './helper';

export default connect(
  'doUploadAllFiles',
  ({
    doUploadAllFiles,
  }) => {
    const [recorder, setRecorder] = useState('');
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
    const [csvData, dispatch] = useReducer(
      reduceCsvState,
      {
        'siteFile': null,
        'searchEffortFile': null,
        'telemetryFishFile': null,
        'missouriRiverFile': null,
        'fishFile': null,
        'supplementalFile': null,
        'proceduresFile': null,
      }
    );

    const fileKeys = Object.keys(files);

    const setFile = (key, file) => {
      setFiles({
        ...files,
        [key]: file,
      });

      if (file) {
        Papa.parse(file, {
          complete: result => dispatch({ type: 'update', key, data: result.data }),
          transformHeader: formatJsonKey,
          transform: formatAsNumber,
          skipEmptyLines: true,
          header: true,
        });
      } else {
        dispatch({ type: 'update', key, data: null });
      }
    };

    const submitIsDisabled = () => {
      let isDisabled = false;

      fileKeys.forEach(key => {
        if (getIsRequired(key, files)) {
          if (!files[key]) isDisabled = true;
        }
      });

      return isDisabled;
    };

    const uploadAllFiles = () => {
      doUploadAllFiles({ files, data: csvData, version, recorder });
    };

    return (
      <div className='container-fluid w-75'>
        <Card>
          <Card.Header text='File Upload' />
          <Card.Body>
            Select the version of the Field App used to generate your datasheets.
            <div className='mt-2'>
              <Select
                className='w-25 d-inline-block mb-1 mr-4'
                onChange={value => setVersion(value)}
                defaultOption={{ value: '4.1.3' }}
                options={[
                  // { value: '3.7.1' },
                  { value: '4.1.3' },
                  { value: '4.1.1' },
                ]}
              />
              <label><small>Recorder:</small></label>
              <input
                type='text'
                placeholder='Initials...'
                className='form-control d-inline-block ml-2'
                style={{ width: '75px' }}
                value={recorder}
                onChange={e => setRecorder(e.target.value)}
              />
            </div>
            {version && (
              <>
                <hr />
                <p>Upload files to each of the required fields denoted by an asterisk (*):</p>
                {fileKeys.map(key => {
                  const isRequired = getIsRequired(key, files);

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
                  handleClick={() => uploadAllFiles()}
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
