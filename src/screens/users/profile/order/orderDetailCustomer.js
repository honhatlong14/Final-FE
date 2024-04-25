import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter, Chip, Stepper, Step, Typography, Tooltip, Input, Textarea, Rating
} from "@material-tailwind/react";
import  {useCallback, useRef, useState, useEffect} from "react";
import {connect, useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {getNewToken, getNewTokenSuccess, logoutSuccess} from "../../../../store/actions/authenticateAction";
import truncateString from "../../../../components/truncateString";
import {
    createComment,
    getOrderDetailByOrderId, getOrderDetailByOrderIdStallId, getPostByBookId,
    getStallByUserId,
    refreshToken,
    tokenRequestInterceptor, updateShippingStatus
} from "../../../../apiServices";
import StallLayout from "../../../../layout/StallLayout";
import {shippingStatus} from "../../../../constants/shippingStatus";
import {FaBox, FaClipboardList, FaMoneyCheck} from "react-icons/fa";
import {LiaShippingFastSolid} from "react-icons/lia";
import {PiArchiveBoxDuotone} from "react-icons/pi";
import {toast} from "react-toastify";
import {MdFeedback} from "react-icons/md";
import {TooltipWithHelperIcon} from "../../../../components/TooltipWithHelperIcon";
import ProfileLayout from "../../../../layout/ProfileLayout";


const DialogCustom = ({openData, updateOpenData, orderId, userId, jwtToken}) => {
    const handleCancelDialog = () => {
        updateOpenData(!openData)
    }

    const handleOpenDialog = () => {
        updateOpenData(!openData)
    }

    const handleConfirmDialog = async () => {
        const updateShippingRequest = async () => {
            const {
                data,
                status
            } = await updateShippingStatus(jwtToken.current, orderId, userId, shippingStatus.Received);
            return {data, status};
        }
        updateShippingRequest().then(dataPre => {
            handleCancelDialog()
            if(dataPre.status === 200)
            toast.success("Thank you for choosing us. Enjoy your book!");
            setTimeout(() => {
                window.location.reload();
            }, 2000)
        })

    }

    return (
        <>
            <Dialog open={openData} handler={handleOpenDialog}>
                <DialogHeader>Checking your delivery</DialogHeader>
                <DialogBody>
                    "Are you sure you have received the book from the carrier?
                    Please note that clicking on the confirmation button means you take full responsibility for the delivery and transportation process.
                    Make sure to check thoroughly before confirming to ensure everything is in perfect order."
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleCancelDialog}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="blue" onClick={handleConfirmDialog}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>

        </>
    );
}


const FeedBack = ({openData, updateShowComment, bookId, userId, jwtToken, commentInfo}) => {
    const formCommentInit = {
        bookId: bookId,
        userId: userId,
        postId: "",
        text: "",
        rating: 1
    }

    const [formComment, setFormComment] = useState(formCommentInit);



    useEffect(() => {
        const loadPostInfoRequests = async () => {
            const { data, status } = await getPostByBookId(jwtToken.current, bookId);
            return { data, status };
        }

        loadPostInfoRequests().then(preData => {
            setFormComment(pre => ({
                ...pre,
                postId: preData.data.id
            }));
        });
    }, []);



    const handleFeedBack = async () => {
            const {data, status} = await createComment(formComment, jwtToken.current);
            if (status === 200) {
                toast.success("Comment Successfully");
                updateShowComment(!openData)
            }
            else{
                toast.error(data.message);
            }

    }



    return (
        <>
            <div className='flex flex-col items-end'>
                <div className='self-start my-3'>
                    <span className='font-bold text-xl '>{commentInfo.title}</span>
                </div>
                <div className="w-72">
                    <Textarea
                        type="text"
                        placeholder="Comment"
                        className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                        labelProps={{
                            className: "hidden",
                        }}
                        onChange={e => setFormComment(pre => ({
                            ...pre,
                            text: e.target.value
                        }))}
                        containerProps={{ className: "min-w-[100px]" }}
                    />
                </div>
                <Rating className='my-3' value={formComment.rating} onChange={(value) => setFormComment(pre => ({
                    ...pre,
                    rating: value
                }))} />
                <Button className='w-48' onClick={handleFeedBack}>Send FeedBack</Button>
            </div>

        </>
    );
}

export function StepperWithIcon({orderDetail, orderId, userId, jwtToken}) {
    const [activeStep, setActiveStep] = useState(1);
    const [isLastStep, setIsLastStep] = useState(false);
    const [isFirstStep, setIsFirstStep] = useState(false);



    const setOrderDetailStep = () => {
        if(orderDetail[0]?.shippingStatus === shippingStatus.Prepare) {
            setActiveStep(2)
        }
        if(orderDetail[0]?.shippingStatus === shippingStatus.OnDelivery) {
            setActiveStep(3)
        }
        if(orderDetail[0]?.shippingStatus === shippingStatus.Received) {
            setActiveStep(4)
        }
    }

    const updateOrderShippingRequest = async (shippingStatus) => {
        const {data, status} = await updateShippingStatus(jwtToken.current, orderId,userId, shippingStatus);
        return {data, status};
    }

    useEffect( () => {
        setOrderDetailStep()
    },[orderDetail])

    console.log("order", orderDetail[0]?.shippingStatus)

    return (
        <div className="w-full h-fit py-4 px-8">
            <Stepper
                activeLineClassName="bg-blue-500"
                activeStep={activeStep}
                isLastStep={(value) => setIsLastStep(value)}
                isFirstStep={(value) => setIsFirstStep(value)}
            >
                <Step activeClassName="bg-blue-500"
                      completedClassName="bg-blue-500"

                >
                    <FaClipboardList className="h-5 w-5" />
                    <div className="absolute -bottom-[2.5rem] w-max text-center">
                        <Typography
                            variant="h6"
                            color={activeStep === 0 ? "blue-gray" : "gray"}
                        >
                            Placed Order
                        </Typography>
                    </div>
                </Step >
                <Step activeClassName="bg-blue-500"
                      completedClassName="bg-blue-500" >
                    <FaMoneyCheck className="h-5 w-5" />
                    <div className="absolute -bottom-[4.2rem] w-[177px] text-center">
                        <Typography
                            variant="h6"
                            color={activeStep === 0 ? "blue-gray" : "gray"}
                        >
                            Payment information confirmed
                        </Typography>
                    </div>
                </Step>
                <Step activeClassName="bg-blue-500"
                      completedClassName="bg-blue-500"
                >
                    <FaBox className="h-5 w-5" />
                    <div className="absolute -bottom-[2.5rem] w-max text-center">
                        <Typography
                            variant="h6"
                            color={activeStep === 0 ? "blue-gray" : "gray"}
                        >
                            Prepare
                        </Typography>
                    </div>
                </Step>
                <Step activeClassName="bg-blue-500"
                      completedClassName="bg-blue-500"
                >
                    <LiaShippingFastSolid  className="h-5 w-5" />
                    <div className="absolute -bottom-[2.5rem] w-max text-center">
                        <Typography
                            variant="h6"
                            color={activeStep === 0 ? "blue-gray" : "gray"}
                        >
                            On Delivery
                        </Typography>
                    </div>
                </Step>
                <Step
                    activeClassName="bg-blue-500"
                    completedClassName="bg-blue-500"
                >
                    <PiArchiveBoxDuotone className="h-5 w-5" />
                    <div className="absolute -bottom-[2.5rem] w-max text-center">
                        <Typography
                            variant="h6"
                            color={activeStep === 0 ? "blue-gray" : "gray"}
                        >
                            Received
                        </Typography>
                    </div>
                </Step>
            </Stepper>
        </div>

    );
}
const ViewOrderDetailPage = ({authenticateReducer, getNewTokenRequest}) => {
    const {jwtToken, id} = authenticateReducer;
    const jwtTokenState = useRef(jwtToken);
    const dispatch = useDispatch();
    const param = useParams();

    const commentInfoInit = {
        bookId : "",
        title: "",
    }

    const stallId = useRef();
    const [open, setOpen] = useState(false);


    const [stallData, setStallData] = useState([]);
    const [orderDetail, setOrderDetail] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showComment, setShowComment] = useState(false);
    const [bookIdComment, setBookIdComment] = useState("");
    const [commentInfo, setCommentInfo] = useState(commentInfoInit);



    const updateOpenData = (newData) => {
        setOpen(newData);
    };

    const updateShowComment = (newData) => {
        setShowComment(newData);
    };

    const toggleComment = (bookId, bookTitle) => {
        setBookIdComment(bookId);
        setCommentInfo({
            bookId: bookId,
            title: bookTitle,
        });
        setShowComment(true);
    };



    const getOrderDetail = useCallback(async () => {
        const loadPendingRequests = async () => {
            const {data, status} = await getOrderDetailByOrderId(jwtTokenState.current, param.id);
            return {data, status};
        };

        const getRefreshToken = async () => {
            const {data, status} = await refreshToken(jwtTokenState.current);
            if (status === 200) {
                jwtTokenState.current = data.jwtToken;
                dispatch(getNewTokenSuccess(data));
            } else {
                dispatch(logoutSuccess());
            }
        };

        const {status, data} = await tokenRequestInterceptor(loadPendingRequests, getRefreshToken);
        if (status === 200) {
            return data;
        }

    }, [jwtToken, getNewTokenRequest])

    // TODO: CHECK
    useEffect(() => {
        const fetchData = async () => {
            try {
                const orderDetailData = await getOrderDetail();
                setOrderDetail(orderDetailData);
            } catch (error) {
                // Xử lý lỗi nếu có
                console.error("Error fetching data:", error);
            }
        };

        // Gọi hàm fetchData
        fetchData();
    }, []);


    useEffect(() => {
        let updatedValue = 0;
        for (let i = 0; i < orderDetail[0]?.orderDetailData.length; i++) {
            let total = orderDetail[0]?.orderDetailData[i].total;
            updatedValue += total;
        }
        setTotalPrice(updatedValue);
    }, [orderDetail]);




    return (
        <>
            <ProfileLayout>
                <div className='w-full h-fit '>
                    <div className='flex mb-3'>
                        <div className='w-[380px] max-w-[380px] bg-[#f5f5f5] h-fit px-3 py-3 mr-3 rounded-xl'>
                            <p className='font-bold text-xl mb-2'>Delivery address</p>
                            <p className='font-bold'>{orderDetail[0]?.fullName}</p>
                            <p>Phone Number: {`${orderDetail[0]?.phoneNumber}`}</p>
                            <p>Address: {`${orderDetail[0]?.streetNumber} ${orderDetail[0]?.streetName}, ${orderDetail[0]?.city} city, ${orderDetail[0]?.country} country`}</p>
                        </div>

                        <div className='flex-1 min-h-[150px] bg-[#f5f5f5] rounded-xl '>
                            <StepperWithIcon orderDetail={orderDetail} orderId={orderDetail[0]?.orderId} userId={id} jwtToken={jwtTokenState}/>
                        </div>
                    </div>
                    <div className='flex justify-between bg-[#f5f5f5] rounded-xl px-5 py-5'>
                        <div className='flex flex-col'>
                            <div>
                                <p className='font-bold text-xl mb-2'>Payment Method</p>
                                <Chip
                                    className='mb-1'
                                    size="sm"
                                    variant="ghost"
                                    value={
                                        orderDetail[0]?.paymentMethod === 0
                                            ? "Cash"
                                            : orderDetail[0]?.paymentMethod === 1
                                                ? "Cart"
                                                : ""
                                    }
                                    color={
                                        orderDetail[0]?.paymentMethod === 0
                                            ? "blue"
                                            : orderDetail[0]?.paymentMethod === 1
                                                ? "green"
                                                : ""
                                    }
                                />
                                <Chip
                                    size="sm"
                                    variant="ghost"
                                    value={
                                        orderDetail[0]?.paymentStatus === "success"
                                            ? "Paid"
                                            : orderDetail[0]?.paymentStatus === null
                                                ? "Not paid"
                                                : ""
                                    }
                                    color={
                                        orderDetail[0]?.paymentStatus === "success"
                                            ? "green"
                                            : orderDetail[0]?.paymentStatus === null
                                                ? "red"
                                                : ""
                                    }
                                />
                            </div>
                        </div>
                        <div className='w-fit'>
                            <p className='font-bold text-xl mb-2'>Order number</p>
                            <p>{orderDetail[0]?.orderId}</p>
                        </div>

                        <div className='flex flex-col items-end max-w-[650px] '>
                            {orderDetail[0]?.orderDetailData.map((item, index) => (
                                <div className='flex w-full'>
                                    <div
                                        className='w-[80px] h-[80px] relative mr-[5px] mb-[5px] flex items-center '>
                                        <img className='w-full h-full object-cover' src={item.bookImageUrl}
                                             alt={item.bookImageUrl}/>
                                    </div>
                                    <div className='w-[252px]'>
                                        {truncateString(item.bookTitle, 30)}
                                    </div>
                                    <div className='ml-5 w-[150px] h-fit flex'>
                                        <p>x</p> {(item.quantity)}
                                    </div>
                                    <div className='ml-5 w-[150px] h-fit flex justify-evenly'>
                                        <p>Total:</p> {item.total} đ
                                    </div>
                                    <div onClick={() => toggleComment(item.bookId, item.bookTitle)} >
                                        {orderDetail[0]?.shippingStatus === 2 ? <TooltipWithHelperIcon/> : <div></div> }
                                    </div>
                                </div>

                            ))}
                            <div className='mr-5 w-fit h-fit flex justify-evenly items-center'>
                                <p className='font-bold text-xl mx-4 text-blue-500'>Total Order:</p>
                                <p className='font-bold text-xl text-red-500'>{totalPrice} $</p>
                            </div>
                            <div className='mt-8'>
                                {orderDetail[0]?.shippingStatus === 2 ?
                                    <></>
                                    :
                                    <Button color="blue"
                                            onClick={() => setOpen(true)}
                                    >
                                        <p>I have received the Book</p>
                                    </Button>}
                            </div>
                            {showComment ? <FeedBack openData={showComment} updateShowComment={updateShowComment} jwtToken={jwtTokenState} userId={id} bookId={bookIdComment} commentInfo={commentInfo}/> : <div></div>}
                        </div>
                    </div>
                </div>
                {open ? <DialogCustom openData={open} updateOpenData={updateOpenData} orderId={orderDetail[0]?.orderId} userId={id} jwtToken={jwtTokenState}/> : <div></div>}
            </ProfileLayout>
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewOrderDetailPage)