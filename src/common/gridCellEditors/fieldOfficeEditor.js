import React, { useState, forwardRef, useImperativeHandle} from 'react';

import Select from 'app-components/select';
import { createDropdownOptions } from 'app-pages/data-entry/helpers';

const SeasonEditor = forwardRef(({
  value,
  fieldOffices,
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
      options={createDropdownOptions(fieldOffices)}
    />
  );
});

export default SeasonEditor;
