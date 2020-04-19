import React from "react";
import { Switch, Route } from "react-router-dom";
import ProfileSideBar from "./profileSideBar";

function MainRight() {
  return (
    <div className="main-right">
      <Switch>
        <Route path="/user/profile/:id" component={ProfileSideBar} />
      </Switch>
    </div>
  );
}

export default MainRight;
