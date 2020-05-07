import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Posts from "../Posts";

function Home(props) {
  const history = useHistory();
  const [homePosts, setHomePosts] = useState([]);
  useEffect(() => getHomePosts(), []);

  const [postIdForComment, setPostIdForComment] = useState("");

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

  const getHomePosts = () => {
    const myheaders = new Headers();
    myheaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    fetch("/users/homePosts", {
      method: "get",
      headers: myheaders,
    })
      .then((res) => res.json())
      .then(async (data) => {
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

  return (
    <Posts
      {...props}
      type="home"
      history={history}
      posts={homePosts}
      setPosts={setHomePosts}
      setFormData={setFormData}
      formData={formData}
      handleCloseCreatePostOrComment={handleCloseCreateComment}
      setGif={setGif}
      ShowCreatePostOrComment={ShowCreateComment}
      gif={gif}
      postId={postIdForComment}
      handleShowCreateComment={handleShowCreateComment}
    />
  );
}

export default Home;
