import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import Posts from "./Posts";
import Context from "./Context";

function Home(props) {
  const ctx = useContext(Context);

  const history = useHistory();

  useEffect(() => {
    document.title = "InstaChat - Home";
    getHomePosts();
  }, []);

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
          ctx.dispatch({ type: "setHomePosts", payload: data.details });
        }
      });
  };

  return (
    <Posts {...props} type="home" history={history} posts={ctx.homePosts} />
  );
}

export default Home;
