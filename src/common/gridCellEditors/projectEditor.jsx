import { useState, forwardRef, useImperativeHandle } from 'react';

import Select from '@components/select';
import { createDropdownOptions } from '@pages/data-entry/helpers';

const ProjectEditor = forwardRef(({ value, projects }, ref) => {
  const [selectedValue, setSelectedValue] = useState(value);

  useImperativeHandle(ref, () => ({
    getValue: () => selectedValue,
    isCancelBeforeStart: () => false,
  }));

  return (
    <Select
      title='Edit Project'
      value={selectedValue}
      onChange={(v) => setSelectedValue(v)}
      options={createDropdownOptions(projects)}
    />
  );
});

export default ProjectEditor;
