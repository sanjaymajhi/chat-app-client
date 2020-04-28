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

  const likePost = (e) => {
    e.preventDefault();
    e.target.style.color = e.target.style.color === "blue" ? "gray" : "blue";
    console.log(e.target.id);
    fetch("/users/posts/like", {
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
                  <span onClick={likePost}>
                    <i className="material-icons" id={post._id}>
                      thumb_up
                    </i>{" "}
                    &ensp;
                    {post.likes}
                  </span>
                  <span>
                    <i className="material-icons"> share</i> &ensp;{post.shares}
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
