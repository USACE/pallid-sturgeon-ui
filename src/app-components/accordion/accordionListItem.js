import React, { useState } from 'react';

import Icon from '../../app-components/icon';
import { classArray } from '../../utils';

import './accordion.scss';

const AccordionListItem = ({
  isDefaultOpen = false,
  onToggle = () => {},
  headingText = '',
  children = null,
  className = '',
  contentClassname = ''
}) => {
  const [isOpen, setIsOpen] = useState(isDefaultOpen);

  const itemClasses = classArray([
    'accordion-item',
    className,
  ]);

  const contentClasses = classArray([
    'accordion-collapse',
    'collapse',
    isOpen && 'show',
    contentClassname,
  ]);

  const headingClasses = classArray([
    'accordion-heading',
    isOpen && 'is-open',
  ]);

  const toggleAccordion = () => {
    onToggle(!isOpen);
    setIsOpen(!isOpen);
  };

  return (
    <div className={itemClasses}>
      <div className={headingClasses} onClick={() => toggleAccordion()}>
        <Icon
          className='ml-3 accordion-icon'
          icon={isOpen ? 'menu-down' : 'menu-right'}
        />
        <p className='text-primary'>{headingText}</p>
      </div>
      <div className={contentClasses}>
        <div className='accordion-body'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AccordionListItem;
