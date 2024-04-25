import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    deleteCartItem,
    getAddressByUserId,
    getAllCartByUserId,
    getDefaultAddress, incrementCartQuantity, reduceCartQuantity,
    refreshToken,
    removeCartItem,
    tokenRequestInterceptor, updateCartItem
} from "../../../apiServices";
import {getNewToken, getNewTokenSuccess, logoutSuccess} from "../../../store/actions/authenticateAction";
import {connect, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Checkbox} from "@material-tailwind/react";
import {GoTrash} from "react-icons/go";
import {faHourglass1} from "@fortawesome/free-solid-svg-icons";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import {ca} from "date-fns/locale";
import routes from "../../../config/routes";

function truncateString(str, maxLength) {
    if (str.length <= maxLength) {
        return str;
    } else {
        return str.slice(0, maxLength) + "...";
    }
}


const CartPage = ({getNewTokenRequest, authenticateReducer}) => {
    const {jwtToken, id} = authenticateReducer;
    const jwtTokenState = useRef(jwtToken);
    const [defaultAddress, setDefaultAddress] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [cartData, setCartData] = useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const bookData = useRef({"userId": "", "cartId": ""});

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function DialogDefault({title}) {
        const handleOpenDialog = () => setOpenDialog(!openDialog);

        const handleCancelDialog = () => {
            setOpenDialog(!openDialog)
        }

        const handleConfirmDialog = () => {

            const loadingReduceRequest = (async () => {
                const loadPendingRequests = async () => {
                    const {data, status} = await removeCartItem(jwtTokenState.current, bookData.current);
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
                    loadingCartRequest()
                }

            })

            loadingReduceRequest()
            setOpenDialog(!openDialog)
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
            const {data, status} = await getAllCartByUserId(jwtTokenState.current, id);
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

    const handleReduce = (cartId, userId, quantityItem) => {
        bookData.current = ({"userId": userId, "cartId": cartId})

        if (quantityItem === 1) {
            setOpenDialog(true)
        } else {
            const loadRequest = async () => {
                const reduceQuantityRequest = async () => {
                    const {data, status} = await reduceCartQuantity(jwtTokenState.current, bookData.current);
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

                const {status} = await tokenRequestInterceptor(reduceQuantityRequest, getRefreshToken);
                if (status === 200) {
                    loadingCartRequest()
                }
            }
            loadRequest()
        }


    }


    const handleIncrement = (cartId, userId) => {
        let dataRequest = {
            "userId": userId,
            "cartId": cartId
        }


        const loadRequest = async () => {
            const reduceQuantityRequest = async () => {
                const {data, status} = await incrementCartQuantity(jwtTokenState.current, dataRequest);
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

            const {status} = await tokenRequestInterceptor(reduceQuantityRequest, getRefreshToken);
            if (status === 200) {
                loadingCartRequest()
            }


        }
        loadRequest()
    }

    const handleSelected = (cartId, userId, isSelected, quantity) => {
        let dataRequest = {
            "userId": userId,
            "quantity": quantity,
            "isSelected": isSelected
        }


        const loadRequest = async () => {
            const updateSelectedRequest = async () => {
                const {data, status} = await updateCartItem(jwtTokenState.current, cartId, dataRequest);
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

            const {status} = await tokenRequestInterceptor(updateSelectedRequest, getRefreshToken);
            if (status === 200) {
                loadingCartRequest()
            }
        }
        loadRequest()
    }

    const handleDelete = (cartId) => {
        const loadRequest = (async () => {
            const loadingDeleteRequest = async () => {
                const {data, status} = await deleteCartItem(jwtTokenState.current, cartId);
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

            const {status, data} = await tokenRequestInterceptor(loadingDeleteRequest, getRefreshToken);
            if (status === 200) {
                loadingCartRequest()
            }
        })
        loadRequest()
    }


    useEffect(() => {
        loadingDefaultAddressRequest()
        loadingCartRequest()
    }, [])

    useEffect(() => {
        let updatedValue = 0;
        for (let i = 0; i < cartData.length; i++) {
            if (cartData[i].isSelected === 1) {
                let total = cartData[i].total;
                updatedValue += total;
            }
        }
        setTotalPrice(updatedValue);
    }, [cartData]);

    const groupedStallName = {};
    cartData.forEach((item) => {
        if (!groupedStallName[item.stallName]) {
            groupedStallName[item.stallName] = [];
        }
        groupedStallName[item.stallName].push(item);
    });

    const displayItemsInCart = [];
    for (const stallName in groupedStallName) {
        if (groupedStallName.hasOwnProperty(stallName)) {
            displayItemsInCart.push(
                <div key={stallName}>
                    <div className='px-3 py-3 mx-3 mb-3 min-w-[910px] bg-[#f5f5fa] h-fit'>
                        <div className='w-full mx-1'>
                            <p className=''>{stallName}</p>
                        </div>

                        {groupedStallName[stallName].map((item, index) => (
                            <div key={index} className='bg-white my-3 h-fit w-full flex items-center'>
                                <Checkbox
                                    defaultChecked={item.isSelected === 1}
                                    onChange={(event) => {
                                        const isSelected = event.target.checked ? 1 : 0;
                                        if (isSelected === 1) {
                                            handleSelected(item.id, id, isSelected, item.quantity)
                                        }
                                        if (isSelected === 0) {
                                            handleSelected(item.id, id, isSelected, item.quantity)
                                        }
                                    }}
                                />

                                <div
                                    className='w-[80px] h-[80px] relative mr-[5px] mb-[5px] flex items-center '>
                                    <img className='w-full h-full object-cover' src={item.book.images[0].imageUrl}
                                         alt={item.book.title}/>
                                </div>
                                <div className='w-[252px]'>
                                    {truncateString(item.book.title, 30)}
                                </div>
                                <div className='ml-5 w-[150px] h-fit'>
                                    {item.book.price} $
                                </div>


                                <div className='ml-5 w-[100px] h-fit flex'>
                                    <p className='border-solid border-2 px-2 py-1 hover:cursor-pointer'
                                       onClick={() =>
                                           handleReduce(item.id, id, item.quantity)
                                       }
                                    >-</p>
                                    <input type="number"
                                           disabled
                                           className='w-10 text-center appearance-none hide-number-input border-solid border-t-2 border-b-2'
                                           value={item.quantity}
                                           onChange={(e) => {
                                               const value = e.target.valueAsNumber
                                           }}
                                    />
                                    <p
                                        onClick={() => handleIncrement(item.id, id)}
                                        className='border-solid border-2 px-2 py-1 hover:cursor-pointer'>+</p>
                                </div>
                                <div className='ml-5 w-[150px] h-fit text-red-600'>
                                    {item.quantity * item.book.price} $
                                </div>
                                <GoTrash onClick={() => handleDelete(item.id)} className='hover:cursor-pointer'/>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

    }

    console.log("cart",cartData)

    return (
        <div className='mx-auto min-w-[500px] w-fit flex justify-between'>
            <div className='h-fit'>
                {cartData.length !== 0 ? displayItemsInCart :
                    <div className='h-fit w-full'>
                        <img className='max-w-[910px] h-[500px]'
                             src="http://res.cloudinary.com/dr1eznvmn/image/upload/v1697552614/3e3ee881-322f-463d-bb3d-62cad013b5ee.jpg"
                             alt="emptyCart"/>
                        <div className='text-center text-2xl'>
                            Opps! Your cart is empty. Let's buy somethings!!!
                        </div>
                    </div>}
            </div>
            <div className=''>
                <div className='sticky flex-1 w-full h-fit top-0 flex flex-col'>
                    <div className='min-w-[320px] px-3 py-3 bg-[#f5f5fa]'>
                        <p className='text-2xl font-bold mb-3'>Delivery to</p>
                        {defaultAddress.length === 0 ?
                            <div className=''>
                                <p className='text-sm'>You don't have any Address.</p>
                                <p className='text-blue-900 hover:cursor-pointer hover:text-blue-500' onClick={() => navigate(`${routes.createAddress}`)}>Let's create one</p>
                            </div> :
                            <div>
                                <p>{defaultAddress.user?.fullName}</p>
                                <p>Phone Number: {defaultAddress.user?.phoneNumber}</p>
                                <p className='font-thin'>Address: {`${defaultAddress.streetNumber} ${defaultAddress.streetName}, ${defaultAddress.city} city, ${defaultAddress.country} country`}</p>
                            </div>}

                    </div>
                    <div className="min-w-[320px] my-3 px-3 py-3 bg-[#f5f5fa]">
                        <div className="h-fit w-full mb-3">
                            <p>Provisional bill</p>
                        </div>

                        <div className="w-full h-fit flex items-end justify-between">
                            <p className="text-2xl my-3">Total</p>
                            <p className="text-2xl my-3 text-red-500">{totalPrice} $</p>
                        </div>
                    </div>
                    {totalPrice === 0 ?
                        <Button disabled color="red" onClick={() => navigate(`${routes.createOrder}`)} className="w-full">Buyyy</Button>
                        :
                        <Button color="red" onClick={() => navigate(`${routes.createOrder}`)} className="w-full">Buyyy</Button>
                    }


                </div>
            </div>

            {openDialog && <DialogDefault title="Do you want to delete Book?"/>}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(CartPage)