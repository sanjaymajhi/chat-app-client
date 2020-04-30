import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Posts from "../Posts";

function Home(props) {
  const history = useHistory();
  const [homePosts, setHomePosts] = useState([]);
  useEffect(() => getHomePosts(), []);

  const getHomePosts = () => {
    const url =
      props.type === "home"
        ? "/users/homePosts"
        : "/users/profile/" + id + "/posts";
    fetch(url, {
      method: "post",
      body: JSON.stringify({ token: localStorage.getItem("token") }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.saved === "success") {
          data.details.sort(
            (a, b) =>
              new Date(b.sent_time).getSeconds -
              new Date(a.sent_time).getSeconds
          );
          props.setHomePosts(data.details);
        }
      });
  };

  return (
    <Posts
      type="home"
      history={history}
      homePosts={homePosts}
      setHomePosts={setHomePosts}
    />
  );
}

export default Home;
