import ProfileLayout from "../../../../layout/ProfileLayout";
import {AiOutlineCheckCircle, AiOutlinePlus} from "react-icons/ai";
import {useNavigate} from "react-router-dom";
import routes from "../../../../config/routes";
import {useCallback, useEffect, useRef, useState} from "react";
import {
    deleteAddress,
    getAddressByUserId,
    getStallByUserId,
    refreshToken,
    tokenRequestInterceptor
} from "../../../../apiServices";
import {getNewToken, getNewTokenSuccess, logoutSuccess} from "../../../../store/actions/authenticateAction";
import {connect, useDispatch} from "react-redux";

const AddressPage = ({getNewTokenRequest, authenticateReducer}) => {
    const {jwtToken, id} = authenticateReducer;
    const jwtTokenState = useRef(jwtToken);
    const [pendingRequest, setPendingRequest] = useState([]);
    const dispatch = useDispatch();


    const navigate = useNavigate();

    const loadingRequest = useCallback(async () => {
        const loadPendingRequests = async () => {
            const {data, status} = await getAddressByUserId(jwtTokenState.current, id);
            console.log("address data", data)
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
            console.log(pendingRequest)
        }
    }, [jwtToken, getNewTokenRequest])

    useEffect(() => {
        loadingRequest()
    }, [])


    const handleDeleteAddress = (addressId) => {
        (async () => {
            const loadingRequests = async () => {
                const {data, status} = await deleteAddress(jwtTokenState.current, addressId);
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

            const {status, data} = await tokenRequestInterceptor(loadingRequests, getRefreshToken);
            if (status === 200) {
                loadingRequest()
            }
        })()
    }

    return (
        <>
            <ProfileLayout>
                <div className='w-full flex flex-col mx-5 my-9'>
                    <div className=''>
                        <p>Address List</p>
                    </div>
                    <div className='w-[80%] h-[105px] mx-auto border-dashed border-4 hover:cursor-pointer bg-[#f5f5fa]'
                         onClick={() => {
                             navigate(`${routes.createAddress}`)
                         }}
                    >
                        <div className='h-full flex flex-col items-center justify-center '>
                            <AiOutlinePlus className=''/>
                            <div className=''>Add a new address</div>
                        </div>
                    </div>
                    {pendingRequest.map((item) => (
                        <div className='w-[80%] h-fit mx-auto mt-3 bg-[#f5f5fa] px-5 py-5'>
                            <div>
                                {item.addressStatus === 1 ? ( <div className='flex items-center'>
                                        <AiOutlineCheckCircle className='text-green-600 mr-2'/>
                                        <p className='text-green-600'>Default Address</p>
                                    </div>
                                ) : ""}
                            </div>
                            <p>{item.user.fullName}</p>
                            <p>Address: {`${item.streetNumber} ${item.streetName}, ${item.city} city, ${item.country} country`}</p>
                            {/*<p>Phone Number: {item.user.phoneNumber}</p>*/}
                            <p>Phone Number: fix later </p>
                            <div className='flex'>
                                <p className='text-blue-800 hover:cursor-pointer hover:text-blue-500 pr-3'>Edit</p>
                                {item.addressStatus === 1 ? "" :
                                    <p className='text-red-900 hover:cursor-pointer hover:text-red-500'
                                       onClick={(e) => {
                                           handleDeleteAddress(item.id)
                                       }}>Delete</p>}

                            </div>
                        </div>
                    ))}

                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddressPage)