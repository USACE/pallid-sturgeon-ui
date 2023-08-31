import React, { useState, forwardRef, useImperativeHandle} from 'react';

import { Input } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';

const FloatEditor = forwardRef(({
  value,
  isRequired = false
}, ref) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const setValue = e => {
    setSelectedValue(e.target.value);
  };

  useImperativeHandle(ref, () => ({
    getValue: () => parseFloat(selectedValue) ? parseFloat(selectedValue) : 0,
    isCancelBeforeStart: () => false,
  }));
  return (<Input value={selectedValue ? selectedValue : ''} type='number' onChange={setValue} isRequired={isRequired} />);
});

export default FloatEditor;
