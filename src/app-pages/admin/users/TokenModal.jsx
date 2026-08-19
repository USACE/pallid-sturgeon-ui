import { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Alert, Grid } from '@trussworks/react-uswds';
import { mdiAccountKey, mdiDelete } from '@mdi/js';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, FormProvider } from 'react-hook-form';

import Button from '@components/button';
import TextInput from '@components/new-inputs/text-input/TextInput';
import TextInputWClipboard from '@components/new-inputs/text-input-w-clipboard/TextInputWClipboard';
import ErrorSummary from '@components/error-summary/ErrorSummary';
import ModalContent from '@src/app-components/modal/primary-modal/PrimaryModal.content';
import ModalFooter from '@src/app-components/modal/primary-modal/PrimaryModal.footer';
import Icon from '@components/icon/icon';
import { generateToken, hash } from '@src/utils/tokenHelpers';
import './token.scss';
import { ValidationMessages } from '@src/utils/enums';

const defaultValues = {
  accessKey: '',
  secretKey: '',
  secretHash: '',
  expiration: '',
};

const schema = yup.object().shape({
  accessKey: yup.string(),
  secretKey: yup.string().required(ValidationMessages.GenerateToken),
  expiration: yup.string(),
});

const TokenFormModal = connect(
  'doModalClose',
  'selectAuthData',
  'selectTokenStore',
  'doFetchToken',
  'doSaveToken',
  'doDeleteToken',
  ({ doModalClose, authData, tokenStore, doFetchToken, doSaveToken, doDeleteToken, user4Token }) => {
    const [accessKey, setAccessKey] = useState(null);
    const [secretKey, setSecretKey] = useState(null);
    const [secretHash, setSecretHash] = useState(null);
    const [expiration, setExpiration] = useState(null);
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
      setValue,
    } = methods;

    const createToken = () => {
      const ak = generateToken(8);
      setAccessKey(ak);
      setValue('accessKey', ak);
      const sk = generateToken(24);
      setSecretKey(sk);
      setValue('secretKey', sk);
      let result = new Date();
      result.setDate(result.getDate() + 60);
      setValue('expiration', result.toLocaleString());
      setExpiration(result);
      hash(user, ak, sk, result, saveToken);
      trigger();
      // useEffect(()=>{
      //   setValue('expiration',expiration);
      // },[expiration]);
    };

    const deleteToken = () => {
      doDeleteToken(user);
      setAccessKey('');
      setSecretKey('');
      setExpiration('');
      setValue('accessKey', '');
      setValue('secretKey', '');
      setValue('expiration', '');
      doFetchToken(user);
      doModalClose();
    };

    const saveToken = (u, ak, hash, exp) => {
      doSaveToken(u, { accessKey: ak, secretKey: hash, expiration: exp });
    };

    useEffect(() => {
      if (user4Token === undefined || user4Token === null) {
        setUser(authData.email);
        doFetchToken(authData.email);
      } else {
        setUser(user4Token);
        doFetchToken(user4Token);
      }
    }, []);

    useEffect(() => {
      if (
        accessKey == null ||
        accessKey.length == 0 ||
        (accessKey !== null && accessKey != tokenStore.token.accessKey)
      ) {
        setValue('accessKey', tokenStore.token.accessKey);
        setAccessKey(tokenStore.token.accessKey);
      } else {
      }
      if (expiration == null || (expiration !== null && expiration != tokenStore.token.expiration)) {
        try {
          if (tokenStore.token.expiration !== null && tokenStore.token.expiration.length > 0) {
            let result = new Date(tokenStore.token.expiration);
            setValue('expiration', result.toLocaleString());
          } else {
            setValue('expiration', '');
          }
        } catch (e) {
          console.error(e);
        }
      }
      console.log(tokenStore);
    }, [tokenStore]);

    useEffect(() => {
      setFocus(errors?.[Object.keys(errors)[0]]?.['ref']?.['id']);
    }, [errors, setFocus]);

    return (
      <ModalContent title='Configure API Token'>
        <FormProvider {...methods}>
          {errors && <ErrorSummary errors={errors} modalID='addUsersFormModal' type='modal' />}
          <section className='modal-body margin-bottom-2' id='addUsersFormModal'>
            <div className='container-fluid margin-top-1'>
              <Alert noIcon slim className='callout'>
                Tokens will need to be refreshed every 60 days.
              </Alert>
            </div>
            <div className='container-fluid margin-top-1'>
              <Button
                isOutline
                size='small'
                variant='info'
                text='Generate Token'
                icon={<Icon path={mdiAccountKey} />}
                handleClick={() => createToken()}
              />
              <Button
                isOutline
                style={{ visibility: accessKey !== null && accessKey.length > 0 ? 'visible' : 'hidden' }}
                size='small'
                variant='info'
                text='Delete Token'
                icon={<Icon path={mdiDelete} />}
                handleClick={() => deleteToken()}
              />
            </div>
            <div className='container-fluid margin-top-1'>
              <Grid row gap='md'>
                <Grid tablet={{ col: 6 }}>
                  <TextInput name='accessKey' label='Token Access Key' showOptionalText={false} readOnly={true} />
                </Grid>
                <Grid tablet={{ col: 6 }}>
                  <TextInput name='expiration' label='Token Expires On' showOptionalText={false} readOnly={true} />
                </Grid>
              </Grid>
              <Grid row gap='md' style={{ visibility: isValid ? 'visible' : 'hidden' }}>
                <Grid tablet={{ col: 6 }}>
                  <TextInputWClipboard
                    name='secretKey'
                    label='Token Secret Key'
                    showOptionalText={false}
                    readOnly={true}
                  />
                </Grid>
                <Grid tablet={{ col: 6 }}>
                  <div className='token-notice'>
                    {' '}
                    Copy the secret key, it will not be available after you close this window.
                  </div>
                </Grid>
              </Grid>
            </div>
          </section>
          <ModalFooter
            cancelText='Close'
            showSaveButton={false}
            showCancelButton
            saveIsDisabled={!isValid}
            onSave={() => saveToken()}
          />
        </FormProvider>
      </ModalContent>
    );
  }
);

export default TokenFormModal;
