import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderContainer from 'common/header/HeaderContainer';
import Footer from 'common/footer/Footer';
import Routes from './Routes';

const App = () => (
  <>
    <HeaderContainer />
    <main className="site-main">
      <Routes />
    </main>
    <Footer />
  </>
);

export default App;
