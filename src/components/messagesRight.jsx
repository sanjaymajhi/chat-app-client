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

  const getMsgBoxId = (friend) => {
    const myheaders = new Headers();
    myheaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    myheaders.append("content-type", "application/json");
    fetch("/users/getMsgBoxId", {
      method: "post",
      body: JSON.stringify({
        friend_id: friend.id,
      }),
      headers: myheaders,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          ctx.dispatch({
            type: "changeUserInfoForMsg",
            payload: friend,
          });
          history.push("/user/messages/" + data.msgBoxId);
        } else {
          ctx.dispatch({
            type: "setMessages",
            payload: { saved: "unsuccessful" },
          });
        }
      });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const list = ctx.friendList.filter(
      (friend) => new RegExp("(" + value + ")", "i").test(friend.name) && friend
    );
    ctx.dispatch({ type: "filterFriendList", payload: list });
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
            <FormControl
              placeholder="Search your Friends"
              onChange={handleChange}
            />
          </InputGroup>
        </div>
      )}
      {ctx.filterFriendList.length > 0
        ? ctx.filterFriendList.map((friend) => (
            <div
              key={friend.id}
              id="msg-profile-div"
              onClick={() => getMsgBoxId(friend)}
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
          ))
        : ctx.friendList.map((friend) => (
            <div
              key={friend.id}
              id="msg-profile-div"
              onClick={() => getMsgBoxId(friend)}
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
