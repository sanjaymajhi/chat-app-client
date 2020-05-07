import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Posts from "../Posts";

function UserPosts(props) {
  const { id } = useParams();
  const history = useHistory();
  const [postIdForComment, setPostIdForComment] = useState("");

  const [postsObject, setPostsObject] = useState({});
  useEffect(() => {
    getPosts();
  }, [id]);

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

  const getPosts = () => {
    const myheaders = new Headers();
    myheaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    fetch("/users/profile/" + id + "/posts", {
      method: "get",
      headers: myheaders,
    })
      .then((res) => res.json())
      .then(async (details) => {
        if (details.saved === "success") {
          await setPostsObject(details);
        }
      });
  };

  return (
    <Posts
      {...props}
      type="user"
      history={history}
      posts={postsObject.posts}
      setPosts={setPostsObject}
      setFormData={setFormData}
      formData={formData}
      handleCloseCreatePostOrComment={handleCloseCreateComment}
      setGif={setGif}
      ShowCreatePostOrComment={ShowCreateComment}
      gif={gif}
      postId={postIdForComment}
      handleShowCreateComment={handleShowCreateComment}
      id={id}
    />
  );
}

export default UserPosts;
