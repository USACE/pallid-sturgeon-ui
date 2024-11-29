import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { ToastContainer } from 'react-toastify';

import Modal from '@components/modal';
import Hero from '@components/hero';
import Footer from '@components/footer';
import PageContent from '@components/page-content';
import LoadingModal from './common/modals/loading';
import LandingModal from './common/modals/landing';
import NavBar from '@components/navigation';

import 'react-toastify/dist/ReactToastify.css';
import './css/bootstrap/css/bootstrap.water.min.css';
import './css/index.scss';

export default connect(
  'doModalOpen',
  'doModalClose',
  'selectRoute',
  'selectAuth',
  'selectLoadingState',
  'selectLoadingMessage',
  ({ doModalOpen, doModalClose, route: Route, auth, loadingState, loadingMessage }) => {
    useEffect(() => {
      if (!auth.token && !sessionStorage.getItem('isLoggedIn')) {
        doModalOpen(LandingModal);
      } else {
        doModalClose(LandingModal);
      }
    }, [auth, doModalClose, doModalOpen, sessionStorage.getItem('isLoggedIn')]);

    return (
      <>
        {loadingState && <LoadingModal text={loadingMessage} />}
        <ToastContainer autoClose={3500} hideProgressBar={false} />
        <NavBar />
        <PageContent>{auth.token ? <Route /> : <Hero />}</PageContent>
        <Modal closeWithEscape />
        <Footer />
      </>
    );
  }
);
