import { useState, forwardRef, useImperativeHandle } from 'react';

import Select from '@components/select';
import { createDropdownOptions } from '@pages/data-entry/helpers';

const SeasonEditor = forwardRef(({ value, seasons }, ref) => {
  const [selectedValue, setSelectedValue] = useState(value);

  useImperativeHandle(ref, () => ({
    getValue: () => selectedValue,
    isCancelBeforeStart: () => false,
  }));

  return (
    <Select
      title='Edit Season'
      value={selectedValue}
      onChange={(v) => setSelectedValue(v)}
      defaultOption={value}
      options={createDropdownOptions(seasons)}
    />
  );
});

export default SeasonEditor;
