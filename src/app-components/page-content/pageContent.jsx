import React from 'react';
import { connect } from 'redux-bundler-react';

import Breadcrumb from '@components/breadcrumb';
import { classArray } from '@src/utils';

import './pageContent.scss';

const PageContent = connect('selectPathname', ({ pathname, children }) => {
  const pageClasses = classArray(['page-content']);

  const hasBreadcrumb = pathname != '/';

  return (
    <div className={pageClasses}>
      {hasBreadcrumb && <Breadcrumb pathname={pathname} />}
      {children}
    </div>
  );
});

export default PageContent;
