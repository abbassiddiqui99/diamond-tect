import * as React from 'react';
import classnames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import Button from 'src/components/Button';
import FormInput from 'src/components/InputField/FormInput';
import AuthCardLayout from 'src/components/Auth/AuthCardLayout';

import { ROUTES } from 'src/constant/NavigationConstant';
import { registerFields } from 'src/constant/AuthConstants';
import useOnSubmit from 'src/hooks/useOnSubmit';
import { useAuthActions } from 'src/providers/auth';
import { SignUpData } from 'src/types';
import ReCAPTCHA from 'react-google-recaptcha';
import CONFIG from 'src/config.env';

const Register: React.FC = () => {
  const authActions = useAuthActions();

  const navigate = useNavigate();
  const { control, handleSubmit, getValues } = useForm<SignUpData>();
  const { loading, onSubmit: handleOnSubmit } = useOnSubmit(authActions.register);
  const [token, setToken] = React.useState<string>();
  const [captchaErr, setCaptchaErr] = React.useState('');

  const onSubmit: SubmitHandler<SignUpData> = async data => {
    if (token) {
      const success = await handleOnSubmit(data);
      if (success) {
        navigate(ROUTES.VERIFY_EMAIL);
      }
    } else {
      setCaptchaErr('Please check Captcha');
    }
  };

  const onTokenChange = (value: string | null) => {
    if (value) {
      setToken(value);
      setCaptchaErr('');
    }
  };

  return (
    <AuthCardLayout heading='Register'>
      <form onSubmit={handleSubmit(onSubmit)} className='mt-10'>
        {registerFields?.map(item => {
          const details = typeof item === 'function' ? item(getValues) : item;
          return (
            <Controller
              key={details.title}
              name={details.name as keyof SignUpData}
              control={control}
              defaultValue=''
              rules={details.rules}
              render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                <FormInput
                  type={details.name.toLowerCase().includes('password') ? 'password' : 'text'}
                  placeholder={details.title}
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error?.message}
                  disabled={loading}
                />
              )}
            />
          );
        })}
        <ReCAPTCHA className='my-5 flex-center' onChange={onTokenChange} sitekey={CONFIG.GOOGLE_RECAPTCHA} />
        {captchaErr ? <p className='text-sm text-center text-red-500'>{captchaErr}</p> : null}
        <Button type='submit' btnText='Register' bold full gradient disabled={loading} loading={loading} />
        <div className='text-sm text-center'>
          Already have an account?{' '}
          <Link
            to={ROUTES.LOGIN}
            className={classnames('font-semibold underline text-secondary-blue', {
              'disable-link': loading,
            })}
          >
            Login
          </Link>
        </div>
      </form>
    </AuthCardLayout>
  );
};

export default Register;
