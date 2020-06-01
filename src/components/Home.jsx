import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import Posts from "./Posts";
import Context from "./Context";
import useInfiniteScroll from "./useInfiniteScroll";

function Home(props) {
  const ctx = useContext(Context);

  const history = useHistory();

  useEffect(() => {
    getHomePosts();
  }, []);

  const handleCloseCreateComment = () => {
    ctx.dispatch({
      type: "setFormDataForHomeComments",
      payload: {
        "post-text": null,
        embedLink: null,
        "post-img": [],
        "post-video": null,
        "gif-id": null,
        postId: null,
      },
    });
    ctx.dispatch({ type: "setShowCreateComment", payload: false });
  };
  const handleShowCreateComment = (e) => {
    ctx.dispatch({ type: "setPostIdForComment", payload: e.target.id });
    ctx.dispatch({ type: "setShowCreateComment", payload: true });
  };

  const setFormDataForHomeComments = (data) =>
    ctx.dispatch({ type: "setFormDataForHomeComments", payload: data });

  const getHomePosts = () => {
    const myheaders = new Headers();
    myheaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    fetch("/users/homePosts/", {
      method: "get",
      headers: myheaders,
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.saved === "success") {
          data.details.sort((a, b) => new Date(b.date) - new Date(a.date));
          ctx.dispatch({ type: "setHomePosts", payload: [...data.details] });
        }
      });
  };

  return (
    <Posts
      {...props}
      type="home"
      history={history}
      posts={ctx.homePosts}
      setFormData={setFormDataForHomeComments}
      formData={ctx.formDataForHomeComments}
      handleCloseCreatePostOrComment={handleCloseCreateComment}
      ShowCreatePostOrComment={ctx.ShowCreateComment}
      postId={ctx.postIdForComment}
      handleShowCreateComment={handleShowCreateComment}
    />
  );
}

export default Home;
