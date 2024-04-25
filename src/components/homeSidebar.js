import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip, Rating,
} from "@material-tailwind/react";
import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    InboxIcon,
    PowerIcon,
} from "@heroicons/react/24/solid";
import {getNewToken, getNewTokenSuccess, logoutSuccess} from "../store/actions/authenticateAction";
import {connect, useDispatch} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {
    getAllCategories,
    getBookByCategoryId,
    getBookByRating,
    getPostByBookId,
    tokenRequestInterceptor
} from "../apiServices";
import {toast} from "react-toastify";
import { FiFilter } from "react-icons/fi";
import {FaFilter} from "react-icons/fa";


const HomeSideBar = ({getNewTokenRequest, authenticateReducer, filterData, updateFilter}) => {

    const {jwtToken, id, refreshToken} = authenticateReducer;
    const dispatch = useDispatch();
    const jwtTokenState = useRef(jwtToken);
    const [categories, setCategories] = useState([]);


    const getCategoriesInfoRequest = async () => {
        const loadPendingRequests = async () => {
            const { data, status } = await getAllCategories(jwtTokenState.current);
            if (status === 200) {
                return { data, status };
            } else {
                toast.error(JSON.stringify(data.message));
            }
        };

        const getRefreshToken = async () => {
            const { data, status } = await refreshToken(jwtTokenState);
            if (status === 200) {
                jwtTokenState.current = data.jwtToken;
                dispatch(getNewTokenSuccess(data));
            } else {
                dispatch(logoutSuccess());
            }
        };

        const { status, data } = await tokenRequestInterceptor(loadPendingRequests, getRefreshToken);
        if (status === 200) {
            return { data, status };
        }
    };

    const getBooksByCategoryRequest = async (categoryId) => {
        const loadPendingRequests = async () => {
            const { data, status } = await getBookByCategoryId(jwtTokenState.current, categoryId);
            if (status === 200) {
                return { data, status };
            } else {
                toast.error(JSON.stringify(data.message));
            }
        };

        const getRefreshToken = async () => {
            const { data, status } = await refreshToken(jwtTokenState);
            if (status === 200) {
                jwtTokenState.current = data.jwtToken;
                dispatch(getNewTokenSuccess(data));
            } else {
                dispatch(logoutSuccess());
            }
        };

        const { status, data } = await tokenRequestInterceptor(loadPendingRequests, getRefreshToken);
        if (status === 200) {
            return { data, status };
        }
    };


    const getBooksByRatingRequest = async (rating) => {
        const loadPendingRequests = async () => {
            const { data, status } = await getBookByRating(jwtTokenState.current, rating);
            if (status === 200) {
                return { data, status };
            } else {
                toast.error(JSON.stringify(data.message));
            }
        };

        const getRefreshToken = async () => {
            const { data, status } = await refreshToken(jwtTokenState);
            if (status === 200) {
                jwtTokenState.current = data.jwtToken;
                dispatch(getNewTokenSuccess(data));
            } else {
                dispatch(logoutSuccess());
            }
        };

        const { status, data } = await tokenRequestInterceptor(loadPendingRequests, getRefreshToken);
        if (status === 200) {
            return { data, status };
        }
    };


    const handleFilterCategory = (categoryId) => {
        getBooksByCategoryRequest(categoryId).then(dataResponse => updateFilter(dataResponse.data));

    }


    const handleFilterRating = (rating) => {
        getBooksByRatingRequest(rating).then(dataResponse => updateFilter(dataResponse.data));
    }

    useEffect(() => {
        let isMounted = true; // Thêm một biến để kiểm tra xem component có còn được mount không

        const fetchData = async () => {
            try {
                const { data, status } = await getCategoriesInfoRequest();
                if (isMounted) {
                    if (status === 200) {
                        setCategories(data);
                    } else {
                        toast.error(JSON.stringify(data.errors));
                    }
                }
            } catch (error) {
                // Xử lý lỗi nếu có
                console.error("Error fetching data:", error);
            }
        }

        fetchData();

        // Cleanup function để đảm bảo không cập nhật state khi component đã unmount
        return () => {
            isMounted = false;
        };
    }, []);



    console.log("cate ", filterData)

    return (<>
        <div className=''>
            <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 bg-[#FAEED1]">
                <List>
                    <div className='flex flex-col'>
                        <div className='flex items-center'>
                            <FaFilter className='mr-1 text-lg' />
                            <Typography variant="h5" color="blue-gray">
                                Rating
                            </Typography>

                        </div>
                        <div onClick={() => handleFilterRating(5)} className='flex items-center '>
                            <Rating  className='my-1 mr-3' value={5} readonly  />
                            <span>5 start</span>
                        </div>
                        <div onClick={() => handleFilterRating(4)} className='flex items-center' >
                            <Rating className='my-1 mr-3' value={4} readonly />
                            <span>4 start</span>
                        </div>
                        <div onClick={() => handleFilterRating(3)} className='flex items-center '>
                            <Rating className='my-1 mr-3' value={3} readonly />
                            <span>3 start</span>
                        </div>

                    </div>
                    <div className="mb-1 p-1">
                        <div className='flex items-center'>
                            <FaFilter className='mr-1 text-lg' />
                            <Typography variant="h5" color="blue-gray">
                                Category
                            </Typography>
                        </div>
                    </div>
                    {categories?.map((item, index) => (
                        <ListItem
                            className=''
                            key={index}
                            onClick={() => handleFilterCategory(item.id)}
                        >
                            {/*<ListItemPrefix>*/}
                            {/*    <PresentationChartBarIcon className="h-5 w-5" />*/}
                            {/*</ListItemPrefix>*/}
                            {item.categoryName}
                        </ListItem>
                    ))}



                </List>
            </Card>
        </div>
    </>);
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeSideBar);