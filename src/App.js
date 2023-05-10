import React, { useEffect } from 'react';
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
    // @TODO: Change logic for this
    useEffect(() => {
      if (!auth.token) {
        doModalOpen(LandingModal);
      } else {
        doModalClose(LandingModal);
      }
    }, [auth, doModalClose, doModalOpen]);

    return (
      <>
        {loadingState && <LoadingModal text={loadingMessage} />}
        <ToastContainer autoClose={3500} hideProgressBar={false} />
        <NavBar />
        <PageContent>
          {auth.token ? <Route />:<Hero />}
        </PageContent>
        <Modal closeWithEscape />
        <Footer />
      </>
    );});
