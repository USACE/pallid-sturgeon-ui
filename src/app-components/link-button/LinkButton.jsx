import { Button } from '@trussworks/react-uswds';
import './linkButton.scss';

const LinkButton = ({ href, onClick, children, content, customClasses, ...customProps }) => {
  // Corrected handler for onClick events
  const handleClick = (event) => {
    // If an onClick prop was provided, call it and prevent default navigation
    if (onClick) {
      event.preventDefault(); // Prevent the default action to ensure custom logic can run
      onClick(event);
    }
  };

  // Handler for keyboard events
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === 'Spacebar' || event.key === ' ') {
      event.preventDefault(); // Prevent the default action to avoid scrolling on 'Space' press
      // Mimic a click event when key is pressed
      handleClick(event);
    }
  };

  return (
    <Button
      className={!customClasses && 'link-button-style'}
      title={children}
      onClick={handleClick}
      onKeyUp={handleKeyPress}
      role='link'
      tabIndex={0}
      aria-label={`Navigate to ${content ?? children}`}
      {...customProps}
    >
      {content ? content : children}
    </Button>
  );
};

export default LinkButton;
