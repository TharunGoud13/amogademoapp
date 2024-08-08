import { GET_CHAT_GROUP,GET_CHAT_GROUP_SUCCESS,GET_CHAT_GROUP_FAILURE } from './actions';

// Initial State
const initialState = {
  getChatGroupResponse:[],
  getChatGroupLoading: false,
  getChatGroupError: null
};

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CHAT_GROUP:
      return { ...state, getChatGroupLoading: true, error: null };
    case GET_CHAT_GROUP_SUCCESS:
      return { ...state, getChatGroupLoading: false, getChatGroupResponse: action.payload };
    case GET_CHAT_GROUP_FAILURE:
      return { ...state, getChatGroupLoading: false, getChatGroupError: action.payload };
    default:
      return state;
  }
};

export default reducer;
