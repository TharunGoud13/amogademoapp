import {
  GET_CHAT_GROUP,
  GET_CHAT_GROUP_SUCCESS,
  GET_CHAT_GROUP_FAILURE,
  GET_USERS,
  GET_USERS_SUCCESS,
  GET_USERS_FAILURE,
  GET_CHAT_GROUP_USERS_LIST,
  GET_CHAT_GROUP_USERS_SUCCESS,
  GET_CHAT_GROUP_USERS_FAILURE,
  GROUP_USERS,
  GROUP_USERS_SUCCESS,
  GROUP_USERS_FAILURE,
  BOM_RAW,
  BOM_RAW_SUCCESS,
  BOM_RAW_FAILURE,
  userActiveStatus,
  USER_ACTIVE_STATUS,
  LOGIN_LOG,
  LOGIN_LOG_SUCCESS,
  LOGIN_LOG_FAILURE,
  CREATE_IMAP_DETAILS,
  CREATE_IMAP_DETAILS_SUCCESS,
  CREATE_IMAP_DETAILS_FAILURE,
  GET_ALL_IMAP_DETAILS,
  GET_ALL_IMAP_DETAILS_SUCCESS,
  GET_ALL_IMAP_DETAILS_FAILURE,
  SET_UNREAD_EMAIL,
  SET_UNREAD_EMAIL_SUCCESS,
  SET_UNREAD_EMAIL_FAILURE,
} from "./actions";

// Initial State
const initialState = {
  getChatGroupResponse: [],
  getChatGroupLoading: false,
  getChatGroupError: null,
  getUsersResponse: [],
  getUsersLoading: false,
  getUsersError: null,
  getChatGroupUsersResponse: [],
  getChatGroupUsersLoading: false,
  getChatGroupUsersError: null,
  groupUsersResponse: [],
  groupUsersLoading: false,
  groupUsersError: null,
  bomRawResponse: [],
  bomRawLoading: false,
  bomRawError: null,
  userActiveStatusResponse: [],
  loginLogResponse: [],
  loginLogLoading: false,
  loginLogError: null,
  createImapDetailsResponse: [],
  createImapDetailsLoading: false,
  createImapDetailsError: null,
  getAllImapDetailsResponse: [],
  getAllImapDetailsLoading: false,
  getAllImapDetailsError: null,
  unreadEmailResponse: [],
  unreadEmailLoading: false,
  unreadEmailError: null,
};

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CHAT_GROUP:
      return {
        ...state,
        getChatGroupLoading: true,
        error: null,
      };
    case GET_CHAT_GROUP_SUCCESS:
      return {
        ...state,
        getChatGroupLoading: false,
        getChatGroupResponse: action.payload,
      };
    case GET_CHAT_GROUP_FAILURE:
      return {
        ...state,
        getChatGroupLoading: false,
        getChatGroupError: action.payload,
      };
    case GET_USERS:
      return {
        ...state,
        getUsersLoading: true,
        getUsersError: null,
      };
    case GET_USERS_SUCCESS:
      return {
        ...state,
        getUsersLoading: false,
        getUsersResponse: action.payload,
      };
    case GET_USERS_FAILURE:
      return {
        ...state,
        getUsersLoading: false,
        getUsersError: action.payload,
      };
    case GET_CHAT_GROUP_USERS_LIST:
      return {
        ...state,
        getChatGroupUsersLoading: true,
        getChatGroupUsersError: null,
      };
    case GET_CHAT_GROUP_USERS_SUCCESS:
      return {
        ...state,
        getChatGroupUsersLoading: false,
        getChatGroupUsersResponse: action.payload,
      };
    case GET_CHAT_GROUP_USERS_FAILURE:
      return {
        ...state,
        getChatGroupUsersLoading: false,
        getChatGroupUsersError: action.payload,
      };
    case GROUP_USERS:
      return {
        ...state,
        groupUsersLoading: true,
        groupUsersError: null,
      };
    case GROUP_USERS_SUCCESS:
      return {
        ...state,
        groupUsersLoading: false,
        groupUsersResponse: action.payload,
      };
    case GROUP_USERS_FAILURE:
      return {
        ...state,
        groupUsersLoading: false,
        groupUsersError: action.payload,
      };
    case BOM_RAW:
      return {
        ...state,
        bomRawLoading: true,
        bomRawError: null,
      };
    case BOM_RAW_SUCCESS:
      return {
        ...state,
        bomRawLoading: false,
        bomRawResponse: action.payload,
      };
    case BOM_RAW_FAILURE:
      return {
        ...state,
        bomRawLoading: false,
        bomRawError: action.payload,
      };
    case USER_ACTIVE_STATUS:
      return {
        ...state,
        userActiveStatusResponse: action.payload,
      };
    case LOGIN_LOG:
      return {
        ...state,
        loginLogLoading: true,
        loginLogError: null,
      };
    case LOGIN_LOG_SUCCESS:
      return {
        ...state,
        loginLogLoading: false,
        loginLogResponse: action.payload,
      };
    case LOGIN_LOG_FAILURE:
      return {
        ...state,
        loginLogLoading: false,
        loginLogError: action.payload,
      };
    case CREATE_IMAP_DETAILS:
      return {
        ...state,
        createImapDetailsLoading: true,
        createImapDetailsError: null,
      };
    case CREATE_IMAP_DETAILS_SUCCESS:
      return {
        ...state,
        createImapDetailsLoading: false,
        createImapDetailsResponse: action.payload,
      };
    case CREATE_IMAP_DETAILS_FAILURE:
      return {
        ...state,
        createImapDetailsLoading: false,
        createImapDetailsError: action.payload,
      };
    case GET_ALL_IMAP_DETAILS:
      return {
        ...state,
        getAllImapDetailsLoading: true,
        getAllImapDetailsError: null,
      };
    case GET_ALL_IMAP_DETAILS_SUCCESS:
      return {
        ...state,
        getAllImapDetailsLoading: false,
        getAllImapDetailsResponse: action.payload,
      };
    case GET_ALL_IMAP_DETAILS_FAILURE:
      return {
        ...state,
        getAllImapDetailsLoading: false,
        getAllImapDetailsError: action.payload,
      };
      case SET_UNREAD_EMAIL:
        return {
         ...state,
          unreadEmailLoading: true,
          unreadEmailError: null,
        };
      case SET_UNREAD_EMAIL_SUCCESS:
        return {
         ...state,
          unreadEmailLoading: false,
          unreadEmailResponse: action.payload,
        };
      case SET_UNREAD_EMAIL_FAILURE:
        return {
         ...state,
          unreadEmailLoading: false,
          unreadEmailError: action.payload,
        };

    default:
      return state;
  }
};

export default reducer;
