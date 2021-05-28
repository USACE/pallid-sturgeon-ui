import React from 'react';
import { connect } from 'redux-bundler-react';
import Accordion from '../../app-components/accordion';

export default connect(
  ({ }) => (
    <div className='container-fluid' style={{ paddingLeft: 0, paddingRight: 0 }}>
      <Accordion />
    </div>
  )
);
