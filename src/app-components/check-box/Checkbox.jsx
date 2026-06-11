import { useFormContext } from 'react-hook-form';
import { Checkbox as USWDSCheckbox } from '@trussworks/react-uswds';
import classNames from 'classnames';

import './checkbox.scss'; 

const Checkbox = ({
  id,
  label,
  name,
  onChange = () => {},
  onBlur = () => {},
  value,
  tile,
  validations,
  hint,
  warning,
  ...customProps
}) => {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext();
  const inputError = errors[name];

  const handleBlur = (e) => {
    onBlur(e);
  };

  const handleChange = (e) => {
    onChange(e);
  };

  const { ref: checkboxRef, ...rest } = register(name, {
    onBlur: handleBlur,
    onChange: handleChange,
    ...validations,
  });

  const classes = classNames({
    'checkbox-invalid-tile': inputError && tile,
    'checkbox-invalid': inputError && !tile,
  });

  return (
    <USWDSCheckbox
      className={classes}
      id={name}
      inputRef={checkboxRef}
      label={label}
      name={name}
      tile={tile}
      value={value}
      {...customProps}
      {...rest}
    />
  );
};

export default Checkbox;
