import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import PropsType from 'prop-types';
import ReactDOM from 'react-dom';

const Modal = ({ open, setOpen, title, children, className, ...rest }) => {
    const cancelButtonRef = useRef(null);

    return ReactDOM.createPortal(
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as='div'
                className={`w-screen fixed z-10 inset-0 overflow-y-auto ${className || ''}`}
                initialFocus={cancelButtonRef}
                onClose={setOpen}
            >
                <div className='w-screen flex items-end justify-center min-h-screen text-center sm:block sm:p-0'>
                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                    >
                        <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
                    </Transition.Child>

                    <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                        enterTo='opacity-100 translate-y-0 sm:scale-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                        leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                    >
                        <div
                            style={{ width: '900px' }}
                            className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-max sm:w-full'
                        >
                            <div className='bg-white'>
                                <div className='w-full max-h-[40rem] overflow-y-auto'>
                                    <div className='text-center sm:mt-0 sm:text-left'>
                                        {title !== '' && (
                                            <Dialog.Title
                                                as='h3'
                                                className='text-lg leading-6 font-medium text-gray-900'
                                            >
                                                {title}
                                            </Dialog.Title>
                                        )}
                                        <div className='w-full mx-auto'>{children}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>,
        document.getElementById('app-modal')
    );
};

Modal.propsType = {
    open: PropsType.bool,
    setOpen: PropsType.func,
    title: PropsType.string,
    children: PropsType.element,
};

export default Modal;
