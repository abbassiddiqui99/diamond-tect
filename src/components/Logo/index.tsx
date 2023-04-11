import { ReactComponent as HeeraLogo } from 'src/assets/svgs/HeeraLogo.svg';
import { ReactComponent as HeeraIcon } from 'src/assets/svgs/HeeraIcon.svg';

const Logo: React.FC = () => {
  return (
    <span className='flex items-center gap-2 py-6'>
      <HeeraIcon className='block w-10 h-10 sm:hidden' /> {/* Icon only for smaller screens */}
      <div className='hidden w-52 h-fit sm:block'>
        <HeeraLogo /> {/* Complete Logo for larger screens */}
      </div>
    </span>
  );
};

export default Logo;
