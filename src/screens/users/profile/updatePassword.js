import {ErrorMessage} from "@hookform/error-message";
import ErrorMessageCustom from "../../../components/errorMessage";
import React from "react";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import Button from "../../../components/button";
import {useForm} from "react-hook-form";
import Form from "../../../components/form";
import {updatePassword} from "../../../apiServices";
import {toast} from 'react-toastify';
import {connect} from "react-redux";
import Password from "../../../components/password";
import ProfileLayout from "../../../layout/ProfileLayout";


const UpdatePasswordFormValidationSchema = yup.object({
    password: yup
        .string()
        .required('The password cannot be empty.')
        .min(8, 'The password is too short - it must be at least 8 characters')
        .matches(/[a-zA-Z]/, 'The password can only contain Latin letters'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Password must match'),
});
const UpdatePasswordPage = ({authenticateReducer}) => {
    const {refreshToken, jwtToken, id} = authenticateReducer;

    let jwtTokenState = jwtToken;
    let refreshTokenState = refreshToken;

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(UpdatePasswordFormValidationSchema),
        defaultValues: {},
    });

    const onSubmit = async (formData) => {
        try {
            console.log(formData);
            const {status, data} = await updatePassword(jwtTokenState, id, {...formData})
            if (status === 200) {
                toast.success("Update Password Successfully");
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);
        }
    };


    return (
        <>
            <ProfileLayout>
                <main className='w-full mb-5 flex justify-center h-full overflow-y-hidden'>
                    <Form className='shadow-none pt-0'>
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
                                {...register('confirmPassword')}
                                placeholder='Confirm Password *'
                            />
                            <ErrorMessage
                                name='confirmPassword'
                                errors={errors}
                                render={({message}) => <ErrorMessageCustom message={message}/>}
                            />
                        </div>
                        <Button
                            className='uppercase'
                            onClick={handleSubmit(onSubmit)}
                            role='submit'
                            type='primary'
                            title='Update password'
                        />
                    </Form>
                </main>
            </ProfileLayout>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer,

    };
};

export default connect(mapStateToProps)(UpdatePasswordPage);