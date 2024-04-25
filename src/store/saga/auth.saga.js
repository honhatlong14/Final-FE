import {toast} from 'react-toastify';
import {call, put, takeLatest} from 'redux-saga/effects';
import {login, refreshToken, logout} from '../../apiServices';
import {authenticateConstant} from '../../constants';
import {getNewTokenSuccess, loginSuccess, logoutSuccess} from '../actions/authenticateAction';

const {LOGIN, LOGOUT, GET_NEW_TOKEN} = authenticateConstant;

function* postLoginForm(action) {
    const {payload} = action;
    try {
        const {status, data} = yield call(login, payload);
        if (status === 200) {
            yield put(loginSuccess(data));
            return;
        } else if (status === 400) {
            return toast.error(data.message);
        } else {
            console.log(data)
            return  toast.error(data.message);
        }
    } catch (error) {
        console.log(error);
    }
}

function* getNewToken() {
    const {data, status} = yield call(refreshToken);
    if (status === 200) {
        yield put(getNewTokenSuccess(data));
    } else {
        yield put(logoutSuccess());
    }
}

function* revokeTokenAndLogout(action) {
    const {payload} = action;
    const {status} = yield call(logout, payload);
    if (status === 200) {
        yield put(logoutSuccess());
    }
}

export default function* authenticateSaga() {
    yield takeLatest(LOGIN, postLoginForm);
    yield takeLatest(GET_NEW_TOKEN, getNewToken);
    yield takeLatest(LOGOUT, revokeTokenAndLogout);
}