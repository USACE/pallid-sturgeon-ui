import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import { Label, Tooltip } from '@trussworks/react-uswds';
import { mdiAlert, mdiHelpCircle } from '@mdi/js';

import { baseStyle, customSelectStyles, customSelectStylesNonRequired } from './comboBoxHelper';

import Icon from '@components/icon/icon';

import './comboBox.scss';

const ComboBox = ({
  closeMenuOnSelect = false,
  showOptionalText = true,
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
  warning,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const inputError = errors[name];

  const errorStyle = required ? customSelectStyles : customSelectStylesNonRequired;

  return (
    <>
      <Label htmlFor={name}>
        <span id={`${name}_label`}>{label}</span>
        {required ? (
          <span className='asterisk-color'>*</span>
        ) : (
          showOptionalText && <span style={{ fontStyle: 'italic' }}> (optional)</span>
        )}
        {tooltip && (
          <Tooltip label={tooltip} position='right'>
            <Icon path={mdiHelpCircle} size='16px' />
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
              styles={inputError ? errorStyle : baseStyle}
              value={value}
            />
          </>
        )}
      />
      {warning && (
        <div className='usa-hint warning-message' id={`${name}_hint`}>
          <Icon path={mdiAlert} style={{ color: '#9e741a' }} />
          {warning}
        </div>
      )}
    </>
  );
};

export default ComboBox;
