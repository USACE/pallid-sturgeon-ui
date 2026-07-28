export const isOfflineSiteRouteKey = (siteRouteKey) => {
  return String(siteRouteKey || '').startsWith('SITE-');
};

export const getSiteRouteParams = (siteRouteKey) => {
  if (isOfflineSiteRouteKey(siteRouteKey)) {
    return {
      siteFid: siteRouteKey,
      site_fid: siteRouteKey,
      isOfflineSite: true,
    };
  }

  return {
    siteId: Number(siteRouteKey),
    site_id: Number(siteRouteKey),
    isOfflineSite: false,
  };
};
