import React from 'react';
import { connect } from 'redux-bundler-react';

import Modal from './app-components/modal';
import NavBar from './app-components/navigation';
import User from './app-components/user/user';
import Breadcrumb from './app-components/breadcrumb/breadcrumb';
import Footer from './common/footer/Footer';
import Hero from './app-components/hero';
import PageContent from './app-components/pageContent';
import FieldApplication from './app-pages/fieldapplication/fieldApplication';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './css/index.scss';
import './css/mdi/css/materialdesignicons.min.css';

export default connect('selectRoute', ({ route: Route }) => (
  <div>
    <NavBar theme='primary' />
    <Hero />
    <FieldApplication />
    <div className='container pt-1 mb-5'>
      <div className='row'>
        <div className='col-8'>
          <Breadcrumb />
        </div>
        <div className='col-4'>
          <User />
        </div>
      </div>
      <PageContent>
        <Route />
      </PageContent>
    </div>
    <Modal closeWithEscape />
    <Footer />
  </div>
));
