import React, { useReducer } from "react";

const Context = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case "setSideNavTab":
      return { ...state, sideNavTab: action.payload };
    case "setHomePosts":
      return { ...state, homePosts: action.payload };
    case "setShowCreateComment":
      return { ...state, ShowCreateComment: action.payload };
    case "setFormDataForComments":
      return { ...state, formDataForComments: action.payload };
    case "changeUserInfoForMsg":
      return { ...state, userInfoForMsg: action.payload };
    case "setMessages":
      return { ...state, messages: [...action.payload] };
    case "appendMessages":
      return { ...state, messages: [...state.messages, ...action.payload] };
    case "setShowGifsForMsg":
      return { ...state, showGifsForMsg: action.payload };
    case "setFriendList":
      return { ...state, friendList: action.payload };
    case "filterFriendList":
      return { ...state, filterFriendList: action.payload };
    case "setPostDetails":
      return { ...state, postDetails: action.payload };
    case "setShowEditProfile":
      return { ...state, showEditProfile: action.payload };
    case "setShowEditProfilePic":
      return { ...state, showEditProfilePic: action.payload };
    case "setShowEditProfileCoverPic":
      return { ...state, showEditProfileCoverPic: action.payload };
    case "setProfile":
      return { ...state, profile: action.payload };
    case "setEditProfile":
      return { ...state, editProfile: action.payload };
    case "setSearchResults":
      return { ...state, searchResults: action.payload };
    case "setShowCreatePost":
      return { ...state, showCreatePost: action.payload };
    case "setFormDataForPost":
      return { ...state, formDataForPost: action.payload };
    case "setPostsObject":
      return { ...state, postsObject: action.payload };
    case "setShowLogin":
      return { ...state, showLogin: action.payload };
    case "setShowRegister":
      return { ...state, showRegister: action.payload };
    case "setLogin":
      return { ...state, Login: action.payload };
    case "setRegister":
      return { ...state, Register: action.payload };
    case "setNotifics":
      return { ...state, notifics: [...action.payload, ...state.notifics] };
    case "setOverlayPicSrc":
      return { ...state, overlayPicSrc: action.payload };
    case "setFriendSuggesstions":
      return { ...state, friendSuggesstions: action.payload };
    case "setTrendingPosts":
      return {
        ...state,
        trendingPosts: [...state.trendingPosts, ...action.payload],
      };
    case "setTrendingVideos":
      return {
        ...state,
        trendingVideos: [...state.trendingVideos, ...action.payload],
      };
    case "setTab":
      return { ...state, tab: action.payload };
    case "setIsFetching":
      return { ...state, isFetching: action.payload };

    case "setFormDataForCmtOnCmt":
      return { ...state, formDataForCmtOnCmt: action.payload };
    case "setShowCreateCommentForCmt":
      return { ...state, ShowCreateCommentForCmt: action.payload };

    default:
      return state;
  }
}

const initialState = {
  showLogin: false,
  showRegister: false,
  Login: {
    email: "",
    password: "",
    method: "native",
  },
  Register: {
    f_name: "",
    l_name: "",
    email: "",
    password: "",
    method: "native",
    imageUri: "",
  },
  sideNavTab: "navHome",
  homePosts: [],
  ShowCreateComment: false,
  formDataForComments: {
    text: null,
    gif: null,
    img: [],
    postId: null,
  },
  userInfoForMsg: {},
  messages: [],
  showGifsForMsg: false,
  friendList: [],
  filterFriendList: [],
  ShowCreateCommentForCmt: false,
  postDetails: {},
  showEditProfile: false,
  showEditProfilePic: false,
  showEditProfileCoverPic: false,
  profile: {},
  editProfile: {
    f_name: "",
    l_name: "",
    bio: "",
    location: "",
    username: "",
  },
  searchResults: [],
  showCreatePost: false,
  formDataForPost: {
    text: null,
    embedLink: null,
    img: [],
    video: null,
  },
  postsObject: {},
  notifics: [],
  overlayPicSrc: "",
  friendSuggesstions: [],
  trendingPosts: [],
  trendingVideos: [],
  tab: "posts",
  isFetching: false,
  formDataForCmtOnCmt: {
    text: null,
    gif: null,
    img: [],
    commentId: null,
  },
};

export function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Context.Provider value={{ ...state, dispatch }}>
      {children}
    </Context.Provider>
  );
}

export const ContextConsumer = Context.Consumer;

export default Context;
