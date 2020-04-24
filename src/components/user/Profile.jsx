import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import avtar from "../../images/avtar.png";
import {
  Modal,
  Alert,
  Form,
  Button,
  Row,
  Col,
  FormGroup,
  Spinner,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import UserPosts from "./userPosts";

function Profile(props) {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const handleCloseEditProfile = () => setShowEditProfile(false);
  const handleShowEditProfile = () => setShowEditProfile(true);

  const [showEditProfilePic, setShowEditProfilePic] = useState(false);
  const handleCloseEditProfilePic = () => setShowEditProfilePic(false);
  const handleShowEditProfilePic = () => setShowEditProfilePic(true);

  const [showEditProfileCoverPic, setShowEditProfileCoverPic] = useState(false);
  const handleCloseEditProfileCoverPic = () =>
    setShowEditProfileCoverPic(false);
  const handleShowEditProfileCoverPic = () => setShowEditProfileCoverPic(true);

  const [profile, setProfile] = useState({});
  const [editProfile, setEditProfile] = useState({
    f_name: "",
    l_name: "",
    bio: "",
    location: "",
    username: "",
  });

  var { id } = useParams();
  useEffect(() => {
    getProfile();
  }, [id]);

  const getProfile = () => {
    fetch("/users/profile/", {
      method: "POST",
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        username: "@" + id,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        await setProfile(data.details);
        localStorage.setItem("f_name", data.details.f_name);
        localStorage.setItem("l_name", data.details.l_name);
        localStorage.setItem("imageUri", data.details.imageUri);
        if (document.querySelector(".follow-button") !== null) {
          document.querySelector(".follow-button").innerHTML =
            data.details.followers.indexOf(data.id) === -1
              ? "Follow"
              : "Unfollow";
        }
      });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setEditProfile({ ...editProfile, [name]: value });
  };

  const history = useHistory();
  const updateProfile = (e) => {
    e.preventDefault();
    const payload = {
      ...editProfile,
      token: localStorage.getItem("token"),
    };
    fetch("/users/update", {
      method: "Post",
      body: JSON.stringify(payload),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          const alert = document.getElementById("edit-alert");
          alert.className = "fade alert alert-success show";
          alert.style.display = "block";
          alert.innerHTML = "Your details had been saved...";
          id = editProfile.username;
          localStorage.setItem("username", editProfile.username);
          setTimeout(() => {
            handleCloseEditProfile();
          }, 2000);
          history.push("/user/profile/" + id); //used to update the url as well as call getProfile
        } else {
          errorDisplay(data);
        }
      });
  };

  const followHandler = (e) => {
    e.preventDefault();
    fetch("/users/profile/" + id + "/follow", {
      method: "post",
      body: JSON.stringify({ token: localStorage.getItem("token") }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          getProfile();
        }
      });
  };

  const errorDisplay = (data) => {
    const alert = document.getElementById("edit-alert");
    alert.style.display = "block";
    if (data.error) {
      alert.innerHTML += data.error.msg;
    }
    if (data.errors) {
      let count = 1;
      data.errors.map((err) => {
        alert.innerHTML += "<p>" + count + ". " + err.msg + "<br/></p>";
        count++;
      });
    }
    setTimeout(function () {
      alert.style.display = "none";
    }, 10000);
  };

  const uploadPic = (e, type) => {
    e.preventDefault();
    document.getElementById("upload-" + type + "-button").disabled = true;
    document.getElementById(type + "-upload-spinner").style.display =
      "inline-block";
    const fileInput = e.target[0].files[0];
    const formData = new FormData();
    formData.append("image", fileInput);
    const options = {
      method: "post",
      body: formData,
      headers: {
        token: localStorage.getItem("token"),
      },
    };
    fetch("/users/profile/upload/" + type + "-image", options)
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          if (type === "profile") {
            handleCloseEditProfilePic();
          } else {
            handleCloseEditProfileCoverPic();
          }
          getProfile();
        }
      });
  };

  const uploadPicInputStyling = (e, type) => {
    document.getElementById(type + "-pic-upload").className =
      "custom-file-input " +
      (e.target.files[0].type === "image/png"
        ? "is-valid"
        : e.target.files[0].type === "image/jpeg"
        ? "is-valid"
        : "is-invalid");
    document.getElementById(type + "-pic-upload-label").innerHTML =
      e.target.files[0].name;
    document.getElementById("upload-" + type + "-button").disabled =
      document.getElementById(type + "-pic-upload").className.split(" ")[1] ===
      "is-valid"
        ? false
        : true;
  };

  return (
    <div>
      <div id="profile-head">
        <strong>{profile.f_name + " " + profile.l_name}</strong>
        <br />
        {profile.posts && profile.posts.length} Tweets
      </div>
      {profile.coverImageUri === "" ? (
        <div
          id="cover-image"
          onClick={
            localStorage.getItem("username") === id
              ? handleShowEditProfileCoverPic
              : ""
          }
        />
      ) : (
        <img
          id="cover-image"
          src={profile.coverImageUri}
          alt="cover"
          onClick={
            localStorage.getItem("username") === id
              ? handleShowEditProfileCoverPic
              : ""
          }
        />
      )}
      {profile.imageUri === "" ? (
        <img
          src={avtar}
          alt="no profile"
          id="profile-pic"
          onClick={
            localStorage.getItem("username") === id
              ? handleShowEditProfilePic
              : ""
          }
        />
      ) : (
        <img
          src={profile.imageUri}
          alt="profile"
          id="profile-pic"
          onClick={
            localStorage.getItem("username") === id
              ? handleShowEditProfilePic
              : ""
          }
        />
      )}

      <div id="profile-div">
        <div
          style={{
            justifySelf: "right",
            padding: "0",
            alignItems: "center",
          }}
        >
          {localStorage.getItem("username") === id ? (
            <button
              id="button"
              className="edit-button"
              onClick={handleShowEditProfile}
            >
              Edit Profile
            </button>
          ) : (
            <button
              id="button"
              className="follow-button"
              onClick={followHandler}
            >
              Follow
            </button>
          )}
        </div>
        <div>
          &nbsp;
          <strong>{profile.f_name + " " + profile.l_name}</strong>
          <br />
          <span>{profile.username}</span>
        </div>
        <div>&nbsp;{profile.bio}</div>
        <div>
          <span>
            <i class="material-icons">location_on</i>
            {profile.location + " "}&nbsp;
            <i class="material-icons"> date_range</i>{" "}
            {" Joined " +
              new Date(profile.join_date).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
          </span>
        </div>
        <div>
          &nbsp;
          <strong>
            {(profile.following === undefined ? 0 : profile.following.length) +
              " "}
          </strong>{" "}
          <span>Following</span>
          &emsp;
          <strong>
            {" " +
              (profile.followers === undefined ? 0 : profile.followers.length) +
              " "}
          </strong>
          <span>Followers</span>
        </div>
        <div style={{ justifySelf: "center", padding: "0" }}>
          <strong>Tweets</strong>{" "}
        </div>
      </div>
      <div>
        <UserPosts />
      </div>
      <Modal
        show={showEditProfile}
        onHide={handleCloseEditProfile}
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton={profile.username === "" ? false : true}>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert
            variant={"danger"}
            style={{ display: "none" }}
            id="edit-alert"
          ></Alert>
          <Form onChange={handleChange} onSubmit={updateProfile}>
            <Row>
              <Col>
                <Form.Group controlId="formBasicFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter First Name"
                    name="f_name"
                    required={true}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formBasicLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Last Name"
                    name="l_name"
                    required={true}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                name="username"
                required={true}
              />
            </Form.Group>

            <Form.Group controlId="formBasicBio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                type="bio"
                placeholder="Add Your Bio"
                name="bio"
                required={true}
              />
            </Form.Group>

            <Form.Group controlId="formBasicLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Add Your location"
                name="location"
                required={true}
              />
            </Form.Group>
            <Button variant="primary" type="submit" id="login-button">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showEditProfilePic}
        onHide={handleCloseEditProfilePic}
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Profile Pic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => uploadPic(e, "profile")}>
            <FormGroup>
              <Form.File id="profile-pic-upload" custom>
                <Form.File.Input
                  onChange={(e) => uploadPicInputStyling(e, "profile")}
                />
                <Form.File.Label
                  data-browse="Browse"
                  id="profile-pic-upload-label"
                >
                  Choose Your Pic
                </Form.File.Label>
                <Form.Control.Feedback type="invalid">
                  wrong file format (only .jpg and .png allowed)
                </Form.Control.Feedback>
              </Form.File>
            </FormGroup>
            <Button
              variant="primary"
              type="submit"
              id="upload-profile-button"
              disabled
            >
              Upload
            </Button>
            &emsp;
            <Spinner
              animation="border"
              variant="primary"
              size="sm"
              id="profile-upload-spinner"
              style={{ display: "none" }}
            />
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showEditProfileCoverPic}
        onHide={handleCloseEditProfileCoverPic}
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Profile Cover</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => uploadPic(e, "profile-cover")}>
            <FormGroup>
              <Form.File id="profile-cover-pic-upload" custom>
                <Form.File.Input
                  onChange={(e) => uploadPicInputStyling(e, "profile-cover")}
                />
                <Form.File.Label
                  data-browse="Browse"
                  id="profile-cover-pic-upload-label"
                >
                  Choose Your Pic
                </Form.File.Label>
                <Form.Control.Feedback type="invalid">
                  wrong file format (only .jpg and .png allowed)
                </Form.Control.Feedback>
              </Form.File>
            </FormGroup>
            <Button
              variant="primary"
              type="submit"
              id="upload-profile-cover-button"
              disabled
            >
              Upload
            </Button>
            &emsp;
            <Spinner
              animation="border"
              variant="primary"
              size="sm"
              id="profile-cover-upload-spinner"
              style={{ display: "none" }}
            />
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Profile;
