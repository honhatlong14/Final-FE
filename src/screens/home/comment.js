import {Avatar, Rating} from "@material-tailwind/react";
import {useEffect, useRef, useState} from "react";
import {
    getAllComment, getAllCommentByPostId, getPostByBookId,
    getSingleUser, refreshToken,
    refreshToken as refreshTokenApi,
    tokenRequestInterceptor
} from "../../apiServices";
import {getNewToken, getNewTokenSuccess, logout, logoutSuccess} from "../../store/actions/authenticateAction";
import {toast} from "react-toastify";
import {connect, useDispatch} from "react-redux";
import moment from 'moment';
import {FaCircleCheck} from "react-icons/fa6";
import ExpandableText from "../../components/ExpandableText";
import images from "../../assets/images";


const formatDate = (dateString) => {
    return moment(dateString).format('MMM Do, YYYY');
};


const CommentPage = ({authenticateReducer, bookId}) => {
    const {refreshToken, jwtToken, id} = authenticateReducer;
    const [commentData, setCommentData] = useState([]);
    const dispatch = useDispatch();
    const jwtTokenState = useRef(jwtToken);
    const [postData, setPostData] = useState({});


    const getPostInfoRequest = async () => {
        const loadPendingRequests = async () => {
            const { data, status } = await getPostByBookId(jwtTokenState.current, bookId);
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
            setPostData(data);
            return { data, status };
        }
    };

    const getCommentData = async (postId) => {
        const { data, status } = await getAllCommentByPostId(jwtTokenState.current, postId);
        return { data, status };
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data, status } = await getPostInfoRequest();
            if (status === 200) {
                // Gọi getCommentData với postId từ dữ liệu đã lấy được
                const commentDataResult = await getCommentData(data.id);
                if (commentDataResult.status === 200) {
                    setCommentData(commentDataResult.data);
                } else if (commentDataResult.status === 401) {
                    toast.error(commentDataResult.data.message);
                } else {
                    toast.error(JSON.stringify(commentDataResult.data.errors));
                }
            }
        };

        fetchData();
    }, []);



    return (
        <>
            <div className='py-3 mt-3 '>
                <p className='font-bold text-2xl mx-3 my-3'>Customer Feedback</p>
                {commentData.length === 0 ?
                    (<div>
                        <div className='w-[850px] h-[430px] mx-auto '>
                            <img className='rounded-2xl' src={images.nonFeedback} alt="nonFeedback"/>
                        </div>
                        <div className='w-fit mx-auto'>
                            <p className='text-3xl font-bold'>No have any Feedback</p>
                        </div>
                    </div>)
                    : commentData?.map((item, index) => (
                    <div key={index}>
                        <div className='flex mb-5 divide-y-2 divide-slate-500 '>
                            <div className='flex self-start items-center w-[350px] mx-3'>
                                <Avatar className='mr-2' src={item.user.avatar} alt="avatar" size="md" />
                                <div className='flex flex-col'>
                                    <span className='font-bold text-xl'>{item.user.fullName}</span>
                                    <span className='text-sm'>{formatDate(item.user.createAt)}</span>
                                </div>
                            </div>
                            <div className='flex-1'>
                                <Rating value={item.rating} readonly />
                                <div className='flex items-center text-green-800 mb-5'>
                                    <FaCircleCheck />
                                    <span className='ml-2 text-green-800'>Purchased</span>
                                </div>
                                <div className='max-w-[98%]'>
                                    <p>{<ExpandableText text={item.text} maxLength={300} />}</p>
                                </div>
                            </div>
                        </div>
                        {/*<div className='w-[90%] mx-auto border-b-[3px]'>*/}
                        {/*</div>*/}
                    </div>
                ))}

                <div>

                </div>
            </div>
        </>
    )
}


const mapDispatchToProps = (dispatch) => {
    return {
        doLogout: (refreshToken, token) => dispatch(logout({refreshToken, token})),
        doGetNewToken: (token) => dispatch(getNewToken(token))
    }
}
const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer,

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentPage)