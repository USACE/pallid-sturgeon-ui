import React from 'react';
import { connect } from 'redux-bundler-react';

import Breadcrumb from 'app-components/breadcrumb';
import { classArray } from '../../utils';

import './pageContent.scss';

const hasDevBanner = process.env.REACT_APP_DEVELOPMENT_BANNER;

const PageContent = connect(
  'selectPathname',
  ({ pathname, children }) => {
    const pageClasses = classArray([
      hasDevBanner && 'banner',
      'page-content',
    ]);

    const hasBreadcrumb = pathname != '/';

    return (
      <div className={pageClasses}>
        {hasBreadcrumb && (
          <Breadcrumb pathname={pathname} />
        )}
        {children}
      </div>
    );
  }
);

export default PageContent;
