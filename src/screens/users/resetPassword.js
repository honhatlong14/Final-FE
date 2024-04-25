import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { resetPassword, validateResetToken } from '../../apiServices';
import ErrorMessageCustom from '../../components/errorMessage';
import Password from '../../components/password';
import config from '../../config';

const registerFormValidationSchema = yup.object({
    password: yup
        .string()
        .required('Mật khẩu không được để trống')
        .min(8, 'Mật khẩu quá ngắn - tối thiểu phải có 8 ký tự.')
        .matches(/[a-zA-Z]/, 'Mật khẩu chỉ có thể chứa các chữ cái Latinh.'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Mật khẩu phải trùng khớp'),
});

const ResetPassword = ({ jwtToken }) => {
    const jwtTokenState = useRef(jwtToken);
    // eslint-disable-next-line no-unused-vars
    const [tokenFromUrl, setTokenFromUrl] = useSearchParams();
    const token = tokenFromUrl.get('token');

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(registerFormValidationSchema),
    });

    const onSubmit = async (formData) => {
        const { data, status } = await resetPassword({ ...formData, token }, jwtTokenState);
        if (status === 200) {
            toast.success(data.message);
            setSuccess(true);
        } else {
            toast.error(data.message);
            setError('Có lỗi xảy ra!');
        }
    };

    useEffect(() => {
        (async () => {
            const { data, status } = await validateResetToken({ token }, jwtTokenState);
            if (status === 200) {
                toast.success(data.message);
            } else {
                navigate('*');
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jwtTokenState.current]);

    return (
        <div
            className='flex-col flex justify-center items-center h-screen bg-cover'
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='fixed min-w-[715px] bg-white rounded-lg p-8 m-auto mt-5 shadow-[0_4px_4px_rgba(0,0,0,0.25)]'
            >
                <h2 className='text-[30px] mt-8 font-zsemibold mb-6 font-bold text-gray-800 text-center uppercase'>
                    Đặt lại mật khẩu
                </h2>
                {success ? (
                    <div className='bg-green-100 text-green-800 border border-green-200 rounded-md p-4 mb-6'>
                        <p>
                            Đặt lại mật khẩu thành công.{' '}
                            <Link to={config.routes.login} className='underline text-primary'>
                                Nhấn vào đây
                            </Link>{' '}
                            để đến trang đăng nhập
                        </p>
                    </div>
                ) : (
                    <div>
                        {error && (
                            <div className='bg-red-100 text-red-800 border border-red-200 rounded-md p-4 mb-6'>
                                <p>{error}</p>
                            </div>
                        )}
                        <div className='mb-6'>
                            <label htmlFor='password' className='block font-medium mb-2 text-gray-800'>
                                Mật khẩu mới
                            </label>
                            <Password
                                className='w-full border border-gray-300 rounded-md py-2 px-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-[0_4px_4px_rgba(0,0,0,0.25)]'
                                placeholder='Mật khẩu mới'
                                {...register('password')}
                            />
                            <ErrorMessage
                                name='password'
                                errors={errors}
                                render={({ message }) => <ErrorMessageCustom message={message} />}
                            />
                        </div>
                        <div className='mb-6'>
                            <label htmlFor='confirm-password' className='block font-medium mb-2 text-gray-800'>
                                Nhập lại mật khẩu mới
                            </label>
                            <Password
                                className='w-full border border-gray-300 rounded-md py-2 px-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-[0_4px_4px_rgba(0,0,0,0.25)]'
                                placeholder='Nhập lại mật khẩu mới'
                                {...register('confirmPassword')}
                            />
                            <ErrorMessage
                                name='confirmPassword'
                                errors={errors}
                                render={({ message }) => <ErrorMessageCustom message={message} />}
                            />
                        </div>
                        <button
                            type='submit'
                            className='w-full bg-[#2fa130] text-white py-2 px-4 rounded-md hover:bg-opacity-80 focus:outline-none'
                        >
                            Reset Password
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        jwtToken: state.authenticateReducer.jwtToken,
    };
};

export default connect(mapStateToProps)(ResetPassword);
