import classnames from 'classnames/bind';
import FormError from 'src/components/FormError';

interface TextareaType extends React.ComponentProps<'textarea'> {
  error?: string;
  className?: string;
  expandable?: boolean;
}

const FormTextarea: React.FC<TextareaType> = ({ rows = 5, error, className = '', expandable = false, ...rest }) => {
  return (
    <div className='my-3'>
      <textarea
        rows={rows}
        className={classnames(
          `relative block w-full p-4 text-gray-900 placeholder-gray-700 rounded-2xl appearance-none resize-none bg-slate-100 sm:text-sm ${className}`,
          { 'resize-y': expandable },
        )}
        {...rest}
      />
      <FormError error={error} />
    </div>
  );
};

export default FormTextarea;
