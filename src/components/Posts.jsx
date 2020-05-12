import React from "react";
import CreatePostOrCommentComponent from "./CreatePostOrComment";

function Posts(props) {
  const likeSharePost = (e, type) => {
    e.preventDefault();
    e.target.style.color =
      e.target.style.color === "#063c5e" ? "gray" : "#063c5e";
    const myheaders = new Headers();
    myheaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    myheaders.append("content-type", "application/json");
    fetch("/users/posts/" + type, {
      method: "post",
      body: JSON.stringify({
        postId: e.target.id,
      }),
      headers: myheaders,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          console.log("done");
        }
      });
  };

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
              <img
                src={
                  props.type === "user"
                    ? localStorage.getItem("imageUri")
                    : props.type === "home"
                    ? post.user_imageUri
                    : post.userId.imageUri
                }
                alt="pic"
                id="user-post-img"
              />
              <div id="post_detail">
                <p id="post-user-detail">
                  <strong>
                    {props.type === "user"
                      ? localStorage.getItem("f_name") +
                        " " +
                        localStorage.getItem("l_name")
                      : props.type === "home"
                      ? post.name
                      : post.userId.f_name + " " + post.userId.l_name}
                  </strong>
                  &ensp;
                  <span>
                    {props.type === "user"
                      ? "@" + props.id
                      : props.type === "home"
                      ? post.username
                      : post.userId.username}
                    {" · "}
                    {new Date(post.date).toLocaleDateString("en-us", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </p>
                <div
                  onClick={
                    props.type !== "comment"
                      ? () => props.history.push("/user/post/" + post._id)
                      : ""
                  }
                >
                  {post.postText}
                  <br />
                  {post.postImg && (
                    <img src={post.postImg} alt="" id="post-detail-img" />
                  )}
                  {post.postGif && (
                    <div id="post-detail-gif-div">
                      <img src={post.postGif} alt="" />
                    </div>
                  )}
                </div>
                <div id="like-share">
                  <span onClick={(e) => likeSharePost(e, "like")}>
                    <i
                      className="material-icons"
                      id={post._id}
                      style={{
                        color:
                          post.likes.indexOf(localStorage.getItem("id")) === -1
                            ? "gray"
                            : "#063c5e",
                      }}
                    >
                      thumb_up
                    </i>{" "}
                    &ensp;
                    {post.likes.length}
                  </span>
                  {props.type !== "comment" ? (
                    <span onClick={(e) => likeSharePost(e, "share")}>
                      <i
                        className="material-icons"
                        id={post._id}
                        style={{
                          color:
                            post.shares.indexOf(localStorage.getItem("id")) ===
                            -1
                              ? "gray"
                              : "#063c5e",
                        }}
                      >
                        {" "}
                        share
                      </i>{" "}
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
          type={props.type === "cooment" ? "commentOnComment" : "comment"}
          postId={props.postId}
        />
      </div>
    </div>
  );
}

export default Posts;
