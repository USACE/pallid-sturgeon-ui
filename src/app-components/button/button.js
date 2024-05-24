import React from 'react';
import { classArray } from 'utils.js';

/**
 * Reusable button with many options to style and transform.
 * 
 * @param {string} size - one of `['small', 'large']` to size the button to your needs
 * @param {string} variant - one of `['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark', 'link']` to apply a class standard style
 * @param {string} text - text do be display on the button
 * @param {string} title - text to be read be screen readers and onHover. if not provided, text prop will be used
 * @param {string} href - a uri for the user to be taken to onClick. overrides and removes handleClick prop if provided.
 * @param {string} type - the type of the button, one of `[button, reset, submit]`. Default `button`.
 * @param {Element} icon - an icon to be displayed next to the text on the button
 * @param {boolean} isOutline - set to `true` to apply the outline styles to the button. default: `false` 
 * @param {boolean} isDisabled - set to `true` to apply the style for a disabled button. default: `false`
 * @param {boolean} isActive - set to `true` to apply the style for an active button. default: `false`
 * @param {Function} handleClick - function to handle user interaction. ignored if an `href` is provided
 */
const Button = ({
  size = '',
  variant = 'primary',
  text = '',
  title = '',
  type = 'button',
  icon = null,
  isOutline = false,
  isDisabled = false,
  isActive = false,
  isLoading = false,
  handleClick = () => { },
  className = '',
  ...customProps
}) => {
  const classes = classArray([
    'btn',
    size && size === 'small' ? 'btn-sm' : size === 'large' ? 'btn-lg' : '',
    `btn-${isOutline ? 'outline-' : ''}${variant}`,
    isActive && 'active',
    isDisabled && 'disabled not-allowed',
    'pb-2',
    className,
  ]);

  const buttonProps = {
    className: classes,
    role: 'button',
    type,
    title: title || text,
    disabled: isDisabled,
    'aria-disabled': isDisabled,
    onClick: handleClick,
    tabIndex: 0,
    ...customProps,
  };

  return (
    <button {...buttonProps} {...customProps}>
      <span className='align-middle'>
        {isLoading && <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>}
        {!isLoading && icon}
        {!isLoading && icon && text && <>&nbsp;</>}
        {!isLoading && text}
      </span>
    </button>
  );
};

export default Button;