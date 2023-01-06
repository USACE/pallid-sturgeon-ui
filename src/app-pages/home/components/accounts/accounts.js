import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';

import { Row, SelectCustomLabel } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';
import { createAccountsOptions } from 'app-pages/data-entry/helpers';

import './accounts.scss';

const Accounts = connect(
  'doAuthUpdate',
  'selectAuthData',
  ({
    doAuthUpdate,
    authData,
    accounts
  }) => {
    const [ accountId, setAccountId ] = useState('');

    return (
      <div className='container pt-4'>
        <p className='user-text'>Logged in as: <b>{authData ? authData.name : ''}</b></p>
        <p className='role-text'>({ accounts ? accounts[0].role : ''})</p>
        <p className='center text'>There are multiple accounts for this user. Please select account below:</p>
        <Row className='center'>
          <div className='col-6'>
            <SelectCustomLabel
              label='Accounts '
              options={createAccountsOptions(accounts)}
              onChange={val => setAccountId(val)}
            />
          </div>
        </Row>
        <Row className='center'>
          <Button
            size='small'
            variant='primary'
            text='Sign In'
            title='Sign In'
            handleClick={() => doAuthUpdate(accountId)}
            isDisabled={accountId === null || accountId === ''}
          />
        </Row>
      </div>
    );
  }
);

export default Accounts;
