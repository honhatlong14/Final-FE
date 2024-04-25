import {ErrorMessage} from '@hookform/error-message';
import {yupResolver} from '@hookform/resolvers/yup';
import {useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import * as yup from 'yup';

import {forgotPassword, loginGoogle} from '../apiServices';
import Button from '../components/button';
import ErrorMessageCustom from '../components/errorMessage';
import Form from '../components/form';
import {PlaneIcon} from '../components/Icon';
import InputField from '../components/inputField';
import Modal from '../components/modal';
import Password from '../components/password';
import config from '../config';
import {login, loginSuccess} from '../store/actions/authenticateAction';
import { GoogleLogin } from '@react-oauth/google';

const loginFormValidationSchema = yup.object({
    email: yup.string().email('Must be a valid email').max(255).required('Email cannot be blank'),
    password: yup
        .string()
        .required('Password can not be blank')
        .min(8, 'Password is too short - minimum 8 characters')
        .matches(/[a-zA-Z]/, 'Passwords can only contain Latin letters'),
});

const LoginPage = ({submitLoginForm, jwtToken, googleLogin}) => {
    let jwtTokenState = jwtToken;
    const emailForgotPasswordRef = useRef();
    const [showModalForgotPassword, setShowModalForgotPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(loginFormValidationSchema),
    });

    const onSubmit = (formData) => {
        submitLoginForm(formData);
    };

    const onGoogleLoginSuccess = (credentialResponse) => {
        // Handle the successful Google login response here
         loginGoogle(credentialResponse.credential).then((res)=>{
             googleLogin(res.data);
         }).catch(err=>console.log(err))
    };

    const onGoogleLoginFailure = () => {
        // Handle Google login failure here
        console.error('Google login failure:');
        // alertService.error("Google login failure");
    };

    const handleShowModalForgotPassword = (e) => {
        e.preventDefault();
        setShowModalForgotPassword(true);
    };

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        const email = emailForgotPasswordRef.current.value;

        const {data, status} = await forgotPassword({email}, jwtTokenState);
        if (status === 200) {
            setShowModalForgotPassword(false);
            toast.success(data.message);
        } else {
            toast.error(JSON.stringify(data.errors));
        }
    };

    return (
        <>
            <div
                className='bg-cover bg-no-repeat flex justify-center w-full h-[100vh]'
            >
                <div className='py-10 w-screen flex items-center justify-center fixed h-[100%] '>
                    <div className='max-w-[715px] w-full'>
                        <Form className='rounded items-center'>
                            <div>
                                {/*<img className='mr-auto ml-auto w-[265px]' src={images.logo} alt='logo' />*/}
                                <h2 className='text-center font-bold my-10 text-3xl'>LOGIN</h2>
                            </div>

                            <div className='mb-4 mt-10 w-full grid gap-2'>
                                <InputField
                                    className='shadow-[0_4px_4px_rgba(0,0,0,0.25)]'
                                    {...register('email')}
                                    type='text'
                                    placeholder='Email'
                                />
                                <ErrorMessage
                                    errors={errors}
                                    name='email'
                                    render={({message}) => <ErrorMessageCustom message={message}/>}
                                />
                            </div>

                            <div className='mb-10 w-full grid gap-2'>
                                <Password
                                    className='shadow-[0_4px_4px_rgba(0,0,0,0.25)]'
                                    {...register('password')}
                                    placeholder='Password'
                                />
                                <ErrorMessage
                                    errors={errors}
                                    name='password'
                                    render={({message}) => <ErrorMessageCustom message={message}/>}
                                />
                            </div>

                            <div className='flex items-center justify-between mt-6 mb-6 px-4 w-full'>
                                <span
                                    className='cursor-pointer leading-3 inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800'
                                    onClick={handleShowModalForgotPassword}
                                >
                                    Forgot Password
                                </span>
                                <span>
                                    <Link
                                        to={config.routes.register}
                                        className='inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800'
                                    >
                                        No account yet, register here
                                    </Link>
                                </span>
                            </div>

                            <Button
                                onClick={handleSubmit(onSubmit)}
                                className='uppercase'
                                role='submit'
                                type='primary'
                                title='Login'
                            ></Button>

                            <div style={{display:'flex', justifyContent:'center', padding: '20px'}}>
                                <GoogleLogin
                                    onSuccess={onGoogleLoginSuccess}
                                    onError={onGoogleLoginFailure}
                                />
                            </div>
                        </Form>
                    </div>
                </div>
            </div>

            <Modal open={showModalForgotPassword} setOpen={setShowModalForgotPassword}>
                <form className='p-[40px] max-w-[850px] flex flex-col'>
                    <h3 className='font-bold text-[20px] leading-[24px]'>Forgot Password?</h3>
                    <p className='text-[20px] leading-[24px] mt-[30px]'>
                        Input <strong>Your Email</strong> used to register. We will send you an email with a link to log in and change your password
                    </p>
                    <input
                        className='mt-[14px] p-[13px] rounded-[8px] bg-[#CAE7BF] outline-none shadow-[0_4px_4px_rgba(0,0,0,0.25)]'
                        placeholder='Nhập email của bạn'
                        type='email'
                        required
                        ref={emailForgotPasswordRef}
                    />
                    <div className='flex items-center justify-center mt-[14px]'>
                        <button
                            type='submit'
                            className='flex items-center justify-center gap-[20px] font-bold text-[20px] leading-[24px] text-[#74C156] w-[162px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-[8px] px-2 py-[11px] hover:bg-[rgba(0,0,0,0.05)]'
                            onClick={handleForgotPassword}
                        >
                            Send
                            <PlaneIcon/>
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        submitLoginForm: (formData) => dispatch(login(formData)),
        googleLogin:(formData) => dispatch(loginSuccess(formData)),
    };
};

const mapStateToProps = (state) => {
    return {
        jwtToken: state.authenticateReducer.jwtToken,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
