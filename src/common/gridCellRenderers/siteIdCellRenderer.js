import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import SitesFormModal from 'app-pages/data-entry/sites-list/components/modals/sitesForm';

const SiteIdCellRenderer = connect(
  'doSitesFetch',
  'doUpdateUrl',
  'doModalOpen',
  ({
    doSitesFetch,
    doUpdateUrl,
    doModalOpen,
    edit,
    data,
    value,
  }) => (
    <Button
      size='small'
      variant='link'
      className='p-0 mb-1'
      text={value}
      handleClick={() => edit ? doModalOpen(SitesFormModal, { edit: true, id: value }) : doSitesFetch({siteId: data.siteId}, doUpdateUrl('/sites-list/datasheet'))}
    />
  ));

export default SiteIdCellRenderer;
