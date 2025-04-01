import React from 'react';
import { classArray } from '@src/utils';

import './pageContent.scss';

const PageContent = ({ children }) => {
  const pageClasses = classArray(['page-content']);

  return <div className={pageClasses}>{children}</div>;
};

export default PageContent;
