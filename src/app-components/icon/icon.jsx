import MaterialIcon from '@mdi/react';

const Icon = ({ focusable = true, size = '16px', ...rest }) => (
  <MaterialIcon
    aria-hidden={focusable ? 'false' : 'true'}
    focusable={focusable ? 'true' : 'false'}
    tabIndex={focusable ? '0' : '-1'}
    role={focusable ? 'button' : 'img'}
    size={size}
    {...rest}
  />
);

export default Icon;
