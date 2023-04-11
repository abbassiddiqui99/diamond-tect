import React from 'react';
import classnames from 'classnames/bind';
import { TiTimes } from 'react-icons/ti';
import { Dialog, Transition } from '@headlessui/react';

import Button from 'src/components/Button';
import Heading from 'src/components/Heading';

interface PopupModalType {
  show: boolean;
  text?: string;
  title?: string;
  large?: boolean;
  btnText?: string;
  closeBtn?: boolean;
  persistent?: boolean;
  noOverflow?: boolean;
  onClose?: () => void;
}

const PopupModal: React.FC<PopupModalType> = ({
  show,
  title,
  large,
  text,
  btnText,
  closeBtn,
  noOverflow = false,
  persistent = false,
  onClose,
  children,
}) => {
  const closeModal = () => {
    if (!persistent && onClose) {
      onClose();
    }
  };

  return (
    <Transition appear show={show} as={React.Fragment}>
      <Dialog as='div' className='fixed inset-0 z-30 overflow-y-auto' onClose={closeModal}>
        <div className='min-h-screen px-4 text-center'>
          <Transition.Child
            as={React.Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-opacity-50 bg-slate-900' />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className='inline-block h-screen align-middle' aria-hidden='true'>
            &#8203;
          </span>
          <Transition.Child
            as={React.Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <div
              className={classnames(
                'inline-block w-full p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl',
                {
                  'overflow-hidden': !noOverflow,
                  'max-w-5xl': large,
                  'max-w-md': !large,
                },
              )}
            >
              <div
                className={classnames('flex', {
                  'justify-between': title,
                  'justify-end': !title,
                })}
              >
                {title ? (
                  <Dialog.Title>
                    <Heading text={title} type='subheading' />
                  </Dialog.Title>
                ) : null}
                {closeBtn ? <TiTimes size={24} onClick={onClose} className='cursor-pointer' /> : null}
              </div>

              {text ? (
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>{text}</p>
                </div>
              ) : null}

              {btnText ? <Button onClick={onClose} btnText={btnText} /> : null}

              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PopupModal;
