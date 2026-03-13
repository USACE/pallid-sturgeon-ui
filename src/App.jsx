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

import 'react-toastify/dist/ReactToastify.css';
import './css/bootstrap/css/bootstrap.water.min.css';
import '@styles/index.scss';
import '@styles/uswds-theme/_uswds-theme-components.scss';
import '@styles/_buttons.scss';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

export default connect(
  'doModalOpen',
  'selectRoute',
  'selectAuth',
  'selectLoadingState',
  'selectLoadingMessage',
  ({ doModalOpen, route: Route, auth, loadingState, loadingMessage }) => {
    const isAuthenticated = !!auth?.token;
    const userHasRole = !!auth?.authData?.role;

    useEffect(() => {
      if (isAuthenticated && userHasRole) {
        // doGetAllLookupData();
      } else {
        const landingModalSeen = sessionStorage.getItem('landingModalSeen');
        if (!landingModalSeen || landingModalSeen === 'false') {
          doModalOpen(LandingModal);
        }
      }
    }, [isAuthenticated, userHasRole, doModalOpen]);

    return (
      <>
        {loadingState && <LoadingModal text={loadingMessage} />}
        <ToastContainer autoClose={3500} hideProgressBar={false} />
        <NavBar />
        <PageContent>{auth.token ? <Route /> : <Hero />}</PageContent>
        <Modal closeWithEscape />
        <SecondaryModal closeWithEscape />
        <Footer />
      </>
    );
  }
);
