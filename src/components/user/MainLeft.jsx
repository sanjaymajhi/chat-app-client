import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import Profile from "./Profile";
import MessagesLeft from "./messagesLeft";
import Home from "./Home";
import { Context } from "./Main";
import MessagesRight from "./messagesRight";
import Post from "./Post";

function MainLeft() {
  const context = useContext(Context);
  return (
    <div class="main-left">
      <Switch>
        <Route path="/user/" exact component={Home} />

        <Route path="/user/profile/:id" component={Profile} />

        <Route
          path="/user/messages"
          component={
            !window.matchMedia("(max-width: 480px)").matches
              ? MessagesLeft
              : Object.keys(context.state).length > 0
              ? MessagesLeft
              : MessagesRight
          }
        />
        <Route path="/user/post/:id" component={Post} />
      </Switch>
    </div>
  );
}

export default MainLeft;
