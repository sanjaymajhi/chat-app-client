import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import CreatePostOrCommentComponent from "../CreatePostOrComment";
import Posts from "../Posts";
import Context from "../Context";

function Post(props) {
  const { id } = useParams();
  const ctx = useContext(Context);

  const [postIdForComment, setPostIdForComment] = useState("");

  useEffect(() => getPost(), []);

  const [ShowCreateComment, setShowCreateComment] = useState(false);
  const handleCloseCreateComment = () => {
    setFormDataForPostComment({});
    setShowCreateComment(false);
  };
  const handleShowCreateComment = (e) => {
    setPostIdForComment(e.target.id);
    setShowCreateComment(true);
  };

  const setGifForPostComment = (data) =>
    ctx.dispatch({ type: "setGifForPostComment", payload: data });

  const setFormDataForPostComment = (data) =>
    ctx.dispatch({ type: "setFormDataForPostComment", payload: data });

  //comment on comment
  const setGifForCommentOnComment = (data) =>
    ctx.dispatch({ type: "setGifForCommentOnComment", payload: data });

  const setFormDataForCmtOnCmt = (data) =>
    ctx.dispatch({ type: "setFormDataForCmtOnCmt", payload: data });

  const setCommentIdForComment = (data) =>
    ctx.dispatch({ type: "setCommentIdForComment", payload: data });

  const setShowCreateCommentForCmt = (data) =>
    ctx.dispatch({ type: "setShowCreateCommentForCmt", payload: data });

  const handleCloseCreateCommentForCmt = () => {
    setFormDataForCmtOnCmt({});
    setShowCreateCommentForCmt(false);
  };
  const handleShowCreateCommentForCmt = (e) => {
    setCommentIdForComment(e.target.id);
    setShowCreateCommentForCmt(true);
  };

  const getPost = () => {
    const myheaders = new Headers();
    myheaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    fetch("/users/post/" + id, {
      method: "get",
      headers: myheaders,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.saved === "success") {
          ctx.dispatch({ type: "setPostDetails", payload: data.details });
          console.log(data.details);
        }
      });
  };

  const likeSharePost = (e, type) => {
    e.preventDefault();
    const target = e.target;
    const myheaders = new Headers();
    myheaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    myheaders.append("content-type", "application/json");
    fetch("/users/posts/" + type, {
      method: "post",
      body: JSON.stringify({
        post_id: id,
      }),
      headers: myheaders,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          console.log("done");
          target.style.color = target.style.color === "blue" ? "gray" : "blue";
        }
      });
  };

  return (
    Object.keys(ctx.postDetails).length > 0 && (
      <div>
        <div id="single-post-head">
          <h3>
            <strong>Post</strong>
          </h3>
        </div>
        <div id="single-post-profile">
          <img
            src={ctx.postDetails.imageUri}
            alt={ctx.postDetails.name + " profile pic"}
          />
          <div>
            <strong>{ctx.postDetails.name}</strong>

            <br />
            <span>{ctx.postDetails.username}</span>
          </div>
        </div>
        <div>
          <div id="single-post-detail">{ctx.postDetails.postText}</div>

          <div id="single-post-date">
            <span>
              {moment(ctx.postDetails.date).format("HH:mm A") +
                " · " +
                moment(ctx.postDetails.date).format("ll")}
            </span>
          </div>
          <div id="single-post-likeshare">
            <strong>{ctx.postDetails.likes.length}</strong>
            <span> Likes</span> &emsp;
            <strong>{ctx.postDetails.shares.length}</strong>
            <span> Shares</span>
          </div>
          <div id="likesharecomment">
            <span
              onClick={(e) => likeSharePost(e, "like")}
              style={{
                color:
                  ctx.postDetails.likes.indexOf(localStorage.getItem("id")) ===
                  -1
                    ? "gray"
                    : "blue",
              }}
            >
              <i className="material-icons">thumb_up</i>
              &ensp; Like
            </span>
            <span
              onClick={(e) => likeSharePost(e, "share")}
              style={{
                color:
                  ctx.postDetails.shares.indexOf(localStorage.getItem("id")) ===
                  -1
                    ? "gray"
                    : "blue",
              }}
            >
              <i className="material-icons"> share</i>
              &ensp; Share
            </span>
            <span>
              <i className="material-icons" onClick={handleShowCreateComment}>
                {" "}
                message
              </i>
              &ensp; Comment
            </span>
          </div>
        </div>
        <Posts
          {...props}
          type="comment"
          posts={ctx.postDetails.comments}
          setFormData={setFormDataForCmtOnCmt}
          formData={ctx.formDataForCmtOnCmt}
          handleCloseCreatePostOrComment={handleCloseCreateCommentForCmt}
          setGif={setGifForCommentOnComment}
          ShowCreatePostOrComment={ctx.ShowCreateCommentForCmt}
          gif={ctx.gifForCommentOnComment}
          postId={ctx.commentIdForComment}
          handleShowCreateComment={handleShowCreateCommentForCmt}
        />

        {/* comment on opened post */}

        <CreatePostOrCommentComponent
          {...props}
          setFormData={setFormDataForPostComment}
          formData={ctx.formDataForPostComment}
          handleCloseCreatePostOrComment={handleCloseCreateComment}
          setGif={setGifForPostComment}
          ShowCreatePostOrComment={ShowCreateComment}
          gif={ctx.gifForPostComment}
          type="comment"
          postId={id}
        />
      </div>
    )
  );
}

export default Post;
