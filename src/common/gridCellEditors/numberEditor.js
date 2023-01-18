import React, { useState, forwardRef, useImperativeHandle} from 'react';

import { Input } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';

const NumberEditor = forwardRef(({
  value,
  isRequired
}, ref) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const setTest = e => {
    setSelectedValue(e.target.value);
  };

  useImperativeHandle(ref, () => ({
    getValue: () => parseInt(selectedValue) ? parseInt(selectedValue) : 0,
    isCancelBeforeStart: () => false,
  }));

  return (<Input value={parseInt(selectedValue) ? parseInt(selectedValue) : ''} type='number' onChange={setTest} isRequired={isRequired} />);
});

export default NumberEditor;
