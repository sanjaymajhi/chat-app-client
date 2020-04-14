import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import User from "./components/user/User";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Homepage from "./components/Homepage";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={Homepage} />
          <Route path="/user/" component={User} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
