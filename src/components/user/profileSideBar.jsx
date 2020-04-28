import React, { useState } from "react";
import { Link } from "react-router-dom";
import { InputGroup, FormControl } from "react-bootstrap";

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
          await setSearchResults(data);
        });
    } else {
      document.getElementById("search-people-results").style.display = "none";
    }
  };

  return (
    <div className="profile-side-bar">
      <form onChange={searchPeople}>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text>
              <i className="material-icons">&#xe8b6;</i>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl placeholder="Search your Friends" name="search" />
        </InputGroup>
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
