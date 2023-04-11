import * as React from 'react';
import classNames from 'classnames/bind';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import FormError from 'src/components/FormError';

interface FormInputType extends React.ComponentProps<'input'> {
  name?: string;
  error?: string;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  icon?: React.ReactNode | null;
}

const FormInput: React.FC<FormInputType> = ({ name, value, placeholder, type, error, className = '', icon, onChange, ...rest }) => {
  const [showPass, setShowPass] = React.useState(false);
  const [isFocus, setIsFocus] = React.useState(false);

  return (
    <div className='my-3'>
      <div
        className={classNames('gap-4 px-4 text-gray-900 rounded-full flex-center bg-slate-100', {
          'shadow-[0_0_0_0.1rem_rgba(94,70,248,1)]': isFocus,
        })}
      >
        <input
          name={name}
          type={showPass ? 'text' : type}
          className={`relative focus:outline-none block py-4 w-full bg-slate-100 placeholder-gray-700 rounded-full appearance-none sm:text-sm ${className}`}
          placeholder={placeholder}
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={onChange}
          {...rest}
        />

        {icon ? icon : null}

        {type === 'password' ? (
          <div className='cursor-pointer' onClick={() => setShowPass(!showPass)}>
            {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </div>
        ) : null}
      </div>
      <FormError error={error} />
    </div>
  );
};

export default FormInput;
