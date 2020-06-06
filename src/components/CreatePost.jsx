import React from "react";
import { useHistory } from "react-router-dom";
import { errorDisplay } from "./functions";

import {
  Modal,
  Form,
  Button,
  Alert,
  FormGroup,
  Spinner,
  InputGroup,
  FormControl,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";

function CreatePost(props) {
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    var data = {};
    if (e.target.name === "img") {
      data = { ...props.formData, img: [] };
      [...e.target.files].map((file) => data["img"].push(file));
      props.setFormData(data);
    } else if (e.target.name === "video") {
      data = props.formData;
      data["video"] =
        e.target.files[0] === undefined ? null : e.target.files[0];
      props.setFormData(data);
    } else {
      data = { ...props.formData, [name]: value };
      props.setFormData(data);
    }

    console.log(data);
    document.getElementById("post-button").disabled = isNull(data);
  };

  const CreatePostOrComment = (e) => {
    e.preventDefault();
    if (
      !(
        props.formData.embedLink === null ||
        (/[-]?[A-Za-z0-9]*[_]?[A-Za-z0-9]*/.test(props.formData.embedLink) &&
          props.formData.embedLink.length === 11)
      )
    ) {
      alert("Not a valid Youtube Video ID...");
      return;
    }
    document.getElementById("post-spinner").style.display = "inline-block";
    const form = new FormData();
    form.append("text", props.formData["text"]);
    form.append("embedLink", props.formData.embedLink);
    form.append("video", props.formData["video"]);

    if (props.formData["img"].length > 0) {
      props.formData["img"].map((data) => form.append("image", data));
    } else {
      form.append("image", null);
    }

    const url =
      props.formData["video"] === null
        ? "/users/profile/postWithImage/"
        : "/users/profile/postWithVideo/";

    const myheaders = new Headers();
    myheaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    fetch(url, {
      method: "Post",
      body: form,
      headers: myheaders,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          const alert = document.getElementById("post-alert");
          alert.className = "fade alert alert-success show";
          alert.style.display = "block";
          alert.innerHTML = "Your details had been saved...";
          setTimeout(() => {
            props.handleCloseCreatePost();
          }, 2000);
        } else {
          document.getElementById("post-spinner").style.display = "none";
          errorDisplay(data, "post-alert");
        }
      });
  };

  const uploadVideoInputStyling = (e) => {
    const file = e.target.files[0];
    const alert = document.getElementById("post-alert");
    if (file.type !== "video/mp4") {
      alert.style.display = "block";
      alert.innerHTML = "Only .mp4 files allowed...";
      e.target.value = "";
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById("post-video-div").childNodes[1].src =
          e.target.result;
      };
      reader.readAsDataURL(file);
      document.getElementById("post-video-div").style.display = "block";
      document.getElementById("post-img-div").style.display = "none";
      document.getElementById("embedLink").style.display = "none";
    }
  };

  const uploadPicInputStyling = (e) => {
    const files = [...e.target.files];
    const alert = document.getElementById("post-alert");
    if (files.length > 4) {
      alert.style.display = "block";
      alert.innerHTML = "Max 4 images allowed...";
      e.target.value = "";
    } else {
      document.getElementById("post-img-div").childNodes[1].innerHTML = "";
      files.map((file) => {
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
          alert.style.display = "block";
          alert.innerHTML = "Only .jpeg or .png files allowed...";
          e.target.value = "";
        } else {
          var reader = new FileReader();
          reader.onload = (e) => {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.id = "post-img-show";
            document
              .getElementById("post-img-div")
              .childNodes[1].appendChild(img);
          };
          reader.readAsDataURL(file);
          document.getElementById("post-video-div").style.display = "none";
          document.getElementById("post-img-div").style.display = "block";
          document.getElementById("embedLink").style.display = "none";
        }
      });
    }
  };

  const isNull = (data) => {
    for (var key in data) {
      if (data[key] !== null && data[key] !== "" && data[key].length !== 0) {
        var flag = 1;
        break;
      }
    }
    if (flag === 1) {
      return false;
    }
    return true;
  };

  const renderTooltip = (props) => {
    return (
      <Tooltip id="button-tooltip" {...props}>
        Step 1. Search a video on youtube.
        <br />
        Step 2. Find video link in the browser url bar.
        <br />
        Example : https://www.youtube.com/watch?v=xQnIN9bW0og
        <br />
        Step 3. Copy the video id of length 11 ie. xQnIN9bW0og.
        <br />
        Step 4. Paste it here.
      </Tooltip>
    );
  };

  return (
    <div>
      <Modal
        show={props.ShowCreatePost}
        onHide={props.handleCloseCreatePost}
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Post</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Alert
            variant={"danger"}
            style={{ display: "none" }}
            id="post-alert"
          ></Alert>

          <div id="post-profile-div">
            <img src={localStorage.getItem("imageUri")} alt="profile" />
            &emsp;
            <span>
              <strong>
                {localStorage.getItem("f_name") +
                  " " +
                  localStorage.getItem("l_name")}
              </strong>
            </span>
          </div>

          <Form onChange={handleChange} onSubmit={CreatePostOrComment}>
            <FormGroup style={{ margin: "0" }}>
              <Form.Control
                plaintext
                as="textarea"
                rows="3"
                placeholder={
                  "What's on your mind " + localStorage.getItem("f_name")
                }
                name="text"
                id="text"
                style={{ resize: "none" }}
              />
            </FormGroup>

            <FormGroup style={{ margin: "0" }}>
              <Form.File
                id="post-pic-upload"
                custom
                style={{ display: "none" }}
              >
                <Form.File.Input
                  name="img"
                  multiple
                  onChange={uploadPicInputStyling}
                />
              </Form.File>
            </FormGroup>

            <FormGroup style={{ margin: "0" }}>
              <Form.File
                id="post-video-upload"
                custom
                style={{ display: "none" }}
              >
                <Form.File.Input
                  name="video"
                  onChange={uploadVideoInputStyling}
                />
              </Form.File>
            </FormGroup>

            <InputGroup
              className="mb-3"
              id="embedLink"
              style={{ display: "none" }}
            >
              <FormControl
                placeholder="Put youtube video link here..."
                aria-describedby="basic-addon2"
                name="embedLink"
              />
              <OverlayTrigger placement="top" overlay={renderTooltip}>
                <InputGroup.Append>
                  <InputGroup.Text id="basic-addon2">?</InputGroup.Text>
                </InputGroup.Append>
              </OverlayTrigger>
            </InputGroup>

            <div id="post-img-div">
              <i
                className="material-icons"
                onClick={() => {
                  document.getElementById("post-pic-upload").value = "";
                  document.getElementById("post-img-div").style.display =
                    "none";
                  const data = {
                    ...props.formData,
                    img: [],
                  };
                  props.setFormData(data);
                  document.getElementById("post-button").disabled = isNull(
                    data
                  );
                  document.getElementById(
                    "post-img-div"
                  ).childNodes[1].innerHTML = "";
                }}
              >
                {" "}
                remove_circle
              </i>
              <div></div>
            </div>

            <div id="post-video-div">
              <i
                className="material-icons"
                onClick={() => {
                  const data = {
                    ...props.formData,
                    video: [],
                  };
                  props.setFormData(data);
                  document.getElementById("post-button").disabled = isNull(
                    data
                  );
                  document.getElementById("post-video-div").style.display =
                    "none";
                }}
              >
                {" "}
                remove_circle
              </i>
              <video width="400" height="240" controls name="video" />
            </div>

            <Button
              variant="primary"
              type="submit"
              id="post-button"
              style={{ width: "100%" }}
              disabled={true}
            >
              <strong>{"Post"}</strong>
              &emsp;
              <Spinner
                animation="border"
                variant="dark"
                size="sm"
                id="post-spinner"
                style={{ display: "none" }}
              />
            </Button>
          </Form>
        </Modal.Body>

        <Modal.Footer id="post-footer">
          <strong style={{ justifySelf: "left" }}>Add to your {"Post"}</strong>
          <Button variant={"light"} title="Upload image">
            <i
              className="material-icons"
              onClick={() => {
                props.setFormData({
                  ...props.formData,
                  embedLink: null,
                  video: null,
                });
                document.getElementById("post-pic-upload").click();
              }}
            >
              image
            </i>
          </Button>

          <Button variant={"light"} title="Upload videos">
            {" "}
            <i
              className="material-icons"
              onClick={() => {
                props.setFormData({
                  ...props.formData,
                  embedLink: null,
                  img: [],
                });
                document.getElementById("post-video-upload").click();
              }}
            >
              videocam
            </i>
          </Button>

          <Button variant={"light"} title="Embed youtube videos">
            {" "}
            <i
              className="material-icons"
              onClick={() => {
                props.setFormData({
                  ...props.formData,
                  video: null,
                  img: [],
                });
                document.getElementById("post-img-div").style.display = "none";
                document.getElementById("post-video-div").style.display =
                  "none";
                document.getElementById("embedLink").style.display = "flex";
              }}
            >
              insert_link
            </i>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CreatePost;
