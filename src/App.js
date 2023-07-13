import React, { useEffect, useMemo } from 'react';
import { connect } from 'redux-bundler-react';
import { ToastContainer } from 'react-toastify';

import Modal from 'app-components/modal';
import NavBar from 'app-components/navigation';
import Hero from 'app-components/hero';
import Footer from './app-components/footer';
import PageContent from 'app-components/page-content';
import LoadingModal from 'common/modals/loading';
import LandingModal from 'common/modals/landing';

import 'react-toastify/dist/ReactToastify.css';
import './css/bootstrap/css/bootstrap.water.min.css';
import './css/mdi/css/materialdesignicons.min.css';
import './css/index.scss';

// Custom hook for authentication check and managing landing modal
const useAuthCheck = (auth, doModalOpen, doModalClose) => {
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!auth.token && !isLoggedIn) {
      doModalOpen(LandingModal);
    } else {
      doModalClose(LandingModal);
    }
  }, [auth, doModalClose, doModalOpen]);
};

export default connect(
  'doModalOpen',
  'doModalClose',
  'selectRoute', 
  'selectAuth', 
  'selectLoadingState',
  'selectLoadingMessage',
  ({ 
    doModalOpen,
    doModalClose,
    route: Route, 
    auth,
    loadingState,
    loadingMessage
  }) => {
    useAuthCheck(auth, doModalOpen, doModalClose);

    const loadingModal = useMemo(() => loadingState && <LoadingModal text={loadingMessage} />, [loadingState, loadingMessage]);
    const content = useMemo(() => auth.token ? <Route /> : <Hero />, [auth.token, Route]);

    return (
      <>
        {loadingModal}
        <ToastContainer autoClose={3500} hideProgressBar={false} />
        <NavBar />
        <PageContent>
          {content}
        </PageContent>
        <Modal closeWithEscape />
        <Footer />
      </>
    );
});
