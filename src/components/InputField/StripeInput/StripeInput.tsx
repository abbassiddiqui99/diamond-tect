import classNames from 'classnames/bind';

interface IStripeInput {
  type: 'text' | 'password';
  label?: string;
  name?: string;
  value?: string;
  error?: string;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const StripeInput: React.FC<IStripeInput> = ({ type, disabled, error, label, name, value, onChange }) => {
  return (
    <div className='my-3'>
      <div className='mb-1 ml-1 flex-between'>
        <p className='text-xs text-gray-500'>{label}</p>
        {error ? <p className='text-xs text-red-500'>{error}</p> : null}
      </div>
      <input
        name={name}
        type={type}
        className={classNames('stripe-input', {
          'border-gray-300': !error,
          'border-red-500': error,
        })}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

export default StripeInput;
