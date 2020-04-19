import React, { useState } from "react";
import { Link } from "react-router-dom";

function ProfileSideBar() {
  const [searchResults, setSearchResults] = useState([]);
  const searchPeople = (e) => {
    document.getElementById("search-people-results").style.display = "block";
    const keyword = e.target.value;
    if (keyword !== "") {
      fetch("/users/search", {
        method: "post",
        body: JSON.stringify({ value: keyword }),
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(async (data) => {
          console.log(data);
          await setSearchResults(data);
        });
    } else {
      document.getElementById("search-people-results").style.display = "none";
    }
  };

  return (
    <div className="profile-side-bar">
      <form onChange={searchPeople}>
        <span>
          <i className="material-icons">&#xe8b6;</i>&emsp;
        </span>
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Find peoples"
        />
        <ul id="search-people-results">
          {searchResults.map((item) => (
            <Link to={"/user/profile/" + item.username.split("@")[1]}>
              <li>
                <img src={item.imageUri} alt="profile" />
                <div>
                  {item.f_name + " " + item.l_name} <br />
                  {item.username}
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </form>
    </div>
  );
}

export default ProfileSideBar;
