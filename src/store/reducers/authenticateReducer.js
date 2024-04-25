import { authenticateConstant } from '../../constants';

const { LOGIN_SUCCESS, LOGOUT_SUCCESS, GET_NEW_TOKEN_SUCCESS } = authenticateConstant;

const initialState = {
    id: '',
    jwtToken: '',
    refreshToken: '',
    email: '',
    role: '',
    isVerified: false,
    isInternal: true
};

const authenticateReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return { ...state, ...action.payload };
        case LOGOUT_SUCCESS:
            return { ...state, ...initialState };
        case GET_NEW_TOKEN_SUCCESS:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

export default authenticateReducer;
