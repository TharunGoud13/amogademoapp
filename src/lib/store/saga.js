import {
  GET_CHAT_GROUP,
  getChatGroupSuccess,
  getChatGroupFailure,
  GET_USERS,
  getUsersSuccess,
  getUsersFailure,
  GET_CHAT_GROUP_USERS_LIST,
  getChatGroupUsersSuccess,
  getChatGroupUsersFailure,
  GROUP_USERS,
  groupUsersSuccess,groupUsersFailure,
  BOM_RAW,bomRawSuccess,bomRawFailure
} from "./actions";
import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";
import { BOM_RAW_URL, GET_CHAT_GROUP_USERS, GET_CONTACTS_API, GET_GROUPS, GET_USERS_OF_GROUP } from "@/constants/envConfig";


const token = `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
function* getUsersSaga() {
  try {
    const response = yield call(axios.get, GET_GROUPS, {
      headers: {
        Authorization:
        token,
      },
    });
      yield put(getChatGroupSuccess(response.data));
    
  } catch (error) {
    yield put(getChatGroupFailure(error));
  }
}

function* getUsersDataSaga(){
  try {
    const response = yield call(axios.get, GET_CONTACTS_API, {
      headers: {
        Authorization:token
      },
    });
    yield put(getUsersSuccess(response.data));
  } catch (error) {
    yield put(getUsersFailure(error));
  }
}

function* getChatGroupUsersSaga() {
  try{
    const response = yield call(axios.get,GET_CHAT_GROUP_USERS,{
      headers: {
        Authorization:token
      },
    })
    yield put(getChatGroupUsersSuccess(response.data));
  }
  catch (error) {
    yield put(getChatGroupUsersFailure(error));
  }
}

function* groupUsersSaga({payload}) {
  const url = `${GET_USERS_OF_GROUP}${payload}`
  try{
    const response = yield call(axios.get, url,{
      headers:{
        Authorization:token
      }
    })
    yield put(groupUsersSuccess(response.data));
  }
  catch (error) {
    yield put(groupUsersFailure(error));
  }

}

function* bomRawSaga({payload}) {
  let url = `${BOM_RAW_URL}`
  if(payload){
    url += `?part_name=eq.${payload}`
  }
  try{
    const response = yield call(axios.get,url,{
      headers:{
        Authorization:token
      }
    })
    yield put(bomRawSuccess(response.data));
  }
  catch(error){
    yield put(bomRawFailure(error));
  }
}

export default function* rootSaga() {
  yield takeLatest(GET_CHAT_GROUP, getUsersSaga);
  yield takeLatest(GET_USERS, getUsersDataSaga);
  yield takeLatest(GET_CHAT_GROUP_USERS_LIST, getChatGroupUsersSaga);
  yield takeLatest(GROUP_USERS, groupUsersSaga);
  yield takeLatest(BOM_RAW, bomRawSaga);
}
