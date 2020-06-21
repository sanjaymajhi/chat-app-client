import React from "react";
import CreateComment from "./CreateComment";
import moment from "moment";
import { useContext } from "react";
import Context from "./Context";
import CommentReplies from "./CommentReplies";
import { Carousel } from "react-bootstrap";
import { useHistory } from "react-router-dom";

function Comment(props) {
  const ctx = useContext(Context);
  const history = useHistory();
  //comment on comment

  const setFormDataForCmtOnCmt = (data) =>
    ctx.dispatch({ type: "setFormDataForCmtOnCmt", payload: data });

  const setShowCreateCommentForCmt = (data) =>
    ctx.dispatch({ type: "setShowCreateCommentForCmt", payload: data });

  const handleCloseCreateCommentForCmt = () => {
    ctx.dispatch({
      type: "setFormDataForCmtOnCmt",
      payload: {
        text: null,
        gif: null,
        img: [],
        commentId: null,
      },
    });
    setShowCreateCommentForCmt(false);
    props.getPost();
  };
  const handleShowCreateCommentForCmt = (e) => {
    ctx.dispatch({
      type: "setFormDataForCmtOnCmt",
      payload: {
        text: null,
        gif: null,
        img: [],
        commentId: e.target.id,
      },
    });
    setShowCreateCommentForCmt(true);
  };

  const likeComment = (e, type) => {
    e.preventDefault();
    const target = e.target;
    const myheaders = new Headers();
    myheaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    myheaders.append("content-type", "application/json");
    const url =
      type !== "comment"
        ? "/users/commentOnComment/like"
        : "/users/comment/like";
    fetch(url, {
      method: "post",
      body: JSON.stringify({
        commentId: e.target.id, //commment id for comments and reply id for replies
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
    <div>
      {props.comments !== undefined &&
        props.comments.length > 0 &&
        props.comments.map((comment) => (
          <div key={comment._id} id="comments">
            <img
              src={comment.user_id.imageUri}
              alt="pic"
              id="user-post-img"
              onClick={() =>
                history.push(
                  "/user/profile/" + comment.user_id.username.split("@")[1]
                )
              }
            />
            <div id="comment_detail">
              <p
                id="comment-user-detail"
                onClick={() =>
                  history.push(
                    "/user/profile/" + comment.user_id.username.split("@")[1]
                  )
                }
              >
                <strong>
                  {comment.user_id.f_name + " " + comment.user_id.l_name}
                </strong>
                &ensp;
                <span>
                  {comment.user_id.username}
                  {window.matchMedia("(max-width: 480px)").matches ? (
                    <br />
                  ) : (
                    " · "
                  )}
                  {new Date() - new Date(comment.date) < 3600 * 12 * 1000
                    ? moment(comment.date).fromNow()
                    : new Date(comment.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                      })}
                </span>
              </p>
              <div>
                {comment.commentText !== "null" && comment.commentText}
                {comment.commentImg.length > 0 && (
                  <div id="comment-images">
                    {comment.commentImg.length > 1 ? (
                      <Carousel>
                        {comment.commentImg.map((img) => (
                          <Carousel.Item
                            onClick={() => {
                              ctx.dispatch({
                                type: "setOverlayPicSrc",
                                payload: img,
                              });
                              document.getElementById(
                                "overlay-pics"
                              ).style.display = "block";
                            }}
                          >
                            <img className="d-block w-100" src={img} alt="" />
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    ) : (
                      <img
                        src={comment.commentImg[0]}
                        alt=""
                        onClick={() => {
                          ctx.dispatch({
                            type: "setOverlayPicSrc",
                            payload: comment.commentImg[0],
                          });
                          document.getElementById(
                            "overlay-pics"
                          ).style.display = "block";
                        }}
                      />
                    )}
                  </div>
                )}

                {[undefined, null].indexOf(comment.commentGif) === -1 && (
                  <div id="comment-gif-div">
                    <img src={comment.commentGif} alt="" />{" "}
                  </div>
                )}
              </div>
              <div id="like-share-onComment">
                <span>
                  <i
                    className="material-icons"
                    onClick={(e) => likeComment(e, "comment")}
                    id={comment._id}
                    style={{
                      color:
                        comment.likes.indexOf(localStorage.getItem("id")) === -1
                          ? "lightgray"
                          : "skyblue",
                    }}
                  >
                    thumb_up
                  </i>
                  &emsp;
                  {comment.likes.length}
                </span>
                <span>
                  <i
                    className="material-icons"
                    onClick={handleShowCreateCommentForCmt}
                    id={comment._id}
                  >
                    {" "}
                    message
                  </i>{" "}
                  &ensp;
                  {props.type !== "comment"
                    ? comment.comments.length
                    : comment.sub_comments.length}
                </span>
              </div>
            </div>
            <CommentReplies
              {...props}
              replies={comment.sub_comments}
              commentId={comment._id}
            />
          </div>
        ))}
      <CreateComment
        {...props}
        setFormData={setFormDataForCmtOnCmt}
        formData={ctx.formDataForCmtOnCmt}
        handleCloseCreateComment={handleCloseCreateCommentForCmt}
        ShowCreateComment={ctx.ShowCreateCommentForCmt}
        type="comment"
        emitCommentEvent={props.emitCommentEvent}
      />
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
  );
}

export default Comment;
