import React, { useState, forwardRef, useImperativeHandle} from 'react';

import Select from 'app-components/select';
import { createDropdownOptions } from 'app-pages/data-entry/helpers';

const ProjectEditor = forwardRef(({
  value,
  projects,
}, ref) => {
  const [selectedValue, setSelectedValue] = useState(value);

  useImperativeHandle(ref, () => ({
    getValue: () => selectedValue,
    isCancelBeforeStart: () => false,
  }));

  return (
    <Select
      title='Edit Project'
      value={selectedValue}
      onChange={v => setSelectedValue(v)}
      defaultOption={value}
      options={createDropdownOptions(projects)}
    />
  );
});

export default ProjectEditor;
