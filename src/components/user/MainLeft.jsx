import React from "react";
import { Switch, Route } from "react-router-dom";
import Profile from "./Profile";
import MessagesLeft from "./messagesLeft";

function MainLeft() {
  return (
    <React.Fragment>
      <Switch>
        <Route path="/user/profile/:id" component={Profile} />

        <Route path="/user/messages" component={MessagesLeft} />
      </Switch>
    </React.Fragment>
  );
}

export default MainLeft;
