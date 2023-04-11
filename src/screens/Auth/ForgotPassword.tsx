import classNames from 'classnames';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import Button from 'src/components/Button';
import Heading from 'src/components/Heading';
import { emailField } from 'src/constant/AuthConstants';
import { ROUTES } from 'src/constant/NavigationConstant';
import FormInput from 'src/components/InputField/FormInput';
import { useAuthActions } from 'src/providers/auth';
import useOnSubmit from 'src/hooks/useOnSubmit';
import AuthCardLayout from 'src/components/Auth/AuthCardLayout';

interface IFormInput {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const authActions = useAuthActions();
  const { control, handleSubmit } = useForm<IFormInput>();
  const { loading, onSubmit: handleOnSubmit } = useOnSubmit(authActions.forgotPassword);

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    const success = await handleOnSubmit(data);
    if (success) {
      navigate(ROUTES.VERIFY_OTP);
    }
  };

  return (
    <AuthCardLayout heading='Forgot Password'>
      <form onSubmit={handleSubmit(onSubmit)} className='mt-10'>
        {emailField ? (
          <>
            <Heading text={emailField.title} type='heading' />
            <Controller
              name='email'
              control={control}
              defaultValue=''
              rules={emailField.rules}
              render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                <FormInput
                  type='text'
                  placeholder={emailField.placeholder}
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error?.message}
                  disabled={loading}
                />
              )}
            />
            <Button type='submit' btnText='Send Email' bold full gradient disabled={loading} loading={loading} />
            <Link
              to={ROUTES.LOGIN}
              className={classNames('text-sm text-gray-500 flex-center hover:text-gray-800', {
                'disable-link': loading,
              })}
            >
              Back to Login
            </Link>
          </>
        ) : null}
      </form>
    </AuthCardLayout>
  );
};

export default ForgotPassword;
