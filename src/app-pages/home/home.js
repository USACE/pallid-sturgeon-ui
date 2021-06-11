import React from 'react';

import Accordion from 'app-components/accordion';

const Home = () => (
  <div className='container-fluid pt-4'>
    <Accordion.List>
      <Accordion.Item headingText='USG Species with No Vial Number'>
        <p>Todo</p>
      </Accordion.Item>
      <Accordion.Item headingText='Unchecked Data Sheet Records'>
        <p>Todo</p>
      </Accordion.Item>
      <Accordion.Item headingText='Office Error Log'>
        <p>Todo</p>
      </Accordion.Item>
    </Accordion.List>
  </div>
);

export default Home;
