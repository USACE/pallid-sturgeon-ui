import { useState, forwardRef, useImperativeHandle, useRef } from 'react';

import { createRolesDropdownOptions } from '@pages/data-entry/helpers';
import { Select } from '@trussworks/react-uswds';

const RolesEditor = forwardRef((props, ref) => {
  const valueRef = useRef(props.value);
  const [value, setValue] = useState(props.value);

  console.warn('props value: ', valueRef);

  useImperativeHandle(ref, () => ({
    getValue: () => {
      console.warn('Returning value:', valueRef.current);
      return valueRef.current;
    },
    isPopup: () => true,
    isCancelBeforeStart: () => false,
    isCancelAfterEnd: () => false,
  }));

  const options = props.options || [];

  const handleOnChange = (e) => {
    const newValue = e?.target?.value;
    valueRef.current = Number(newValue);
    setValue(newValue);
    // props.stopEditing(); // 👈 commit immediately
  };

  return (
    <select value={valueRef.current} onChange={handleOnChange}>
      {createRolesDropdownOptions(options)?.map((item, index) => (
        <option key={index + 2} value={item.value}>
          {item.text}
        </option>
      ))}
    </select>
  );
});

export default RolesEditor;
