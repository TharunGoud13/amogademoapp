import { FETCH_DATA_REQUEST,fetchDataSuccess,fetchDataFailure } from "./actions";
import {takeLatest,call,put} from "redux-saga/effects";
import axios from "axios";

function* getUsersSaga(){
    const response = yield call(axios.get,'https://jsonplaceholder.typicode.com/users');
    console.log(response.data);
    yield put(fetchDataSuccess(response.data));
}

export default function* rootSaga(){
    yield takeLatest(FETCH_DATA_REQUEST, getUsersSaga);
}