// Action Types
export const GET_CHAT_GROUP = "GET_CHAT_GROUP";
export const GET_CHAT_GROUP_SUCCESS = "GET_CHAT_GROUP_SUCCESS";
export const GET_CHAT_GROUP_FAILURE = "GET_CHAT_GROUP_FAILURE";

export const GET_USERS = "GET_USERS";
export const GET_USERS_SUCCESS = "GET_USERS_SUCCESS";
export const GET_USERS_FAILURE = "GET_USERS_FAILURE";

// on click of + on topnav of chat display user_catalog_api
export const GET_CHAT_GROUP_USERS_LIST = "GET_CHAT_GROUP_USERS_LIST";
export const GET_CHAT_GROUP_USERS_SUCCESS = "GET_CHAT_GROUP_USERS_SUCCESS";
export const GET_CHAT_GROUP_USERS_FAILURE = "GET_CHAT_GROUP_USERS_FAILURE";

// on click of edit display users of that group
export const GROUP_USERS = "GROUP_USERS";
export const GROUP_USERS_SUCCESS = "GROUP_USERS_SUCCESS";
export const GROUP_USERS_FAILURE = "GROUP_USERS_FAILURE";

//bom raw
export const BOM_RAW = "BOM_RAW";  
export const BOM_RAW_SUCCESS = "BOM_RAW_SUCCESS";
export const BOM_RAW_FAILURE = "BOM_RAW_FAILURE";

//user active status
export const USER_ACTIVE_STATUS = "USER_ACTIVE_STATUS";

// create log and insert to DB for user login
export const LOGIN_LOG = "LOGIN_LOG";
export const LOGIN_LOG_SUCCESS = "LOGIN_LOG_SUCCESS";
export const LOGIN_LOG_FAILURE = "LOGIN_LOG_FAILURE";

// Action Creators
export const getChatGroup = (payload) => {
    return{
        type: GET_CHAT_GROUP,
        payload
    }
}

export const getChatGroupSuccess = (payload) => {
    return{
        type: GET_CHAT_GROUP_SUCCESS,
        payload
    }
}

export const getChatGroupFailure = (error) => {
    return{
        type: GET_CHAT_GROUP_FAILURE,
        payload: error
    }
}

export const getUsers = (payload) => {
    return{
        type: GET_USERS,
        payload
    }
}

export const getUsersSuccess = (payload) => {
    return{
        type: GET_USERS_SUCCESS,
        payload
    }
}

export const getUsersFailure = (error) => {
    return{
        type: GET_USERS_FAILURE,
        payload: error
    }
}

export const getChatGroupUsers = (payload) => {
    return{
        type: GET_CHAT_GROUP_USERS_LIST,
        payload
    }
}

export const getChatGroupUsersSuccess = (payload) => {
    return{
        type: GET_CHAT_GROUP_USERS_SUCCESS,
        payload
    }

}

export const getChatGroupUsersFailure = (error) => {
    return{
        type: GET_CHAT_GROUP_USERS_FAILURE,
        payload: error
    }
}

export const groupUsers = (payload) => {
    return{
        type: GROUP_USERS,
        payload
    }
}

export const groupUsersSuccess = (payload) => {
    return{
        type: GROUP_USERS_SUCCESS,
        payload
    }
}

export const groupUsersFailure = (error) => {
    return{
        type: GROUP_USERS_FAILURE,
        payload: error
    }
}

export const bomRaw = (payload) => {
    return{
        type: BOM_RAW,
        payload
    }
}

export const bomRawSuccess = (payload) => {
    return{
        type: BOM_RAW_SUCCESS,
        payload
    }
}

export const bomRawFailure = (error) => {
    return{
        type: BOM_RAW_FAILURE,
        payload: error
    }
}

export const userActiveStatus = (payload) => {
    return{
        type: USER_ACTIVE_STATUS,
        payload
    }
}

export const loginLog = (payload) => {
    return{
        type: LOGIN_LOG,
        payload
    }
}

export const loginLogSuccess = (payload) => {
    return{
        type: LOGIN_LOG_SUCCESS,
        payload
    }
}

export const loginLogFailure = (error) => {
    return{
        type: LOGIN_LOG_FAILURE,
        payload: error
    }
}