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