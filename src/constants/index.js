const authenticatePrefix = "APPLICATION_AUTHENTICATE";

export const authenticateConstant = {
    LOGIN: `${authenticatePrefix}/LOGIN`,
    LOGIN_SUCCESS: `${authenticatePrefix}/LOGIN_SUCCESS`,
    REGISTER: `${authenticatePrefix}/REGISTER_SUCCESS`,
    LOGOUT: `${authenticatePrefix}/LOGOUT`,
    LOGOUT_SUCCESS: `${authenticatePrefix}/LOUGOUT_SUCCESS`,
    GET_NEW_TOKEN: `${authenticatePrefix}/GET_NEW_TOKEN`,
    GET_NEW_TOKEN_SUCCESS: `${authenticatePrefix}/GET_NEW_TOKEN_SUCCESS`,
};

export const stallStatusConstant = {
    Deny: 0,
    Activate: 1,
    Pending: 2,
    Lock : 3
}