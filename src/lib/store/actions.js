// Action Types
export const GET_CHAT_GROUP = "GET_CHAT_GROUP";
export const GET_CHAT_GROUP_SUCCESS = "GET_CHAT_GROUP_SUCCESS";
export const GET_CHAT_GROUP_FAILURE = "GET_CHAT_GROUP_FAILURE";

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