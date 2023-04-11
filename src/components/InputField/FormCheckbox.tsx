type FormCheckboxType = {
  name?: string;
  label?: string;
  checked?: boolean;
  error?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const FormCheckbox: React.FC<FormCheckboxType> = ({ name, label, checked, error, onChange }) => {
  return (
    <>
      <div className='flex items-center'>
        <input
          name={name}
          type='checkbox'
          checked={checked}
          onChange={onChange}
          className='w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
        />
        <label className='block ml-2 text-sm text-gray-900'>{label}</label>
      </div>
      <div className='mb-3'>{error ? <p className='ml-1 text-xs text-red-500 '>{error}</p> : null}</div>
    </>
  );
};

export default FormCheckbox;
