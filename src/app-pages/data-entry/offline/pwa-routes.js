export const PWA_ROUTES = ['/home', '/sites-list', '/logout'];

export const isPwaAllowedRoute = (pathname) => {
  if (!pathname) {
    return false;
  }

  return pathname === '/' || pathname === '/home' || pathname === 'logout' || pathname.startsWith('/sites-list');
};
