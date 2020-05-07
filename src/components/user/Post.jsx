import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import CreatePostOrCommentComponent from "../CreatePostOrComment";
import Posts from "../Posts";

function Post(props) {
  const { id } = useParams();
  const [postIdForComment, setPostIdForComment] = useState("");
  const [postDetails, setPostDetails] = useState({});

  useEffect(() => getPost(), []);

  const [ShowCreateComment, setShowCreateComment] = useState(false);
  const handleCloseCreateComment = () => {
    setFormData({});
    setShowCreateComment(false);
  };
  const handleShowCreateComment = (e) => {
    setPostIdForComment(e.target.id);
    setShowCreateComment(true);
  };

  const [gif, setGif] = useState(null);
  const [formData, setFormData] = useState({});

  //comment on comment
  const [gif2, setGif2] = useState(null);
  const [formData2, setFormData2] = useState({});

  const [commentIdForComment, setCommentIdForComment] = useState("");

  const [ShowCreateComment2, setShowCreateComment2] = useState(false);
  const handleCloseCreateComment2 = () => {
    setFormData2({});
    setShowCreateComment2(false);
  };
  const handleShowCreateComment2 = (e) => {
    setCommentIdForComment(e.target.id);
    setShowCreateComment2(true);
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
          setPostDetails(data.details);
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
    Object.keys(postDetails).length > 0 && (
      <div>
        <div id="single-post-head">
          <h3>
            <strong>Post</strong>
          </h3>
        </div>
        <div id="single-post-profile">
          <img
            src={postDetails.imageUri}
            alt={postDetails.name + " profile pic"}
          />
          <div>
            <strong>{postDetails.name}</strong>

            <br />
            <span>{postDetails.username}</span>
          </div>
        </div>
        <div>
          <div id="single-post-detail">{postDetails.postText}</div>

          <div id="single-post-date">
            <span>
              {moment(postDetails.date).format("HH:mm A") +
                " · " +
                moment(postDetails.date).format("ll")}
            </span>
          </div>
          <div id="single-post-likeshare">
            <strong>{postDetails.likes.length}</strong>
            <span> Likes</span> &emsp;
            <strong>{postDetails.shares.length}</strong>
            <span> Shares</span>
          </div>
          <div id="likesharecomment">
            <span
              onClick={(e) => likeSharePost(e, "like")}
              style={{
                color:
                  postDetails.likes.indexOf(localStorage.getItem("id")) === -1
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
                  postDetails.shares.indexOf(localStorage.getItem("id")) === -1
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
          posts={postDetails.comments}
          setFormData={setFormData2}
          formData={formData2}
          handleCloseCreatePostOrComment={handleCloseCreateComment2}
          setGif={setGif2}
          ShowCreatePostOrComment={ShowCreateComment2}
          gif={gif2}
          postId={commentIdForComment}
          handleShowCreateComment={handleShowCreateComment2}
        />

        {/* comment on opened post */}

        <CreatePostOrCommentComponent
          {...props}
          setFormData={setFormData}
          formData={formData}
          handleCloseCreatePostOrComment={handleCloseCreateComment}
          setGif={setGif}
          ShowCreatePostOrComment={ShowCreateComment}
          gif={gif}
          type="comment"
          postId={id}
        />
      </div>
    )
  );
}

export default Post;
