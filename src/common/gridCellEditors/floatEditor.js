import React, { useState, forwardRef, useImperativeHandle} from 'react';

import { Input } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';

const FloatEditor = forwardRef(({
  value,
  isRequired
}, ref) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const setTest = e => {
    setSelectedValue(e.target.value);
  };

  useImperativeHandle(ref, () => ({
    getValue: () => parseFloat(selectedValue) ? parseFloat(selectedValue) : 0,
    isCancelBeforeStart: () => false,
  }));

  return (<Input value={parseFloat(selectedValue) ? parseFloat(selectedValue) : ''} type='number' onChange={setTest} isRequired={isRequired} />);
});

export default FloatEditor;
