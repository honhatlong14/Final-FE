import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    createANewBook,
    createBook, createBookPost, createStall, getAllCategories,
    getSingleUser, getStallByUserId, refreshToken,
    refreshToken as refreshTokenApi,
    register as registerApi, tokenRequestInterceptor,
} from "../../../apiServices";
import {connect, useDispatch} from "react-redux";
import * as yup from "yup";
import {PhotoIcon} from "../../../components/Icon";
import {toast} from "react-toastify";
import StallLayout from "../../../layout/StallLayout";
import {getNewToken, getNewTokenSuccess, logoutSuccess} from "../../../store/actions/authenticateAction";
import {Field, useFormik} from "formik";
import {resizeFileBase64} from "../../../utilities/imageHelper";
import {Loading} from "../../../components/loading";
import {Input, Button, Textarea, Switch} from "@material-tailwind/react";
import {FaBeer} from "react-icons/fa";
import {IoIosCloseCircleOutline, IoMdCloseCircleOutline} from "react-icons/io";
import { getIn } from 'formik';
import Swal from "sweetalert2";


const CreateBookFormValidationSchema = yup.object({
    title: yup.string().max(255).required('Title cannot be empty.'),
    description: yup
        .string()
        .required('Description cannot be empty.'),
    numPage: yup.number().required('Page Number cannot be empty.'),
    availbleQuantity: yup.number().required('Availble Quantity cannot be empty.'),
    author: yup.string().required('Author cannot be empty.'),
    bookImages: yup.array().max(9).of(yup.mixed().required('Book Image cannot be empty')),
    categories: yup.array().max(9).of(yup.mixed().required('Book Category cannot be empty')),
    price: yup.number().required('Price cannot be empty & It must be number.'),
});

const CreateBookPage = ({getNewTokenRequest, authenticateReducer}) => {
    const {jwtToken, id} = authenticateReducer;
    const [user, setUser] = useState({});
    const dispatch = useDispatch();
    const [imagesDisplay, setImagesDisplay] = useState([])
    const fileInputRef = useRef(null)
    const [dataRecive, setDataRecive] = useState([])
    const [loading, setLoading] = useState(false)
    const jwtTokenState = useRef(jwtToken);
    const [pendingRequest, setPendingRequest] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoriesSelected, setCategoriesSelected] = useState([]);
    const [stallData, setStallData] = useState();

    useEffect(() => {
        loadingRequest();
        formik.setFieldValue('stallId', stallData);
        let imageUpload = imagesDisplay.map((item) => item.dataImage)
        setDataRecive(imageUpload);
        formik.setFieldValue('bookImages', imageUpload);
    }, [imagesDisplay])

    const formik = useFormik({
        initialValues: {
            bookImages: [],
            categories: [],
            title: '',
            description: '',
            numPage: '',
            availbleQuantity: '',
            author: '',
            price: '',
            sellStatus: 0,
            stallId: ''

        }, validationSchema: CreateBookFormValidationSchema,
        onSubmit: async (value) => {
            setLoading(true);
            setTimeout(async () => {
                const {data, status} = await createBookPost(value, jwtTokenState.current)
                if (status === 200) {
                    toast.success(data.message);
                    setLoading(false);
                    toast.success("Create Book Successfully");
                    setTimeout(() => {
                        window.location.reload();
                    }, 500)
                } else {
                    toast.error(data.message);
                    setLoading(false);
                }

            }, 1000);


        }
    });

    const loadingRequest = useCallback(async () => {
        const loadPendingRequests = async () => {
            const {data, status} = await getStallByUserId(jwtTokenState.current, id);
            setStallData(data.id);
            return {data, status};
        };

        const getRefreshToken = async () => {
            const {data, status} = await refreshToken(jwtTokenState);
            if (status === 200) {
                jwtTokenState.current = data.jwtToken;
                dispatch(getNewTokenSuccess(data));
            } else {
                dispatch(logoutSuccess());
            }
        };

        const {status, data} = await tokenRequestInterceptor(loadPendingRequests, getRefreshToken);
        if (status === 200) {
            setPendingRequest(data);
        }
    }, [imagesDisplay])

    const handleClick = () => {
        fileInputRef.current.click();
    }

    const onFileSelect = async (event) => {
        const files = event.target.files;

        if (files.length === 0) return;
        for (let i = 0; i < files.length; i++) {
            if (files[i].type.split('/')[0] !== 'image') continue;
            if (!imagesDisplay.some((e) => e.name === files[i].name)) {
                const imagePath = await resizeFileBase64(files[i]);
                setImagesDisplay((prevImages) => [
                    ...prevImages,
                    {
                        name: files[i].name,
                        url: URL.createObjectURL(files[i]),
                        dataImage: imagePath
                    }
                ])
            }
        }
    }


    const handleSelectCategory = (categoryItem) => {
        setCategoriesSelected((prevCategories) => {
            if (!prevCategories.includes(categoryItem)) {
                // Nếu categoryItem chưa có trong prevCategories, thêm nó vào
                formik.setFieldValue('categories', [...prevCategories, categoryItem]);
                return [...prevCategories, categoryItem];
            }
            // Nếu categoryItem đã có trong prevCategories, không thay đổi gì cả
            return prevCategories;
        });
    }




    const handleRemoveCategory = (categoryItem) => {
        setCategoriesSelected((prevCategories) => {
            const isCategoryExist = prevCategories.includes(categoryItem);

            if (isCategoryExist) {
                formik.setFieldValue('categories', prevCategories.filter(item => item !== categoryItem));
                return prevCategories.filter(item => item !== categoryItem);
            }
            return prevCategories;
        });
    }

    const ErrorMessage = ({ name }) => (
        <Field
            name={name}
            render={({ form }) => {
                const error = getIn(form.errors, name);
                const touch = getIn(form.touched, name);
                return touch && error ? error : null;
            }}
        />
    );


    useEffect(() => {
        (async () => {
            const getSingleUserData = async () => {
                const {data, status} = await getSingleUser(jwtTokenState.current, id);
                return {data, status};
            };

            const getRefreshToken = async () => {
                const {data, status} = await refreshTokenApi(jwtTokenState.current);
                if (status === 200) {
                    jwtTokenState.current = data.jwtToken;
                    dispatch(getNewTokenSuccess(data));
                } else {
                    dispatch(logoutSuccess());
                }
            };

            const {status, data} = await tokenRequestInterceptor(getSingleUserData, getRefreshToken);
            if (status === 200) {
                setUser(data);
            } else if (status === 401) {
                toast.error(data.message);
            } else {
                toast.error(JSON.stringify(data.errors));
            }
        })();
    }, [jwtToken, getNewTokenRequest]);

    useEffect(() => {
        (async () => {
            const getCategoryData = async () => {
                const {data, status} = await getAllCategories(jwtTokenState.current);
                return {data, status};
            };

            const getRefreshToken = async () => {
                const {data, status} = await refreshTokenApi(jwtTokenState.current);
                if (status === 200) {
                    jwtTokenState.current = data.jwtToken;
                    dispatch(getNewTokenSuccess(data));
                } else {
                    dispatch(logoutSuccess());
                }
            };

            const {status, data} = await tokenRequestInterceptor(getCategoryData, getRefreshToken);
            if (status === 200) {
                setCategories(data);
            } else if (status === 401) {
                toast.error(data.message);
            } else {
                toast.error(JSON.stringify(data.errors));
            }
        })();
    }, []);


    const deleteImage = (index) => {
        setImagesDisplay((prevImages) =>
            prevImages.filter((_, i) => i !== index)
        );
        let imageUpload = imagesDisplay.map((item) => item.dataImage)

        formik.setFieldValue('bookImages', imageUpload);
    }


    return (
        <>
            <StallLayout>
                <div
                    className='w-full bg-cover bg-no-repeat bg-opacity-50 px-10 py-10'
                >
                    <div className='py-6'>
                        <h1>Basic Information</h1>
                    </div>
                    <form
                        onSubmit={formik.handleSubmit}
                    >
                        <div className='flex flex-col '>
                            <div className='flex mb-4'>
                                <div className='mx-5'>
                                    <Switch name='sellStatus'
                                            checked={formik.values.sellStatus === 1} // Sử dụng === để so sánh chính xác
                                            onChange={(event) => {
                                                const newValue = event.target.checked ? 1 : 0;
                                                formik.setFieldValue('sellStatus', newValue);
                                            }}
                                            className='' label="Post for sell"/>
                                </div>
                            </div>
                            <div className='flex mb-4'>
                                <div className='mx-5 w-[144px]'>
                                    Image Book
                                </div>
                                <div className='flex flex-1'>
                                    <div
                                        onClick={handleClick}
                                        className=' w-[80px] h-[80px] border-2 border-dashed rounded-xl flex flex-wrap justify-center content-center hover:bg-blue-500 content-center mr-3'
                                    >
                                        <input type="file" id='bookImages' name='bookImages' className='hidden'
                                               multiple='multiple'
                                               onChange={onFileSelect}
                                               ref={fileInputRef}
                                        />
                                        <PhotoIcon className=''/>
                                        <div className=''>
                                            <h1 className='text-sm'>Add images</h1>
                                        </div>

                                    </div>

                                    <div className='flex flex-wrap flex-1'>
                                        {imagesDisplay.map((images, index) => (
                                            <div key={index}
                                                 className='w-[80px] h-[80px] relative mr-[5px] mb-[5px] '>
                                                <IoMdCloseCircleOutline
                                                    onClick={() => deleteImage(index)}
                                                    className='w-[20px] h-[20px] absolute top-[9px] right-[9px] hover:cursor-pointer text-gray-50'/>
                                                <img className='w-full h-full object-cover' src={images.url}
                                                     alt={images.name}/>
                                            </div>
                                        ))
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className='flex mb-3'>
                                <div className='mx-5 basis-[144px] w-[144px]'>
                                    Title
                                </div>
                                <div className='flex-auto'>
                                    {formik.errors.title && formik.touched.title ? (
                                        <Input size="md" className=''
                                               name='title'
                                               onChange={formik.handleChange}
                                               value={formik.values.title}
                                               label={formik.errors.title}
                                               error
                                        />
                                    ) : <Input variant="outlined" size="md" label="Title book" className=''
                                               name='title'
                                               onChange={formik.handleChange}
                                               value={formik.values.title}
                                    />}
                                </div>

                            </div>


                            <div className='flex mb-3'>
                                <div className='mx-5 basis-[144px] w-[144px]'>
                                    Page Number
                                </div>
                                <div className='flex-auto'>
                                    {formik.errors.numPage && formik.touched.numPage ? (
                                        <Input size="md" className=''
                                               name='numPage'
                                               onChange={formik.handleChange}
                                               value={formik.values.numPage}
                                               label={formik.errors.numPage}
                                               error
                                        />
                                    ) : <Input variant="outlined" size="md" label="Page Number book" className=''
                                               name='numPage'
                                               onChange={formik.handleChange}
                                               value={formik.values.numPage}
                                    />}
                                </div>
                            </div>

                            <div className='flex mb-3'>
                                <div className='mx-5 basis-[144px] w-[144px]'>
                                    Available Quantity
                                </div>
                                <div className='flex-auto'>
                                    {formik.errors.availbleQuantity && formik.touched.availbleQuantity ? (
                                        <Input variant="outlined" size="md" className=''
                                               name='availbleQuantity'
                                               onChange={formik.handleChange}
                                               value={formik.values.availbleQuantity}
                                               label={formik.errors.availbleQuantity}
                                               error
                                        />
                                    ) : <Input size="md" label="Availble Quantity book" className=''
                                               name='availbleQuantity'
                                               onChange={formik.handleChange}
                                               value={formik.values.availbleQuantity}
                                    />}
                                </div>
                            </div>
                            <div className='flex mb-3'>
                                <div className='mx-5 basis-[144px] w-[144px]'>
                                    Author
                                </div>
                                <div className='flex-auto'>
                                    {formik.errors.author && formik.touched.author ? (
                                        <Input size="md" className=''
                                               name='author'
                                               onChange={formik.handleChange}
                                               value={formik.values.author}
                                               label={formik.errors.author}
                                               error
                                        />
                                    ) : <Input variant="outlined" size="md" label="Author book" className=''
                                               name='author'
                                               onChange={formik.handleChange}
                                               value={formik.values.author}
                                    />}
                                </div>
                            </div>
                            <div className='flex mb-3'>
                                <div className='mx-5 basis-[144px] w-[144px]'>
                                    Price
                                </div>
                                <div className='flex-auto'>
                                    {formik.errors.price && formik.touched.price ? (
                                        <Input size="md" className=''
                                               name='price'
                                               onChange={formik.handleChange}
                                               value={formik.values.price}
                                               label={formik.errors.price}
                                               error
                                        />
                                    ) : <Input variant="outlined" size="md" label="Price book" className=''
                                               name='price'
                                               onChange={formik.handleChange}
                                               value={formik.values.price}
                                    />}
                                </div>
                            </div>

                            <div className='flex mb-3'>
                                <div className='mx-5 basis-[144px] w-[144px] '>
                                    Category
                                </div>
                                {/*<div className='flex-auto max-w-[450px] bg-gray-600'>*/}
                                <div className='flex-auto max-w-[450px] h-fit'>
                                    <div className='flex flex-wrap'>
                                        {categories?.map(item => (
                                            <div onClick={() => handleSelectCategory(item)}
                                                 className='hover:cursor-pointer mr-1 w-fit px-3 py-1 bg-amber-100 rounded-md'>
                                                <span className='font-bold'>{item.categoryName}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='flex-auto'>
                                    {formik.errors.categories && formik.touched.categories ? (
                                            <div className='w-full h-[300px] border-solid border-2 border-indigo-600 rounded-md'>
                                                <ErrorMessage name={categoriesSelected} />
                                            </div>

                                        ) :
                                        <div
                                            className='w-full h-[300px] border-solid border-2 border-indigo-600 rounded-md'>
                                            <div className='mx-3 my-3 flex flex-wrap'>
                                                {categoriesSelected?.map(item => (
                                                    <div
                                                        className='hover:cursor-pointer w-fit px-3 py-1 bg-amber-100 rounded-md flex items-center mr-1'>
                                                        <span className='font-bold mr-2'>{item.categoryName}</span>
                                                        <IoIosCloseCircleOutline
                                                            onClick={() => handleRemoveCategory(item)}
                                                            className='hover:bg-gray-600 hover:rounded-3xl'/>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className='flex mb-3'>
                                <div className='mx-5 basis-[144px] w-[144px]'>
                                    Description
                                </div>
                                <div className='flex-auto'>
                                    {formik.errors.description && formik.touched.description ? (
                                        <Textarea size="md" className=''
                                                  name='description'
                                                  onChange={formik.handleChange}
                                                  value={formik.values.description}
                                                  label={formik.errors.description}
                                                  error
                                        />
                                    ) : <Textarea variant="outlined" size="md" label="Description book" className=''
                                                  name='description'
                                                  onChange={formik.handleChange}
                                                  value={formik.values.description}
                                    />}
                                </div>
                            </div>


                            <div className='mx-auto'>
                                {loading ? <Loading className='mt-3 '/> : <Button type="submit">Saved Change</Button>}
                            </div>
                        </div>
                    </form>

                </div>


            </StallLayout>

        </>
    )

}
const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getNewTokenRequest: (jwtToken) => dispatch(getNewToken(jwtToken)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateBookPage);