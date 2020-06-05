import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import CreatePostOrCommentComponent from "./CreatePostOrComment";
import Posts from "./Posts";
import Context from "./Context";
import likeSharePost from "./functions";
import { Carousel } from "react-bootstrap";

function Post(props) {
  const { id } = useParams();
  const ctx = useContext(Context);

  useEffect(() => getPost(), []);

  const [ShowCreateComment, setShowCreateComment] = useState(false);
  const handleCloseCreateComment = () => {
    setFormDataForPostComment({
      "post-text": null,
      embedLink: null,
      "post-img": [],
      "post-video": null,
      "gif-id": null,
      postId: null,
    });
    setShowCreateComment(false);
  };
  const handleShowCreateComment = () => {
    setShowCreateComment(true);
  };

  const setFormDataForPostComment = (data) =>
    ctx.dispatch({ type: "setFormDataForPostComment", payload: data });

  //comment on comment

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

  return (
    <React.Fragment>
      {Object.keys(ctx.postDetails).length > 0 && (
        <div>
          <div id="single-post-head">
            <h3>Post</h3>
          </div>

          <div id="single-post-div">
            <div id="single-post-profile-pic">
              <img
                src={ctx.postDetails.user_id.imageUri}
                alt={ctx.postDetails.user_id.f_name + " profile pic"}
              />
            </div>
            <div>
              <strong>
                {ctx.postDetails.user_id.f_name +
                  " " +
                  ctx.postDetails.user_id.l_name}
              </strong>
              <span>{" · " + ctx.postDetails.user_id.username}</span>
              <div id="single-post-text">
                {ctx.postDetails.postText !== "null" &&
                  ctx.postDetails.postText}
              </div>
              <br />
              <div id="single-post-img-div">
                {ctx.postDetails.postImg.length > 0 &&
                  (ctx.postDetails.postImg.length === 1 ? (
                    <img
                      className="d-block w-100"
                      src={ctx.postDetails.postImg[0]}
                      alt=""
                      onClick={() => {
                        ctx.dispatch({
                          type: "setOverlayPicSrc",
                          payload: ctx.postDetails.postImg[0],
                        });
                        document.getElementById("overlay-pics").style.display =
                          "block";
                      }}
                    />
                  ) : (
                    <Carousel>
                      {ctx.postDetails.postImg.map((img) => (
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
                  ))}
                {ctx.postDetails.postGif !== undefined && (
                  <div>
                    <img src={ctx.postDetails.postGif} alt="" />
                  </div>
                )}
              </div>
              {ctx.postDetails.embedLink !== null && (
                <iframe
                  title="Youtube Video"
                  src={
                    "https://www.youtube.com/embed/" + ctx.postDetails.embedLink
                  }
                ></iframe>
              )}
              {ctx.postDetails.postVideo !== null && (
                <video src={ctx.postDetails.postVideo} controls />
              )}
            </div>
          </div>

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
            <span>
              <i
                className="material-icons"
                onClick={(e) => likeSharePost(e, "like", "post")}
                id={ctx.postDetails._id}
                style={{
                  color:
                    ctx.postDetails.likes.indexOf(
                      localStorage.getItem("id")
                    ) === -1
                      ? "gray"
                      : "blue",
                }}
              >
                thumb_up
              </i>
              &ensp; Like
            </span>

            <span>
              <i
                className="material-icons"
                onClick={(e) => likeSharePost(e, "share", "post")}
                id={ctx.postDetails._id}
                style={{
                  color:
                    ctx.postDetails.shares.indexOf(
                      localStorage.getItem("id")
                    ) === -1
                      ? "gray"
                      : "blue",
                }}
              >
                {" "}
                share
              </i>
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

          <Posts
            {...props}
            type="comment"
            posts={ctx.postDetails.comments}
            setFormData={setFormDataForCmtOnCmt}
            formData={ctx.formDataForCmtOnCmt}
            handleCloseCreatePostOrComment={handleCloseCreateCommentForCmt}
            ShowCreatePostOrComment={ctx.ShowCreateCommentForCmt}
            postId={ctx.commentIdForComment}
            handleShowCreateComment={handleShowCreateCommentForCmt}
          />

          {/* comment on opened post */}

          <CreatePostOrCommentComponent
            {...props}
            setFormData={setFormDataForPostComment}
            formData={ctx.formDataForPostComment}
            handleCloseCreatePostOrComment={handleCloseCreateComment}
            ShowCreatePostOrComment={ShowCreateComment}
            gif={ctx.gifForPostComment}
            type="comment"
            postId={id}
          />
        </div>
      )}
    </React.Fragment>
  );
}

export default Post;
