import React, { useContext, useEffect } from "react";
import Context from "./Context";
import { Modal, Alert } from "react-bootstrap";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
import moment from "moment";

function MessagesLeft(props) {
  const ctx = useContext(Context);
  const gf = new GiphyFetch(process.env.REACT_APP_GIPHY_API_KEY);
  const fetchEmojis = (offset) => gf.emoji({ offset, limit: 10 });

  const handleCloseShowGifsForMsg = () =>
    ctx.dispatch({ type: "setShowGifsForMsg", payload: false });
  const handleShowGifsForMsg = () =>
    ctx.dispatch({ type: "setShowGifsForMsg", payload: true });

  useEffect(() => {
    if (Object.keys(ctx.userInfoForMsg).length > 0) {
      const interval = setInterval(() => getMessages(), 2000);
      return () => clearInterval(interval);
    }
  }, [ctx.userInfoForMsg]);

  const getMessages = () => {
    const myheaders = new Headers();
    myheaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    myheaders.append("content-type", "application/json");
    fetch("/users/messages", {
      method: "post",
      body: JSON.stringify({
        friend_id: ctx.userInfoForMsg.id,
      }),
      headers: myheaders,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          data.length = data.msgs.chat.length;
          ctx.dispatch({ type: "setMessages", payload: data });
        } else {
          ctx.dispatch({
            type: "setMessages",
            payload: { saved: "unsuccessful" },
          });
        }
      });
  };

  const sendMessage = (name, value) => {
    const formData = new FormData();
    formData.append(name, value);
    formData.append("friendId", ctx.userInfoForMsg.id);
    if (ctx.messages.saved === "success") {
      formData.append("msgBoxId", ctx.messages.msgs._id);
    } else {
      formData.append("msgBoxId", "");
    }

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
          getMessages();
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
      {Object.keys(ctx.userInfoForMsg).length === 0 ? (
        <div id="msg-not-selected">
          <h2>You don't have a message selected</h2>
          <span>Select one of your friend to message</span>
        </div>
      ) : (
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
            {ctx.messages.msgs !== undefined &&
              ctx.messages.msgs.chat.map((msg) => {
                var direction = "";

                const elem = document.getElementById("msg-box-msgs");
                elem.scrollTop = elem.scrollHeight;
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
