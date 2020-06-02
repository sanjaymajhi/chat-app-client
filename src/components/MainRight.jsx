import React from "react";
import { Switch, Route } from "react-router-dom";
import MessagesRight from "./messagesRight";
import FriendSuggesstion from "./FriendSuggesstion";

function MainRight() {
  return (
    <div className="main-right">
      <Switch>
        <Route path="/user/profile/:id" component={MessagesRight} />
        <Route path="/user/messages/" component={MessagesRight} />
        <Route path="/user/explore" component={FriendSuggesstion} />
        <Route path="/user/" exact component={FriendSuggesstion} />
      </Switch>
    </div>
  );
}

export default MainRight;
