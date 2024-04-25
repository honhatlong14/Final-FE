import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {createBookPost, getSingleUser, register as registerApi, updateUser} from "../../../apiServices";
import {connect} from "react-redux";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import Form from "../../../components/form";
import InputField from "../../../components/inputField";
import {ErrorMessage} from "@hookform/error-message";
import ErrorMessageCustom from "../../../components/errorMessage";
import Password from "../../../components/password";
import SelectOption from "../../../components/SelectOption";
import {PhotoIcon} from "../../../components/Icon";
import Button from "../../../components/button";
import Modal from "../../../components/modal";
import config from "../../../config";
import {resizeFile} from "../../../utilities/imageHelper";
import {toast} from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import {Loading} from "../../../components/loading";


const EditUserFormValidationSchema = yup.object({
    email: yup.string().email('Phải là một email hợp lệ').max(255).required('Email không được để trống'),
    password: yup
        .string()
        .required('Mật khẩu không được để trống')
        .min(8, 'Mật khẩu quá ngắn - tối thiểu phải có 8 ký tự.')
        .matches(/[a-zA-Z]/, 'Mật khẩu chỉ có thể chứa các chữ cái Latinh.'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Mật khẩu phải trùng khớp'),
    fullName: yup.string().required('Họ & Tên không được để trống'),
    gender: yup.string().required('Giới tính không được để trống'),
    avatarFile: yup.mixed().required('Thẻ sinh viên không được để trống'),
    phoneNumber: yup.string().required('Số điện thoại không được để trống'),
    role: yup.string().required('Quyền không được để trống')
});

const EditUserPage = ({authenticateReducer}) => {
    const {jwtToken} = authenticateReducer;
    let {id} = useParams();
    const [user, setUser] = useState({});
    const [imageName, setImageName] = useState();
    const [showModal, setShowModal] = useState(false);
    let [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setValue,
        trigger
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(EditUserFormValidationSchema),
        defaultValues: {
            avatarFile: '',
            acceptTerms: true,
        },
    });

    const fields = ['email', 'password', 'confirmPassword', 'fullName', 'gender', 'avatarFile', 'phoneNumber', 'role'];


    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        const base64ImagePath = await resizeFile(file);
        setValue('avatarFile', base64ImagePath);
        await trigger('avatarFile');
        setImageName(file.name);
    };

    const onSubmit = async (formData) => {

        setLoading(true);
        setTimeout(async () => {
            const {data, status} = await updateUser({...formData}, user.id, jwtToken);
            if (status === 200) {
                reset({
                    avatarFile: '',
                    acceptTerms: false,
                });
                toast.success("User updated success");
                setShowModal(true);
                navigate("/admin");
                setLoading(false);
            } else {
                toast.error(JSON.stringify(data.errors));
                setLoading(false);
            }

        }, 1000);
    };

    useEffect(() => {
        (async () => {
                const {data, status} = await getSingleUser(jwtToken, id)
                return data
            }
        )().then(dataResponse => {
            setUser(dataResponse)
            fields.forEach(field => setValue(field, dataResponse[field]))
        })
    }, [jwtToken])



    return (
        <>
            <div
                className='bg-cover bg-no-repeat flex justify-center bg-opacity-50'
            >
                <div
                    className='w-screen sm:max-w-screen-xl shadow-[0_0px_4px_rgba(0,0,0,0.25)] bg-white rounded-lg bg-opacity-50 pt-10'>
                    <div>
                        <h2 className='text-center font-bold mt-[30px] mb-[14px] text-[30px] leading-9'>Edit User</h2>
                    </div>

                    <Form className='shadow-none pt-0'>
                        <div className='grid gap-2'>
                            <InputField
                                className='shadow-[0_4px_4px_rgba(0,0,0,0.25)] appearance-none border rounded-lg w-full py-4 px-3 text-black leading-tight focus:outline-none focus:shadow-outline'
                                type='text'
                                ref={register}
                                placeholder='Email*'
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

                        <div className='grid gap-2'>
                            <SelectOption
                                className='px-[12px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-white outline-none'
                                {...register('role')}
                                listData={[
                                    {value: 0, name: 'Admin'},
                                    {value: 1, name: 'Staff'},
                                    {value: 2, name: 'User'},
                                    {value: 3, name: 'Customer'},
                                    {value: 4, name: 'Store Owner'}
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
                                    <h3 className='text-[#9c9b9b]'>{imageName || user.avatar ||'Avatar *'}</h3>
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

                        {loading ? <Loading className='mx-auto '/> :
                            <Button
                            className='uppercase'
                            onClick={handleSubmit(onSubmit)}
                            role='submit'
                            type='primary'
                            title='Register'
                        />}

                    </Form>
                </div>
            </div>
        </>
    )

}
const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer,
    };
};

export default connect(mapStateToProps)(EditUserPage);