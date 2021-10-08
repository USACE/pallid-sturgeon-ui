import React, { useState, forwardRef, useImperativeHandle} from 'react';

import Select from 'app-components/select';

const SpeciesEditor = forwardRef(({
  value,
}, ref) => {
  const [selectedValue, setSelectedValue] = useState(value);

  useImperativeHandle(ref, () => ({
    getValue: () => selectedValue,
    isCancelBeforeStart: () => false,
  }));

  return (
    <Select
      title='Edit Species'
      value={selectedValue}
      onChange={v => setSelectedValue(v)}
      defaultOption={value}
      options={[
        { value: 'USG' },
        { value: 'SNSG' },
        { value: 'BLCF' },
        { value: 'CNCF' },
        { value: 'FHCF' },
        { value: 'FWDM' },
      ]}
    />
  );
});

export default SpeciesEditor;
