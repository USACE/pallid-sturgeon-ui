import React, { useState, forwardRef, useImperativeHandle} from 'react';

import { SelectCustomLabel } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';

const SelectEditor = forwardRef(({
  value,
  options,
  isRequired,
  type,
}, ref) => {
  const [selectedValue, setSelectedValue] = useState(value);

  useImperativeHandle(ref, () => ({
    getValue: () => valueType(),
    isCancelBeforeStart: () => false,
  }));

  const valueType = () => {
    switch (type) {
      case 'number':
        return parseInt(selectedValue);
      case 'float':
        return parseFloat(selectedValue);
      default:
        return selectedValue;
    }
  };

  return (
    <SelectCustomLabel
      title='Select option...'
      value={valueType()}
      onChange={v => setSelectedValue(v)}
      defaultValue={valueType()}
      options={options}
      isRequired={isRequired}
    />
  );
});

export default SelectEditor;
