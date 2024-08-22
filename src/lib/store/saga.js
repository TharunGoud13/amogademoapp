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
  groupUsersSuccess,
  groupUsersFailure,
  BOM_RAW,
  bomRawSuccess,
  bomRawFailure,
  LOGIN_LOG,
  loginLogSuccess,
  loginLogFailure,
} from "./actions";
import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";
import {
  BOM_RAW_URL,
  GET_CHAT_GROUP_USERS,
  GET_CONTACTS_API,
  GET_GROUPS,
  GET_USERS_OF_GROUP,
  LOG_USERS_API,
} from "@/constants/envConfig";
import getCurrentBrowser from "../getCurrentBrowser";
import getUserLocation from "../geoLocation";
import getCurrentOS from "../getCurrentOS";

const detectDeviceType = () =>
  /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
    ? 'Mobile'
    : 'Desktop';
 

const token = `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`;
function* getUsersSaga() {
  try {
    const response = yield call(axios.get, GET_GROUPS, {
      headers: {
        Authorization: token,
      },
    });
    yield put(getChatGroupSuccess(response.data));
  } catch (error) {
    yield put(getChatGroupFailure(error));
  }
}

function* getUsersDataSaga() {
  try {
    const response = yield call(axios.get, GET_CONTACTS_API, {
      headers: {
        Authorization: token,
      },
    });
    yield put(getUsersSuccess(response.data));
  } catch (error) {
    yield put(getUsersFailure(error));
  }
}

function* getChatGroupUsersSaga() {
  try {
    const response = yield call(axios.get, GET_CHAT_GROUP_USERS, {
      headers: {
        Authorization: token,
      },
    });
    yield put(getChatGroupUsersSuccess(response.data));
  } catch (error) {
    yield put(getChatGroupUsersFailure(error));
  }
}

function* groupUsersSaga({ payload }) {
  const url = `${GET_USERS_OF_GROUP}${payload}`;
  try {
    const response = yield call(axios.get, url, {
      headers: {
        Authorization: token,
      },
    });
    yield put(groupUsersSuccess(response.data));
  } catch (error) {
    yield put(groupUsersFailure(error));
  }
}

function* bomRawSaga({ payload }) {
  let url = `${BOM_RAW_URL}`;
  if (payload) {
    url += `?part_name=eq.${payload}`;
  }
  try {
    const response = yield call(axios.get, url, {
      headers: {
        Authorization: token,
      },
    });
    yield put(bomRawSuccess(response.data));
  } catch (error) {
    yield put(bomRawFailure(error));
  }
}

function* loginLogSaga(action) {

  const {
    description,
    event_type,
    session,
    user_ip_address,
    http_method,
    http_url,
    request_payload,
    response_status_code,
    response_time_ms,
    response_payload,
    response_status,
    response_error,
    error_message,
  } = action.payload;
  const browser = getCurrentBrowser();
  const currentTime = new Date().toUTCString();
  let locationData = {};
  try {
    locationData = yield call(getUserLocation);
  } catch (error) {
    throw new Error(error)
  }
  
  const payload = {
    description,
    session_id: session?.id,
    user_id: session?.id,
    user_name: session?.name,
    user_email: session?.email,
    event_type,
    user_ip_address: user_ip_address,
    browser: browser,
    created_datetime: currentTime,
    created_at_geo: locationData?.latitude + " " + locationData?.longitude,
    geo_location: locationData?.latitude + " " + locationData?.longitude,
    city: locationData?.address?.town,
    state: locationData?.address?.state,
    country: locationData?.address?.country,
    geo_codes: locationData?.address?.postcode,
    device: detectDeviceType(),
    operating_system: getCurrentOS(),
    http_method,
    http_url,
    request_payload,
    response_status_code,
    response_time_ms,
    response_payload,
    response_status,
    response_error,
    error_message,
    business_name:session?.business_name,
    business_number:session?.business_number,
  };
  try {
    const response = yield fetch(LOG_USERS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });
    yield put(loginLogSuccess(response.data));
  } catch (error) {
    yield put(loginLogFailure(error));
  }
}

export default function* rootSaga() {
  yield takeLatest(GET_CHAT_GROUP, getUsersSaga);
  yield takeLatest(GET_USERS, getUsersDataSaga);
  yield takeLatest(GET_CHAT_GROUP_USERS_LIST, getChatGroupUsersSaga);
  yield takeLatest(GROUP_USERS, groupUsersSaga);
  yield takeLatest(BOM_RAW, bomRawSaga);
  yield takeLatest(LOGIN_LOG, loginLogSaga);
}
