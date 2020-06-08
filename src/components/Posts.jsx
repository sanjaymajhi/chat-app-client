import React from "react";
import CreateComment from "./CreateComment";
import { likeSharePost } from "./functions";
import moment from "moment";
import { useContext } from "react";
import Context from "./Context";

function Posts(props) {
  const ctx = useContext(Context);
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
  };
  const handleShowCreateComment = (e) => {
    ctx.dispatch({
      type: "setFormDataForComments",
      payload: {
        text: null,
        img: [],
        gif: null,
        postId: e.target.id,
      },
    });
    ctx.dispatch({ type: "setShowCreateComment", payload: true });
  };

  const setFormDataForComments = (data) =>
    ctx.dispatch({ type: "setFormDataForComments", payload: data });

  return (
    <div id="home-posts">
      {props.type === "home" ? (
        window.matchMedia("(max-width: 480px)").matches ? (
          <div id="home-profile-div">
            <img
              src={localStorage.getItem("imageUri")}
              alt="profile pic"
              onClick={() =>
                props.history.push(
                  "/user/profile/" + localStorage.getItem("username")
                )
              }
            />
            <p>
              <strong> Home</strong>
            </p>
          </div>
        ) : (
          <h2>Home</h2>
        )
      ) : (
        ""
      )}
      <div id={props.type === "home" ? "home-div-posts" : ""}>
        {props.posts !== undefined && props.posts.length > 0 ? (
          props.posts.map((post) => (
            <div key={post._id} className="user_posts">
              <img src={post.user_id.imageUri} alt="pic" id="user-post-img" />
              <div id="post_detail">
                <p id="post-user-detail">
                  <strong>
                    {post.user_id.f_name + " " + post.user_id.l_name}
                  </strong>
                  &ensp;
                  <span>
                    {post.user_id.username}
                    {window.matchMedia("(max-width: 480px)").matches ? (
                      <br />
                    ) : (
                      " · "
                    )}
                    {new Date() - new Date(post.date) < 3600 * 12 * 1000
                      ? moment(post.date).fromNow()
                      : new Date(post.date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                        })}
                  </span>
                </p>
                <div
                  onClick={() => props.history.push("/user/post/" + post._id)}
                >
                  {post.postText !== "null" && post.postText}

                  {post.postImg.length > 0 && (
                    <div id="post-images">
                      {post.postImg.length > 1 && (
                        <div id="overlayOnImage">
                          <h1>+{post.postImg.length - 1} more</h1>
                        </div>
                      )}
                      <img src={post.postImg[0]} alt="" />
                    </div>
                  )}
                  {[null, undefined].indexOf(post.postVideo) === -1 && (
                    <div id="post-images">
                      <video src={post.postVideo} controls />
                    </div>
                  )}
                  {[null, undefined].indexOf(post.embedLink) === -1 && (
                    <iframe
                      title="Youtube Video"
                      src={"https://www.youtube.com/embed/" + post.embedLink}
                    ></iframe>
                  )}
                </div>
                <div id="like-share">
                  <span>
                    <i
                      className="material-icons"
                      onClick={(e) => likeSharePost(e, "like", "posts")}
                      id={post._id}
                      style={{
                        color:
                          post.likes.indexOf(localStorage.getItem("id")) === -1
                            ? "lightgray"
                            : "skyblue",
                      }}
                    >
                      thumb_up
                    </i>
                    &emsp;
                    {post.likes.length}
                  </span>
                  <span>
                    <i
                      className="material-icons"
                      onClick={(e) => likeSharePost(e, "share", "posts")}
                      id={post._id}
                      style={{
                        color:
                          post.shares.indexOf(localStorage.getItem("id")) === -1
                            ? "lightgray"
                            : "skyblue",
                      }}
                    >
                      {" "}
                      share
                    </i>
                    &ensp;
                    {post.shares.length}
                  </span>
                  <span>
                    <i
                      className="material-icons"
                      onClick={handleShowCreateComment}
                      id={post._id}
                    >
                      {" "}
                      message
                    </i>{" "}
                    &ensp;
                    {post.comments.length}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : props.type === "home" ? (
          <h2>
            No Posts to show... <br />
            Please follow some peoples...
          </h2>
        ) : (
          ""
        )}
        <CreateComment
          {...props}
          setFormData={setFormDataForComments}
          formData={ctx.formDataForComments}
          handleCloseCreateComment={handleCloseCreateComment}
          ShowCreateComment={ctx.ShowCreateComment}
          type="post"
        />
      </div>
    </div>
  );
}

export default Posts;
