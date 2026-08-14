export const siteDatasheetUpdated = 'site-datasheet-updated';

export function refreshSiteDatasheet() {
  window.dispatchEvent(new CustomEvent(siteDatasheetUpdated));
}
