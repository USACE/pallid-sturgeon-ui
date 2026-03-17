import { connect } from 'redux-bundler-react';

import Button from '@components/button';
import SitesFormModal from '@src/app-pages/sites-list/site-form-modal/SitesFormModal';

const SiteIdCellRenderer = connect(
  'doDomainFieldOfficesFetch',
  'doDomainBendRnFetch',
  'doDomainSegmentsFetch',
  'doFetchUsers',
  'doDomainSeasonsFetch',
  'doFetchSites',
  'doUpdateUrl',
  'doModalOpen',
  ({
    doDomainFieldOfficesFetch,
    doDomainBendRnFetch,
    doDomainSegmentsFetch,
    doFetchUsers,
    doDomainSeasonsFetch,
    doFetchSites,
    doUpdateUrl,
    doModalOpen,
    edit,
    data,
    value,
  }) => {
    const handleCallback = () => {
      doUpdateUrl(`/sites-list/${data?.siteId}`);
    };

    const handleClick = () => {
      if (edit) {
        doDomainFieldOfficesFetch();
        doDomainBendRnFetch();
        doFetchUsers();
        doDomainSeasonsFetch();
        doDomainSegmentsFetch({ office: data?.fieldoffice, project: data?.projectId });
        doModalOpen(SitesFormModal, { edit: true, data: data });
      } else {
        doFetchSites({ siteId: data?.siteId }, handleCallback());
      }
    };

    return <Button size='small' variant='link' className='p-0 mb-1' text={value} handleClick={() => handleClick()} />;
  }
);

export default SiteIdCellRenderer;
