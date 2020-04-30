import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import CreatePostOrCommentComponent from "../CreatePostOrComment";

function SideNav(props) {
  const [ShowCreatePost, setShowCreatePost] = useState(false);
  const handleCloseCreatePost = () => {
    setFormData({});
    setShowCreatePost(false);
  };
  const handleShowCreatePost = () => setShowCreatePost(true);

  const [gif, setGif] = useState(null);
  const [formData, setFormData] = useState({});

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

      {/* create post modal */}
      <CreatePostOrCommentComponent
        {...props}
        setFormData={setFormData}
        formData={formData}
        handleCloseCreatePostOrComment={handleCloseCreatePost}
        setGif={setGif}
        ShowCreatePostOrComment={ShowCreatePost}
        gif={gif}
      />
    </div>
  );
}

export default SideNav;
