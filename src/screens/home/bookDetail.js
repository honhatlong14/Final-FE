import {Button, Carousel, IconButton, Rating, Typography} from "@material-tailwind/react";
import {useEffect, useRef, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {
    addToCart,
    createStall,
    getBookById,
    getBookPostByUserId, getPostByBookId,
    refreshToken,
    tokenRequestInterceptor
} from "../../apiServices";
import {getNewTokenSuccess, logoutSuccess} from "../../store/actions/authenticateAction";
import {Link, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {AiOutlineMinus, AiOutlinePlus} from "react-icons/ai";
import {Input} from '@mui/material';
import routes from "../../config/routes";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import CommentPage from "./comment";

export function CarouselCustomArrows({data}) {
    return (
        <Carousel
            className="rounded-xl w-[430px] h-[430px]"
            prevArrow={({handlePrev}) => (<IconButton
                variant="text"
                color="white"
                size="lg"
                onClick={handlePrev}
                className="!absolute top-2/4 left-4 -translate-y-2/4"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                </svg>
            </IconButton>)}
            nextArrow={({handleNext}) => (<IconButton
                variant="text"
                color="white"
                size="lg"
                onClick={handleNext}
                className="!absolute top-2/4 !right-4 -translate-y-2/4"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                </svg>
            </IconButton>)}
        >
            {data?.map((item) => (<img
                key={item.bookId}
                src={item.imageUrl}
                alt={item.bookId}
                className="h-full w-full object-cover"
            />))}
        </Carousel>
    );
}


const BookDetailPage = ({authenticateReducer}) => {
    const {jwtToken, id} = authenticateReducer;
    const [pendingRequest, setPendingRequest] = useState([]);
    const dispatch = useDispatch();
    const jwtTokenState = useRef(jwtToken);
    const param = useParams();
    const [expanded, setExpanded] = useState(false);
    const [quantityBook, setQuantityBook] = useState(1);
    const navigate = useNavigate();
    const [dataAddBook, setDataAddBook] = useState({"bookId": "", "userId": ""})
    const [rating, setRating] = useState(pendingRequest.rating);

    useEffect(() => {
        setRating(pendingRequest.rating);
        console.log(rating)
    }, [pendingRequest.rating]);



    const ExpandableText = (text, maxLength) => {

        const toggleText = () => {
            setExpanded(!expanded);
        };

        const displayText = expanded ? text : text.slice(0, maxLength);

        return (<div>
            <p>{displayText}</p>
            {text.length > maxLength && (
                <button className='w-full my-3 mx-auto hover:cursor-pointer hover:font-bold' onClick={toggleText}>
                    {expanded ? 'Read Less' : 'Read More'}
                </button>)}
        </div>);
    }

    const formik = useFormik({
        initialValues: {
            bookId: param.id,
            userId: id,
            quantity: 1,
            total: 0
        },
        onSubmit: async (values) => {
            values.quantity = quantityBook;
            values.total = pendingRequest?.price * quantityBook;
            const {data, status} = await addToCart(jwtTokenState.current, values);
            if (status === 200) {
                toast.success("Add Book Successfully");
            } else {
                toast.error(JSON.stringify(data.message));
            }
        },
    })

    const handleAddToCart = async () => {

        const addToCartRequest = async () => {
            const {data, status} = await addToCart(jwtTokenState.current, dataAddBook);
            if (status === 200) {
                return {data, status};
            } else {
                toast.error(JSON.stringify(data.message));
            }
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

        const {status, data} = await tokenRequestInterceptor(addToCartRequest, getRefreshToken);
        if (status === 200) {
            console.log("Get refresh token in add to cart", data)
        } else {
            toast.error('Something went wrong!');
        }
    }


    const loadingRequest = (async () => {
        const loadPendingRequests = async () => {
            const {data, status} = await getBookById(jwtTokenState.current, param.id);
            if (status === 200) {
                return {data, status};
            } else {
                toast.error(JSON.stringify(data.message));
            }
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
            setDataAddBook({"bookId": param.id, "userId": id})
            return {data, status};
        }
    })




    useEffect(() => {
        loadingRequest();
    }, [jwtToken.current])

    const handleChangeQuantity = (e) => {
        const value = e.target.valueAsNumber
        setQuantityBook(value)
        formik.setFieldValue('quantity', value);
    }

    const handleIncrement = () => {
        setQuantityBook(quantityBook + 1);
    }

    const handleReduce = () => {
        if (quantityBook > 1) {
            setQuantityBook(quantityBook - 1)
        }
    }



    return (
        <div className='mt-18 flex'>
            <div className='w-full flex mt-3'>
                <div>
                    <div className='w-[1030px] flex justify-evenly'>
                        <div className='sticky top-0 h-fit'>
                            <CarouselCustomArrows data={pendingRequest.images}/>
                        </div>
                        <div className='w-[580px] h-fit flex flex-col '>
                            <div className='bg-[#f5f5fa] rounded-2xl mb-3'>
                                <div>
                                    <div className='font-bold text-2xl mx-3 mt-3 overflow-hidden break-words'>{pendingRequest.title}</div>

                                    <div className='flex'>
                                        <div className='mx-3 flex items-center'>
                                            <div>{pendingRequest.rating}</div>
                                            {/*<Rating className='' value={4} readonly />*/}
                                            <Rating  size='small' value={5} readonly />
                                        </div>
                                        <div className=' h-[20px] border-r-[2px]'></div>
                                        <Typography className='mx-3'
                                                    variant="">Sold: {pendingRequest.quantitySold}</Typography>
                                    </div>
                                </div>

                                <div className='mx-3 my-3'>
                                    <Typography variant="h4">{pendingRequest.price} $</Typography>
                                </div>
                            </div>
                            <div className='bg-[#f5f5fa] rounded-2xl px-3 py-3'>
                                <div className='font-bold text-2xl'>
                                    Description
                                </div>
                                <div>
                                    <p className='whitespace-pre-wrap text-md'>{pendingRequest.description ? ExpandableText(pendingRequest.description, 1000) : ''}</p>
                                </div>
                            </div>
                            {/*TODO: Làm 1 cái thông tin stall ở đây*/}
                            {/*<div>*/}
                            {/*    Thông tin của Stall */}
                            {/*</div>*/}
                        </div>
                    </div>
                    {/*TODO: LÀM 1 CUSTOMER REVIEW Ở ĐÂY   ========================================*/}
                    <div className='bg-[#f5f5fa] rounded-2xl h-fit max-w-[1020px]'>
                       <CommentPage bookId={param.id} />
                    </div>
                </div>
                <div className='sticky flex-1 w-full h-fit top-0 bg-[#f5f5fa] px-3 py-3 rounded-2xl'>
                    <p className='mb-3'>Quantity</p>
                    <form

                    >
                        <div className='flex'>
                             <IconButton className='' onClick={handleReduce}
                                        disabled={quantityBook === 1}
                                        variant="outlined"><AiOutlineMinus/></IconButton>

                            <input
                                type='number'
                                name='quantity'
                                value={quantityBook}
                                onChange={handleChangeQuantity}
                                className='appearance-none rounded-xl hide-number-input mx-1 w-[50px] border-solid border-[3px] text-center'/>

                            <IconButton className='' onClick={handleIncrement}
                                        variant="outlined"><AiOutlinePlus/></IconButton>
                        </div>

                    </form>
                    <div className='my-3'>
                        <p>Temporary total</p>
                        <div>
                            <p className='font-bold text-2xl'>
                                {pendingRequest?.price * quantityBook} $
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        {/*<Button onClick={() => {*/}
                        {/*    navigate(`${routes.cart}`)*/}
                        {/*}} color="red" className='mb-3'>*/}
                        {/*    Buy Now*/}
                        {/*</Button>*/}
                        <Button onClick={(e) => {
                            e.preventDefault();
                            formik.handleSubmit()
                        }} type="submit" color="blue" variant='outlined'>Add to cart</Button>

                    </div>

                </div>
            </div>

        </div>)
}

const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer,
    };
};

export default connect(mapStateToProps)(BookDetailPage)