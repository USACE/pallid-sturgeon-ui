import React, { useState, forwardRef, useImperativeHandle} from 'react';

import Select from 'app-components/select';
import { createDropdownOptions, createFieldOfficeIdDropdownOptions } from 'app-pages/data-entry/helpers';

const FieldOfficeEditor = forwardRef(({
  value,
  fieldOffices,
  isId
}, ref) => {
  const [selectedValue, setSelectedValue] = useState(value);

  useImperativeHandle(ref, () => ({
    getValue: () => selectedValue,
    isCancelBeforeStart: () => false,
  }));

  return (
    <Select
      title='Edit Field Office'
      value={selectedValue}
      onChange={v => setSelectedValue(v)}
      defaultOption={value}
      options={isId ? createFieldOfficeIdDropdownOptions(fieldOffices) : createDropdownOptions(fieldOffices)}
    />
  );
});

export default FieldOfficeEditor;
