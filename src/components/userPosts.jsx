import React, { useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import Posts from "./Posts";
import Context from "./Context";

function UserPosts(props) {
  const ctx = useContext(Context);

  const { id } = useParams();
  const history = useHistory();

  const setPostsObject = (data) =>
    ctx.dispatch({
      type: "setPostsObject",
      payload: data,
    });

  useEffect(() => {
    getPosts();
  }, [id]);

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
          details.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
          await setPostsObject(details);
        }
      });
  };

  return (
    <Posts
      {...props}
      type="user"
      history={history}
      posts={ctx.postsObject.posts}
    />
  );
}

export default UserPosts;
