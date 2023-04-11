import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import Button from 'src/components/Button';
import FormInput from 'src/components/InputField/FormInput';

interface IFormInput {
  otp: string;
}

interface OTPProps {
  btnText?: string;
  disabled?: boolean;
  placeholderText?: string;
  onSave: (otp: number) => void;
}
const OTP: React.FC<OTPProps> = ({ btnText, disabled, placeholderText = 'Verification Code', onSave }) => {
  const { control, handleSubmit } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = data => onSave(+data.otp);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name='otp'
        control={control}
        defaultValue=''
        rules={{
          required: 'This field is required',
        }}
        render={({ field: { name, value, onChange }, fieldState: { error } }) => (
          <FormInput
            type='text'
            placeholder={placeholderText}
            name={name}
            value={value}
            onChange={onChange}
            error={error?.message}
            disabled={disabled}
          />
        )}
      />

      <div className='mb-2'>
        <Button type='submit' gradient bold full loading={disabled} disabled={disabled}>
          {btnText || 'Verify'}
        </Button>
      </div>
    </form>
  );
};

export default OTP;
