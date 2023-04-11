import dayjs from 'dayjs';
import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { IToken } from 'src/types';
import CONFIG from 'src/config.env';
import { authUser } from 'src/providers';
import Button from 'src/components/Button';
import { showToast } from 'src/utils/Toast';
import Heading from 'src/components/Heading';
import FormError from 'src/components/FormError';
import { errorHandler } from 'src/utils/helpers';
import Datepicker from 'src/components/Datepicker';
import { useAuthActions } from 'src/providers/auth';
import { useProtectedNft } from 'src/hooks/useProtectedNft';

interface IFormData {
  successionDays: string;
}

const UpdateTimer: React.FC = () => {
  const authActions = useAuthActions();
  const [auth, setAuth] = useRecoilState(authUser);
  const { updateProtectionTimer } = useProtectedNft();
  const { user } = useRecoilValue(authUser) as IToken;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>();

  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<IFormData> = async data => {
    try {
      setLoading(true);
      await updateProtectionTimer({
        variables: {
          days: Number(data.successionDays),
        },
      });
      showToast({ message: 'Successfully updated succession days', type: 'success' });
      const temp: IToken = JSON.parse(JSON.stringify(auth));
      if (temp.user?.protectionTimer) {
        temp.user.protectionTimer = dayjs().add(Number(data.successionDays), 'days').valueOf();
      }
      setAuth(temp);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  if (authActions.isUserOnFreePlan) return null;

  return (
    <div className='flex-col my-10 flex-center md:flex-row md:flex-between'>
      <Heading type='subheading' text='Change Succession Days' className='mb-0 text-center sm:text-left' />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='gap-2 flex-center'>
          <Controller
            name='successionDays'
            control={control}
            defaultValue={`${user?.protectionDays || CONFIG.MIN_SUCCESSION_DAYS || ''}`}
            rules={{
              required: 'This field is required',
            }}
            render={({ field: { name, value, onChange } }) => (
              <div className='w-full'>
                <Datepicker
                  name={name}
                  placeholderText='Set Succession Days'
                  onChange={date => {
                    const days = dayjs(date).diff(dayjs(), 'days');
                    onChange(`${days}`);
                  }}
                  selected={dayjs()
                    .add(Number(value || user?.protectionDays || CONFIG.MIN_SUCCESSION_DAYS) + 1, 'days')
                    .toDate()}
                  minDate={dayjs()
                    .add(Number(CONFIG.MIN_SUCCESSION_DAYS) + 1, 'days')
                    .toDate()}
                  days={value || CONFIG.MIN_SUCCESSION_DAYS}
                  disabled={loading}
                />
              </div>
            )}
          />
          <Button type='submit' textSize='sm' btnText='Set' disabled={loading} loading={loading} className='w-24 rounded-lg' />
        </div>
        <FormError error={errors.successionDays} />
      </form>
    </div>
  );
};

export default UpdateTimer;
