import { authenticateConstant } from '../../constants';
const { LOGIN, LOGIN_SUCCESS, LOGOUT_SUCCESS, GET_NEW_TOKEN_SUCCESS, GET_NEW_TOKEN, LOGOUT } = authenticateConstant;

export const login = (payload) => {
    return { type: LOGIN, payload };
};

export const logout = (payload) => {
    return { type: LOGOUT, payload };
};

export const loginSuccess = (payload) => {
    return { type: LOGIN_SUCCESS, payload };
};

export const logoutSuccess = () => {
    return { type: LOGOUT_SUCCESS };
};

export const getNewToken = (payload) => {
    return { type: GET_NEW_TOKEN, payload };
};

export const getNewTokenSuccess = (payload) => {
    return { type: GET_NEW_TOKEN_SUCCESS, payload };
};
