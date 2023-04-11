import classnames from 'classnames/bind';
import { BsFillQuestionCircleFill } from 'react-icons/bs';

interface TooltipType {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  bgColor?: string;
  textColor?: string;
  icon?: React.ReactNode;
}

const Tooltip: React.FC<TooltipType> = ({ text, position = 'top', icon, bgColor = '', textColor = '' }) => {
  return (
    <div className='relative flex-col flex-center group'>
      {icon ? icon : <BsFillQuestionCircleFill className='fill-gray-500' />}
      {/* Tooltip container */}
      <div
        className={classnames('absolute fade-in z-10 items-center hidden group-hover:flex', {
          'bottom-0 mb-6 flex-col ': position === 'top',
          'top-0 mt-6 flex-col ': position === 'bottom',
          'right-0 mr-6 flex flex-row': position === 'left',
          'left-0 ml-6 flex flex-row': position === 'right',
        })}
      >
        {/* Bottom or right Arrow */}
        {position === 'bottom' ? (
          <div
            className={classnames(`w-3 h-3 -mb-2 rotate-45 ${bgColor}`, {
              'bg-gray-700': !bgColor,
            })}
          />
        ) : null}
        {position === 'right' ? (
          <div
            className={classnames(`w-3 h-3 ml-2 -mr-2 rotate-45 ${bgColor}`, {
              'bg-gray-700': !bgColor,
            })}
          />
        ) : null}

        {/* Text Container */}
        <span
          className={classnames(`relative z-10 p-2 text-xs leading-none rounded-lg shadow-lg whitespace-nowrap ${bgColor} ${textColor}`, {
            'bg-gray-700': !bgColor,
            'text-white': !textColor,
          })}
        >
          {text}
        </span>

        {/* Left or Top Arrow */}
        {position === 'left' ? (
          <div
            className={classnames(`w-3 h-3 -ml-2 rotate-45 ${bgColor}`, {
              'bg-gray-700': !bgColor,
            })}
          />
        ) : null}

        {position === 'top' ? (
          <div
            className={classnames(`w-3 h-3 -mt-2 rotate-45 ${bgColor}`, {
              'bg-gray-700': !bgColor,
            })}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Tooltip;
