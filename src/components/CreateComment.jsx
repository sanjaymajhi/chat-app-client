import React from "react";
import { useHistory } from "react-router-dom";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
import { errorDisplay } from "./functions";
//if props type is post then it is comment on a post otherwise comment on a comment
import {
  Modal,
  Form,
  Button,
  Alert,
  FormGroup,
  Spinner,
} from "react-bootstrap";

function CreateComment(props) {
  const gf = new GiphyFetch(process.env.REACT_APP_GIPHY_API_KEY);
  const fetchGifs = (offset) => gf.trending({ offset, limit: 10 });
  const fetchEmojis = (offset) => gf.emoji({ offset, limit: 10 });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    var data = {};
    if (e.target.name === "img") {
      data = { ...props.formData, img: [] };
      [...e.target.files].map((file) => data.img.push(file));
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
    document.getElementById("post-spinner").style.display = "inline-block";
    const form = new FormData();
    form.append("text", props.formData.text);
    form.append("gif", props.formData.gif);

    if (props.formData.img.length > 0) {
      props.formData.img.map((data) => form.append("image", data));
    } else {
      form.append("image", null);
    }

    if (props.type === "post") {
      form.append("postId", props.formData.postId);
    } else {
      form.append("commentId", props.formData.commentId);
    }

    const url =
      props.type === "post"
        ? "/users/profile/post/comment"
        : "/users/comment/commentOnComment";

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
            props.handleCloseCreateComment();
          }, 2000);
        } else {
          document.getElementById("post-spinner").style.display = "none";
          errorDisplay(data, "post-alert");
        }
      });
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
          document.getElementById("post-gif-div").style.display = "none";
          document.getElementById("post-img-div").style.display = "block";
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
      gif: data.images.preview_webp.url,
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

  return (
    <div>
      <Modal
        show={props.ShowCreateComment}
        onHide={props.handleCloseCreateComment}
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#333333",
            borderBottom: "1px solid black",
          }}
        >
          <Modal.Title>
            {props.type === "post" ? "Write a Comment" : "Write Your Reply"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            backgroundColor: "#333333",
          }}
        >
          <Alert
            variant={"danger"}
            style={{ display: "none" }}
            id="post-alert"
          ></Alert>

          <div id="post-profile-div">
            <img
              src={localStorage.getItem("imageUri")}
              alt="profile"
              style={{ border: "1px solid white" }}
            />
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
                  props.type === "post"
                    ? "Type your comment here..."
                    : "Type your reply here..."
                }
                id="text"
                name="text"
                style={{ resize: "none", color: "white" }}
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

            <div id="post-gif-div">
              {props.formData !== undefined && (
                <img src={props.formData["gif"]} alt="gif" />
              )}
              <i
                className="material-icons"
                onClick={() => {
                  const data = {
                    ...props.formData,
                    gif: null,
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
              variant="secondary"
              type="submit"
              id="post-button"
              style={{ width: "100%" }}
              disabled={true}
            >
              <strong>
                {props.type === "post" ? "Post Comment" : "Post Reply"}
              </strong>
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

        <Modal.Footer
          id="post-footer"
          style={{
            backgroundColor: "#333333",
            borderTop: "1px solid black",
          }}
        >
          <strong style={{ justifySelf: "left" }}>
            Add to your {props.type === "post" ? "Comment" : "Reply"}
          </strong>
          <Button variant={"light"} title="Upload image">
            <i
              className="material-icons"
              onClick={() => {
                props.setFormData({
                  ...props.formData,
                  gif: null,
                });
                document.getElementById("post-pic-upload").click();
              }}
            >
              image
            </i>
          </Button>

          <Button variant={"light"}>
            {" "}
            <i
              className="material-icons"
              onClick={() => {
                props.setFormData({
                  ...props.formData,
                  img: [],
                });
                gifOrEmojiClick("gif");
              }}
            >
              gif
            </i>
          </Button>

          <Button
            variant={"light"}
            onClick={() => {
              props.setFormData({
                ...props.formData,
                img: [],
              });
              gifOrEmojiClick("emoji");
            }}
          >
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

export default CreateComment;
