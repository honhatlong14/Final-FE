import {connect, useDispatch} from "react-redux";
import routes from "../../../config/routes";
import {
    Button,
    Checkbox,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    Radio,
    Typography
} from "@material-tailwind/react";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    createOrderCashPayment,
    getAllCartByUserId,
    getAllCartSelected,
    getDefaultAddress,
    refreshToken, removeCartItem,
    tokenRequestInterceptor
} from "../../../apiServices";
import {getNewTokenSuccess, logoutSuccess} from "../../../store/actions/authenticateAction";
import {useNavigate} from "react-router-dom";
import {GoTrash} from "react-icons/go";
import {GiPayMoney} from "react-icons/gi";
import {FaCcVisa} from "react-icons/fa";
import {toast} from "react-toastify";


function truncateString(str, maxLength) {
    if (str.length <= maxLength) {
        return str;
    } else {
        return str.slice(0, maxLength) + "...";
    }
}


const CreateOrderPage = ({authenticateReducer, getNewTokenRequest}) => {
    const [defaultAddress, setDefaultAddress] = useState([]);
    const [cartData, setCartData] = useState([]);
    // const paymentMethod = useRef("");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [openDialog, setOpenDialog] = React.useState(false);


    const {jwtToken, id} = authenticateReducer;
    const jwtTokenState = useRef(jwtToken);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loadingDefaultAddressRequest = useCallback(async () => {
        const loadPendingRequests = async () => {
            const {data, status} = await getDefaultAddress(jwtTokenState.current, id);
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
            setDefaultAddress(data);
        }

    }, [jwtToken, getNewTokenRequest])

    const loadingCartRequest = useCallback(async () => {
        const loadPendingRequests = async () => {
            const {data, status} = await getAllCartSelected(jwtTokenState.current, id);
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
            setCartData(data);
        }

    }, [jwtToken, getNewTokenRequest])


    useEffect(() => {
        loadingDefaultAddressRequest()
        loadingCartRequest()
    }, [])

    const groupedStallName = {};
    cartData.forEach((item) => {
        if (!groupedStallName[item.stallName]) {
            groupedStallName[item.stallName] = [];
        }
        groupedStallName[item.stallName].push(item);
    });

    function DialogDefault({title}) {
        const handleOpenDialog = () => setOpenDialog(!openDialog);

        const handleCancelDialog = () => {
            setOpenDialog(!openDialog)
        }

        const handleConfirmDialog = () => {

            const loadingCreateOrderCashRequest = (async () => {
                const loadPendingRequests = async () => {
                    const {data, status} = await createOrderCashPayment(jwtTokenState.current, id);
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
                }
            })

            loadingCreateOrderCashRequest()
            setOpenDialog(!openDialog)
            toast.success("Create Order Successfully");

            setTimeout(() => navigate(`${routes.home}`) , 2000)

        }

        return (
            <>
                <Dialog open={openDialog} handler={handleOpenDialog}>
                    <DialogHeader>Hi friend!</DialogHeader>
                    <DialogBody divider>
                        {title}
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            variant="text"
                            color="red"
                            onClick={handleCancelDialog}
                            className="mr-1"
                        >
                            <span>No! I don't</span>
                        </Button>
                        <Button variant="gradient" color="green" onClick={handleConfirmDialog}>
                            <span>Yeahhhh!!! </span>
                        </Button>
                    </DialogFooter>
                </Dialog>
            </>
        );
    }

    const handlePaymentMethod = (paymentMethod) => {
        if(paymentMethod === "cash") {
            setOpenDialog(true)
        }
    }

    const displayItemsInCart = [];
    for (const stallName in groupedStallName) {
        if (groupedStallName.hasOwnProperty(stallName)) {
            displayItemsInCart.push(
                <div key={stallName}>
                    <div className='px-3 py-3 mx-3 mb-3 min-w-[910px] bg-[#f5f5fa] h-fit'>
                        <div className='w-full mx-1'>
                            <p className='font-bold text-2xl'>Checkout</p>
                        </div>

                        {groupedStallName[stallName].map((item, index) => (
                            <div key={index} className='bg-white my-3 h-fit w-full flex items-center'>


                                <div
                                    className='w-[80px] h-[80px] relative mr-[5px] mb-[5px] flex items-center '>
                                    <img className='w-full h-full object-cover' src={item.book.images[0].imageUrl}
                                         alt={item.book.title}/>
                                </div>
                                <div className='w-[252px]'>
                                    {truncateString(item.book.title, 30)}
                                </div>
                                <div className='ml-5 w-[100px] h-fit flex items-center'>
                                    <p>Quantity: </p>
                                    <input type="number"
                                           disabled
                                           className='w-10 text-center appearance-none hide-number-input bg-white'
                                           value={item.quantity}
                                    />
                                </div>
                                <div className='text-right ml-5 w-[150px] h-fit'>
                                    {item.book.price} $
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

    }


    return (
        <div className='mx-auto min-w-[500px] w-fit flex justify-between'>
            <div className='h-fit min-w-[910px]'>
                {cartData ? displayItemsInCart :
                    <div className='h-fit w-full'>
                        <img className='max-w-[910px] h-[500px]'
                             src="http://res.cloudinary.com/dr1eznvmn/image/upload/v1697552614/3e3ee881-322f-463d-bb3d-62cad013b5ee.jpg"
                             alt="emptyCart"/>
                        <div className='text-center text-2xl'>
                            Opps! Your cart is empty. Let's buy somethings!!!
                        </div>
                    </div>}

                <div className='w-full h-fit px-3 py-3'>
                    <p className='text-2xl font-bold'>Select a payment method</p>
                    <div className='flex flex-col'>
                        <Radio name="color" color="blue"
                               defaultChecked={true}
                               label={
                                   <div>
                                       <Typography color="blue-gray" className="font-medium flex items-center">
                                           <GiPayMoney className='text-2xl mr-3'/>
                                           Cash on delivery
                                       </Typography>
                                   </div>
                               }
                               onChange={(event) => {
                                   const isSelected = event.target.checked ? 1 : 0;
                                   if (isSelected === 1) {
                                       setPaymentMethod("cash")
                                   }
                               }}
                        />
                        <Radio name="color" color="blue"
                               label={
                                   <div>
                                       <Typography color="blue-gray" className="font-medium flex items-center">
                                           <FaCcVisa className='text-2xl mr-3'/>
                                           Payment with international Visa, Master, JCB cards
                                       </Typography>
                                   </div>
                               }
                               onChange={(event) => {
                                   const isSelected = event.target.checked ? 1 : 0;
                                   if (isSelected === 1) {
                                       setPaymentMethod("cart")
                                   }
                               }}
                        />
                    </div>
                </div>
            </div>
            <div className=''>
                <div className='sticky flex-1 w-full h-fit top-0 flex flex-col'>
                    <div className='min-w-[320px] px-3 py-3 bg-[#f5f5fa]'>
                        <p className='text-2xl font-bold mb-3'>Delivery to</p>
                        {defaultAddress.length === 0 ?
                            <div className=''>
                                <p className='text-sm'>You don't have any Address.</p>
                                <p className='text-blue-900 hover:cursor-pointer hover:text-blue-500'
                                   onClick={() => navigate(`${routes.createAddress}`)}>Let's create one</p>
                            </div> :
                            <div>
                                <p>{defaultAddress.user?.fullName}</p>
                                <p>Phone Number: {defaultAddress.user?.phoneNumber}</p>
                                <p className='font-thin'>Address: {`${defaultAddress.streetNumber} ${defaultAddress.streetName}, ${defaultAddress.city} city, ${defaultAddress.country} country`}</p>
                            </div>}

                    </div>

                    {(defaultAddress.length === 0 || cartData.length === 0 )?
                        <Button disabled
                                color="red"
                                onClick={paymentMethod === "cash" ? () => handlePaymentMethod(paymentMethod) : () => navigate(`${routes.payment}`)}
                                className="w-full">Buyyy</Button>
                        :
                        <Button color="red"
                                onClick={paymentMethod === "cash"? () => handlePaymentMethod(paymentMethod) : () => navigate(`${routes.payment}`)}
                                className="w-full">Buyyy</Button>

                    }

                    {openDialog && <DialogDefault title="Do you want to payment by cash on delivery?"/>}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer,
    };
};

export default connect(mapStateToProps)(CreateOrderPage)