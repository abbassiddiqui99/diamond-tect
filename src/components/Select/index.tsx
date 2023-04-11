import * as React from 'react';
import { HiCheck, HiSelector } from 'react-icons/hi';
import { Listbox, Transition } from '@headlessui/react';

interface SelectType {
  value: string;
  options: string[];
  disabled?: boolean;
  onChange: (value: string) => void;
}

const Select: React.FC<SelectType> = ({ value, options, disabled, onChange }) => {
  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className='relative'>
        <Listbox.Button className='relative w-full p-4 text-left rounded-full cursor-pointer bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-secondary-blue focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm'>
          <span className='block truncate'>{value}</span>
          <span className='absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none'>
            <HiSelector size={20} className='text-slate-600' aria-hidden='true' />
          </span>
        </Listbox.Button>
        <Transition
          as={React.Fragment}
          enter='transition ease-in-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Listbox.Options className='absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-64 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
            {options.map((option, optionIdx) => (
              <Listbox.Option
                key={optionIdx}
                className={({ active }) =>
                  `${active ? 'text-white bg-secondary-blue' : 'text-gray-900'}
                cursor-default select-none relative py-2 pl-10 pr-4`
                }
                value={option}
              >
                {({ selected, active }) => (
                  <>
                    <span className={`${selected ? 'font-semibold' : 'font-normal'} block truncate`}>{option}</span>
                    {selected ? (
                      <span
                        className={`${active ? 'text-white' : 'text-secondary-blue'}
                      absolute inset-y-0 left-0 flex items-center pl-3`}
                      >
                        <HiCheck size={20} aria-hidden='true' />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default Select;
