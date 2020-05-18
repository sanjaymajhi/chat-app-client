import React, { useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import Posts from "./Posts";
import Context from "./Context";

function UserPosts(props) {
  const ctx = useContext(Context);

  const { id } = useParams();
  const history = useHistory();

  const setPostIdForUserPostsComment = (data) =>
    ctx.dispatch({
      type: "setPostIdForUserPostsComment",
      payload: data,
    });

  const setPostsObject = (data) =>
    ctx.dispatch({
      type: "setPostsObject",
      payload: data,
    });

  const setShowCreateCommentForProfilePosts = (data) =>
    ctx.dispatch({
      type: "setShowCreateCommentForProfilePosts",
      payload: data,
    });
  const handleCloseCreateComment = () => {
    setFormDataForUserPostsCmnt({});
    setShowCreateCommentForProfilePosts(false);
  };
  const handleShowCreateCommentForProfilePosts = (e) => {
    setPostIdForUserPostsComment(e.target.id);
    setShowCreateCommentForProfilePosts(true);
  };

  const setGifForUserPostsCmnt = (data) =>
    ctx.dispatch({
      type: "setGifForUserPostsCmnt",
      payload: data,
    });
  const setFormDataForUserPostsCmnt = (data) =>
    ctx.dispatch({
      type: "setFormDataForUserPostsCmnt",
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
      setPosts={setPostsObject}
      setFormData={setFormDataForUserPostsCmnt}
      formData={ctx.formDataForUserPostsCmnt}
      handleCloseCreatePostOrComment={handleCloseCreateComment}
      setGif={setGifForUserPostsCmnt}
      ShowCreatePostOrComment={ctx.ShowCreateCommentForProfilePosts}
      gif={ctx.gifForUserPostsCmnt}
      postId={ctx.postIdForUserPostsComment}
      handleShowCreateComment={handleShowCreateCommentForProfilePosts}
      id={id}
    />
  );
}

export default UserPosts;
