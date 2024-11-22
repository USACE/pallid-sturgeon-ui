import { useFormContext } from 'react-hook-form';

import { Label, TextInput as UswdsTextInput } from '@trussworks/react-uswds';

import classNames from 'classnames';

import './TextInput.scss';

const TextInput = ({
  className = 'width-full',
  hint,
  showOptionalText = true,
  label,
  type = 'text',
  maxLength = type === 'text' ? 256 : null,
  name,
  onBlur = () => {},
  onChange = () => {},
  pattern,
  readOnly,
  required,
  uppercase,
  validations,
  ...customProps
}) => {
  const classes = classNames(className, { 'text-uppercase': uppercase });

  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext();
  const inputError = errors[name];

  const handleBlur = (e) => {
    onBlur(e);
  };

  const handleChange = (e) => {
    onChange(e);
  };

  const { ref: textInputRef, ...rest } = register(name, {
    onBlur: handleBlur,
    onChange: handleChange,
    pattern,
    ...validations,
  });

  return (
    <>
      <Label htmlFor={name}>
        <span id={`${name}_label`}>{label}</span>
        {required ? (
          <span className='asterisk-color'>*</span>
        ) : (
          showOptionalText && <span className='text-italic'> (optional)</span>
        )}
      </Label>
      {hint && (
        <div className='usa-hint' id={`${name}_hint`}>
          {hint}
        </div>
      )}
      <UswdsTextInput
        className={classes}
        defaultValue={getValues(name)}
        readOnly={readOnly}
        id={name}
        inputRef={textInputRef}
        maxLength={maxLength}
        name={name}
        required={required}
        type={type}
        validationStatus={inputError && 'error'}
        {...rest}
        {...customProps}
      />
    </>
  );
};

export default TextInput;
