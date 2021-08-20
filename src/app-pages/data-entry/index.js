import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Card from 'app-components/card';
import FindDataSheet from './components/find-data-sheet';
import NewSite from './components/new-site';
import SitesListTable from './components/sites-list-table';

import './dataentry.scss';

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
        <Card className='mb-3'>
          <Card.Header text='Find Data Sheet by ID' />
          <Card.Body>
            <FindDataSheet/>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header text='Site Search Filter' />
          <Card.Body>
            <SitesListTable />
          </Card.Body>
        </Card>
      </div>
    );
  }
);
