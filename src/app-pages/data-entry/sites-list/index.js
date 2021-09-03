import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Card from 'app-components/card';
import NewSite from './components/new-site';
import SitesList from './components/sites-list';

import '../dataentry.scss';

export default connect(
  'doDataEntryLoadData',
  ({
    doDataEntryLoadData,
  }) => {
    useEffect(() => {
      doDataEntryLoadData();
    }, []);

    return (
      <div className='container-fluid'>
        <Card className='mb-3'>
          <Card.Header text='Create New Site' />
          <Card.Body>
            <NewSite />
          </Card.Body>
        </Card>
        <Card>
          <Card.Header text='Site Search Filter' />
          <Card.Body>
            <SitesList />
          </Card.Body>
        </Card>
      </div>
    );
  }
);
