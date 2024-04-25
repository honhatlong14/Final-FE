import ProfileLayout from "../../../../layout/ProfileLayout";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    getAllOrders,
    refreshToken,
    tokenRequestInterceptor
} from "../../../../apiServices";
import {getNewToken, getNewTokenSuccess, logoutSuccess} from "../../../../store/actions/authenticateAction";
import {connect, useDispatch} from "react-redux";
import {
    Chip, Input,
} from "@material-tailwind/react";

import truncateString from "../../../../components/truncateString";
import images from "../../../../assets/images";
import {useNavigate} from "react-router-dom";
import routes from "../../../../config/routes";
import { FaSearch } from "react-icons/fa";


const OrderPage = ({authenticateReducer, getNewTokenRequest}) => {
    const {jwtToken, id} = authenticateReducer;
    const jwtTokenState = useRef(jwtToken);
    const [orderDetail, setOrderDetailData] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParam] = useState(["orderId"]);
    const [q, setQ] = useState("");


    function search(items) {
        return items.filter((item) => {
            return searchParam.some((newItem) => {
                return (
                    item[newItem]
                        .toString()
                        .toLowerCase()
                        .indexOf(q.toLowerCase()) > -1
                );
            });
        });
    }

    const loadingCartRequest = useCallback(async () => {
        const loadPendingRequests = async () => {
            const {data, status} = await getAllOrders(jwtTokenState.current, id);
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
            setOrderDetailData(data);
        }

    }, [jwtToken, getNewTokenRequest])

    useEffect(() => {
        loadingCartRequest()
    }, [])


    return (
        <ProfileLayout>
            {orderDetail.length !== 0 ?
                <div className='flex flex-col w-full'>
                    <div className="ml-3 my-5 relative flex w-full max-w-[24rem]">
                        <Input
                            type="email"
                            label="Input Order Number ..."
                            icon={ <FaSearch />}
                            onChange={e => setQ(e.target.value)}
                            className="pr-20"
                            containerProps={{
                                className: "min-w-0",
                            }}
                        />

                    </div>
                    <div>
                        <div className='px-3 py-3 mx-3 mb-3 min-w-[910px] bg-[#f5f5fa] h-fit'>
                            {search(orderDetail).map((i, index) => (
                                <div className='group bg-white mb-3'>
                                    <div className='group-hover:bg-[#f5f5fa] flex group-hover:cursor-pointer'>
                                        <div className='w-fit mx-1 min-w-[145px] '>
                                            <div className="w-max flex">
                                                <Chip
                                                    size="sm"
                                                    variant="ghost"
                                                    value={
                                                        i.paymentStatus === "success"
                                                            ? "Paid"
                                                            : i.paymentStatus === null
                                                                ? "Not paid"
                                                                : ""
                                                    }
                                                    color={
                                                        i.paymentStatus === "success"
                                                            ? "green"
                                                            : i.paymentStatus === null
                                                                ? "red"
                                                                : ""
                                                    }
                                                />
                                            </div>
                                            <div className="w-max">
                                                <Chip
                                                    size="sm"
                                                    variant="ghost"
                                                    value={
                                                        i.paymentMethod === 0
                                                            ? "Cash"
                                                            : i.paymentMethod === 1
                                                                ? "Cart"
                                                                : ""
                                                    }
                                                    color={
                                                        i.paymentMethod === 0
                                                            ? "blue"
                                                            : i.paymentMethod === 1
                                                                ? "blue"
                                                                : ""
                                                    }
                                                />
                                            </div>
                                            <div className="w-max">
                                                <Chip
                                                    size="sm"
                                                    variant="ghost"
                                                    value={
                                                        i.shippingStatus === 0
                                                            ? "Prepare"
                                                            : i.shippingStatus === 1
                                                                ? "On Delivery"
                                                                : i.shippingStatus === 2
                                                                    ? "Received"
                                                                    : ""
                                                    }
                                                    color={
                                                        i.shippingStatus === 0
                                                            ? "blue"
                                                            : i.shippingStatus === 1
                                                                ? "violet"
                                                                : i.shippingStatus === 2
                                                                    ? "green"
                                                                    : ""
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className='group-hover:bg-[#f5f5fa] group-hover:cursor-pointer'>
                                            <span className='font-bold text-xl mr-3'>Order Number:</span>
                                            <span className='font-bold text-cyan-500'>{i.orderId}</span>
                                        </div>
                                    </div>

                                    <div key={index}
                                         onClick={ () => navigate('/profile/order/orderDetail/' + i.orderId) }
                                         className='bg-white py-3 h-fit w-full flex flex-col items-center group-hover:bg-[#f5f5fa] group-hover:cursor-pointer'>
                                        {i.orderDetailsResponses.map((item, index) => (
                                            <div className='flex'>
                                                <div
                                                    className='w-[80px] h-[80px] relative mr-[5px] mb-[5px] flex items-center '>
                                                    <img className='w-full h-full object-cover' src={item.bookImageUrl}
                                                         alt={item.bookImageUrl}/>
                                                </div>
                                                <div className='w-[252px]'>
                                                    {truncateString(item.orderDetail.book.title, 30)}
                                                </div>
                                                <div className='ml-5 w-[150px] h-fit flex'>
                                                    <p>x</p> {(item.orderDetail.quantity)}
                                                </div>
                                                <div className='ml-5 w-[150px] h-fit flex justify-evenly'>
                                                    <p>Total:</p> {item.orderDetail.total} đ
                                                </div>
                                                <div className='ml-5 w-[150px] h-fit flex justify-evenly'>
                                                    <p>Stall:</p> {item.stallName}
                                                </div>
                                            </div>

                                        ))}

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                :
                <div className='flex flex-col hover:cursor-pointer hover:text-blue-800' onClick={() => navigate(`${routes.home}`)}>
                    <img className="w-[450px] h-[450px]" src={images.emptyOrder} alt=""/>
                    <p className="text-center text-2xl font-bold hover:cursor-pointer ">You have not
                        any order. Let's buy somethings</p>
                </div>
            }

        </ProfileLayout>
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


export default connect(mapStateToProps, mapDispatchToProps)(OrderPage);