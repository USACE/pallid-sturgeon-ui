import React, { useState, forwardRef, useImperativeHandle} from 'react';

import { Input } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';

const DateEditor = forwardRef(({
  value,
  isRequired = false
}, ref) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = e => {
    setSelectedValue(e.target.value);
  };

  useImperativeHandle(ref, () => ({
    getValue: () => selectedValue,
    isCancelBeforeStart: () => false,
  }));

  return (<Input type='date' value={selectedValue} onChange={handleChange} isRequired={isRequired} />);
});

export default DateEditor;
