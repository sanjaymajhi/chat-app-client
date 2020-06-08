import React from "react";
import moment from "moment";
import { useContext } from "react";
import Context from "./Context";
import { useEffect } from "react";

function CommentReplies(props) {
  const ctx = useContext(Context);
  const likeReply = (e) => {
    e.preventDefault();
    const target = e.target;
    const myheaders = new Headers();
    myheaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    myheaders.append("content-type", "application/json");
    const url = "/users/comment/commentOnComment/like";
    fetch(url, {
      method: "post",
      body: JSON.stringify({
        commentId: props.commentId,
        replyId: e.target.id,
      }),
      headers: myheaders,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          //no of likes or shares before clicking
          let number = Number(target.nextSibling.nextSibling.textContent);
          target.nextSibling.nextSibling.textContent =
            target.style.color === "skyblue" ? number - 1 : number + 1;
          target.style.color =
            target.style.color === "skyblue" ? "lightgray" : "skyblue";
        }
      });
  };

  return (
    <React.Fragment>
      {props.replies !== undefined &&
        props.replies.length > 0 &&
        props.replies.map((reply) => (
          <div key={reply._id} id="sub_comments">
            <img src={reply.user_id.imageUri} alt="pic" id="user-post-img" />
            <div id="comment_detail">
              <p id="post-user-detail">
                <strong>
                  {reply.user_id.f_name + " " + reply.user_id.l_name}
                </strong>
                &ensp;
                <span>
                  {reply.user_id.username}
                  {window.matchMedia("(max-width: 480px)").matches ? (
                    <br />
                  ) : (
                    " · "
                  )}
                  {new Date() - new Date(reply.date) < 3600 * 12 * 1000
                    ? moment(reply.date).fromNow()
                    : new Date(reply.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                      })}
                </span>
              </p>
              <div>
                {reply.replyText !== "null" && reply.replyText}
                {[undefined, null].indexOf(reply.replyImg) === -1 && (
                  <div id="comment-images">
                    <img
                      src={reply.replyImg}
                      alt=""
                      onClick={() => {
                        ctx.dispatch({
                          type: "setOverlayPicSrc",
                          payload: reply.replyImg,
                        });
                        document.getElementById("overlay-pics").style.display =
                          "block";
                      }}
                    />
                  </div>
                )}

                {[undefined, null, "null"].indexOf(reply.replyGif) === -1 && (
                  <div id="comment-gif-div">
                    <img src={reply.replyGif} alt="" />{" "}
                  </div>
                )}
              </div>
              <div id="like-share-onComment">
                <span>
                  <i
                    className="material-icons"
                    onClick={likeReply}
                    id={reply._id}
                    style={{
                      color:
                        reply.likes.indexOf(localStorage.getItem("id")) === -1
                          ? "lightgray"
                          : "skyblue",
                    }}
                  >
                    thumb_up
                  </i>
                  &emsp;
                  {reply.likes.length}
                </span>
              </div>
            </div>
            <div
              id="overlay-pics"
              onClick={() => {
                document.getElementById("overlay-pics").style.display = "none";
                ctx.dispatch({
                  type: "setOverlayPicSrc",
                  payload: "",
                });
              }}
            >
              <img src={ctx.overlayPicSrc} alt="large size pic" />
            </div>
          </div>
        ))}
    </React.Fragment>
  );
}

export default CommentReplies;
