import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CreatePostOrCommentComponent from "./CreatePostOrComment";
import Context from "./Context";

function SideNav(props) {
  const ctx = useContext(Context);
  const setShowCreatePost = (data) =>
    ctx.dispatch({ type: "setShowCreatePost", payload: data });

  const handleCloseCreatePost = () => {
    setFormDataForPost({});
    setShowCreatePost(false);
  };
  const handleShowCreatePost = () => setShowCreatePost(true);

  const setGifForPost = (data) =>
    ctx.dispatch({ type: "setGifForPost", payload: data });
  const setFormDataForPost = (data) =>
    ctx.dispatch({ type: "setFormDataForPost", payload: data });

  return (
    <div>
      <ul id="side-nav-phone">
        <Link to="/user/">
          <li>
            <i class="material-icons">store</i>
          </li>
        </Link>
        <Link to="/user/explore">
          <li>
            <i class="material-icons">explore</i>
          </li>
        </Link>
        <Link to="/user/notifications">
          <li>
            <i class="material-icons">notifications</i>
          </li>
        </Link>
        <Link to="/user/messages">
          <li>
            <i class="material-icons">message</i>
          </li>
        </Link>
      </ul>
      <button id="tweet-button-phone" onClick={handleShowCreatePost}>
        <i class="material-icons"> edit</i>
      </button>

      <ul id="side-nav">
        <Link to="/user/">
          <li>
            <h2>InstaChat</h2>
          </li>
        </Link>
        <Link to="/user/">
          <li>
            <i class="material-icons">store</i>&emsp;Home
          </li>
        </Link>
        <Link to="/user/explore">
          <li>
            <i class="material-icons">explore</i>&emsp;Explore
          </li>
        </Link>
        <Link to="/user/notifications">
          <li>
            <i class="material-icons">notifications</i>&emsp;Notifications
          </li>
        </Link>
        <Link to="/user/messages">
          <li>
            <i class="material-icons">message</i>&emsp;Messages
          </li>
        </Link>
        <Link to={"/user/profile/" + localStorage.getItem("username")}>
          <li>
            <i class="material-icons">account_circle</i>&emsp;Profile
          </li>
        </Link>
        <button onClick={handleShowCreatePost}>Tweet</button>
      </ul>

      <ul id="side-nav-tablet">
        <Link to="/user/">
          <li>
            <h2>InstaChat</h2>
          </li>
        </Link>
        <Link to="/user/">
          <li>
            <i class="material-icons">store</i>
          </li>
        </Link>
        <Link to="/user/explore">
          <li>
            <i class="material-icons">explore</i>
          </li>
        </Link>
        <Link to="/user/notifications">
          <li>
            <i class="material-icons">notifications</i>
          </li>
        </Link>
        <Link to="/user/messages">
          <li>
            <i class="material-icons">message</i>
          </li>
        </Link>
        <Link to={"/user/profile/" + localStorage.getItem("username")}>
          <li>
            <i class="material-icons">account_circle</i>
          </li>
        </Link>
        <br />
        <br />
        <button onClick={handleShowCreatePost} id="tweet-button-tablet">
          <i class="material-icons"> edit</i>
        </button>
      </ul>

      {/* create post modal */}
      <CreatePostOrCommentComponent
        {...props}
        setFormData={setFormDataForPost}
        formData={ctx.formDataForPost}
        handleCloseCreatePostOrComment={handleCloseCreatePost}
        setGif={setGifForPost}
        ShowCreatePostOrComment={ctx.showCreatePost}
        gif={ctx.gifForPost}
      />
    </div>
  );
}

export default SideNav;
