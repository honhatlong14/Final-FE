import {useReducer} from "./useReducer";
import {refreshToken, tokenRequestInterceptor} from "../apiServices";
import {getNewTokenSuccess, logoutSuccess} from "../store/actions/authenticateAction";
import {useDispatch, useSelector} from 'react-redux';
import {toast} from "react-toastify";
import {useEffect} from "react";

function fetchReducer(state, action){
    switch (action.type) {
        case 'fetchAPI/request':
            return {...state, isLoading: action.isLoading};
        case 'fetchAPI/success':
        case 'fetchAPI/error':
            return {
                ...state,
                isLoading: action.isLoading,
                error: action.error,
                data: action.data
            }
        default:
            return state;
    }
}

export const useApiCall = async (apiCall, params) =>{
    let jwtTokenState = useSelector((state) => state.authenticateReducer.jwtToken);
    const dispatchRedux = useDispatch();
    const [state, dispatch] = useReducer(fetchReducer, {
        data: [],
        isLoading: false,
        error: null
    });

    useEffect(() => {
        (async () => {
            dispatch({
                type:'fetchAPI/request',
                isLoading: true,
            });

            try{
                const makeApiRequest = async () => {
                    const { data, status } = await apiCall({...params, jwtTokenState});
                    return { data, status };
                };

                const getRefreshToken = async () => {
                    const { data, status } = await refreshToken(jwtTokenState);
                    if (status === 200) {
                        jwtTokenState = data.jwtToken;
                        dispatchRedux(getNewTokenSuccess(data));
                    } else {
                        dispatchRedux(logoutSuccess());
                    }
                };

                const { status, data } = await tokenRequestInterceptor(makeApiRequest, getRefreshToken);

                if (status >= 200 && status < 400)
                {
                    toast.success(data.message);
                    dispatch({
                        type: 'fetchAPI/success',
                        isLoading: false,
                        error: null,
                        data
                    });
                }
                else if (status === 401){
                    toast.error("Unauthorize, You need to re-login");
                    dispatch({
                        type: 'fetchAPI/error',
                        isLoading: false,
                        error: "Unauthorize, You need to re-login",
                        data:[]
                    });
                }
                else {
                    toast.error(JSON.stringify(data.errors));
                    dispatch({
                        type: 'fetchAPI/error',
                        isLoading: false,
                        error: data.errors,
                        data:[]
                    });
                }

            }
            catch (err){
                dispatch({
                    type: 'fetchAPI/error',
                    isLoading: false,
                    error: err,
                    data:[]
                });
            }
        })();

    }, []);

    return {...state}
}