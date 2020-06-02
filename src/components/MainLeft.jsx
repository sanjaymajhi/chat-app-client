import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import Profile from "./Profile";
import MessagesLeft from "./messagesLeft";
import Home from "./Home";
import MessagesRight from "./messagesRight";
import Post from "./Post";
import Context from "./Context";
import Notifications from "./Notifications";
import ExploreLeft from "./ExploreLeft";
import NoMsgBox from "./NoMsgBox";

function MainLeft() {
  const ctx = useContext(Context);
  return (
    <div className="main-left">
      <Switch>
        <Route path="/user/" exact component={Home} />

        <Route path="/user/profile/:id" component={Profile} />

        <Route
          path="/user/messages/:id"
          component={
            window.matchMedia("(min-width: 901px)").matches
              ? MessagesLeft
              : Object.keys(ctx.userInfoForMsg).length > 0
              ? MessagesLeft
              : MessagesRight
          }
        />

        <Route
          path="/user/messages/"
          component={
            window.matchMedia("(min-width: 901px)").matches
              ? NoMsgBox
              : MessagesRight
          }
        />

        <Route path="/user/post/:id" component={Post} />

        <Route path="/user/notifications/" component={Notifications} />

        <Route path="/user/explore/" component={ExploreLeft} />
      </Switch>
    </div>
  );
}

export default MainLeft;
