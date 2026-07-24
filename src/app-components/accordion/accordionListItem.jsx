import { useState } from 'react';
import { mdiMenuDown, mdiMenuRight } from '@mdi/js';

import { classArray } from '@src/utils';

import Icon from '@components/icon/icon';

import './accordion.scss';

const AccordionListItem = ({
  isDefaultOpen = false,
  onToggle = () => {},
  headingText = '',
  children = null,
  className = '',
  contentClassname = '',
}) => {
  const [isOpen, setIsOpen] = useState(isDefaultOpen);

  const itemClasses = classArray(['accordion-item', className]);

  const contentClasses = classArray(['accordion-collapse', 'collapse', isOpen && 'show', contentClassname]);

  const headingClasses = classArray(['accordion-heading', isOpen && 'is-open']);

  const toggleAccordion = () => {
    onToggle(!isOpen);
    setIsOpen(!isOpen);
  };

  return (
    <div className={itemClasses}>
      <div className={headingClasses} onClick={() => toggleAccordion()}>
        <Icon className='ml-3 accordion-icon' focusable={false} path={isOpen ? mdiMenuDown : mdiMenuRight} />
        <p className='text-bold margin-top-2'>{headingText}</p>
      </div>
      <div className={contentClasses}>
        <div className='accordion-body'>{children}</div>
      </div>
    </div>
  );
};

export default AccordionListItem;
