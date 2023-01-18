import React, { useState, forwardRef, useImperativeHandle} from 'react';

import { SelectCustomLabel } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';

const SelectEditor = forwardRef(({
  value,
  options,
  isRequired
}, ref) => {
  const [selectedValue, setSelectedValue] = useState(value);

  useImperativeHandle(ref, () => ({
    getValue: () => selectedValue,
    isCancelBeforeStart: () => false,
  }));

  return (
    <SelectCustomLabel
      title='Select option...'
      value={selectedValue}
      onChange={v => setSelectedValue(v)}
      defaultValue={value}
      options={options}
      isRequired={isRequired}
    />
  );
});

export default SelectEditor;
