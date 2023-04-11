import * as React from 'react';
import classnames from 'classnames/bind';
import { Disclosure } from '@headlessui/react';
import { HiChevronDown } from 'react-icons/hi';

import Heading from 'src/components/Heading';

interface DetailsTabType {
  title: string;
  className?: string;
  defaultOpen?: boolean;
  openDisclosure?: boolean;
  setOpenDisclosure?: React.Dispatch<React.SetStateAction<boolean>>;
}
const DetailsTab: React.FC<DetailsTabType> = ({ title, defaultOpen, className = '', children, openDisclosure, setOpenDisclosure }) => {
  const ref = React.useRef(null);
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open, close }: { open: boolean; close: (ref?: HTMLElement) => void }) => (
        <div
          className={className}
          onClick={() => {
            if (openDisclosure && setOpenDisclosure) {
              setOpenDisclosure(false);
              close();
            }
          }}
        >
          <Disclosure.Button className='flex w-full gap-4 group' ref={ref}>
            <Heading type='base' text={title} className='text-left' />
            <HiChevronDown
              size={24}
              className={classnames('group-hover:fill-black transition fill-gray-400', {
                'transform rotate-180': open,
              })}
            />
          </Disclosure.Button>
          {open || openDisclosure ? <Disclosure.Panel static>{children}</Disclosure.Panel> : null}
        </div>
      )}
    </Disclosure>
  );
};

export default DetailsTab;
