import React, { useState, forwardRef, useImperativeHandle } from 'react';

import Select from 'app-components/select';
import { createRolesDropdownOptions } from 'app-pages/data-entry/helpers';

const RolesEditor = forwardRef(({
  value,
  roles,
}, ref) => {
  const [selectedValue, setSelectedValue] = useState(value);

  useImperativeHandle(ref, () => ({
    getValue: () => selectedValue,
    isCancelBeforeStart: () => false,
  }));

  return (
    <Select
      title='Edit Role'
      value={selectedValue}
      onChange={v => setSelectedValue(v)}
      defaultOption={value}
      options={createRolesDropdownOptions(roles)}
    />
  );
});

export default RolesEditor;
