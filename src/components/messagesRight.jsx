import React, { useEffect, useContext } from "react";
import { InputGroup, FormControl } from "react-bootstrap";
import Context from "./Context";
import { useHistory } from "react-router-dom";

function MessagesRight() {
  const ctx = useContext(Context);
  const history = useHistory();

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
        <strong>
          {history.location.pathname === "/user/messages"
            ? "Messages"
            : "Friends"}
        </strong>{" "}
      </p>
      {history.location.pathname === "/user/messages" && (
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
      )}
      {ctx.friendList.map((friend) => (
        <div
          key={friend.id}
          id="msg-profile-div"
          onClick={() => {
            context.dispatch({
              type: "changeUserInfoForMsg",
              payload: friend,
            });
            history.push("/user/messages");
          }}
        >
          <div id="msg-profile-pic">
            <img src={friend.imageUri} alt={friend.name + " pic"} />
            {friend.isOnline && <span id="dot"></span>}
          </div>
          <div>
            <strong> {friend.name}</strong>

            <br />
            <span>{"@" + friend.username}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessagesRight;
