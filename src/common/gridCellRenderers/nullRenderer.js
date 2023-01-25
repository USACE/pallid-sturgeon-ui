import React from 'react';

const NullRenderer = ({
  type,
  value,
}) => {
  const getValue = () => {
    switch (type) {
      case 'float': 
        return value.Float64;
      case 'int':
        return value.Int64;
      case 'str':
        return dateFormatter(value.String);
      default:
        return; 
    }
  };

  const dateFormatter = (date) => date.split('T')[0];

  return (
    <p>{value.Valid ? getValue() : ''}</p>
  );
};

export default NullRenderer;
