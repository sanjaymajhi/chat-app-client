import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid, Gif } from "@giphy/react-components";

import {
  Modal,
  Form,
  Button,
  Alert,
  FormGroup,
  Spinner,
} from "react-bootstrap";

function CreatePostOrComment(props) {
  const gf = new GiphyFetch(process.env.REACT_APP_GIPHY_API_KEY);
  const fetchGifs = (offset) => gf.trending({ offset, limit: 10 });
  const fetchEmojis = (offset) => gf.emoji({ offset, limit: 10 });

  const [ShowCreatePost, setShowCreatePost] = useState(false);
  const handleCloseCreatePost = () => {
    setFormData({});
    setShowCreatePost(false);
  };
  const handleShowCreatePost = () => setShowCreatePost(true);

  const [gif, setGif] = useState(null);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (e.target.name === "post-img") {
      setFormData({
        ...formData,
        [name]: e.target.files[0],
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const errorDisplay = (data) => {
    const alert = document.getElementById("post-alert");
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

  const history = useHistory();

  const createPost = (e) => {
    e.preventDefault();
    document.getElementById("post-spinner").style.display = "inline-block";
    const form = new FormData();
    form.append("post-text", formData["post-text"]);
    form.append("post-gif", formData["gif-id"]);
    form.append("image", formData["post-img"]);
    fetch("/users/profile/post", {
      method: "Post",
      body: form,
      headers: {
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          const alert = document.getElementById("post-alert");
          alert.className = "fade alert alert-success show";
          alert.style.display = "block";
          alert.innerHTML = "Your details had been saved...";
          setTimeout(() => {
            handleCloseCreatePost();
          }, 2000);
        } else {
          document.getElementById("post-spinner").style.display = "none";
          errorDisplay(data);
        }
      });
  };

  const uploadPicInputStyling = (e) => {
    const file = e.target.files[0];
    const alert = document.getElementById("post-alert");
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      alert.style.display = "block";
      alert.innerHTML = "Only .jpeg or .png files allowed...";
      e.target.value = "";
    } else {
      var reader = new FileReader();
      reader.onload = (e) => {
        const img = document.getElementById("post-img-show");
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      document.getElementById("post-gif-div").style.display = "none";
      document.getElementById("post-img-div").style.display = "block";
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
    await setFormData({
      "post-text": formData["post-text"],
      "gif-id": data.images.preview_webp.url,
    });
    setGif(data);
  };

  return (
    <div>
      <Modal
        show={ShowCreatePost}
        onHide={handleCloseCreatePost}
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

          <Form onChange={handleChange} onSubmit={createPost}>
            <FormGroup>
              <Form.Control
                plaintext
                as="textarea"
                rows="3"
                placeholder={
                  "What's on your mind " + localStorage.getItem("f_name")
                }
                name="post-text"
                id="post-text"
                required={true}
              />
            </FormGroup>

            <FormGroup>
              <Form.File
                id="post-pic-upload"
                custom
                style={{ display: "none" }}
              >
                <Form.File.Input
                  name="post-img"
                  onChange={uploadPicInputStyling}
                />
              </Form.File>
            </FormGroup>

            <div id="post-img-div">
              <div>
                <i
                  className="material-icons"
                  onClick={() => {
                    document.getElementById("post-pic-upload").value = "";
                    document.getElementById("post-img-div").style.display =
                      "none";
                    setFormData({ "post-text": formData["post-text"] });
                  }}
                >
                  {" "}
                  remove_circle
                </i>
                <img src="#" alt="" id="post-img-show" />
              </div>
            </div>

            <div id="post-gif-div">
              {gif && (
                <Gif
                  gif={gif}
                  width={
                    window.matchMedia("(max-width: 480px)").matches ? 150 : 200
                  }
                  hideAttribution={true}
                />
              )}
              <i
                className="material-icons"
                onClick={() => {
                  setGif(null);
                  setFormData({ "post-text": formData["post-text"] });
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
            >
              <strong>Post</strong>&emsp;
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
          <strong style={{ justifySelf: "left" }}>Add to your post</strong>
          <Button variant={"light"}>
            <i
              className="material-icons"
              onClick={() => document.getElementById("post-pic-upload").click()}
            >
              image
            </i>
          </Button>
          <Button variant={"light"}>
            {" "}
            <i
              className="material-icons"
              onClick={() => gifOrEmojiClick("gif")}
            >
              gif
            </i>
          </Button>
          <Button variant={"light"} onClick={() => gifOrEmojiClick("emoji")}>
            <span>&#128516;</span>{" "}
          </Button>
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

export default CreatePostOrComment;
