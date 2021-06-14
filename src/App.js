import React from 'react';
import { connect } from 'redux-bundler-react';

import Modal from 'app-components/modal';
import NavBar from 'app-components/navigation';
// import User from 'app-components/user/user';
// import Breadcrumb from 'app-components/breadcrumb/breadcrumb';
import Footer from './common/footer';
import PageContent from 'app-components/page-content';

import './css/bootstrap/css/bootstrap.water.min.css';
import './css/mdi/css/materialdesignicons.min.css';
import './css/index.scss';

export default connect('selectRoute', ({ route: Route }) => (
  <>
    <NavBar />
    <PageContent>
      <Route />
    </PageContent>
    <Modal closeWithEscape />
    <Footer />
  </>
));
