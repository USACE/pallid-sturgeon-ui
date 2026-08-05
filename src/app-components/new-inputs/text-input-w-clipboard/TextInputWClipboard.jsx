import { useFormContext } from 'react-hook-form';

import { Label, TextInput as UswdsTextInput } from '@trussworks/react-uswds';
import { mdiContentCopy } from '@mdi/js';
import Icon from '@components/icon/icon';
import classNames from 'classnames';

import Button from '@components/button/button';

import './textInputWClipboard.scss';

const writeToClipBoard = async (id) => {  
  try {
      await navigator.clipboard.writeText(document.getElementById(id).value);
  } catch (error) {
      console.error(error.message);
  }
}

const TextInputWClipboard = ({
  className = 'width-mobile',
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
  const classes = classNames(className, { 'text-uppercase': uppercase }, 'copy-button-group');

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
      <Button
        isOutline
        usePaddingBottom={false}
        size='small'
        // variant='light'
        // className='ml-2'
        title={`Copy to Clipboard`}
        icon={<Icon path={mdiContentCopy} />}
        handleClick={() => writeToClipBoard(name)}
      />
    </>
  );
};

export default TextInputWClipboard;
