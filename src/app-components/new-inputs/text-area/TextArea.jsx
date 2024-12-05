import { useMemo, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';

import { Textarea as UswdsTextArea, Label } from '@trussworks/react-uswds';

import useListener from '@hooks/useListener';

import './textarea.scss';

const TextArea = ({
  className,
  hint,
  label,
  maxLength = 4000,
  name,
  onBlur,
  onChange,
  pattern,
  readOnly,
  required,
  rowCount = 3,
  validations,
}) => {
  const {
    formState: { errors },
    register,
    watch,
  } = useFormContext();

  const inputValue = watch(name);
  const hasError = !!errors[name];
  const textAreaCss = classNames('form-control', className);

  const containerRef = useRef(null);
  const {
    ref: textareaRef,
    onChange: onInputChange,
    ...rest
  } = register(name, { onChange, onBlur, pattern, ...validations });

  const countText = useMemo(() => {
    const countText = inputValue?.length
      ? maxLength - inputValue.length
      : maxLength;
    const endWord = inputValue?.length === 0 ? 'allowed' : 'left';

    return `${countText} characters ${endWord}`;
  }, [inputValue, maxLength]);

  const handleOnChange = (e) => {
    onInputChange(e);
  };

  useListener('paste', handleOnChange, containerRef?.current);

  return (
    <div className='textarea-container' ref={containerRef}>
      {label && (
        <Label htmlFor={name}>
          <span id={`${name}_label`}>{label}</span>
          {required ? (
            <span className='asterisk-color'>*</span>
          ) : (
            <span className='optional-text'>(optional)</span>
          )}
        </Label>
      )}
      {hint && (
        <div className='usa-hint' id={`${name}_hint`}>
          {hint}
        </div>
      )}
      <UswdsTextArea
        aria-describedby={name}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-label={label || 'Text Area'}
        aria-required={required}
        className={textAreaCss}
        defaultValue={inputValue}
        error={hasError}
        id={name}
        inputRef={textareaRef}
        maxLength={maxLength}
        pattern={pattern}
        readOnly={readOnly}
        required={required}
        rows={rowCount}
        onChange={handleOnChange}
        {...rest}
      />
      <div className='usa-hint'>{countText}</div>
    </div>
  );
};

export default TextArea;
