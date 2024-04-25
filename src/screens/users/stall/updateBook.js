import {getNewToken, getNewTokenSuccess, logoutSuccess} from "../../../store/actions/authenticateAction";
import {connect, useDispatch} from "react-redux";
import * as yup from "yup";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {Field, getIn, useFormik} from "formik";
import {
    createBookPost, getAllCategories, getBookById,
    getSingleUser,
    getStallByUserId, refreshToken as refreshTokenApi,
    refreshToken,
    tokenRequestInterceptor, updateBookPost
} from "../../../apiServices";
import {toast} from "react-toastify";
import {resizeFileBase64} from "../../../utilities/imageHelper";
import {Button, Input, Switch, Textarea} from "@material-tailwind/react";
import {PhotoIcon} from "../../../components/Icon";
import {IoIosCloseCircleOutline, IoMdCloseCircleOutline} from "react-icons/io";
import {Loading} from "../../../components/loading";
import {useParams} from "react-router-dom";



const UpdateBookFormValidationSchema = yup.object({
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


const UpdateBookPage = ({getNewTokenRequest, authenticateReducer}) => {
    const {jwtToken, id} = authenticateReducer;
    const param = useParams();
    const [user, setUser] = useState({});
    const dispatch = useDispatch();
    const [imagesDisplay, setImagesDisplay] = useState([])
    const fileInputRef = useRef(null)
    const [dataRecive, setDataRecive] = useState([])
    const [loading, setLoading] = useState(false)
    const jwtTokenState = useRef(jwtToken);
    const [pendingRequest, setPendingRequest] = useState([]);
    const [categories, setCategories] = useState([]);
    // const [categoriesSelected, setCategoriesSelected] = useState([]);
    const [stallData, setStallData] = useState();


    const dataBookInit = {
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

    }

    const [dataUpdate, setDataUpdate] = useState(dataBookInit);

    useEffect(() => {
        loadingRequest();
        formik.setFieldValue('stallId', stallData);
        // let imageUpload = imagesDisplay.map((item) => item.dataImage)
        // formik.setFieldValue('bookImages', imageUpload);
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

        }, validationSchema: UpdateBookFormValidationSchema,
        onSubmit: async (value) => {
            console.log("value", value)
            setLoading(true);
            setTimeout(async () => {
                const {data, status} = await updateBookPost( jwtTokenState.current, param.id, value)
                if (status === 200) {
                    toast.success(data.message);
                    setLoading(false);
                    toast.success("Update Book Successfully");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000)
                } else {
                    toast.error(data.message);
                    setLoading(false);
                }

            }, 1000);


        }
    });
    const loadingGetBookRequest = useCallback(async () => {
        const loadPendingRequests = async () => {
            const {data, status} = await getBookById(jwtTokenState.current, param.id);
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
            return data
        }
    }, [dataUpdate])

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


    // const onFileSelect = async (event) => {
    //     const files = event.target.files;
    //
    //     if (files.length === 0) return;
    //
    //     const imagePromises = [];
    //
    //     for (let i = 0; i < files.length; i++) {
    //         if (files[i].type.split('/')[0] !== 'image') continue;
    //         if (!imagesDisplay.some((e) => e.name === files[i].name)) {
    //             const imagePromise = new Promise(async (resolve) => {
    //                 const imagePath = await resizeFileBase64(files[i]);
    //                 resolve({
    //                     id: "", // Để trống nếu là ảnh mới
    //                     url: URL.createObjectURL(files[i]),
    //                     dataImage: imagePath,
    //                 });
    //             });
    //
    //             imagePromises.push(imagePromise);
    //         }
    //     }
    //
    //     Promise.all(imagePromises)
    //         .then((newImages) => {
    //             setImagesDisplay((prevImages) => [...prevImages, ...newImages]);
    //
    //             // Cập nhật dataUpdate khi thêm ảnh mới
    //             setDataUpdate((prevDataUpdate) => ({
    //                 ...prevDataUpdate,
    //                 bookImages: [
    //                     ...prevDataUpdate.bookImages,
    //                     ...newImages.map((newImage) => ({
    //                         id: newImage.id, // Giữ nguyên id nếu đã có, có thể để trống nếu là ảnh mới
    //                         dataImage: newImage.dataImage,
    //                     })),
    //                 ],
    //             }));
    //
    //             // Tiếp theo, cập nhật formik khi tất cả các ảnh đã được xử lý
    //             return Promise.all(newImages.map((newImage) => ({
    //                 id: newImage.id, // Giữ nguyên id nếu đã có, có thể để trống nếu là ảnh mới
    //                 dataImage: newImage.dataImage,
    //             })));
    //         })
    //         .then((imageUpload) => {
    //             formik.setFieldValue('bookImages', imageUpload);
    //         });
    // };
    const onFileSelect = async (event) => {
        const files = event.target.files;

        if (files.length === 0) return;

        // Lưu trữ giá trị hiện tại của bookImages trong dataUpdate
        const currentDataUpdateBookImages = [...dataUpdate.bookImages];

        const imagePromises = [];

        for (let i = 0; i < files.length; i++) {
            if (files[i].type.split('/')[0] !== 'image') continue;
            if (!imagesDisplay.some((e) => e.name === files[i].name)) {
                const imagePromise = new Promise(async (resolve) => {
                    const imagePath = await resizeFileBase64(files[i]);
                    resolve({
                        id: "", // Để trống nếu là ảnh mới
                        url: URL.createObjectURL(files[i]),
                        dataImage: imagePath,
                    });
                });

                imagePromises.push(imagePromise);
            }
        }

        Promise.all(imagePromises)
            .then((newImages) => {
                setImagesDisplay((prevImages) => [...prevImages, ...newImages]);

                // Cập nhật dataUpdate khi thêm ảnh mới
                setDataUpdate((prevDataUpdate) => ({
                    ...prevDataUpdate,
                    bookImages: [
                        ...prevDataUpdate.bookImages,
                        ...newImages.map((newImage) => ({
                            id: newImage.id, // Giữ nguyên id nếu đã có, có thể để trống nếu là ảnh mới
                            dataImage: newImage.dataImage,
                        })),
                    ],
                }));

                // Thêm giữ nguyên các phần tử trong dataUpdate.bookImages vào kết quả trả về
                return [
                    ...currentDataUpdateBookImages,
                    ...newImages.map((newImage) => ({
                        id: newImage.id, // Giữ nguyên id nếu đã có, có thể để trống nếu là ảnh mới
                        dataImage: newImage.dataImage,
                    })),
                ];
            })
            .then((imageUpload) => {
                // Cập nhật formik với giá trị mới
                formik.setFieldValue('bookImages', imageUpload);
            });
    };




    // const handleSelectCategory = (categoryItem) => {
    //     setDataUpdate((prevDataUpdate) => {
    //         // Kiểm tra xem categoryItem đã tồn tại trong categories hay chưa
    //         const isCategoryExist = prevDataUpdate.categories.some(item => item.id === categoryItem.id);
    //
    //         if (!isCategoryExist) {
    //             // Thêm categoryItem vào categories trong prevDataUpdate
    //             const updatedCategories = [...prevDataUpdate.categories, categoryItem];
    //
    //             // Cập nhật dataUpdate với categories mới
    //             const updatedDataUpdate = {
    //                 ...prevDataUpdate,
    //                 categories: updatedCategories,
    //             };
    //
    //             // Cập nhật giá trị của 'categories' trong formik
    //             formik.setFieldValue('categories', updatedCategories);
    //
    //             // Trả về updatedDataUpdate để cập nhật state
    //             return updatedDataUpdate;
    //         }
    //
    //         // Nếu categoryItem đã tồn tại, trả về nguyên trạng thái không thay đổi của prevDataUpdate
    //         return prevDataUpdate;
    //     });
    // };

    const handleSelectCategory = (categoryItem) => {
        setDataUpdate((prevDataUpdate) => {
            // Kiểm tra xem categoryItem đã tồn tại trong categories hay chưa
            const isCategoryExist = prevDataUpdate.categories.some(item => item.id === categoryItem.id);

            if (!isCategoryExist) {
                // Thêm categoryItem vào categories trong prevDataUpdate
                const updatedCategories = [...prevDataUpdate.categories, {
                    id: categoryItem.id,
                    categoryName: categoryItem.categoryName,
                    createAt: categoryItem.createAt,
                    createdBy: categoryItem.createdBy,
                    updateAt: categoryItem.updateAt,
                    updateBy: categoryItem.updateBy,
                    isDeleted: categoryItem.isDeleted,
                    deleteAt: categoryItem.deleteAt,
                    deleteBy: categoryItem.deleteBy,
                }];

                // Cập nhật dataUpdate với categories mới
                const updatedDataUpdate = {
                    ...prevDataUpdate,
                    categories: updatedCategories,
                };

                // Cập nhật giá trị của 'categories' trong formik
                formik.setFieldValue('categories', updatedCategories);

                // Trả về updatedDataUpdate để cập nhật state
                return updatedDataUpdate;
            }

            // Nếu categoryItem đã tồn tại, trả về nguyên trạng thái không thay đổi của prevDataUpdate
            return prevDataUpdate;
        });
    };




    const handleRemoveCategory = (categoryItem) => {
        setDataUpdate((prevDataUpdate) => {
            const isCategoryExist = prevDataUpdate.categories.some(item => item.id === categoryItem.id);

            if (isCategoryExist) {
                // Lọc bỏ categoryItem khỏi categories trong prevDataUpdate
                const updatedCategories = prevDataUpdate.categories.filter(item => item !== categoryItem);

                // Cập nhật dataUpdate với categories mới
                const updatedDataUpdate = {
                    ...prevDataUpdate,
                    categories: updatedCategories,
                };

                // Cập nhật giá trị của 'categories' trong formik
                formik.setFieldValue('categories', updatedCategories);

                // Trả về updatedDataUpdate để cập nhật state
                return updatedDataUpdate;
            }

            // Nếu categoryItem không tồn tại, trả về nguyên trạng thái không thay đổi
            return prevDataUpdate;
        });
    };



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


    // useEffect(() => {
    //     loadingGetBookRequest().then(dataResponse => {
    //         // Kiểm tra và set dữ liệu cho bookImages
    //         const bookImages = dataResponse.images && dataResponse.images.length > 0
    //             ? dataResponse.images
    //             : [];
    //
    //         const categories = dataResponse.bookCategories.map(item => (item.category));
    //
    //         console.log("response", dataResponse)
    //
    //
    //         // Set dữ liệu cho dataUpdate
    //         setDataUpdate(prevState => ({
    //             ...prevState,
    //             title: dataResponse.title,
    //             author: dataResponse.author,
    //             availbleQuantity: dataResponse.availbleQuantity,
    //             bookImages: bookImages,
    //             categories: categories,
    //             description: dataResponse.description,
    //             numPage: dataResponse.numPage,
    //             price: dataResponse.price,
    //             sellStatus: dataResponse.post.sellStatus, // Lấy giá trị từ post
    //             stallId: dataResponse.post.stallId, // Lấy giá trị từ post
    //         }));
    //
    //         // Set dữ liệu cho initialValues của formik
    //         formik.setValues({
    //             ...formik.values,
    //             title: dataResponse.title,
    //             author: dataResponse.author,
    //             availbleQuantity: dataResponse.availbleQuantity,
    //             bookImages: bookImages,
    //             categories: categories,
    //             description: dataResponse.description,
    //             numPage: dataResponse.numPage,
    //             price: dataResponse.price,
    //             sellStatus: dataResponse.post.sellStatus, // Lấy giá trị từ post
    //             stallId: dataResponse.post.stallId, // Lấy giá trị từ post
    //         });
    //
    //         const updatedImagesDisplay = dataResponse.images.map(item => ({
    //             name: item.id,
    //             url: item.imageUrl, // Set imageUrl vào url của imagesDisplay
    //             dataImage: item.imageUrl,
    //         }));
    //
    //         // Set dữ liệu cho imagesDisplay
    //         setImagesDisplay(updatedImagesDisplay);
    //
    //         // Console.log giá trị của imagesDisplay
    //         console.log("Giá trị của imagesDisplay:", updatedImagesDisplay);
    //
    //         // Console.log giá trị của formik
    //         console.log("Giá trị của formik:", formik.values);
    //     });
    // }, [formik.setValues]);

    // useEffect(() => {
    //     loadingGetBookRequest().then(dataResponse => {
    //         // Kiểm tra và set dữ liệu cho bookImages
    //         const fetchPromises = dataResponse.images && dataResponse.images.length > 0
    //             ? dataResponse.images.map(item => {
    //                 // Trả về promise từ việc fetch và decode dữ liệu base64 từ item.imageUrl
    //                 return new Promise((resolve, reject) => {
    //                     fetch(item.imageUrl)
    //                         .then(response => response.blob())
    //                         .then(blob => {
    //                             const reader = new FileReader();
    //                             reader.onloadend = () => {
    //                                 const base64data = reader.result;
    //                                 resolve({
    //                                     id: item.id,
    //                                     url: item.imageUrl,
    //                                     dataImage: base64data,
    //                                 });
    //                             };
    //                             reader.readAsDataURL(blob);
    //                         })
    //                         .catch(error => {
    //                             reject(error);
    //                         });
    //                 });
    //             })
    //             : [];
    //
    //         // Sử dụng Promise.all để đợi tất cả các promises được giải quyết
    //         Promise.all(fetchPromises)
    //             .then(decodedImages => {
    //                 // decodedImages chứa danh sách ảnh đã được decode
    //                 const categories = dataResponse.bookCategories.map(item => (item.category));
    //                 const dataImages = decodedImages.map(item => item.dataImage);
    //
    //                 // Set dữ liệu cho dataUpdate
    //                 setDataUpdate(prevState => ({
    //                     ...prevState,
    //                     title: dataResponse.title,
    //                     author: dataResponse.author,
    //                     availbleQuantity: dataResponse.availbleQuantity,
    //                     bookImages: dataImages, // Sử dụng danh sách ảnh đã được decode
    //                     categories: categories,
    //                     description: dataResponse.description,
    //                     numPage: dataResponse.numPage,
    //                     price: dataResponse.price,
    //                     sellStatus: dataResponse.post.sellStatus,
    //                     stallId: dataResponse.post.stallId,
    //                 }));
    //
    //                 // Set dữ liệu cho initialValues của formik
    //                 formik.setValues({
    //                     ...formik.values,
    //                     title: dataResponse.title,
    //                     author: dataResponse.author,
    //                     availbleQuantity: dataResponse.availbleQuantity,
    //                     bookImages: dataImages, // Sử dụng danh sách ảnh đã được decode
    //                     categories: categories,
    //                     description: dataResponse.description,
    //                     numPage: dataResponse.numPage,
    //                     price: dataResponse.price,
    //                     sellStatus: dataResponse.post.sellStatus,
    //                     stallId: dataResponse.post.stallId,
    //                 });
    //
    //                 // Cập nhật imageUrl từ bookImages của dataUpdate vào imagesDisplay
    //                 const updatedImagesDisplay = decodedImages.map(item => ({
    //                     name: item.name,
    //                     url: item.url,
    //                     dataImage: item.dataImage,
    //                 }));
    //
    //                 // Cập nhật imagesDisplay
    //                 setImagesDisplay(updatedImagesDisplay);
    //
    //                 // Console.log giá trị của imagesDisplay
    //                 console.log("Giá trị của imagesDisplay:", updatedImagesDisplay);
    //             })
    //             .catch(error => {
    //                 console.error("Lỗi khi fetch hoặc decode hình ảnh:", error);
    //             });
    //     });
    // }, [formik.setValues]);

    useEffect(() => {
        loadingGetBookRequest().then(dataResponse => {
            // Kiểm tra và set dữ liệu cho bookImages
            const fetchPromises = dataResponse.images && dataResponse.images.length > 0
                ? dataResponse.images.map(item => {
                    // Trả về promise từ việc fetch và decode dữ liệu base64 từ item.imageUrl
                    return new Promise((resolve, reject) => {
                        fetch(item.imageUrl)
                            .then(response => response.blob())
                            .then(blob => {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    const base64data = reader.result;
                                    resolve({
                                        id: item.id,
                                        url: item.imageUrl,
                                        dataImage: base64data,
                                    });
                                };
                                reader.readAsDataURL(blob);
                            })
                            .catch(error => {
                                reject(error);
                            });
                    });
                })
                : [];

            // Sử dụng Promise.all để đợi tất cả các promises được giải quyết
            Promise.all(fetchPromises)
                .then(decodedImages => {
                    // decodedImages chứa danh sách ảnh đã được decode
                    const categories = dataResponse.bookCategories.map(item => (item.category));

                    // Lấy danh sách các ảnh chỉ chứa id và dataImage
                    const simplifiedImages = decodedImages.map(item => ({
                        id: item.id,
                        dataImage: item.dataImage,
                    }));

                    // Set dữ liệu cho dataUpdate
                    setDataUpdate(prevState => ({
                        ...prevState,
                        title: dataResponse.title,
                        author: dataResponse.author,
                        availbleQuantity: dataResponse.availbleQuantity,
                        bookImages: simplifiedImages, // Sử dụng danh sách ảnh chỉ chứa id và dataImage
                        categories: categories,
                        description: dataResponse.description,
                        numPage: dataResponse.numPage,
                        price: dataResponse.price,
                        sellStatus: dataResponse.post.sellStatus,
                        stallId: dataResponse.post.stallId,
                    }));

                    // Set dữ liệu cho initialValues của formik
                    formik.setValues({
                        ...formik.values,
                        title: dataResponse.title,
                        author: dataResponse.author,
                        availbleQuantity: dataResponse.availbleQuantity,
                        bookImages: simplifiedImages, // Sử dụng danh sách ảnh chỉ chứa id và dataImage
                        categories: categories,
                        description: dataResponse.description,
                        numPage: dataResponse.numPage,
                        price: dataResponse.price,
                        sellStatus: dataResponse.post.sellStatus,
                        stallId: dataResponse.post.stallId,
                    });

                    // Cập nhật imageUrl từ bookImages của dataUpdate vào imagesDisplay
                    const updatedImagesDisplay = decodedImages.map(item => ({
                        id: item.id,
                        url: item.url,
                        dataImage: item.dataImage,
                    }));

                    // Cập nhật imagesDisplay
                    setImagesDisplay(updatedImagesDisplay);

                    // Console.log giá trị của imagesDisplay
                    console.log("Giá trị của imagesDisplay:", updatedImagesDisplay);
                })
                .catch(error => {
                    console.error("Lỗi khi fetch hoặc decode hình ảnh:", error);
                });
        });
    }, [formik.setValues]);






    const deleteImage = (index) => {
        // Tạo một bản sao của mảng imagesDisplay và loại bỏ phần tử tại index
        const updatedImagesDisplay = [...imagesDisplay];
        const deletedImage = updatedImagesDisplay.splice(index, 1)[0]; // Lấy ảnh đã xóa


        console.log("delete image", deletedImage)
        // Cập nhật imagesDisplay
        setImagesDisplay(updatedImagesDisplay);

        // Lấy mảng dataImage từ updatedImagesDisplay
        let imageUpload = updatedImagesDisplay.map((item) => ({
            id: item.id,
            dataImage: item.dataImage,
        }));

        // Cập nhật giá trị cho 'bookImages' trong formik
        formik.setFieldValue('bookImages', imageUpload);

        // Cập nhật giá trị cho 'bookImages' trong dataUpdate
        setDataUpdate((prevState) => ({
            ...prevState,
            bookImages: imageUpload,
        }));


    };




    return (
        <>
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
                                            {/*<ErrorMessage name={categoriesSelected} />*/}
                                        </div>

                                    ) :
                                    <div
                                        className='w-full h-[300px] border-solid border-2 border-indigo-600 rounded-md'>
                                        <div className='mx-3 my-3 flex flex-wrap'>
                                            {dataUpdate.categories?.map(item => (
                                                <div
                                                    key={item.categoryId}  // Đảm bảo có key duy nhất cho mỗi phần tử trong danh sách
                                                    className='hover:cursor-pointer w-fit px-3 py-1 bg-amber-100 rounded-md flex items-center mr-1'
                                                >
                                                    <span className='font-bold mr-2'>{item.categoryName}</span>
                                                    <IoIosCloseCircleOutline
                                                        onClick={() => handleRemoveCategory(item)}
                                                        className='hover:bg-gray-600 hover:rounded-3xl'
                                                    />
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
export  default connect(mapStateToProps, mapDispatchToProps)(UpdateBookPage)

