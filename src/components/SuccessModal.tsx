import { PoweredBySpan } from '@/components/IntroForm';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { Fragment, useState } from 'react';

interface SuccessModalProps {
  count: number;
  setOpen: () => void;
}
const SuccessModal: React.FC<SuccessModalProps> = ({ count, setOpen }) => {
  return (
    <Transition.Root show={!!count} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative  max-w-2xl transform overflow-hidden rounded-lg bg-purple px-4 pt-5 pb-4 text-left text-white shadow-xl transition-all sm:my-8 sm:w-full sm:p-6'>
                <div className='flex items-center space-x-4'>
                  <img src='/images/done.png' alt='' />
                  <div>
                    {count && (
                      <h3 className='text-3xl font-semibold'>
                        Yay! you removed <br />
                        <span className='text-yellow'>
                          {count} server{count > 1 ? 's' : ''}
                        </span>
                      </h3>
                    )}
                  </div>
                  <a
                    href='https://onchain.build'
                    target='_blank'
                    rel='noreferrer'
                    className='absolute bottom-2 right-2 scale-75 transform opacity-40 transition-opacity duration-300 hover:opacity-100'
                  >
                    <PoweredBySpan />
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SuccessModal;
