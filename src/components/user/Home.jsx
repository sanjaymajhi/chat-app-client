import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

function Home() {
  const history = useHistory();
  const [homePosts, setHomePosts] = useState([]);
  useEffect(() => getHomePosts(), []);

  const getHomePosts = () => {
    fetch("/users/homePosts", {
      method: "Post",
      body: JSON.stringify({ token: localStorage.getItem("token") }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          data.details.sort(
            (a, b) =>
              new Date(b.sent_time).getSeconds -
              new Date(a.sent_time).getSeconds
          );
          setHomePosts(data.details);
        }
      });
  };

  const likeSharePost = (e, type) => {
    e.preventDefault();
    e.target.style.color = e.target.style.color === "blue" ? "gray" : "blue";
    console.log(e.target.id);
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
    <div id="home-posts">
      {window.matchMedia("(max-width: 480px)").matches ? (
        <div id="home-profile-div">
          <img
            src={localStorage.getItem("imageUri")}
            alt="profile pic"
            onClick={() =>
              history.push("/user/profile/" + localStorage.getItem("username"))
            }
          />
          <p>
            <strong> Home</strong>
          </p>
        </div>
      ) : (
        <h2>Home</h2>
      )}

      <div id="home-div-posts">
        {homePosts.length > 0
          ? homePosts.map((post) => (
              <div key={post._id} className="user_posts">
                <img src={post.user_imageUri} alt="pic" id="user-post-img" />
                <div id="post_detail">
                  <p id="post-user-detail">
                    <strong>{post.name}</strong>
                    &ensp;
                    <span>
                      {post.username}
                      {" · "}
                      {new Date(post.date).toLocaleDateString("en-us", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </p>
                  <div>{post.postText}</div>
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
                      <i className="material-icons" id={post._id}>
                        thumb_up
                      </i>{" "}
                      &ensp;
                      {post.likes.length}
                    </span>
                    <span onClick={(e) => likeSharePost(e, "share")}>
                      <i className="material-icons" id={post._id}>
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
    </div>
  );
}

export default Home;
