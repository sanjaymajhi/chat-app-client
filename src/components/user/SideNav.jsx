import React from "react";
import "react-bootstrap";

function SideNav() {
  return (
    <ul id="side-nav">
      <li>
        <h2>InstaChat</h2>
      </li>
      <li>
        <i class="material-icons">store</i>&emsp;Home
      </li>
      <li>
        <i class="material-icons">explore</i>&emsp;Explore
      </li>
      <li>
        <i class="material-icons">notifications</i>&emsp;Notifications
      </li>
      <li>
        <i class="material-icons">message</i>&emsp;Messages
      </li>
      <li>
        <i class="material-icons">account_circle</i>&emsp;Profile
      </li>
      <button>Tweet</button>
    </ul>
  );
}

export default SideNav;
