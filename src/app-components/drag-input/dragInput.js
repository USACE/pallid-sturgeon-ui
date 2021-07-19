import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

import './dragInput.scss';

const DragInput = ({
  text = 'Drag \'n\' drop your file here, or click to select a file',
  onChange = _file => {},
}) => {
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: 'text/csv',
  });

  useEffect(() => {
    if (acceptedFiles.length) {
      onChange(null);
    } else {
      onChange(acceptedFiles[0]);
    }
  }, [acceptedFiles]);

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      <p>{text}</p>
    </div>
  );
};

export default DragInput;
