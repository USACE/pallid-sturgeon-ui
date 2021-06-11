import React from 'react';
import { connect } from 'redux-bundler-react';

import { classArray } from '../../utils';

import './pageContent.scss';

const hasDevBanner = process.env.REACT_APP_DEVELOPMENT_BANNER;

const PageContent = connect(
  'selectPathname',
  ({
    pathname,
    children,
  }) => {
    const pageClasses = classArray([
      'page-content',
      hasDevBanner && 'banner',
    ]);

    return (
      <div className={pageClasses}>
        {children}
      </div>
    );
  }
);

export default PageContent;
