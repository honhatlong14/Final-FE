import { all } from 'redux-saga/effects';
import authenticateSaga from './auth.saga';

export default function* rootSaga() {
    yield all([authenticateSaga()]);
}
