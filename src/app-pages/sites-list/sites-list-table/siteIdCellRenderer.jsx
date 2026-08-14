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
    const siteId = data?.siteId ?? data?.site_id ?? data?.serverId;
    const siteFid = data?.siteFid ?? data?.site_fid;
    const siteRouteKey = Number(siteId) > 0 ? String(siteId) : (data?.siteRouteKey ?? siteFid);

    const handleClick = () => {
      if (edit) {
        if (navigator.onLine) {
          doDomainFieldOfficesFetch();
          doDomainBendRnFetch();
          doFetchUsers();
          doDomainSeasonsFetch();
          doDomainSegmentsFetch({ office: data?.fieldoffice, project: data?.projectId });
        }
        doModalOpen(SitesFormModal, { edit: true, data: data });
        return;
      }
      doUpdateUrl(`/sites-list/${siteRouteKey}`);
    };

    return <Button size='small' variant='link' className='p-0 mb-1' text={value} handleClick={() => handleClick()} />;
  }
);

export default SiteIdCellRenderer;
