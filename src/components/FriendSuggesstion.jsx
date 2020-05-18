import React, { useEffect, useContext } from "react";
import Context from "./Context";
import { useHistory } from "react-router-dom";

function FriendSuggesstion() {
  const ctx = useContext(Context);
  const history = useHistory();

  const getSuggesstions = () => {
    const myheaders = new Headers();
    myheaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    fetch("/users/friend-suggesstions", {
      method: "get",
      headers: myheaders,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          ctx.dispatch({ type: "setFriendSuggesstions", payload: data.data });
        }
      });
  };

  useEffect(() => {
    getSuggesstions();
  }, []);

  const followHandler = (e, id) => {
    e.preventDefault();
    const myheaders = new Headers();
    myheaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    fetch("/users/profile/" + id + "/follow", {
      method: "get",
      headers: myheaders,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          getSuggesstions();
        }
      });
  };

  return (
    <div id="friend-suggesstions">
      <p>
        <strong>Peoples You May Know</strong>{" "}
      </p>
      {ctx.friendSuggesstions.map((friend) => (
        <div key={friend._id} id="suggess-profile-pic">
          <img src={friend.imageUri} alt={friend.name + " pic"} />
          <div
            onClick={() =>
              history.push("/user/profile/" + friend.username.split("@")[1])
            }
          >
            <strong>{friend.f_name + " " + friend.l_name}</strong>

            <br />
            {friend.username}
          </div>
          <button
            onClick={(e) => followHandler(e, friend.username.split("@")[1])}
          >
            Follow
          </button>
        </div>
      ))}
    </div>
  );
}

export default FriendSuggesstion;
