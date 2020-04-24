import React, { useReducer } from "react";
import MainLeft from "./MainLeft";
import MainRight from "./MainRight";

export const Context = React.createContext();

function Main() {
  const initialState = {};
  const reducer = (state, action) => {
    switch (action.type) {
      case "change":
        return action.payload;
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div id="main">
      <Context.Provider value={{ state: state, dispatch: dispatch }}>
        <MainLeft />
        <MainRight />
      </Context.Provider>
    </div>
  );
}

export default Main;
