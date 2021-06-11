import React from 'react';

import { classArray } from '../../utils';

import './pageContent.scss';

const hasDevBanner = process.env.REACT_APP_DEVELOPMENT_BANNER;

const PageContent = ({ children }) => {
  const pageClasses = classArray([
    hasDevBanner && 'banner',
  ]);

  return (
    <div className={pageClasses}>
      {children}
    </div>
  );
};

export default PageContent;
