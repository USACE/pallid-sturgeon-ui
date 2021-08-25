import React from 'react';

import Accordion from 'app-components/accordion';
import Hero from 'app-components/hero';
import RoleFilter from 'app-components/role-filter';
import RoleRequestSentMessage from 'app-components/role-request-sent';

const Home = () => (
  <RoleFilter
    allowRoles={['ADMINISTRATOR']}
    alt={() => <RoleRequestSentMessage className='p-2' />}>
    <Hero />
    <div className='container pt-4'>
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
  </RoleFilter>
);

export default Home;
