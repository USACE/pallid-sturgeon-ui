import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { Label, Tooltip } from '@trussworks/react-uswds';

import {
  customSelectStyles,
  customSelectStylesNonRequired,
} from './comboBoxHelper';

import Icon from '@components/icon';

const ComboBox = ({
  closeMenuOnSelect = false,
  handleBlur,
  handleChange,
  isLoading,
  label,
  menuPlacement,
  multi,
  name,
  options,
  readOnly,
  required,
  tooltip,
}) => {
  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext();

  const inputError = errors[name];

  const errorStyle = required
    ? customSelectStyles
    : customSelectStylesNonRequired;

  return (
    <>
      <Label htmlFor={name}>
        <span id={`${name}_label`}>{label}</span>
        {required ? (
          <span className='asterisk-color'>*</span>
        ) : (
          <span style={{ fontStyle: 'italic' }}> (optional)</span>
        )}
        {tooltip && (
          <Tooltip label={tooltip} position='right'>
            <Icon
              icon='help-circle'
              style={{ fontSize: '16px', marginBottom: '8px' }}
            />
          </Tooltip>
        )}
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value, name, ref } }) => (
          <>
            <Select
              closeMenuOnSelect={closeMenuOnSelect}
              hideSelectedOptions={false}
              inputId={name}
              isDisabled={readOnly}
              isLoading={isLoading}
              isMulti={multi}
              menuPlacement={menuPlacement}
              name={name}
              onBlur={(e) => {
                onBlur(e);
                handleBlur && handleBlur(e);
              }}
              onChange={(e) => {
                onChange(e);
                handleChange && handleChange(e);
              }}
              options={options}
              readOnly={readOnly}
              required={required}
              ref={ref}
              styles={inputError ? errorStyle : {}}
              value={value}
            />
          </>
        )}
      />
    </>
  );
};

export default ComboBox;
