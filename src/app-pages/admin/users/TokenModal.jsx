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
import { generateToken, hash } from '@src/utils/tokenHelpers'

import { ValidationMessages } from '@src/utils/enums';

const defaultValues = {
  accessKey: '',
  secretKey: '',
  secretHash: '',
  expiration: '',
};

const schema = yup.object().shape({
  accessKey: yup.string(),
  secretKey: yup.string(),
  expiration: yup.string(),
});

const TokenFormModal = connect(
  'doModalClose',
  'selectAuthData',
  'selectTokenStoreToken',
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
      const ak = generateToken(8)
      setAccessKey(ak);
      setValue('accessKey',ak);
      const sk = generateToken(24);
      setSecretKey(sk);
      setValue('secretKey',sk);
      hash(sk,setSecretHash);
      let result = new Date();
      result.setDate(result.getDate() + 60)
      setValue('expiration',result.toLocaleString());
      setExpiration(result);
      // useEffect(()=>{
      //   setValue('expiration',expiration);
      // },[expiration]);
    };

    const deleteToken = () => {
      doDeleteToken(user.email);
      setAccessKey('');
      setSecretKey('');
      setExpiration('');
      setValue('accessKey','');
      setValue('secretKey','');
      setValue('expiration','');
      doModalClose();
    };

    const saveToken = () => {
      doSaveToken(user.email, { accessKey:accessKey, secretKey:secretHash, expiration:expiration })
    }

    useEffect(() => {
    //   doFetchToken(user.email);
    //   if(accessKey === null){
    //     console.log(selectTokenStoreToken);
    //   }
      if(user4Token === undefined || user4Token === null ){
        setUser(authData);
      } else {
        setUser(user4Token);
      }
    }, [setUser]);

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
              <Grid row gap='md'>
                <Grid tablet={{ col: 6 }}>
                  <TextInputWClipboard name='secretKey' label='Token Secret Key' showOptionalText={false} readOnly={true} />
                </Grid>
              </Grid>
            </div>
          </section>
          <ModalFooter cancelText="Close" showCancelButton saveIsDisabled={!isValid} onSave={() => saveToken()} />
        </FormProvider>
      </ModalContent>
    );
  }
);

export default TokenFormModal;
