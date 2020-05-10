import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { InputGroup, FormControl } from "react-bootstrap";
import Context from "./Context";

function ProfileSideBar() {
  const ctx = useContext(Context);

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
        .then(async (data) => {
          await ctx.dispatch({ type: "setSearchResults", payload: data });
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
          {ctx.searchResults.map((item) => (
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
