import { useFormContext } from 'react-hook-form';
import { Label, Select, Tooltip } from '@trussworks/react-uswds';
import classnames from 'classnames';

import Icon from '@components/icon';

import './selectInput.scss';

const SelectInput = ({
  children,
  className = 'width-full',
  defaultOption = '-Select Option-',
  group,
  showOptionalText = true,
  label,
  name,
  onBlur = () => {},
  onChange = () => {},
  options = [],
  readOnly,
  required,
  validations,
  tooltip,
  ...customProps
}) => {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext();

  const inputError = errors[name];
  const renderedOptions = options.map((option) => (
    <option key={option.value} value={option.value ? option.value : option}>
      {option.label ? option.label : option}
    </option>
  ));

  const containerCss = classnames('select-container', className, {
    'is-invalid': inputError,
  });

  const { ref: selectRef, ...rest } = register(name, {
    onBlur,
    onChange,
    ...validations,
  });

  return (
    <>
      <Label htmlFor={name}>
        <span id={`${name}_label`}>{label}</span>
        {required ? (
          <span className='asterisk-color'>*</span>
        ) : (
          showOptionalText && <span className='optional-text'> (optional)</span>
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
      <div className={containerCss}>
        <Select
          aria-invalid={inputError ? 'true' : 'false'}
          aria-required={required ? 'true' : 'false'}
          disabled={readOnly}
          id={name}
          inputRef={selectRef}
          name={name}
          required={required}
          {...rest}
          {...customProps}
        >
          <option
            value=''
            style={{
              display: required && showOptionalText ? 'none' : 'inline',
            }}
          >{`${defaultOption}`}</option>
          {!group && renderedOptions}
          {group && <optgroup label={group}>{renderedOptions}</optgroup>}
          {children}
        </Select>
      </div>
    </>
  );
};

export default SelectInput;
