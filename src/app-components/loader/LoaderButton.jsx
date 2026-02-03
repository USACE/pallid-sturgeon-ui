import { Button } from '@trussworks/react-uswds';
import classnames from 'classnames';
import Spinner from './Spinner';

const LoaderButton = ({ children, className, isLoading, isDisabled, ...props }) => {
  const buttonStyles = classnames(className, 'loading-button', {
    'is-loading': isLoading,
  });

  return (
    <Button className={buttonStyles} disabled={isLoading || isDisabled} {...props}>
      {isLoading && <Spinner className='button-loader' />}
      {children}
    </Button>
  );
};

export default LoaderButton;
