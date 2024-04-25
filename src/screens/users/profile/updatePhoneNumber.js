import Form from "../../../components/form";
import Password from "../../../components/password";
import {ErrorMessage} from "@hookform/error-message";
import ErrorMessageCustom from "../../../components/errorMessage";
import Button from "../../../components/button";
import ProfileLayout from "../../../layout/ProfileLayout";
import React from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {updatePassword, updatePhoneNumber} from "../../../apiServices";
import {toast} from "react-toastify";
import * as yup from "yup";
import {connect} from "react-redux";
import InputField from "../../../components/inputField";


const UpdatePhoneFormValidationSchema = yup.object({
    phoneNumber: yup
        .string()
        .required('The phone number cannot be empty.')
        .min(8, 'The phone number is too short - it must be at least 8 characters')
});
const UpdatePhoneNumber = ({authenticateReducer}) => {
    const {refreshToken, jwtToken, id} = authenticateReducer;

    let jwtTokenState = jwtToken;
    let refreshTokenState = refreshToken;

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(UpdatePhoneFormValidationSchema),
        defaultValues: {},
    });

    const onSubmit = async (formData) => {
        try {
            console.log(formData);
            const {status, data} = await updatePhoneNumber(jwtTokenState, id, {...formData})
            if (status === 200) {
                toast.success("Update Phone Number Successfully");
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
                            <InputField
                                className='shadow-[0_4px_4px_rgba(0,0,0,0.25)] appearance-none border rounded-lg w-full py-4 px-3 text-black leading-tight focus:outline-none focus:shadow-outline'
                                {...register('phoneNumber')}
                                placeholder='Phone Number *'
                            />
                            <ErrorMessage
                                name='password'
                                errors={errors}
                                render={({message}) => <ErrorMessageCustom message={message}/>}
                            />
                        </div>

                        <Button
                            className='uppercase'
                            onClick={handleSubmit(onSubmit)}
                            role='submit'
                            type='primary'
                            title='Update Phone Number'
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

export default connect(mapStateToProps)(UpdatePhoneNumber)