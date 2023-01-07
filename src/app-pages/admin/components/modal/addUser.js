import React, { useEffect, useReducer } from 'react';
import { connect } from 'redux-bundler-react';

import { ModalContent, ModalFooter, ModalHeader } from 'app-components/modal';
import { Row, SelectCustomLabel } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';
import { createDropdownOptions, createFieldOfficeIdDropdownOptions, createUsersOptions } from 'app-pages/data-entry/helpers';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_INPUT':
      return {
        ...state,
        [action.field]: action.payload
      };
    case 'INITIALIZE_FORM':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

const AddUserFormModal = connect(
  'doDomainFieldOfficesFetch',
  'doDomainProjectsFetch',
  'doFetchUsersList',
  'doFetchUsers',
  'doRoleOfficeUpdate',
  'selectDomainsFieldOffices',
  'selectDomainsProjects',
  'selectUsersList',
  ({
    doDomainFieldOfficesFetch,
    doDomainProjectsFetch,
    doFetchUsersList,
    doFetchUsers,
    doRoleOfficeUpdate,
    domainsFieldOffices,
    domainsProjects,
    usersList,
  }) => {
    const [state, dispatch] = useReducer(reducer, {});

    const handleSelect = (field, val) => {
      dispatch({
        type: 'UPDATE_INPUT',
        field: field,
        payload: val
      });
    };

    const doSave = () => {
      // Isolate user to get user's role
      const user = usersList.find(u => parseInt(state['userId']) === parseInt(u.userId));

      doRoleOfficeUpdate({
        userId: parseInt(state['userId']),
        roleId: parseInt(user.roleId),
        officeId: parseInt(state['officeId']),
        projectCode: state['projectCode'],
      }, doFetchUsers());
    };

    useEffect(() => {
      doDomainFieldOfficesFetch();
      doDomainProjectsFetch();
      doFetchUsersList();
    }, []);
  
    return (
      <ModalContent size='lg'>
        <ModalHeader title='Add Account to Existing User' />
        <section className='modal-body'>
          <p>As an ADMINISTRATOR, you can add an account to an existing user.</p>
          <Row>
            <div className='col-6'>
              <SelectCustomLabel
                name='userId'
                label='Select User'
                value={state['userId']}
                options={createUsersOptions(usersList)}
                onChange={val => handleSelect('userId', val)}
                isRequired
              />
            </div>
          </Row>
          <Row>
            <div className='col-6'>
              <SelectCustomLabel
                name='officeId'
                label='Field Office'
                value={state['officeId']}
                options={createFieldOfficeIdDropdownOptions(domainsFieldOffices)}
                onChange={val => handleSelect('officeId', val)}
                isRequired
              />
            </div>
            <div className='col-6'>
              <SelectCustomLabel
                name='projectCode'
                label='Project'
                value={state['projectCode']}
                options={createDropdownOptions(domainsProjects)}
                onChange={val => handleSelect('projectCode', val)}
                isRequired
              />
            </div>
          </Row>
        </section>
        <ModalFooter
          showCancelButton
          // saveIsDisabled={true}
          onSave={doSave}
        />
      </ModalContent>
    );
  });

export default AddUserFormModal;