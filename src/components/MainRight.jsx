import React from "react";
import { Switch, Route } from "react-router-dom";
import ProfileSideBar from "./profileSideBar";
import MessagesRight from "./messagesRight";

function MainRight() {
  return (
    <div className="main-right">
      <Switch>
        <Route path="/user/profile/:id" component={ProfileSideBar} />
        <Route path="/user/messages" component={MessagesRight} />
      </Switch>
    </div>
  );
}

export default MainRight;
