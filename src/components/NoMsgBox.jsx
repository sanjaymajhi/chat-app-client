import React from "react";
import { useEffect } from "react";

function NoMsgBox() {
  useEffect(() => {
    document.title = "InstaChat - Messages";
  }, []);
  return (
    <div id="message-left">
      <div id="msg-not-selected">
        <h2>You don't have a message selected</h2>
        <span>Select one of your friend to message</span>
      </div>
    </div>
  );
}

export default NoMsgBox;
