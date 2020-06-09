import React, { useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import CreatePost from "./CreatePost";
import Context from "./Context";
import { get_notifications } from "./functions";
import { Toast } from "react-bootstrap";

function SideNav(props) {
  const ctx = useContext(Context);
  const history = useHistory();
  const setShowCreatePost = (data) =>
    ctx.dispatch({ type: "setShowCreatePost", payload: data });

  const handleCloseCreatePost = () => {
    setFormDataForPost({
      "post-text": null,
      embedLink: null,
      "post-img": [],
      "post-video": null,
    });
    setShowCreatePost(false);
  };
  const handleShowCreatePost = () => setShowCreatePost(true);

  const setFormDataForPost = (data) =>
    ctx.dispatch({ type: "setFormDataForPost", payload: data });

  const setNotifics = (data) =>
    ctx.dispatch({ type: "setNotifics", payload: data });

  useEffect(() => {
    const interval = setInterval(() => {
      get_notifications(
        ctx.notifics.length,
        setNotifics,
        ctx.notifics,
        history
      );
      console.log("notific");
    }, 20000);
    return () => {
      clearInterval(interval);
    };
  }, [ctx.notifics]);

  useEffect(() => {
    get_notifications(0, setNotifics);
  }, []);

  const colorNavTab = (e) => {
    document.getElementById(ctx.sideNavTab).style.borderLeft = "";
    e.target.style.borderLeft = "1vw solid #5cb85b";
    ctx.dispatch({ type: "setSideNavTab", payload: e.target.id });
  };

  return (
    <div>
      {console.log("render")}
      <ul id="side-nav-phone">
        <Link to="/user/">
          <li>
            <i className="material-icons">store</i>
          </li>
        </Link>
        <Link to="/user/explore">
          <li>
            <i className="material-icons">explore</i>
          </li>
        </Link>
        <Link to="/user/notifications">
          <li>
            <i className="material-icons">notifications</i>
          </li>
        </Link>
        <Link to="/user/messages">
          <li>
            <i className="material-icons">message</i>
          </li>
        </Link>
      </ul>
      <button id="tweet-button-phone" onClick={handleShowCreatePost}>
        <i className="material-icons"> edit</i>
      </button>

      <ul id="side-nav">
        <Link to="/user/">
          <li>
            <h2>InstaChat</h2>
          </li>
        </Link>
        <Link to="/user/">
          <li id="navHome" onClick={colorNavTab}>
            <i className="material-icons">store</i>&emsp;Home
          </li>
        </Link>
        <Link to="/user/explore">
          <li id="navExplore" onClick={colorNavTab}>
            <i className="material-icons">explore</i>&emsp;Explore
          </li>
        </Link>
        <Link to="/user/notifications">
          <li id="navNotific" onClick={colorNavTab}>
            <i className="material-icons">notifications</i>&emsp;Notifications
          </li>
        </Link>
        <Link to="/user/messages">
          <li id="navMsg" onClick={colorNavTab}>
            <i className="material-icons">message</i>&emsp;Messages
          </li>
        </Link>
        <Link to={"/user/profile/" + localStorage.getItem("username")}>
          <li id="navProfile" onClick={colorNavTab}>
            <i className="material-icons">account_circle</i>&emsp;Profile
          </li>
        </Link>
        <button onClick={handleShowCreatePost}>Tweet</button>
      </ul>

      <ul id="side-nav-tablet">
        <Link to="/user/">
          <li>
            <h2>IChat</h2>
          </li>
        </Link>
        <Link to="/user/">
          <li id="navHomeTablet" onClick={colorNavTab}>
            <i className="material-icons">store</i>
          </li>
        </Link>
        <Link to="/user/explore">
          <li id="navExploreTablet" onClick={colorNavTab}>
            <i className="material-icons">explore</i>
          </li>
        </Link>
        <Link to="/user/notifications">
          <li id="navNotificTablet" onClick={colorNavTab}>
            <i className="material-icons">notifications</i>
          </li>
        </Link>
        <Link to="/user/messages">
          <li id="navMsgTablet" onClick={colorNavTab}>
            <i className="material-icons">message</i>
          </li>
        </Link>
        <Link to={"/user/profile/" + localStorage.getItem("username")}>
          <li id="navProfileTablet" onClick={colorNavTab}>
            <i className="material-icons">account_circle</i>
          </li>
        </Link>
        <button onClick={handleShowCreatePost} id="tweet-button-tablet">
          <i className="material-icons"> edit</i>
        </button>
      </ul>

      {/* create post modal */}
      <CreatePost
        {...props}
        setFormData={setFormDataForPost}
        formData={ctx.formDataForPost}
        handleCloseCreatePost={handleCloseCreatePost}
        ShowCreatePost={ctx.showCreatePost}
      />
      <Toast
        show={true}
        id="notific-alert"
        style={{
          display: "none",
          position: "fixed",
          bottom: "5vh",
          left: "2vw",
          backgroundColor: "black",
          color: "white",
          zIndex: "10000",
        }}
      >
        <Toast.Body id="notific-toast-body">
          Only jpg and png files allowed
        </Toast.Body>
      </Toast>
    </div>
  );
}

export default SideNav;
