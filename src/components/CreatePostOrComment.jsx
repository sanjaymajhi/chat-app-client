import React from "react";
import { useHistory } from "react-router-dom";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
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

function CreatePostOrCommentComponent(props) {
  const gf = new GiphyFetch(process.env.REACT_APP_GIPHY_API_KEY);
  const fetchGifs = (offset) => gf.trending({ offset, limit: 10 });
  const fetchEmojis = (offset) => gf.emoji({ offset, limit: 10 });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    var data = {};
    if (e.target.name === "post-img") {
      data = { ...props.formData, "post-img": [] };
      [...e.target.files].map((file) => data["post-img"].push(file));
      props.setFormData(data);
    } else if (e.target.name === "post-video") {
      data = props.formData;
      data["post-video"] =
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
    form.append("post-text", props.formData["post-text"]);
    if (props.type === "post") {
      form.append("embedLink", props.formData.embedLink);
      form.append("post-video", props.formData["post-video"]);
    } else {
      form.append("post-gif", props.formData["gif-id"]);
    }
    if (props.formData["post-img"].length > 0) {
      props.formData["post-img"].map((data) => form.append("image", data));
    } else {
      form.append("image", null);
    }

    if (props.type === "comment") {
      form.append("postId", props.postId);
    }

    const url =
      props.type === "comment"
        ? "/users/profile/post/comment"
        : props.type === "commentOnComment"
        ? "/users/profile/post/commentOnComment"
        : props.formData["post-video"] === null
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
            props.handleCloseCreatePostOrComment();
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
      document.getElementById("post-gif-div").style.display = "none";
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
          document.getElementById("post-gif-div").style.display = "none";
          document.getElementById("post-img-div").style.display = "block";
          document.getElementById("embedLink").style.display = "none";
        }
      });
    }
  };

  const gifOrEmojiClick = (type) => {
    const selectedElem = document.getElementById("post-" + type + "-select");
    if (type === "emoji") {
      document.getElementById("post-gif-select").style.display = "none";
    } else {
      document.getElementById("post-emoji-select").style.display = "none";
    }
    selectedElem.style.display === "block"
      ? (selectedElem.style.display = "none")
      : (selectedElem.style.display = "block");
  };

  const giphyClick = async (gif, e) => {
    e.preventDefault();
    document.getElementById("post-img-div").style.display = "none";
    document.getElementById("post-gif-div").style.display = "block";
    const { data } = await gf.gif(gif.id);
    const formData = {
      ...props.formData,
      "gif-id": data.images.preview_webp.url,
    };
    props.setFormData(formData);
    document.getElementById("post-button").disabled = isNull(formData);
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
        show={props.ShowCreatePostOrComment}
        onHide={props.handleCloseCreatePostOrComment}
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {props.type === "comment" ? "Write a Comment" : "Create Post"}
          </Modal.Title>
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
                  props.type === "comment"
                    ? "Type your comment here..."
                    : "What's on your mind " + localStorage.getItem("f_name")
                }
                name="post-text"
                id="post-text"
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
                  name="post-img"
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
                  name="post-video"
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
                    "post-img": [],
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
                    "post-video": [],
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
              <video width="400" height="240" controls name="post-video" />
            </div>

            <div id="post-gif-div">
              {props.formData !== undefined && (
                <img src={props.formData["gif-id"]} alt="gif" />
              )}
              <i
                className="material-icons"
                onClick={() => {
                  const data = {
                    ...props.formData,
                    "gif-id": null,
                  };
                  props.setFormData(data);
                  document.getElementById("post-button").disabled = isNull(
                    data
                  );
                  document.getElementById("post-gif-div").style.display =
                    "none";
                }}
              >
                {" "}
                remove_circle
              </i>
            </div>

            <Button
              variant="primary"
              type="submit"
              id="post-button"
              style={{ width: "100%" }}
              disabled={true}
            >
              <strong>{props.type || "Post"}</strong>&emsp;
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
          <strong style={{ justifySelf: "left" }}>
            Add to your {props.type || "post"}
          </strong>
          <Button variant={"light"} title="Upload image">
            <i
              className="material-icons"
              onClick={() => {
                props.setFormData({
                  ...props.formData,
                  embedLink: null,
                  "post-video": null,
                  "gif-id": null,
                });
                document.getElementById("post-pic-upload").click();
              }}
            >
              image
            </i>
          </Button>
          {props.type === "post" ? (
            <Button variant={"light"} title="Upload videos">
              {" "}
              <i
                className="material-icons"
                onClick={() => {
                  props.setFormData({
                    ...props.formData,
                    embedLink: null,
                    "post-img": [],
                  });
                  document.getElementById("post-video-upload").click();
                }}
              >
                videocam
              </i>
            </Button>
          ) : (
            <Button variant={"light"}>
              {" "}
              <i
                className="material-icons"
                onClick={() => {
                  props.setFormData({
                    ...props.formData,
                    "post-img": [],
                  });
                  gifOrEmojiClick("gif");
                }}
              >
                gif
              </i>
            </Button>
          )}

          {props.type === "post" ? (
            <Button variant={"light"} title="Embed youtube videos">
              {" "}
              <i
                className="material-icons"
                onClick={() => {
                  props.setFormData({
                    ...props.formData,
                    "post-video": null,
                    "post-img": [],
                  });
                  document.getElementById("post-img-div").style.display =
                    "none";
                  document.getElementById("post-video-div").style.display =
                    "none";
                  document.getElementById("embedLink").style.display = "flex";
                }}
              >
                insert_link
              </i>
            </Button>
          ) : (
            <Button
              variant={"light"}
              onClick={() => {
                props.setFormData({
                  ...props.formData,
                  "post-img": [],
                });
                gifOrEmojiClick("emoji");
              }}
            >
              <span>&#128516;</span>{" "}
            </Button>
          )}

          <div id="post-emoji-select">
            {" "}
            <Grid
              width={
                window.matchMedia("(max-width: 480px)").matches ? 250 : 450
              }
              columns={window.matchMedia("(max-width: 480px)").matches ? 2 : 3}
              fetchGifs={fetchEmojis}
              hideAttribution={true}
              onGifClick={(data, e) => giphyClick(data, e)}
            />
          </div>
          <div id="post-gif-select">
            {" "}
            <Grid
              width={
                window.matchMedia("(max-width: 480px)").matches ? 250 : 450
              }
              columns={window.matchMedia("(max-width: 480px)").matches ? 2 : 3}
              fetchGifs={fetchGifs}
              hideAttribution={true}
              onGifClick={(data, e) => giphyClick(data, e)}
            />
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CreatePostOrCommentComponent;
