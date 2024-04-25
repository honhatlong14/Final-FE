import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {createANewBook, createBook, getSingleUser, register as registerApi, updateUser} from "../../../apiServices";
import {connect} from "react-redux";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import Form from "../../../components/form";
import InputField from "../../../components/inputField";
import {ErrorMessage} from "@hookform/error-message";
import ErrorMessageCustom from "../../../components/errorMessage";
import {PhotoIcon} from "../../../components/Icon";
import Button from "../../../components/button";
import {resizeFile, resizeFileBase64} from "../../../utilities/imageHelper";
import {toast} from "react-toastify";


const CreateBookAdminFormValidationSchema = yup.object({
    title: yup.string().max(255).required('Title cannot be empty.'),
    description: yup
        .string()
        .required('Description cannot be empty.'),
    numPage: yup.number().required('Page Number cannot be empty.'),
    availbleQuantity: yup.number().required('Available Quantity cannot be empty.'),
    author: yup.string().required('Author cannot be empty.'),
    bookImages: yup.array().of(yup.mixed().required('Book Image cannot be empty'))
});

const CreateBookAdminPage = ({authenticateReducer}) => {
    const {jwtToken} = authenticateReducer;
    const [imageName, setImageName] = useState();
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState([]);


    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setValue,
        trigger
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(CreateBookAdminFormValidationSchema),
        defaultValues: {
            bookImages: [],
        },
    });

    const handleImageChange = async (e) => {

        const files = Array.from(e.target.files);
        setSelectedFiles(files);
        const validFiles = await validateImageFiles(files);

        setValue('bookImages', validFiles);
        await trigger('bookImages');
    };

    const validateImageFiles = async (files) => {
        const supportedFormats = ['image/jpeg', 'image/png'];
        const validFiles = [];

        for (const file of files) {
            if (supportedFormats.includes(file.type)) {
                const imagePath = await resizeFileBase64(file);
                validFiles.push(imagePath);
            } else {
                toast.error('Định dạng tệp không được hỗ trợ');
            }
        }

        return validFiles;
    };

    const onSubmit = async (data) => {
        try {
            // const formData = new FormData();
            // formData.append('title', data.title);
            // formData.append('description', data.description);
            // formData.append('numPage', data.numPage);
            // formData.append('availbleQuantity', data.availbleQuantity);
            //
            // data.bookImages.forEach((image) => {
            //     formData.append('bookImages', image);
            // });
            console.log(data);
            const response = await createBook(data, jwtToken)
            console.log('Dữ liệu đã được gửi:', response.data);
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);
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
                        <h2 className='text-center font-bold mt-[30px] mb-[14px] text-[30px] leading-9'>Create Book</h2>
                    </div>

                    <Form className='shadow-none pt-0'>
                        <div className='grid gap-2'>
                            <InputField
                                className='shadow-[0_4px_4px_rgba(0,0,0,0.25)] appearance-none border rounded-lg w-full py-4 px-3 text-black leading-tight focus:outline-none focus:shadow-outline'
                                type='text'
                                placeholder='Title*'
                                {...register('title')}
                            />
                            <ErrorMessage
                                name='title'
                                errors={errors}
                                render={({message}) => <ErrorMessageCustom message={message}/>}
                            />
                        </div>


                        <div className='grid gap-2'>
                            <InputField
                                className='shadow-[0_4px_4px_rgba(0,0,0,0.25)] appearance-none border rounded-lg w-full py-4 px-3 text-black leading-tight focus:outline-none focus:shadow-outline'
                                type='text'
                                placeholder='Description*'
                                {...register('description')}
                            />
                            <ErrorMessage
                                name='description'
                                errors={errors}
                                render={({message}) => <ErrorMessageCustom message={message}/>}
                            />
                        </div>

                        <div className='grid gap-2'>
                            <InputField
                                className='shadow-[0_4px_4px_rgba(0,0,0,0.25)] appearance-none border rounded-lg w-full py-4 px-3 text-black leading-tight focus:outline-none focus:shadow-outline'
                                type='number'
                                placeholder='Page Number*'
                                {...register('numPage')}
                            />
                            <ErrorMessage
                                name='numPage'
                                errors={errors}
                                render={({message}) => <ErrorMessageCustom message={message}/>}
                            />
                        </div>

                        <div className='grid gap-2'>
                            <InputField
                                className='shadow-[0_4px_4px_rgba(0,0,0,0.25)] appearance-none border rounded-lg w-full py-4 px-3 text-black leading-tight focus:outline-none focus:shadow-outline'
                                type='number'
                                placeholder='Availble Quantity*'
                                {...register('availbleQuantity')}
                            />
                            <ErrorMessage
                                name='availbleQuantity'
                                errors={errors}
                                render={({message}) => <ErrorMessageCustom message={message}/>}
                            />
                        </div>

                        <div className='grid gap-2'>
                            <InputField
                                className='shadow-  [0_4px_4px_rgba(0,0,0,0.25)] appearance-none border rounded-lg w-full py-4 px-3 text-black leading-tight focus:outline-none focus:shadow-outline'
                                type='text'
                                placeholder='Author*'
                                {...register('author')}
                            />
                            <ErrorMessage
                                name='author'
                                errors={errors}
                                render={({message}) => <ErrorMessageCustom message={message}/>}
                            />
                        </div>


                        <div className='flex w-full justify-between'>

                            <div className='flex-1 '>
                                <div
                                    className='bg-white flex relative shadow-[0_4px_4px_rgba(0,0,0,0.25)] appearance-none border rounded-lg w-full py-[13px] px-3 text-black leading-tight focus:outline-none focus:shadow-outline'>
                                    <InputField
                                        id='imageUpload'
                                        className='hidden'
                                        type='file'
                                        multiple
                                        onChange={handleImageChange}
                                    />
                                    {selectedFiles.map((item, index) => {
                                        return (
                                            <h3 key={index}
                                                className='block text-[#9c9b9b]'>{item.name}
                                            </h3>
                                        )

                                    })}
                                    <h3 className='block text-[#9c9b9b]'>{(Array.isArray(selectedFiles) && selectedFiles.length === 0) ? 'Book Image *' : ''}</h3>
                                    <label htmlFor='imageUpload'>
                                        <PhotoIcon
                                            className='absolute right-[20px] top-[50%] translate-y-[-50%] cursor-pointer'/>
                                    </label>
                                </div>
                                <ErrorMessage
                                    name='bookImages'
                                    errors={errors}
                                    render={({message}) => <ErrorMessageCustom message={message}/>}
                                />
                            </div>
                        </div>


                        <Button
                            className='uppercase'
                            onClick={handleSubmit(onSubmit)}
                            role='submit'
                            type='primary'
                            title='Create Book'
                        />
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

export default connect(mapStateToProps)(CreateBookAdminPage);