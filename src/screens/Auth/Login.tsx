import * as React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames/bind';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import Button from 'src/components/Button';
import Heading from 'src/components/Heading';
import FormInput from 'src/components/InputField/FormInput';
import AuthCardLayout from 'src/components/Auth/AuthCardLayout';

import { loginFields } from 'src/constant/AuthConstants';
import { ROUTES } from 'src/constant/NavigationConstant';

import CONFIG from 'src/config.env';
import { SignUpData } from 'src/types';
import { showToast } from 'src/utils/Toast';
import { IFormInput } from 'src/types/auth';
import useOnSubmit from 'src/hooks/useOnSubmit';
import { useAuthActions } from 'src/providers/auth';

const FormBottom: React.FC<{ onTokenChange: (value: string | null) => void; loading: boolean; error?: string }> = ({
  onTokenChange,
  loading,
  error,
}) => (
  <div className='text-sm'>
    <div className='flex justify-end'>
      <Link
        to={ROUTES.FORGOT_PASSWORD}
        className={classnames('underline text-secondary-blue', {
          'disable-link': loading,
        })}
      >
        Forgot your password?
      </Link>
    </div>
    <ReCAPTCHA className='my-5 flex-center' onChange={onTokenChange} sitekey={CONFIG.GOOGLE_RECAPTCHA} />
    {error ? <p className='text-sm text-center text-red-500'>{error}</p> : null}

    <Button type='submit' btnText='Login' textSize='lg' bold full gradient disabled={loading} loading={loading} />
    <div className='text-center'>
      Don’t Have an account yet?{' '}
      <Link
        to={ROUTES.REGISTER}
        className={classnames('font-semibold underline text-secondary-blue', {
          'disable-link': loading,
        })}
      >
        Sign up now
      </Link>
    </div>
  </div>
);

const Login = () => {
  const authActions = useAuthActions();
  const { control, handleSubmit } = useForm<IFormInput>();
  const { loading, onSubmit: handleOnSubmit } = useOnSubmit(authActions.login);
  const [token, setToken] = React.useState<string>();
  const [captchaErr, setCaptchaErr] = React.useState('');

  const sessionMessage = localStorage.getItem('sessionMessage');
  if (sessionMessage) {
    showToast({ type: 'info', message: sessionMessage });
    localStorage.clear();
  }

  const onSubmit: SubmitHandler<SignUpData> = async data => {
    if (token) {
      await handleOnSubmit(data);
    } else {
      setCaptchaErr('Please check Captcha');
    }
  };

  const onTokenChange = (value: string | null) => {
    if (value) {
      setCaptchaErr('');
      setToken(value);
    }
  };

  return (
    <AuthCardLayout heading='Login'>
      <form onSubmit={handleSubmit(onSubmit)} className='mt-10'>
        {loginFields?.map(item => {
          return (
            <React.Fragment key={item.name}>
              <Heading text={item.title} type='heading' />
              <Controller
                name={item.name as keyof IFormInput}
                control={control}
                defaultValue=''
                rules={item.rules}
                render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                  <FormInput
                    type={item.name === 'password' ? 'password' : 'text'}
                    placeholder={item.placeholder}
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                    disabled={loading}
                  />
                )}
              />
            </React.Fragment>
          );
        })}
        <FormBottom loading={loading} onTokenChange={onTokenChange} error={captchaErr} />
      </form>
    </AuthCardLayout>
  );
};

export default Login;
