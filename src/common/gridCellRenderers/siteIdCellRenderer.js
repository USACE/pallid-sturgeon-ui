import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';

const SiteIdCellRenderer = connect(
  'doFetchSiteById',
  ({ doFetchSiteById, data, value }) => (
    <Button
      size='small'
      variant='link'
      className='p-0 mb-1'
      text={value}
      handleClick={() => doFetchSiteById({ siteId: data.siteId })}
    />
  ));

export default SiteIdCellRenderer;
