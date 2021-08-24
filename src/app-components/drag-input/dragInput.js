import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import Button from 'app-components/button';
import Icon from 'app-components/icon';
import FileDetails from './fileDetails';

import './dragInput.scss';

const DragInput = ({
  text = 'Drag \'n\' drop your file here, or click to select a file',
  onChange = _file => {},
}) => {
  const [currentFile, setCurrentFile] = useState(null);
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: '.csv, text/csv, application/vnd.ms-excel, application/csv, text/x-csv, application/x-csv, text/comma-separated-values, text/x-comma-separated-values',
  });

  useEffect(() => {
    if (!acceptedFiles.length) {
      setCurrentFile(null);
    } else {
      setCurrentFile(acceptedFiles[0]);
    }
  }, [acceptedFiles, setCurrentFile]);

  useEffect(() => {
    onChange(currentFile);
  }, [currentFile]);

  return (
    <div className='d-flex drag-input'>
      <div {...getRootProps({
        className: `dropzone${currentFile ? ' active' : ''}`,
      })}>
        <input {...getInputProps()} />
        {currentFile
          ? <FileDetails file={currentFile} />
          : <p>{text}</p>
        }
      </div>
      {currentFile && (
        <Button
          isOutline
          variant='danger'
          size='small'
          title='Clear File'
          className='ml-2 clear-file'
          handleClick={(e) => {
            setCurrentFile(null);
          }}
          icon={<Icon icon='close' />}
        />
      )}
    </div>
  );
};

export default DragInput;
