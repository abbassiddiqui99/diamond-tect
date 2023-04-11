import * as React from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import Button from 'src/components/Button';
import Heading from 'src/components/Heading';
import { ChangePasswordData } from 'src/types';
import { CHANGE_PASSWORD } from 'src/graphql/mutation';
import FormInput from 'src/components/InputField/FormInput';
import { changePasswordFields } from 'src/constant/AuthConstants';
import { PROTECTED_ROUTES } from 'src/constant/NavigationConstant';
import { createLoadingToast, dismissToast, showToast, updateToast } from 'src/utils/Toast';

const Password: React.FC = () => {
  const navigate = useNavigate();
  const [changePasswordMutation, { loading }] = useMutation(CHANGE_PASSWORD);
  const { control, handleSubmit, getValues, reset } = useForm<ChangePasswordData>();

  const onSubmit: SubmitHandler<ChangePasswordData> = async value => {
    const toastId = createLoadingToast();
    try {
      await changePasswordMutation({
        variables: {
          changePasswordData: {
            oldpassword: value.oldPassword,
            newpassword: value.password,
          },
        },
      });
      reset();
      dismissToast(toastId);
      showToast({
        message: 'Password change successfully',
        type: 'success',
      });
      navigate(PROTECTED_ROUTES.PROFILE);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      updateToast({ id: toastId, message: error?.graphQLErrors[0]?.extensions?.exception?.response?.error });
    }
  };

  return (
    <div className='max-w-2xl mx-auto mt-10'>
      <form onSubmit={handleSubmit(onSubmit)}>
        {changePasswordFields?.map(item => {
          const details = typeof item === 'function' ? item(getValues) : item;
          return (
            <React.Fragment key={details.name}>
              <Heading text={details.title} type='subheading' className='mb-0 text-center sm:text-left' />
              <Controller
                key={details.title}
                name={details.name as keyof ChangePasswordData}
                control={control}
                defaultValue=''
                rules={details.rules}
                render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                  <FormInput
                    type='password'
                    placeholder={details.title}
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
        <Button type='submit' btnText='Save' disabled={loading} loading={loading} full />
      </form>
    </div>
  );
};

export default Password;
