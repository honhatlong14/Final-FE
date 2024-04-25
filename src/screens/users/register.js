import {ErrorMessage} from '@hookform/error-message';
import {yupResolver} from '@hookform/resolvers/yup';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import * as yup from 'yup';

import {register as registerApi} from '../../apiServices/index';
import Button from '../../components/button';
import ErrorMessageCustom from '../../components/errorMessage';
import Form from '../../components/form';
import {PhotoIcon} from '../../components/Icon';
import InputField from '../../components/inputField';
import Modal from '../../components/modal';
import Password from '../../components/password';
import config from '../../config';
import {resizeFile} from '../../utilities/imageHelper';
import SelectOption from '../../components/SelectOption';
import {connect} from 'react-redux';

const registerFormValidationSchema = yup.object({
    email: yup.string().email('Must be a valid email').max(255).required('Email cannot be blank'),
    password: yup
        .string()
        .required('Password can not be blank')
        .min(8, 'Password is too short - minimum 8 characters')
        .matches(/[a-zA-Z]/, 'Passwords can only contain Latin letters'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Password must match'),
    fullName: yup.string().required('Full Name cannot be left blank'),
    gender: yup.string().required('Gender cannot be left blank'),
    avatarFile: yup.mixed().required('Avatar cannot be empty'),
    phoneNumber: yup.string().required('Phone number can not be left blank'),
});

const RegisterPage = ({
                          close = () => {
                          }, jwtToken, role
                      }) => {
    const [imageName, setImageName] = useState();
    const [showModal, setShowModal] = useState(false);
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setValue,
        trigger
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(registerFormValidationSchema),
        defaultValues: {
            avatarFile: '',
            acceptTerms: false,
        },
    });

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        const base64ImagePath = await resizeFile(file);
        setValue('avatarFile', base64ImagePath);
        await trigger('avatarFile');
        setImageName(file.name);

    };

    const onSubmit = async (formData) => {
        const {status, data} = await registerApi({...formData}, jwtToken);
        if (status === 200) {
            reset({
                avatarFile: '',
                acceptTerms: false,
            });

            toast.success(data.message);
            setShowModal(true);
        } else {
            toast.error(JSON.stringify(data.message));
        }
    };

    return (
        <>
            <div
                className='bg-cover bg-no-repeat flex justify-center bg-opacity-50'
            >
                <div
                    className='w-screen sm:max-w-screen-xl shadow-[0_0px_4px_rgba(0,0,0,0.25)] bg-white rounded-lg bg-opacity-50 pt-10'>
                    <div>
                        <h2 className='text-center font-bold mt-[30px] mb-[14px] text-[30px] leading-9'>Register</h2>
                    </div>

                    <Form className='shadow-none pt-0'>
                        <div className='grid gap-2'>
                            <InputField
                                className='shadow-[0_4px_4px_rgba(0,0,0,0.25)] appearance-none border rounded-lg w-full py-4 px-3 text-black leading-tight focus:outline-none focus:shadow-outline'
                                type='text'
                                placeholder='Email *'
                                {...register('email')}
                            />
                            <ErrorMessage
                                name='email'
                                errors={errors}
                                render={({message}) => <ErrorMessageCustom message={message}/>}
                            />
                        </div>

                        <div className='grid gap-2'>
                            <Password
                                className='shadow-[0_4px_4px_rgba(0,0,0,0.25)] appearance-none border rounded-lg w-full py-4 px-3 text-black leading-tight focus:outline-none focus:shadow-outline'
                                {...register('password')}
                                placeholder='Password *'
                            />
                            <ErrorMessage
                                name='password'
                                errors={errors}
                                render={({message}) => <ErrorMessageCustom message={message}/>}
                            />
                        </div>

                        <div className='grid gap-2'>
                            <Password
                                className='shadow-[0_4px_4px_rgba(0,0,0,0.25)] appearance-none border rounded-lg w-full py-4 px-3 text-black leading-tight focus:outline-none focus:shadow-outline'
                                placeholder='Confirm password *'
                                {...register('confirmPassword')}
                            />
                            <ErrorMessage
                                name='confirmPassword'
                                errors={errors}
                                render={({message}) => <ErrorMessageCustom message={message}/>}
                            />
                        </div>

                        <div className='grid gap-2'>
                            <InputField
                                className='shadow-[0_4px_4px_rgba(0,0,0,0.25)] appearance-none border rounded-lg w-full py-4 px-3 text-black leading-tight focus:outline-none focus:shadow-outline'
                                type='text'
                                placeholder='Full Name *'
                                {...register('fullName')}
                            />
                            <ErrorMessage
                                name='fullName'
                                errors={errors}
                                render={({message}) => <ErrorMessageCustom message={message}/>}
                            />
                        </div>

                        <div className='grid gap-2'>
                            <SelectOption
                                className='px-[12px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-white outline-none'
                                {...register('gender')}
                                listData={[
                                    {value: 0, name: 'Male'},
                                    {value: 1, name: 'Female'},
                                    {value: 2, name: 'Other'},
                                ]}
                            />
                            <ErrorMessage
                                name='gender'
                                errors={errors}
                                render={({message}) => <ErrorMessageCustom message={message}/>}
                            />
                        </div>

                        <div className='flex w-full justify-between'>

                            <div className='flex-1'>
                                <div
                                    className='bg-white flex relative shadow-[0_4px_4px_rgba(0,0,0,0.25)] appearance-none border rounded-lg w-full py-[13px] px-3 text-black leading-tight focus:outline-none focus:shadow-outline'>
                                    <InputField
                                        id='imageUpload'
                                        className='hidden'
                                        type='file'
                                        onChange={handleImageChange}
                                    />
                                    <h3 className='text-[#9c9b9b]'>{imageName || 'Avatar *'}</h3>
                                    <label htmlFor='imageUpload'>
                                        <PhotoIcon
                                            className='absolute right-[20px] top-[50%] translate-y-[-50%] cursor-pointer'/>
                                    </label>
                                </div>
                                <ErrorMessage
                                    name='avatarFile'
                                    errors={errors}
                                    render={({message}) => <ErrorMessageCustom message={message}/>}
                                />
                            </div>
                        </div>

                        <div className='grid gap-2'>
                            <InputField
                                className='shadow-[0_4px_4px_rgba(0,0,0,0.25)] appearance-none border rounded-lg w-full py-4 px-3 text-black leading-tight focus:outline-none focus:shadow-outline'
                                type='text'
                                placeholder='Phone Number *'
                                {...register('phoneNumber')}
                            />
                            <ErrorMessage
                                name='phoneNumber'
                                errors={errors}
                                render={({message}) => <ErrorMessageCustom message={message}/>}
                            />
                        </div>

                        <div className='flex items-center w-full'>
                            <input className='ml-2 mr-4' type='checkbox' {...register('acceptTerms')} />
                            <p>
                                I agree with
                                <i className='italic text-blue-500 font-bold text-md cursor-pointer'>
                                    Terms and Privacy Policy for Users
                                </i>
                            </p>
                        </div>
                        <Button
                            className='uppercase'
                            onClick={handleSubmit(onSubmit)}
                            role='submit'
                            type='primary'
                            title='Register'
                        />
                    </Form>
                </div>
            </div>

            <Modal open={showModal} setOpen={setShowModal}>
                <div className='max-w-[850px] p-[40px]'>
                    <h3 className='font-bold text-[20px] leading-[24px]'>Your account needs to be verified</h3>
                    <p className='text-[20px] mt-[30px]'>
                        To ensure user's rights, We needs to review the information from your registration profile.
                        So please fill in accurate personal information and patiently wait for admin's account approval.
                        We will send a confirmation email for your successful registration as soon as possible!
                    </p>
                    <div className='mt-[30px] text-center'>
                        <Link
                            to={config.routes.login}
                            className='px-4 py-[10px] font-bold text-[20px] leading-[24px] text-[#74C156] rounded-[8px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] border-[1px] border-solid border-[#F5F5F5] hover:bg-[rgba(0,0,0,0.05)] outline-none'
                        >
                            Redirect to Login
                        </Link>
                    </div>
                </div>
            </Modal>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        jwtToken: state.authenticateReducer.jwtToken,
        role: state.authenticateReducer.role,
    };
};

export default connect(mapStateToProps)(RegisterPage);
