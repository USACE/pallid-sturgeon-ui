import React, { useEffect, useReducer, useState, useRef } from 'react';
import { connect } from 'redux-bundler-react';

import { ModalContent, ModalFooter, ModalHeader } from 'app-components/modal';
import { Row, SelectCustomLabel } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';
import { createDropdownOptions, createFieldOfficeIdDropdownOptions } from 'app-pages/data-entry/helpers';

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
  'selectDomainsFieldOffices',
  'selectDomainsProjects',
  ({
    doDomainFieldOfficesFetch,
    doDomainProjectsFetch,
    domainsFieldOffices,
    domainsProjects,
  }) => {
    const [state, dispatch] = useReducer(reducer, {});

    const handleSelect = (field, val) => {
      dispatch({
        type: 'UPDATE_INPUT',
        field: field,
        payload: val
      });
    };

    useEffect(() => {
      doDomainFieldOfficesFetch();
      doDomainProjectsFetch();
    }, []);

    console.log(state);

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
                isRequired
              />
            </div>
          </Row>
          <Row>
            <div className='col-6'>
              <SelectCustomLabel
                name='fieldoffice'
                label='Field Office'
                options={createFieldOfficeIdDropdownOptions(domainsFieldOffices)}
                onChange={val => handleSelect('fieldoffice', val)}
                isRequired
              />
            </div>
            <div className='col-6'>
              <SelectCustomLabel
                name='projectId'
                label='Project'
                options={createDropdownOptions(domainsProjects)}
                onChange={val => handleSelect('projectId', val)}
                isRequired
              />
            </div>
          </Row>
        </section>
        <ModalFooter
          showCancelButton
          saveIsDisabled={true}
        />
      </ModalContent>
    );
  });

export default AddUserFormModal;