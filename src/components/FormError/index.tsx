import { FieldError } from 'react-hook-form';
import { AiOutlineWarning } from 'react-icons/ai';

const FormError: React.FC<{ error?: string | FieldError }> = ({ error }) => {
  if (!error) return null;

  return (
    <div className='flex items-center gap-1 mt-1 ml-2 text-xs text-red-500'>
      <div>
        <AiOutlineWarning />
      </div>
      <p>{error}</p>
    </div>
  );
};

export default FormError;
