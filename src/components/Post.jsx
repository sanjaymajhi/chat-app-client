import React, { useEffect, useContext, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import moment from "moment";
import CreateComment from "./CreateComment";
import Comment from "./Comment";
import Context from "./Context";
import { likeSharePost } from "./functions";
import { Carousel } from "react-bootstrap";
import ShareModal from "./ShareModal";
import io from "socket.io-client";
const ENDPOINT = "wss://chat-app-by-sanjay.herokuapp.com";
const socket = io(ENDPOINT);

function Post(props) {
  const { id } = useParams();
  const ctx = useContext(Context);
  const history = useHistory();

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  useEffect(() => {
    getPost();
    socket.emit("join", id);
    return () => {
      socket.emit("leaveRoom", id);
    };
  }, []);

  socket.on("newCmt", () => {
    getPost();
  });

  const emitCommentEvent = () => {
    socket.emit("comment", id);
  };

  const handleCloseCreateComment = () => {
    ctx.dispatch({
      type: "setFormDataForComments",
      payload: {
        text: null,
        img: [],
        gif: null,
        postId: null,
      },
    });
    ctx.dispatch({ type: "setShowCreateComment", payload: false });
    getPost();
  };
  const handleShowCreateComment = () => {
    ctx.dispatch({
      type: "setFormDataForComments",
      payload: {
        text: null,
        img: [],
        gif: null,
        postId: id,
      },
    });
    ctx.dispatch({ type: "setShowCreateComment", payload: true });
  };

  const setFormDataForComments = (data) =>
    ctx.dispatch({ type: "setFormDataForComments", payload: data });

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
        if (data.saved === "success") {
          data.details.comments.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          ctx.dispatch({ type: "setPostDetails", payload: data.details });
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
            <div
              id="single-post-profile-pic"
              onClick={() =>
                history.push(
                  "/user/profile/" +
                    ctx.postDetails.user_id.username.split("@")[1]
                )
              }
            >
              <img
                src={ctx.postDetails.user_id.imageUri}
                alt={ctx.postDetails.user_id.f_name + " profile pic"}
              />
            </div>
            <div>
              <strong
                onClick={() =>
                  history.push(
                    "/user/profile/" +
                      ctx.postDetails.user_id.username.split("@")[1]
                  )
                }
              >
                {ctx.postDetails.user_id.f_name +
                  " " +
                  ctx.postDetails.user_id.l_name}
              </strong>
              <span
                onClick={() =>
                  history.push(
                    "/user/profile/" +
                      ctx.postDetails.user_id.username.split("@")[1]
                  )
                }
              >
                {" · " + ctx.postDetails.user_id.username}
              </span>
              <div id="single-post-text">
                {ctx.postDetails.postText !== "null" &&
                  ctx.postDetails.postText}
              </div>
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
                      ? "lightgray"
                      : "skyblue",
                }}
              >
                thumb_up
              </i>
              &ensp; Like
            </span>

            <span onClick={handleShow}>
              <i
                className="material-icons"
                // onClick={(e) => likeSharePost(e, "share", "post")}
                id={ctx.postDetails._id}
                // style={{
                //   color:
                //     ctx.postDetails.shares.indexOf(
                //       localStorage.getItem("id")
                //     ) === -1
                //       ? "lightgray"
                //       : "skyblue",
                // }}
              >
                {" "}
                share
              </i>
              &ensp;
              {/* Share */}
              Share
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

          <Comment
            {...props}
            type="comment"
            comments={ctx.postDetails.comments}
            emitCommentEvent={emitCommentEvent}
            getPost={getPost}
          />

          {/* comment on opened post */}

          <CreateComment
            {...props}
            setFormData={setFormDataForComments}
            formData={ctx.formDataForComments}
            handleCloseCreateComment={handleCloseCreateComment}
            ShowCreateComment={ctx.ShowCreateComment}
            type="post"
            emitCommentEvent={emitCommentEvent}
          />

          <ShareModal
            {...props}
            show={show}
            handleClose={handleClose}
            postId={id}
          />
        </div>
      )}
    </React.Fragment>
  );
}

export default Post;
