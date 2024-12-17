import { useState, forwardRef, useImperativeHandle } from 'react';

import { SelectCustomLabel } from '@pages/data-entry/edit-data-sheet/forms/_shared/helper';

const SelectEditor = forwardRef(
  ({ value, options, isRequired = false, type = 'string' }, ref) => {
    const [selectedValue, setSelectedValue] = useState(value);

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

    useImperativeHandle(ref, () => ({
      getValue: () => valueType(),
      isCancelBeforeStart: () => false,
    }));

    return (
      <SelectCustomLabel
        title='Select option...'
        value={valueType()}
        onChange={(v) => setSelectedValue(v)}
        defaultValue={valueType()}
        options={options}
        isRequired={isRequired}
      />
    );
  }
);

export default SelectEditor;
