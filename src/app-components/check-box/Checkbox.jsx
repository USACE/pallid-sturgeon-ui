import { useFormContext } from 'react-hook-form';
import { Checkbox as USWDSCheckbox } from '@trussworks/react-uswds';
import classNames from 'classnames';

import './checkbox.scss';

const Checkbox = ({ id, label, name, onChange = () => {}, onBlur = () => {}, value, tile, ...customProps }) => {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext();
  const inputError = errors[name];

  const { ref: checkboxRef, ...rest } = register(name, {
    onBlur,
    onChange: async (e) => {
      await trigger(name);
      onChange(e);
    },
  });

  const classes = classNames({
    'checkbox-invalid-tile': inputError && tile,
    'checkbox-invalid': inputError && !tile,
  });

  return (
    <USWDSCheckbox
      className={classes}
      id={id ?? value}
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
