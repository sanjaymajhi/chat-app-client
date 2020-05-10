import React, { useState, useEffect, useContext } from "react";
import { InputGroup, FormControl } from "react-bootstrap";
import Context from "../Context";

function MessagesRight() {
  const ctx = useContext(Context);

  useEffect(() => {
    getFriendList();
  }, []);

  const context = useContext(Context);

  const getFriendList = () => {
    const myheaders = new Headers();
    myheaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    fetch("/users/friend-list", {
      method: "get",
      headers: myheaders,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          ctx.dispatch({ type: "setFriendList", payload: data.data });
        }
      });
  };
  return (
    <div id="messages-right">
      <p>
        <strong>Messages</strong>{" "}
      </p>
      <div id="msg-people-search">
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text>
              <i className="material-icons">&#xe8b6;</i>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl placeholder="Search your Friends" />
        </InputGroup>
      </div>
      {ctx.friendList.map((friend) => (
        <div
          key={friend.id}
          id="msg-profile-pic"
          onClick={() =>
            context.dispatch({
              type: "change",
              payload: friend,
            })
          }
        >
          <img src={friend.imageUri} alt={friend.name + " pic"} />
          <div>
            {friend.name}
            <br />
            {friend.username}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessagesRight;
