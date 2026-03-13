import { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Alert, Grid } from '@trussworks/react-uswds';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, FormProvider } from 'react-hook-form';

import SelectInput from '@components/new-inputs/select-input/SelectInput';
import ErrorSummary from '@components/error-summary/ErrorSummary';
import ModalContent from '@src/app-components/modal/primary-modal/PrimaryModal.content';
import ModalFooter from '@src/app-components/modal/primary-modal/PrimaryModal.footer';

import { createDropdownOptions, createFieldOfficeIdDropdownOptions } from '@pages/data-entry/helpers';

import { ValidationMessages } from '@src/utils/enums';

const createUsersOptions = (data) => {
  if (!data) return [];

  return data.map((opt) => ({
    text: opt.firstName + ' ' + opt.lastName + ' (' + opt.userName + ')',
    value: opt.userId,
  }));
};

const defaultValues = {
  userId: '',
  officeId: '',
  projectCode: '',
};

const schema = yup.object().shape({
  userId: yup.string().required(ValidationMessages.FieldRequired),
  officeId: yup.string().required(ValidationMessages.FieldRequired),
  projectCode: yup.string().required(ValidationMessages.FieldRequired),
});

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
    const [user, setUser] = useState(null);

    const methods = useForm({
      defaultValues: defaultValues,
      resolver: yupResolver(schema),
      mode: 'onBlur',
      stateOptions: [],
    });
    const {
      formState: { errors, isValid },
      setFocus,
      watch,
      getValues,
      trigger,
    } = methods;

    const userId = watch('userId');

    const fetchUsersList = () => {
      doFetchUsers();
      doFetchUsersList();
    };

    const handleSave = () => {
      if (isValid) {
        const values = getValues();
        doRoleOfficeUpdate(
          {
            userId: Number(values.userId),
            roleId: Number(user.roleId),
            officeId: Number(values.officeId),
            projectCode: values.projectCode,
          },
          fetchUsersList()
        );
      } else {
        trigger();
      }
    };

    // Isolate user to get user's role
    useEffect(() => {
      setUser(usersList.find((u) => parseInt(userId) === parseInt(u.userId)) ?? null);
    }, [userId]);

    // Loading data
    useEffect(() => {
      doDomainFieldOfficesFetch();
      doDomainProjectsFetch(false);
      doFetchUsersList();
    }, []);

    useEffect(() => {
      setFocus(errors?.[Object.keys(errors)[0]]?.['ref']?.['id']);
    }, [errors, setFocus]);

    return (
      <ModalContent title='Add Account to Existing User'>
        <FormProvider {...methods}>
          {errors && <ErrorSummary errors={errors} modalID='addUsersFormModal' type='modal' />}
          <section className='modal-body margin-bottom-2' id='addUsersFormModal'>
            <div className='container-fluid margin-top-1'>
              <Alert noIcon slim className='callout'>
                As an ADMINISTRATOR, you can add an account to an existing user.
              </Alert>
              <Grid row gap='md'>
                <Grid tablet={{ col: 6 }}>
                  <SelectInput name='userId' label='Select User' required>
                    {createUsersOptions(usersList).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
              </Grid>
              <Grid row gap='md'>
                <Grid tablet={{ col: 6 }}>
                  <SelectInput name='officeId' label='Field Office' required>
                    {createFieldOfficeIdDropdownOptions(domainsFieldOffices).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
                <Grid tablet={{ col: 6 }}>
                  <SelectInput name='projectCode' label='Project' required>
                    {createDropdownOptions(domainsProjects).map((item, index) => (
                      <option key={index + 1} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </SelectInput>
                </Grid>
              </Grid>
            </div>
          </section>
          <ModalFooter showCancelButton saveIsDisabled={!isValid} onSave={() => handleSave()} />
        </FormProvider>
      </ModalContent>
    );
  }
);

export default AddUserFormModal;
