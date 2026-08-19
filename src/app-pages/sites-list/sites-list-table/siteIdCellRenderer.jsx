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
    edit: viewSiteForm,
    data,
    value,
  }) => {
    // Pull Site Unique Identifiers
    const siteId = data?.siteId;
    const siteFid = data?.siteFid;
    const siteRouteKey = Number(siteId) > 0 ? String(siteId) : (data?.siteRouteKey ?? siteFid);
    // Check network status (offline/online)
    const isOnline = navigator.onLine;

    const handleCallback = () => {
      doUpdateUrl(`/sites-list/${data?.siteId}`);
    };

    const handleClick = () => {
      // Online Status Conditions
      if (isOnline) {
        if (viewSiteForm) {
          // Load all Domain Lookup Table Data
          doDomainFieldOfficesFetch();
          doDomainBendRnFetch();
          doFetchUsers();
          doDomainSeasonsFetch();
          doDomainSegmentsFetch({ office: data?.fieldoffice, project: data?.projectId });
          // Open Sites Form Modal
          doModalOpen(SitesFormModal, { edit: true, data: data });
        } else {
          // Navigate to Sites Datasheet Page and Fetch Online Sites by Selected Site Unique Identifier
          // This populates Base Data for Data Header Component
          doFetchSites({ siteId: data?.siteId }, handleCallback());
        }
      } else {
        // Offline Status Conditions
        viewSiteForm
          ? doModalOpen(SitesFormModal, { edit: true, data: data })
          : doUpdateUrl(`/sites-list/${siteRouteKey}`);
      }
    };

    return <Button size='small' variant='link' className='p-0 mb-1' text={value} handleClick={() => handleClick()} />;
  }
);

export default SiteIdCellRenderer;
