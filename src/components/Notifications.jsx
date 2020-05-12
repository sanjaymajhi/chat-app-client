import React, { useEffect, useContext } from "react";
import Context from "./Context";
import moment from "moment";

function Notifications() {
  const ctx = useContext(Context);

  const myheaders = new Headers();
  myheaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
  const get_notifications = () =>
    fetch("/users/notifications", {
      method: "GET",
      headers: myheaders,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          data.notifics.sort(
            (a, b) =>
              new Date(a.datetime).getMilliseconds -
              new Date(b.datetime).getMilliseconds
          );
          ctx.dispatch({ type: "setNotifics", payload: data.notifics });
        }
      });

  useEffect(() => {
    get_notifications();
  }, []);

  const switchInJsx = (data) => {
    switch (data) {
      case "share":
        return "shared your post.";
      case "like":
        return "liked your post.";
      case "comment":
        return "commented on your post.";
      default:
        return "started following you.";
    }
  };

  return (
    <div id="notific-div">
      {console.log(ctx.notifics)}
      <div id="notific-head">
        <h3>Notifications</h3>
      </div>
      <div id="notifics">
        {ctx.notifics.length > 0 ? (
          ctx.notifics.map((notific) => (
            <div id="notific">
              <img
                src={notific.userWhoPushed.imageUri}
                alt={notific.userWhoPushed.f_name + " pic"}
              />
              <div>
                <strong>
                  {notific.userWhoPushed._id === localStorage.getItem("id")
                    ? "You"
                    : notific.userWhoPushed.f_name +
                      " " +
                      notific.userWhoPushed.l_name}
                </strong>{" "}
                {switchInJsx(notific.type)}
                <br />
                <span>{moment(notific.datetime).fromNow()}</span>
              </div>
            </div>
          ))
        ) : (
          <div id="no-notific">
            <h3> There are no notifications to show</h3>
            <span>Follow peoples and create posts</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
