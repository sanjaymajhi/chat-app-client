import React from "react";
import "react-bootstrap";
import { Link } from "react-router-dom";

function SideNav() {
  return (
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
      <button>Tweet</button>
    </ul>
  );
}

export default SideNav;
