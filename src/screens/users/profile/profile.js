import {connect, useDispatch} from "react-redux";
import UserSidebar from "../../../components/userSidebar";
import React, {useEffect, useRef, useState} from "react";
import {
    createBookPost,
    getSingleUser,
    refreshToken as refreshTokenApi,
    tokenRequestInterceptor,
    updateUserImage
} from "../../../apiServices";
import {getNewTokenSuccess, logoutSuccess} from "../../../store/actions/authenticateAction";
import {toast} from "react-toastify";
import {Link, useNavigate} from "react-router-dom";
import routes from "../../../config/routes";
import {Formik, useFormik, useFormikContext} from 'formik';
import ProfileLayout from "../../../layout/ProfileLayout";
import {FaBeer, FaPhoneAlt} from "react-icons/fa";
import {RiPencilLine} from "react-icons/ri";
import {IoClose} from "react-icons/io5";
import {BiSolidKey} from "react-icons/bi";
import {MdPhone} from "react-icons/md";
import {Loading} from "../../../components/loading";
import {Button} from "@material-tailwind/react";


const Profile = ({authenticateReducer}) => {
    const {refreshToken, jwtToken, id} = authenticateReducer;
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [dragDropImage, setDragDropImage] = useState(false)
    const [displayUploadedImage, setDisplayUploadedImage] = useState(null);
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false)


    let jwtTokenState = jwtToken;
    let refreshTokenState = refreshToken;

    const formik = useFormik({
        initialValues: {
            avtarFile: '',
        },
        onSubmit: async (value) => {
            const formData = new FormData();
            formData.append('avatarFile', value.avtarFile);
            setLoading(true)
            setTimeout(async () => {
                const {data, status} = await updateUserImage(jwtTokenState, id, formData)
                if (status === 200) {
                    toast.success("Update Avatar Successfully");
                    setLoading(false);
                    setTimeout(() => {
                        window.location.reload();
                    }, 500)
                } else {
                    toast.error(data.message);
                    setLoading(false);
                }

            }, 1000);
        },
    });

    const handleUpdateImage = () => {
        setDragDropImage((prev) => !prev)
        setDisplayUploadedImage(null)
    }

    const handleClick = () => {
        fileInputRef.current.click();
    }


    useEffect(() => {
        (async () => {
            const getSingleUserData = async () => {
                const {data, status} = await getSingleUser(jwtTokenState, id);
                return {data, status};
            };

            const getRefreshToken = async () => {
                const {data, status} = await refreshTokenApi(refreshTokenState);
                if (status === 200) {
                    jwtTokenState = data.jwtToken;
                    refreshTokenState = data.refreshToken;
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
    }, [id, jwtToken]);

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        formik.setFieldValue('avtarFile', file);
        setDisplayUploadedImage(URL.createObjectURL(file));
    };
    const handleInputChange = (event) => {
        const file = event.target.files[0];
        formik.setFieldValue('avtarFile', file);
        setDisplayUploadedImage(URL.createObjectURL(file));
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };


    return (
        <>
            <ProfileLayout>
                <main className='w-full mb-5 flex justify-center h-full overflow-y-hidden'>
                    <div className='w-full sm:mt-5'>
                        <div className='flex ml-8 h-full'>
                            <div className='pt-[5rem] px-6 w-fit h-fit '>
                                <div className="hover:cursor-pointer ">
                                    <div className='relative'
                                         onClick={handleUpdateImage}
                                    >
                                        <img
                                            className="w-[8rem] h-[8rem] rounded-[50%] ring ring-blue-600 ring-offset-base-100 ring-offset-2"
                                            src={user.avatar} alt="avatar"/>
                                        <RiPencilLine
                                            className='absolute bg-[#64646d] text-[#ffffff] rounded-full bottom-0 right-[10%] w-[16px] h-[16px]'/>
                                    </div>

                                </div>
                            </div>
                            <div className='pt-[20px] pl-4 w-[560px] pr-[70px]'>
                                <span className='block mb-4'>Personal Information</span>
                                <div className='h-full'>
                                    <form>
                                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                                            <div>
                                                <label htmlFor="first_name"
                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full
                                                    name</label>
                                                <input type="text" id="first_name"
                                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                       placeholder="John" required
                                                       disabled
                                                       value={user.fullName}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="last_name"
                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                                <input type="text" id="last_name"
                                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                       placeholder="Doe" required
                                                       disabled
                                                       value={user.email}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="phone"
                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone
                                                    number</label>
                                                <input type="text" id="phone"
                                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                       placeholder="123-45-678" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                                                       disabled
                                                       value={user.phoneNumber}
                                                       required/>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/*TODO: Vertical border to separate the box*/}
                            <div className='border-r-[1px] h-full'></div>
                            <div className='pt-[20px] pl-4 w-[560px] pr-[70px]'>
                                <span className='block mb-4'>Security</span>
                                <div className='flex items-center hover:cursor-pointer hover:text-cyan-800 mb-3'>
                                    <BiSolidKey className='w-8 h-8 mr-3 inline-block'/>
                                    <Link to={routes.updatePassword}>
                                        <span >Change Password</span>
                                    </Link>
                                </div>

                                <div onClick={() => navigate(`${routes.updatePhoneNumber}`)} className='flex items-center hover:cursor-pointer hover:text-cyan-800'>
                                    <MdPhone  className='w-8 h-8 mr-3 inline-block'/>
                                    <p>Change Phone Number</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                {/*</div>*/}

                {/* DRAG & DROP IMAGE*/}
                {dragDropImage &&
                    <div className='fixed inset-0 bg-black bg-opacity-80 z-[999] w-full h-full '>
                        <div
                            className='w-[400px] h-[400px] border-[2px] absolute top-[25%] left-[calc(50%-200px)] bg-white rounded-2xl'>
                            <div className='mb-3 flex justify-between'>
                                <span className='ml-4 mt-2'>Update Your Avatar</span>
                                <IoClose
                                    onClick={handleUpdateImage}
                                    className='mr-4 w-[25px] h-[25px] hover:cursor-pointer'/>
                            </div>
                            <div className='border-b-[2px] w-[calc(100%-30px)] m-auto'></div>
                            <div className='w-full h-[85%] px-3 py-3 bg-white '>
                                <form className='h-full'
                                      onSubmit={formik.handleSubmit}
                                >
                                    <div
                                        className={`w-full h-full bg-[#f5f5fa] border-2 border-dashed flex flex-col rounded-2xl`}
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onClick={handleClick}
                                    >
                                        <input type="file" id="input-file-upload" className='hidden'
                                               onChange={handleInputChange}
                                               ref={fileInputRef}
                                        />
                                        {displayUploadedImage ?
                                            <img className='w-full h-full' src={displayUploadedImage.toString()}
                                                 alt=""/> :
                                            <span className=' mx-auto my-auto'>Drag or Drop Image to here</span>}

                                    </div>
                                    {displayUploadedImage && (
                                        loading ? <Loading className='mx-auto '/> :
                                            <button type="submit"
                                            className="w-full upload-button hover:bg-amber-100 m-auto">
                                                Upload a file
                                        </button>
                                    )
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                }
            </ProfileLayout>
        </>
    )
}


const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer
    };
};

export default connect(mapStateToProps)(Profile);