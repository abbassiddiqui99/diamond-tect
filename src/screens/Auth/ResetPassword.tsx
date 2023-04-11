import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import Button from 'src/components/Button';
import Heading from 'src/components/Heading';
import { ResetPasswordData } from 'src/types';
import { useAuthActions } from 'src/providers/auth';
import { ROUTES } from 'src/constant/NavigationConstant';
import FormInput from 'src/components/InputField/FormInput';
import { resetPasswordFields } from 'src/constant/AuthConstants';
import useOnSubmit from 'src/hooks/useOnSubmit';
import AuthCardLayout from 'src/components/Auth/AuthCardLayout';

const ResetPassword = () => {
  const navigate = useNavigate();
  const authActions = useAuthActions();
  const { control, handleSubmit, getValues } = useForm<ResetPasswordData>();
  const { loading, onSubmit: handleOnSubmit } = useOnSubmit(authActions.resetPassword);

  const onSubmit: SubmitHandler<ResetPasswordData> = async data => {
    await handleOnSubmit({
      newpassword: data.password,
    });
    navigate(ROUTES.LOGIN);
  };
  return (
    <AuthCardLayout heading='Reset Password'>
      <form onSubmit={handleSubmit(onSubmit)} className='mt-10'>
        {resetPasswordFields?.map(item => {
          const details = typeof item === 'function' ? item(getValues) : item;
          return (
            <React.Fragment key={details.title}>
              <Heading text={details.title} type='heading' />
              <Controller
                name={details.name as keyof ResetPasswordData}
                control={control}
                defaultValue=''
                rules={details.rules}
                render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                  <FormInput
                    type='password'
                    placeholder={details.placeholder}
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
        <Button type='submit' btnText='Reset Password' textSize='lg' bold full gradient disabled={loading} loading={loading} />
      </form>
    </AuthCardLayout>
  );
};

export default ResetPassword;
