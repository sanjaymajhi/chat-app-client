import React, { useContext, useEffect } from "react";
import Context from "./Context";
import { Modal, Alert } from "react-bootstrap";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
import moment from "moment";
import { useParams } from "react-router-dom";

function MessagesLeft(props) {
  const ctx = useContext(Context);
  const { id } = useParams();

  const gf = new GiphyFetch(process.env.REACT_APP_GIPHY_API_KEY);
  const fetchEmojis = (offset) => gf.emoji({ offset, limit: 10 });

  const handleCloseShowGifsForMsg = () =>
    ctx.dispatch({ type: "setShowGifsForMsg", payload: false });
  const handleShowGifsForMsg = () =>
    ctx.dispatch({ type: "setShowGifsForMsg", payload: true });

  useEffect(() => {
    getMessages(id);
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => getNewMessages(id, ctx.messages.length),
      1000
    );
    document.getElementById("tweet-button-phone").style.display = "none";
    return () => {
      clearInterval(interval);
      if (window.matchMedia("(max-width: 480px)").matches) {
        document.getElementById("tweet-button-phone").style.display = "block";
      }
    };
  }, [ctx.userInfoForMsg]);

  const getMessages = (id) => {
    const myheaders = new Headers();
    myheaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    myheaders.append("content-type", "application/json");
    fetch("/users/messages/" + id, {
      method: "get",
      headers: myheaders,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          ctx.dispatch({ type: "setMessages", payload: data.msgs });
          ctx.dispatch({
            type: "changeUserInfoForMsg",
            payload:
              data.user1 === localStorage.getItem("id")
                ? data.user2
                : data.user1,
          });
          const elem = document.getElementById("msg-box-msgs");
          elem.scrollTop = elem.scrollHeight;
        } else {
          ctx.dispatch({
            type: "setMessages",
            payload: { saved: "unsuccessful" },
          });
        }
      });
  };

  const getNewMessages = (id, leave) => {
    //leave no. of messages as already present in state
    const myheaders = new Headers();
    myheaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    myheaders.append("content-type", "application/json");
    fetch("/users/messages/" + id + "/" + leave, {
      method: "get",
      headers: myheaders,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          ctx.dispatch({ type: "setMessages", payload: data.msgs });
          const elem = document.getElementById("msg-box-msgs");
          elem.scrollTop = elem.scrollHeight;
        }
      });
  };

  const sendMessage = (name, value) => {
    const formData = new FormData();
    formData.append(name, value);
    formData.append("friendId", ctx.userInfoForMsg.id);
    formData.append("msgBoxId", id);

    const myheaders = new Headers();
    myheaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );

    fetch("/users/sendMsg", {
      method: "post",
      body: formData,
      headers: myheaders,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          if (name === "gif") {
            handleCloseShowGifsForMsg();
          }
          if (name === "text") {
            document.getElementById("text").value = "";
          }
          getMessages(id, ctx.messages.length - 1);
        }
      });
  };

  const sendGiphy = async (gif, e) => {
    e.preventDefault();
    const { data } = await gf.gif(gif.id);
    sendMessage("gif", data.images.preview_webp.url);
  };

  const sendImage = (e) => {
    const file = e.target.files[0];
    const alert = document.getElementById("wrong-image-alert");
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      alert.style.display = "block";
      alert.innerHTML = "Only .jpeg or .png files allowed...";
      setInterval(() => (alert.style.display = "none"), 2000);
      e.target.value = "";
    } else {
      sendMessage("image", file);
    }
  };

  return (
    <div id="message-left">
      <div id="msg-box">
        <div id="msg-box-profile">
          <img
            src={ctx.userInfoForMsg.imageUri}
            alt={ctx.userInfoForMsg.name + " pic"}
          />
          <div>
            <strong>{ctx.userInfoForMsg.name}</strong>
            <br />
            <span>{ctx.userInfoForMsg.username}</span>
          </div>
        </div>

        <Alert
          variant={"danger"}
          style={{ display: "none" }}
          id="wrong-image-alert"
        ></Alert>
        <div id="msg-box-msgs">
          {ctx.messages.length > 0 &&
            ctx.messages.map((msg) => {
              var direction = "";
              if (msg.senderId === localStorage.getItem("id")) {
                direction = "right";
              } else {
                direction = "left";
              }
              if (msg.text) {
                return (
                  <div key={msg._id} class={direction}>
                    <li>
                      {msg.text}&ensp;
                      <span>{moment(msg.sent_time).format("HH:mm A")}</span>
                    </li>
                  </div>
                );
              } else if (msg.image) {
                return (
                  <div key={msg._id} class={direction}>
                    <img src={msg.image} alt="" />
                    <br />
                    <span>{moment(msg.sent_time).format("HH:mm A")}</span>
                  </div>
                );
              } else {
                return (
                  <div key={msg._id} class={direction}>
                    <img src={msg.gif} alt="" />
                    <br />
                    <span>{moment(msg.sent_time).format("HH:mm A")}</span>
                  </div>
                );
              }
            })}
        </div>
        <div id="msg-box-bottom-div">
          <i
            className="material-icons"
            onClick={() => document.getElementById("send-image").click()}
          >
            image
          </i>
          <i className="material-icons" onClick={handleShowGifsForMsg}>
            gif
          </i>
          <input
            type="text"
            placeholder="Type your msg here... press enter to send"
            id="text"
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                sendMessage("text", document.getElementById("text").value);
              }
            }}
          />
        </div>
      </div>
      )}
      <input
        type="file"
        name="image"
        id="send-image"
        onChange={sendImage}
        style={{ display: "none" }}
      />
      <Modal
        show={ctx.showGifsForMsg}
        onHide={handleCloseShowGifsForMsg}
        {...props}
        size="md"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Gif</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="gif-modal">
            <Grid
              fetchGifs={fetchEmojis}
              width={
                window.matchMedia("(max-width: 480px)").matches ? 250 : 450
              }
              columns={window.matchMedia("(max-width: 480px)").matches ? 2 : 3}
              hideAttribution={true}
              onGifClick={sendGiphy}
            />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default MessagesLeft;
