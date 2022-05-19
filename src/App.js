import React from 'react';
import { connect } from 'redux-bundler-react';
import { ToastContainer } from 'react-toastify';

import Modal from 'app-components/modal';
import NavBar from 'app-components/navigation';
import Hero from 'app-components/hero';
import Footer from './common/footer/Footer';
import PageContent from 'app-components/page-content';

import 'react-toastify/dist/ReactToastify.css';
import './css/bootstrap/css/bootstrap.water.min.css';
import './css/mdi/css/materialdesignicons.min.css';
import './css/index.scss';

export default connect(
  'selectRoute',
  'selectAuthIsMocked',
  'selectAuthTokenRaw',
  ({ 
    route: Route,
    authIsMocked,
    authToken,
  }) => (
    <>
      <ToastContainer autoClose={3500} hideProgressBar={false} />
      <NavBar />
      <PageContent>
        {(authIsMocked || !!authToken) ? <Route />:<Hero />}
      </PageContent>
      <Modal closeWithEscape />
      <Footer />
    </>
  )
);
