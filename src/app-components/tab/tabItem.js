import React from 'react';
import { classArray } from 'utils';

import './tab.scss';

const TabItem = ({ tab, changeTab, index, isActive }) => {
  const { title, isHidden, isDisabled, paddingSmall } = tab;

  const spanClasses = classArray([
    'nav-link',
    isActive && 'active',
    isDisabled && 'disabled',
    paddingSmall && 'padding-small',
  ]);

  const liClasses = classArray([
    'nav-item',
    'pointer',
    isDisabled && 'not-allowed',
    isHidden && 'd-none',
  ]);

  return (
    <li className={liClasses}>
      <span
        className={spanClasses}
        onClick={() => changeTab(title, index)}
      >
        <b>{title}</b>
      </span>
    </li>
  );
};

export default TabItem;
