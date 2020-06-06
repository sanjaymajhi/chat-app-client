import React, { useEffect, useContext } from "react";
import Context from "./Context";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { get_notifications } from "./functions";

function Notifications() {
  const ctx = useContext(Context);
  const history = useHistory();

  const setNotifics = (data) =>
    ctx.dispatch({ type: "setNotifics", payload: data });

  useEffect(() => {
    get_notifications(ctx.notifics.length, setNotifics);
  }, []);

  const switchInJsx = (data) => {
    switch (data) {
      case "share":
        return "shared your post.";
      case "like":
        return "liked your post.";
      case "comment":
        return "commented on your post.";
      case "likeComment":
        return "liked your comment.";
      case "replyComment":
        return "replied to your comment.";
      case "likeReply":
        return "liked your reply to a comment.";
      default:
        return "started following you.";
    }
  };

  return (
    <div id="notific-div">
      <div id="notific-head">
        <h3>Notifications</h3>
      </div>
      <div id="notifics">
        {ctx.notifics.length > 0 ? (
          ctx.notifics.map((notific) => (
            <div id="notific" key={notific._id}>
              <img
                src={notific.userWhoPushed.imageUri}
                alt={notific.userWhoPushed.f_name + " pic"}
              />
              <div
                onClick={
                  notific.type !== "follow"
                    ? () => history.push("/user/post/" + notific.postId)
                    : () =>
                        history.push(
                          "/user/profile/" +
                            notific.userWhoPushed.username.split("@")[1]
                        )
                }
              >
                <strong>
                  {notific.userWhoPushed.f_name +
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
