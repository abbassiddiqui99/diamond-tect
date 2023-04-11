import * as React from 'react';
import classNames from 'classnames/bind';
import { BsFillCalendar2Fill } from 'react-icons/bs';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import FormError from 'src/components/FormError';

interface DatepickerProps extends ReactDatePickerProps {
  error?: string;
  days?: string | number;
  className?: string;
}

const Datepicker: React.FC<DatepickerProps> = ({
  selected,
  days,
  minDate,
  disabled,
  dateFormat = 'yyyy-MM-dd',
  error,
  className = '',
  onChange,
}) => {
  const CustomInput = (props: React.HTMLProps<HTMLInputElement>, ref: React.Ref<HTMLInputElement>) => {
    return (
      <div
        className={classNames(`h-12 gap-3 border-2 rounded-lg flex-center border-secondary-blue ${className}`, {
          'cursor-not-allowed': disabled,
          'cursor-pointer': !disabled,
        })}
        onClick={props.onClick}
        ref={ref}
      >
        <div className='text-gray-500'>
          <BsFillCalendar2Fill />
        </div>
        <div className='text-gray-900 border-gray-300 rounded-lg sm:text-sm focus:ring-blue-500 focus:border-blue-500'>{days} Days</div>
      </div>
    );
  };

  return (
    <>
      <DatePicker
        selected={selected}
        minDate={minDate}
        onChange={onChange}
        dateFormat={dateFormat}
        customInput={React.createElement(React.forwardRef(CustomInput))}
        disabled={disabled}
      />
      <FormError error={error} />
    </>
  );
};

export default Datepicker;
