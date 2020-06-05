import React, { useReducer } from "react";

const Context = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case "setHomePosts":
      return { ...state, homePosts: action.payload };
    case "setPostIdForComment":
      return { ...state, postIdForComment: action.payload };
    case "setShowCreateComment":
      return { ...state, ShowCreateComment: action.payload };
    case "setFormDataForHomeComments":
      return { ...state, formDataForHomeComments: action.payload };
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
    case "setFormDataForPostComment":
      return { ...state, formDataForPostComment: action.payload };
    case "setShowCreateCommentForCmt":
      return { ...state, ShowCreateCommentForCmt: action.payload };
    case "setPostDetails":
      return { ...state, postDetails: action.payload };
    case "setCommentIdForComment":
      return { ...state, commentIdForComment: action.payload };
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
    case "setShowCreateCommentForProfilePosts":
      return { ...state, ShowCreateCommentForProfilePosts: action.payload };
    case "setGifForUserPostsCmnt":
      return { ...state, gifForUserPostsCmnt: action.payload };
    case "setFormDataForUserPostsCmnt":
      return { ...state, formDataForUserPostsCmnt: action.payload };
    case "setPostsObject":
      return { ...state, postsObject: action.payload };
    case "setPostIdForUserPostsComment":
      return { ...state, postIdForUserPostsComment: action.payload };
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
  homePosts: [],
  postIdForComment: "",
  ShowCreateComment: false,
  formDataForHomeComments: {
    "post-text": null,
    "gif-id": null,
    "post-img": [],
    postId: null,
    embedLink: null,
    "post-video": null,
  },
  userInfoForMsg: {},
  messages: [],
  showGifsForMsg: false,
  friendList: [],
  filterFriendList: [],
  formDataForPostComment: {
    "post-text": null,
    "gif-id": null,
    "post-img": [],
    postId: null,
    embedLink: null,
    "post-video": null,
  },
  ShowCreateCommentForCmt: false,
  postDetails: {},
  commentIdForComment: "",
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
    "post-text": null,
    embedLink: null,
    "post-img": [],
    "post-video": null,
    "gif-id": null,
    postId: null,
  },
  ShowCreateCommentForProfilePosts: false,
  gifForUserPostsCmnt: null,
  formDataForUserPostsCmnt: {
    "post-text": null,
    "gif-id": null,
    "post-img": [],
    postId: null,
    embedLink: null,
    "post-video": null,
  },
  postsObject: {},
  postIdForUserPostsComment: "",
  notifics: [],
  overlayPicSrc: "",
  friendSuggesstions: [],
  trendingPosts: [],
  trendingVideos: [],
  tab: "posts",
  isFetching: false,
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
