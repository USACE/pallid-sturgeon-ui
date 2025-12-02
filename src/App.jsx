import { useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { ToastContainer } from 'react-toastify';

import Modal from '@components/modal';
import Hero from '@components/hero';
import Footer from '@components/footer';
import PageContent from '@components/page-content';
import LoadingModal from './common/modals/loading';
import LandingModal from './common/modals/landing';
import NavBar from '@components/navigation';
import SyncBadge from './app-components/offline/SyncBadge';
import QuickCreate from './app-components/offline/QuickCreate';

import 'react-toastify/dist/ReactToastify.css';
import './css/bootstrap/css/bootstrap.water.min.css';
import '@styles/index.scss';
import '@styles/uswds-theme/_uswds-theme-components.scss';
import '@styles/_buttons.scss';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

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
        {/* offline sync badge - below the navbar */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 5,
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '6px 12px',
          }}
        >
          <SyncBadge />
        </div>
        <PageContent>
          {auth.token ? (
            <>
              {/* TEMP: QuickCreate button for testing */}
              <div style={{ padding: 12 }}>
                <QuickCreate />
              </div>
              <Route />
            </>
          ) : (
            <Hero />
          )}
        </PageContent>
        <Modal closeWithEscape />
        <Footer />
      </>
    );
  }
);
