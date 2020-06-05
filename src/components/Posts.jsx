import React from "react";
import CreatePostOrCommentComponent from "./CreatePostOrComment";
import likeSharePost from "./functions";
import moment from "moment";

function Posts(props) {
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
                  onClick={() =>
                    props.type !== "comment"
                      ? props.history.push("/user/post/" + post._id)
                      : ""
                  }
                >
                  {post.postText !== "null" && post.postText}
                  <br />

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

                  {[undefined, null].indexOf(post.postGif) === -1 && (
                    <div id="post-detail-gif-div">
                      <img src={post.postGif} alt="" />{" "}
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
                      onClick={(e) =>
                        likeSharePost(e, "like", "posts", props.type)
                      }
                      id={post._id}
                      style={{
                        color:
                          post.likes.indexOf(localStorage.getItem("id")) === -1
                            ? "gray"
                            : "blue",
                      }}
                    >
                      thumb_up
                    </i>
                    &emsp;
                    {post.likes.length}
                  </span>
                  {props.type !== "comment" ? (
                    <span>
                      <i
                        className="material-icons"
                        onClick={(e) => likeSharePost(e, "share")}
                        id={post._id}
                        style={{
                          color:
                            post.shares.indexOf(localStorage.getItem("id")) ===
                            -1
                              ? "gray"
                              : "blue",
                        }}
                      >
                        {" "}
                        share
                      </i>
                      &ensp;
                      {post.shares.length}
                    </span>
                  ) : (
                    ""
                  )}
                  <span>
                    <i
                      className="material-icons"
                      onClick={props.handleShowCreateComment}
                      id={post._id}
                    >
                      {" "}
                      message
                    </i>{" "}
                    &ensp;
                    {props.type !== "comment"
                      ? post.comments.length
                      : post.sub_comments.length}
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
        <CreatePostOrCommentComponent
          {...props}
          setFormData={props.setFormData}
          formData={props.formData}
          handleCloseCreatePostOrComment={props.handleCloseCreatePostOrComment}
          setGif={props.setGif}
          ShowCreatePostOrComment={props.ShowCreatePostOrComment}
          gif={props.gif}
          type={props.type === "comment" ? "commentOnComment" : "comment"}
          postId={props.postId}
        />
      </div>
    </div>
  );
}

export default Posts;
