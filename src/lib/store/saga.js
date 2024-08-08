import {
  GET_CHAT_GROUP,
  getChatGroupSuccess,
  getChatGroupFailure,
} from "./actions";
import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";
import { GET_GROUPS } from "@/constants/envConfig";

function* getUsersSaga() {
  try {
    const response = yield call(axios.get, GET_GROUPS, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXBpX3VzZXIifQ.Ks_9ISeorCCS73q1WKEjZHu9kRx107eOx5VcImPh9U8",
      },
    });

    
      yield put(getChatGroupSuccess(response.data));
    
  } catch (error) {
    yield put(getChatGroupFailure(error));
  }
}

export default function* rootSaga() {
  yield takeLatest(GET_CHAT_GROUP, getUsersSaga);
}
