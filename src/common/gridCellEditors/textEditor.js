import React, { useState, forwardRef, useImperativeHandle} from 'react';

import { Input } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';

const TextEditor = forwardRef(({
  value,
  isRequired
}, ref) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = e => {
    setSelectedValue(e.target.value);
  };

  useImperativeHandle(ref, () => ({
    getValue: () => selectedValue,
    isCancelBeforeStart: () => false,
  }));

  return (<Input value={selectedValue} onChange={handleChange} isRequired={isRequired} />);
});

export default TextEditor;
