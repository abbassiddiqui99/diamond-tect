import classnames from 'classnames/bind';
import Loader from 'src/assets/svgs/Loader';

interface ButtonType extends React.ComponentProps<'button'> {
  bold?: boolean;
  full?: boolean;
  btnText?: string;
  loading?: boolean;
  gradient?: boolean;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  preAppendIcon?: boolean;
  textSize?: 'sm' | 'base' | 'lg' | '2xl';
}

const Button: React.FC<ButtonType> = ({
  bold,
  icon,
  full,
  loading,
  btnText,
  gradient,
  preAppendIcon,
  className = '',
  textSize = 'base',
  children,
  ...rest
}) => {
  return (
    <button
      className={classnames(
        `px-3 h-12 my-3 transition ease-in-out rounded-full disabled:cursor-not-allowed disabled:opacity-50 text-${textSize} ${className}`,
        {
          'w-full': full,
          'font-semibold': bold,
          'primary-gradient text-white hover:opacity-90': gradient,
          'border-2 border-primary-blue hover:bg-gray-100': !gradient,
        },
      )}
      {...rest}
    >
      {loading ? (
        <div className='flex-center'>
          <Loader small color={gradient ? 'white' : 'black'} />
        </div>
      ) : (
        <>
          <div className='gap-2 flex-center'>
            {icon && preAppendIcon ? icon : null}
            {btnText ? btnText : null}
            {icon && !preAppendIcon ? icon : null}
          </div>
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
