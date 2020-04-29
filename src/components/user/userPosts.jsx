import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";

function UserPosts() {
  const { id } = useParams();
  const [postsObject, setPostsObject] = useState({});
  useEffect(() => {
    getPosts(id);
  }, [id]);

  const getPosts = (u_id) => {
    fetch("/users/profile/" + u_id + "/posts", {
      method: "post",
      body: JSON.stringify({ token: localStorage.getItem("token") }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(async (details) => {
        if (details.saved === "success") {
          await setPostsObject(details);
        }
      });
  };

  const likeSharePost = (e, type) => {
    e.preventDefault();
    e.target.style.color =
      e.target.style.color === "#063c5e" ? "gray" : "#063c5e";
    fetch("/users/posts/" + type, {
      method: "post",
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        post_id: e.target.id,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          console.log("done");
        }
      });
  };

  return (
    <div>
      {postsObject.posts !== undefined
        ? postsObject.posts.map((post) => (
            <div key={post._id} className="user_posts">
              <img
                src={localStorage.getItem("imageUri")}
                alt="pic"
                id="user-post-img"
              />
              <div id="post_detail">
                <p id="post-user-detail">
                  <strong>
                    {localStorage.getItem("f_name") +
                      " " +
                      localStorage.getItem("l_name")}
                  </strong>
                  &ensp;
                  <span>
                    {"@" + id}
                    {" · "}
                    {new Date(post.date).toLocaleDateString("en-us", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </p>
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
                  <span onClick={(e) => likeSharePost(e, "share")}>
                    <i
                      className="material-icons"
                      id={post._id}
                      style={{
                        color:
                          post.shares.indexOf(localStorage.getItem("id")) === -1
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
                  <span>
                    <i className="material-icons"> message</i> &ensp;
                    {post.comments.length}
                  </span>
                </div>
              </div>
            </div>
          ))
        : ""}
    </div>
  );
}

export default UserPosts;
