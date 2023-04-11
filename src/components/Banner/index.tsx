import * as React from 'react';
import classnames from 'classnames/bind';
import { BiBadgeCheck, BiError, BiErrorAlt, BiInfoCircle, BiX } from 'react-icons/bi';

interface BannerType {
  type: keyof typeof data;
  text?: string;
  sticky?: boolean;
  className?: string;
}

const data = {
  error: {
    color: 'bg-red-600',
    icon: <BiErrorAlt />,
  },
  info: {
    color: 'bg-indigo-600',
    icon: <BiInfoCircle />,
  },
  success: {
    color: 'bg-green-600',
    icon: <BiBadgeCheck />,
  },
  warning: {
    color: 'bg-yellow-600',
    icon: <BiError />,
  },
};

const Banner: React.FC<BannerType> = ({ type, text, sticky = false, className = '', children }) => {
  const [isDismissed, setIsDismissed] = React.useState(false);

  return !isDismissed ? (
    <div
      className={classnames(`${data[type].color} ${className}`, {
        'sticky top-0 z-50': sticky,
      })}
    >
      <div className='p-2 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='gap-4 text-white fill-white flex-between'>
          <div className='flex items-center'>
            {data[type].icon}
            <p className='ml-3 text-sm truncate'>{text}</p>
            {children}
          </div>
          <div onClick={() => setIsDismissed(true)} className='cursor-pointer'>
            <BiX fill='white' />
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Banner;
