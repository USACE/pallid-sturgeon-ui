import { Icon } from '@trussworks/react-uswds';

import './secondaryModal.scss';

const SecondaryModalHeader = ({ title = '', hasIcon = false, isError = false }) => {
  const DisplayIcon = ({ isError }) =>
    isError ? (
      <Icon.Error className='secondary-modal-icon' color='#D43929' aria-label={title} />
    ) : (
      <Icon.Help className='secondary-modal-icon' color='#005ea2' aria-label={title} />
    );

  return (
    <header id='secondary-modal-header' className='secondary-modal-header'>
      <h3 className='modal-title'>
        {hasIcon && <DisplayIcon isError={isError} />}
        <div>{title}</div>
      </h3>
    </header>
  );
};

export default SecondaryModalHeader;
