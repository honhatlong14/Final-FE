import { connect } from 'react-redux';
import React, { useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout, getNewToken } from '../store/actions/authenticateAction';
import Modal from './modal';
//import Profile from "../screens/users/profile";

import images from '../assets/images';
import Password from './password';
import Form from './form';
import Button from './button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import ErrorMessageCustom from './errorMessage';
import { changePassword, tokenRequestInterceptor } from '../apiServices/';
import { toast } from 'react-toastify';
import config from '../config';
import { FaBeer } from "react-icons/fa";

const passwordChangeSchema = yup.object({
  oldPassword: yup.string().required('Old password must be filled'),
  newPassword: yup
    .string()
    .required('No password provided.')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
});

const Navbar = ({ authenticateReducer, doLogout, getNewTokenRequest }) => {
  const { isAuthenticated, user, token } = authenticateReducer;
  const { refreshToken, jwtToken } = authenticateReducer;
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const location = useLocation();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    resolver: yupResolver(passwordChangeSchema),
  });

  const navigation = [
    { name: 'Ideas', href: '/ideas', current: location.pathname === '/ideas' },
    {
      name: 'Contribute',
      href: '/contribute',
      current: location.pathname === '/contribute',
    },
  ];

  const toggleChangePassword = (e) => {
    setShowChangePassword((prev) => !prev);
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  const handleChangePassword = async (formData) => {
    const changePasswordFunc = async () => {
      const changePasswordRetry = async () => {
        const { data, status } = await changePassword(formData, token);
        return { data, status };
      };
      const { status, data } = await tokenRequestInterceptor(changePasswordRetry, getNewTokenRequest);
      if (status === 200) {
        setShowChangePassword((prev) => !prev);
        reset({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        toast.success('Password Changed');
      } else {
        toast.error(data.message);
      }
    };
    changePasswordFunc();
  };

  const handleLogout = (e) => {
    e.preventDefault();
    doLogout(refreshToken, jwtToken);
  };

  const editUserHandler = (e, id) => {
    e.preventDefault();
    setUserId(id);
    setOpen((prev) => !prev);
  };

  return (
    <>
      <Disclosure as='nav' className='bg-gray-800'>
        {({ open }) => (
          <>
            <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
              <div className='relative flex items-center justify-between h-16'>
                <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
                  {/* Mobile menu button*/}
                  <Disclosure.Button className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
                    <span className='sr-only'>Open main menu</span>
                    {open ? (
                      <FaBeer className='block h-6 w-6' aria-hidden='true' />
                    ) : (
                      <FaBeer className='block h-6 w-6' aria-hidden='true' />
                    )}
                  </Disclosure.Button>
                </div>
                <div className='flex-1 flex items-center justify-center sm:items-stretch sm:justify-start'>
                  <div className='cursor-pointer flex-shrink-0 flex items-center' onClick={() => navigate('/')}>
                    <img className='hidden lg:block h-10 w-10' src={images.logo} alt='Workflow' />
                  </div>
                  <div className='hidden sm:block sm:ml-6'>
                    <div className='flex space-x-4'>
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'px-3 py-2 rounded-md text-sm font-medium'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
                  {isAuthenticated ? (
                    <Menu as='div' className='ml-3 relative'>
                      <div>
                        <Menu.Button className='bg-gray-800 flex text-sm gap-1 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'>
                          <span className='sr-only'>Open user menu</span>
                          <span className='font-medium text-white'>Hello, {user.fullname}</span>
                          <img className='h-8 w-8 rounded-full' src={user?.avatar || images.logo} alt='Menu' />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter='transition ease-out duration-100'
                        enterFrom='transform opacity-0 scale-95'
                        enterTo='transform opacity-100 scale-100'
                        leave='transition ease-in duration-75'
                        leaveFrom='transform opacity-100 scale-100'
                        leaveTo='transform opacity-0 scale-95'
                      >
                        <Menu.Items className='origin-top-right z-50 absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={(e) => editUserHandler(e, authenticateReducer?.user?.id)}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700 w-full text-left'
                                )}
                              >
                                Your Profile
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={toggleChangePassword}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700 w-full text-left'
                                )}
                              >
                                Change Password
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <span
                                onClick={handleLogout}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                                )}
                              >
                                Sign out
                              </span>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <div className='flex gap-x-8'>
                      <Link
                        to={config.routes.login}
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                      >
                        Login
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Disclosure.Panel className='sm:hidden'>
              <div className='px-2 pt-2 pb-3 space-y-1'>
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as='a'
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block px-3 py-2 rounded-md text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <Modal open={open} setOpen={setOpen}>
        {/*<Profile close={() => setOpen(!open)} userId={userId} />*/}
        {/* <EditUserPage close={() => setOpen(!open)} userId={userId} /> */}
      </Modal>
      <Modal open={showChangePassword} setOpen={setShowChangePassword}>
        <div className='w-screen sm:max-w-lg'>
          <Form title='Change Password'>
            <Password name='oldPassword' placeholder='Old Password' {...register('oldPassword')} />
            <ErrorMessage
              name='oldPassword'
              errors={errors}
              render={({ message }) => <ErrorMessageCustom message={message} />}
            />
            <Password name='newPassword' placeholder='New Password' {...register('newPassword')} />
            <ErrorMessage
              name='newPassword'
              errors={errors}
              render={({ message }) => <ErrorMessageCustom message={message} />}
            />
            <Password name='confirmPassword' placeholder='Confirm Password' {...register('confirmPassword')} />
            <ErrorMessage
              name='confirmPassword'
              errors={errors}
              render={({ message }) => <ErrorMessageCustom message={message} />}
            />
            <div className='w-3/5 flex flex-wrap justify-between items-center'>
              <Button
                onClick={handleSubmit(handleChangePassword)}
                role='submit'
                icon={FaBeer}
                type='primary'
                title='Save'
              />
              <Button icon={FaBeer} type='danger' title='Cancel' onClick={toggleChangePassword} />
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    authenticateReducer: state.authenticateReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    doLogout: (refreshToken, token) => dispatch(logout({ refreshToken, token })),
    getNewTokenRequest: () => dispatch(getNewToken()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
