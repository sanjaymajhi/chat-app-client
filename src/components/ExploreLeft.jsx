import React, { useContext, useEffect } from "react";
import Context from "./Context";
import { InputGroup, FormControl, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import Posts from "./Posts";
import useInfiniteScroll from "./useInfiniteScroll";
import avtar from "../images/avtar.png";

function ExploreLeft(props) {
  const ctx = useContext(Context);
  const [isFetching, setIsFetching] = useInfiniteScroll();

  useEffect(() => {
    if (isFetching) {
      ctx.tab === "posts"
        ? getTrendingPosts(ctx.trendingPosts.length)
        : getTrendingVideos(ctx.trendingVideos.length);
    }
  }, [isFetching]);

  useEffect(() => {
    document.title = "InstaChat - Explore";
    getTrendingPosts(ctx.trendingPosts.length);
    getTrendingVideos(ctx.trendingVideos.length);
  }, []);

  const searchPeople = (e) => {
    document.getElementById("search-people-results").style.display = "block";
    const keyword = e.target.value;
    const myheaders = new Headers();
    myheaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    myheaders.append("content-type", "application/json");
    if (keyword !== "") {
      fetch("/users/search", {
        method: "post",
        body: JSON.stringify({ value: keyword }),
        headers: myheaders,
      })
        .then((res) => res.json())
        .then((data) => {
          ctx.dispatch({ type: "setSearchResults", payload: data });
        });
    } else {
      document.getElementById("search-people-results").style.display = "none";
    }
  };

  const getTrendingPosts = (index) => {
    const myheaders = new Headers();
    myheaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    fetch("/users/get-trending-posts/from/" + index, {
      method: "get",
      headers: myheaders,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          ctx.dispatch({ type: "setTrendingPosts", payload: data.data });
        }
        setIsFetching(false);
      });
  };

  const getTrendingVideos = (index) => {
    const myheaders = new Headers();
    myheaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    fetch("/users/get-trending-videos/from/" + index, {
      method: "get",
      headers: myheaders,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          ctx.dispatch({ type: "setTrendingVideos", payload: data.data });
          setIsFetching(false);
        }
      });
  };

  return (
    <div className="explore-left">
      <div id="explore-fixed">
        <form onChange={searchPeople}>
          <InputGroup className="mb-1">
            <InputGroup.Prepend>
              <InputGroup.Text
                style={{
                  backgroundColor: "#444444",
                  color: "white",
                  border: "1px solid black",
                }}
              >
                <i className="material-icons">&#xe8b6;</i>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Search your Friends"
              name="search"
              id="search-people"
              style={{
                backgroundColor: "#444444",
                color: "white",
                border: "1px solid black",
              }}
            />
          </InputGroup>
          <ul id="search-people-results">
            {ctx.searchResults.map((item) => (
              <Link to={"/user/profile/" + item.username.split("@")[1]}>
                <li>
                  <img src={item.imageUri || avtar} alt="profile" />
                  <div>
                    <strong>{item.f_name + " " + item.l_name}</strong> <br />
                    <span>{item.username}</span>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        </form>

        <div id="explore-tabs">
          <div
            id="posts"
            onClick={() => ctx.dispatch({ type: "setTab", payload: "posts" })}
            style={
              ctx.tab === "posts" ? { borderBottom: "1vh solid #5cb85b" } : {}
            }
          >
            Posts
          </div>
          <div
            id="videos"
            onClick={() => ctx.dispatch({ type: "setTab", payload: "videos" })}
            style={
              ctx.tab === "videos" ? { borderBottom: "1vh solid #5cb85b" } : {}
            }
          >
            Videos
          </div>
        </div>
      </div>
      <div id="explore-posts">
        {ctx.tab === "posts" ? (
          <Posts {...props} type="user" posts={ctx.trendingPosts} />
        ) : (
          <Posts {...props} type="user" posts={ctx.trendingVideos} />
        )}
        {isFetching === true && (
          <div style={{ width: "20%", margin: "2vh auto" }}>
            <Spinner animation="border" variant="light" size="md" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ExploreLeft;
