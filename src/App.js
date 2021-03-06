import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import User from "./components/User";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import { ContextProvider } from "./components/Context";
import About from "./components/About";

function App() {
  return (
    <div className="App">
      <Router>
        <ContextProvider>
          <Switch>
            <Route path="/login" exact component={Homepage} />
            <Route path="/user/" component={User} />
            <Route path="/about" component={About} />
          </Switch>
        </ContextProvider>
      </Router>
    </div>
  );
}

export default App;
