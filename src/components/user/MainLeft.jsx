import React from "react";
import { Switch, Route } from "react-router-dom";
import Profile from "./Profile";

function MainLeft() {
  return (
    <div>
      <Switch>
        <Route path="/user/profile/:id" component={Profile} />
      </Switch>
    </div>
  );
}

export default MainLeft;
