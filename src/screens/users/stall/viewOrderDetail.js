import {Chip, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Typography} from "@material-tailwind/react";
import StallLayout from "../../../layout/StallLayout";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    getOrderDetailByOrderId, getOrderDetailByOrderIdStallId,
    getStallByUserId,
    refreshToken,
    tokenRequestInterceptor,
    updateShippingStatus, updateStallStatus
} from "../../../apiServices";
import {getNewToken, getNewTokenSuccess, logoutSuccess} from "../../../store/actions/authenticateAction";
import {connect, useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import { Stepper, Step, Button } from "@material-tailwind/react";
import {shippingStatus} from "../../../constants/shippingStatus";
import {FaBox, FaClipboardList, FaMoneyCheck} from "react-icons/fa";
import {LiaShippingFastSolid} from "react-icons/lia";
import { PiArchiveBoxDuotone } from "react-icons/pi";
import truncateString from "../../../components/truncateString";
import Swal from "sweetalert2";
import {stallStatusConstant} from "../../../constants";





export function StepperWithIcon({orderDetail, orderId, userId, jwtToken}) {
    const [activeStep, setActiveStep] = React.useState(1);
    const [isLastStep, setIsLastStep] = React.useState(false);
    const [isFirstStep, setIsFirstStep] = React.useState(false);



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

    const handleUpdateOrderShippingRequest = (shippingStatus) => {
        Swal.fire({
            title: "Are you sure?",
            text: "The Order On Delivery?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I do!"
        }).then((result) => {
            if (result.isConfirmed) {
                updateOrderShippingRequest(shippingStatus).then(data => setActiveStep(3))
                Swal.fire({
                    title: "Deny Stall Request!",
                    text: "Cancel Change Shipping Status",
                    icon: "success"
                });
            }
        });
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
                    // lineClassName="bg-blue-500/50"
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
                        className={`${orderDetail[0]?.shippingStatus !== shippingStatus.Received ? 'hover:cursor-pointer' : ""}`}
                          // onClick={ () => {
                          //     if (orderDetail[0]?.shippingStatus !== shippingStatus.Received) {
                          //          updateOrderShippingRequest(shippingStatus.Prepare).then(data => setActiveStep(2))
                          //     } else {
                          //         console.log('Không thực hiện hành động vì orderDetail không phải là 3.');
                          //     }
                          // }}
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
                          className={`${orderDetail[0]?.shippingStatus !== shippingStatus.Received ? 'hover:cursor-pointer' : ""}`}
                          onClick={ () => {
                              if (orderDetail[0]?.shippingStatus !== shippingStatus.Received) {
                                  // updateOrderShippingRequest(shippingStatus.OnDelivery).then(data => setActiveStep(3))
                                  handleUpdateOrderShippingRequest(shippingStatus.OnDelivery)
                              } else {
                                  // Xử lý logic khi orderDetail không phải là 3 (ví dụ: hiển thị thông báo, không cho phép click, ...)
                                  console.log('Không thực hiện hành động vì orderDetail không phải là 3.');
                              }
                          }}
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
    const stallId = useRef();

    const [stallData, setStallData] = useState([]);
    const [orderDetail, setOrderDetail] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);


    const getStallInfo = useCallback(async () => {
        const loadPendingRequests = async () => {
            const {data, status} = await getStallByUserId(jwtTokenState.current, id);
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

    const getOrderDetail = useCallback(async () => {
        const loadPendingRequests = async () => {
            const {data, status} = await getOrderDetailByOrderIdStallId(jwtTokenState.current, param.id, stallId.current);
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


    useEffect(() => {
        const fetchData = async () => {
            try {
                const stallInfo = await getStallInfo();
                setStallData(stallInfo);
                stallId.current = stallInfo.id;

                if (stallInfo && stallInfo.id) {
                    const orderDetailData = await getOrderDetail();
                    setOrderDetail(orderDetailData);
                }
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

    console.log("price ", orderDetail[0]?.orderId)

    return (
        <>
            <StallLayout>
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
                        <div className='flex  flex-col items-end'>
                            {orderDetail[0]?.orderDetailData.map((item, index) => (
                                <div className='flex'>
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
                                </div>
                            ))}
                            <div className='mr-5 w-fit h-fit flex justify-evenly items-center'>
                                <p className='font-bold text-xl mx-4 text-blue-500'>Total Order:</p>
                                <p className='font-bold text-xl text-red-500'>{totalPrice} $</p>
                            </div>
                        </div>


                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewOrderDetailPage)