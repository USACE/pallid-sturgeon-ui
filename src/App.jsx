import { useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { ToastContainer } from 'react-toastify';

import Hero from '@components/hero';
import Footer from '@components/footer';
import PageContent from '@components/page-content';
import LoadingModal from './common/modals/loading';
import LandingModal from './common/modals/LandingModal';
import NavBar from '@components/navigation';
import Modal from './app-components/modal/primary-modal/PrimaryModal';
import SecondaryModal from './app-components/modal/secondary-modal/SecondaryModal';
import { initOnlineListener } from './app-pages/data-entry/offline/online-listener';
import SyncBanner from './app-pages/data-entry/offline/sync-banner/SyncBanner';
import { usePwaMode } from './app-pages/data-entry/offline/pwa-mode';

import 'react-toastify/dist/ReactToastify.css';
import './css/bootstrap/css/bootstrap.water.min.css';
import '@styles/index.scss';
import '@styles/uswds-theme/_uswds-theme-components.scss';
import '@styles/_buttons.scss';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { CssTheme } from './utils/enums';

// Exact hexadecimal values extracted from Chrome's "Customize Chrome" palette
const CHROME_PALETTES = {
  defaultGray: { main: '#e3e3e3', bg: '#f1f3f4', text: '#3c4043' },
  purple: { main: '#d7aefb', bg: '#f3e8fd', text: '#8ab4f8' },
  green: { main: '#a8dab5', bg: '#e6f4ea', text: '#137333' },
  blue: { main: '#aecbfa', bg: '#e8f0fe', text: '#174ea6' },
  yellow: { main: '#fde293', bg: '#fef7e0', text: '#b06000' },
};

export default connect(
  'doGetAllLookupData',
  'doModalOpen',
  'selectRoute',
  'selectAuth',
  'selectLoadingState',
  'selectLoadingMessage',
  ({ doGetAllLookupData, doModalOpen, route: Route, auth, loadingState, loadingMessage }) => {
    const isAuthenticated = !!auth?.token;
    const userHasRole = !!auth?.authData?.role;
    const pwaMode = usePwaMode();

    useEffect(() => {
      const cleanupOnlineListener = initOnlineListener();

      if (isAuthenticated && userHasRole) {
        doGetAllLookupData();
      } else {
        const landingModalSeen = sessionStorage.getItem('landingModalSeen');
        if (!landingModalSeen || landingModalSeen === 'false') {
          doModalOpen(LandingModal);
        }
      }

      return cleanupOnlineListener;
    }, [doGetAllLookupData, isAuthenticated, userHasRole, doModalOpen]);

    return (
      <>
        {loadingState && <LoadingModal text={loadingMessage} />}
        <ToastContainer autoClose={3500} hideProgressBar={false} />
        {(!pwaMode || !isAuthenticated) && <NavBar />}
        {auth.token && <SyncBanner />}
        <PageContent>{auth.token ? <Route /> : <Hero />}</PageContent>
        <Modal closeWithEscape />
        <SecondaryModal closeWithEscape />
        <Footer />
      </>
    );
  }
);
