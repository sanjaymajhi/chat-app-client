import React, { useContext, useEffect } from "react";
import Context from "./Context";
import { Modal, Toast } from "react-bootstrap";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
import moment from "moment";
import { useParams, Link } from "react-router-dom";
import io from "socket.io-client";
import { useState } from "react";
import { v4 } from "uuid";
const ENDPOINT = "wss://chat-app-by-sanjay.herokuapp.com";
const socket = io(ENDPOINT);

export function MessagesLeft(props) {
  const ctx = useContext(Context);
  const { id } = useParams();

  const [msg, setMsg] = useState({});
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    ctx.dispatch({ type: "appendMessages", payload: [msg] });
  }, [msg]);

  useEffect(() => {
    const elem = document.getElementById("msg-box-msgs");
    elem.scrollTop = elem.scrollHeight;
  }, [ctx.messages]);

  const gf = new GiphyFetch(process.env.REACT_APP_GIPHY_API_KEY);
  const fetchEmojis = (offset) => gf.emoji({ offset, limit: 10 });

  const handleCloseShowGifsForMsg = () =>
    ctx.dispatch({ type: "setShowGifsForMsg", payload: false });
  const handleShowGifsForMsg = () =>
    ctx.dispatch({ type: "setShowGifsForMsg", payload: true });

  socket.on("newMsg", (data) =>
    JSON.stringify(msg) !== JSON.stringify(data) ? setMsg(data) : ""
  );

  socket.on("sent", ({ uuid, senderId }) => {
    if (senderId.toString() === localStorage.getItem("id").toString())
      for (let i = ctx.messages.length - 1; i >= 0; i--) {
        if (ctx.messages[i].uuid !== undefined) {
          if (ctx.messages[i].uuid === uuid) {
            ctx.dispatch({ type: "editMessage", payload: i });
            break;
          }
        }
      }
  });

  socket.on("typing", () => {
    setTyping(true);
  });

  socket.on("stopped", () => {
    setTyping(false);
  });

  useEffect(() => {
    document.title = "InstaChat - Messages";
    socket.emit("join", id);
    getMessages(id);
    document.getElementById("tweet-button-phone").style.display = "none";
    return () => {
      socket.emit("leaveRoom", id);
      if (window.matchMedia("(max-width: 480px)").matches) {
        document.getElementById("tweet-button-phone").style.display = "block";
      }
    };
  }, [id]);

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
          ctx.dispatch({
            type: "setMessages",
            payload: {
              msgs: data.msgs,
              user:
                data.user1._id === localStorage.getItem("id")
                  ? data.user2
                  : data.user1,
            },
          });
          const elem = document.getElementById("msg-box-msgs");
          elem.scrollTop = elem.scrollHeight;
        }
      });
  };

  const sendMessage = (name, value) => {
    const elem = document.getElementById("msg-box-msgs");
    elem.scrollTop = elem.scrollHeight;
    const msg = {
      uuid: v4(),
      sent: false,
      senderId: localStorage.getItem("id"),
      [name]: value,
      sent_time: Date.now(),
    };
    ctx.dispatch({ type: "appendMessages", payload: [msg] });
    socket.emit("message", { msg: msg, roomId: id });
  };

  const sendGiphy = async (gif, e) => {
    e.preventDefault();
    const { data } = await gf.gif(gif.id);
    sendMessage("gif", data.images.preview_webp.url);
    handleCloseShowGifsForMsg();
  };

  const sendImage = (e) => {
    const file = e.target.files[0];
    const alert = document.getElementById("alert");
    const alertBody = document.querySelector(".toast-body");
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      alertBody.innerHTML = "Only jpeg and png files allowed...";
      alert.className = "fade toast show";
      setInterval(() => (alert.className = "fade toast"), 5000);
      e.target.value = "";
    } else {
      const reader = new FileReader();
      var msg;
      reader.onload = (e) => {
        msg = {
          uuid: v4(),
          sent: false,
          senderId: localStorage.getItem("id"),
          image: e.target.result,
          sent_time: Date.now(),
        };
        ctx.dispatch({ type: "appendMessages", payload: [msg] });
      };
      reader.readAsDataURL(file);

      const form = new FormData();
      form.append("image", file);

      const myheaders = new Headers();
      myheaders.append(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );

      fetch("/users/uploadChatImage", {
        method: "Post",
        body: form,
        headers: myheaders,
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Unable to Upload File");
          }
          return res.json();
        })
        .then((data) => {
          msg.image = data.link;
          socket.emit("message", { msg: msg, roomId: id });
        })
        .catch((err) => {
          alertBody.innerHTML = "Unable to Upload...";
          setInterval(() => (alert.className = "fade toast"), 5000);
        });
    }
  };

  const sendVideo = (e) => {
    const file = e.target.files[0];
    const alert = document.getElementById("alert");
    const alertBody = document.querySelector(".toast-body");
    if (file.type !== "video/mp4") {
      alertBody.innerHTML = "Only MP4 files allowed...";
      alert.className = "fade toast show";
      setInterval(() => (alert.className = "fade toast"), 5000);
      e.target.value = "";
    } else {
      const reader = new FileReader();
      var msg;
      reader.onload = (e) => {
        msg = {
          uuid: v4(),
          sent: false,
          senderId: localStorage.getItem("id"),
          video: e.target.result,
          sent_time: Date.now(),
        };
        ctx.dispatch({ type: "appendMessages", payload: [msg] });
      };
      reader.readAsDataURL(file);

      const form = new FormData();
      form.append("video", file);

      const myheaders = new Headers();
      myheaders.append(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );

      fetch("/users/uploadChatVideo", {
        method: "Post",
        body: form,
        headers: myheaders,
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Unable to Upload File");
          }
          return res.json();
        })
        .then((data) => {
          msg.video = data.link;
          socket.emit("message", { msg: msg, roomId: id });
        })
        .catch((err) => {
          alertBody.innerHTML = "Unable to Upload...";
          setInterval(() => (alert.className = "fade toast"), 5000);
        });
    }
  };

  return (
    <div id="message-left">
      <div id="msg-box">
        <div id="msg-box-profile">
          {window.matchMedia("(max-width: 480px)").matches && (
            <Link to="/user/messages">
              <i className="material-icons">arrow_back</i>
            </Link>
          )}
          <img
            src={ctx.userInfoForMsg.imageUri}
            alt={ctx.userInfoForMsg.name + " pic"}
          />
          <div>
            <strong>
              {ctx.userInfoForMsg.f_name + " " + ctx.userInfoForMsg.l_name}
            </strong>
            <br />
            <span>
              {ctx.userInfoForMsg.username} {typing ? "Typing..." : ""}
            </span>
          </div>
        </div>

        <div id="msg-box-msgs">
          {ctx.messages.length > 0 &&
            ctx.messages.map((msg) =>
              msg.text ? (
                <div
                  key={msg._id || msg.uuid}
                  className={
                    msg.senderId === localStorage.getItem("id")
                      ? "right"
                      : "left"
                  }
                >
                  <li>
                    {msg.text}&ensp;
                    <span>{moment(msg.sent_time).format("HH:mm A")}</span>
                    {msg.sent === undefined ? (
                      <i className="material-icons">check</i>
                    ) : (
                      <i className="material-icons">access_time</i>
                    )}
                  </li>
                </div>
              ) : msg.image ? (
                <div
                  key={msg._id || msg.uuid}
                  className={
                    msg.senderId === localStorage.getItem("id")
                      ? "right"
                      : "left"
                  }
                >
                  <img src={msg.image} alt="" />
                  <br />
                  <span>{moment(msg.sent_time).format("HH:mm A")}</span>
                  {msg.sent === undefined ? (
                    <i
                      className="material-icons"
                      style={{
                        position: "absolute",
                        bottom: "1vh",
                        right: "1vw",
                      }}
                    >
                      check
                    </i>
                  ) : (
                    <i
                      className="material-icons"
                      style={{
                        position: "absolute",
                        bottom: "1vh",
                        right: "1vw",
                      }}
                    >
                      access_time
                    </i>
                  )}
                </div>
              ) : msg.gif ? (
                <div
                  key={msg._id || msg.uuid}
                  className={
                    msg.senderId === localStorage.getItem("id")
                      ? "right"
                      : "left"
                  }
                >
                  <span>{moment(msg.sent_time).format("HH:mm A")}</span>
                  <img src={msg.gif} alt="" />
                  {msg.sent === undefined ? (
                    <i
                      className="material-icons"
                      style={{
                        position: "absolute",
                        bottom: "4vh",
                        right: "1vw",
                      }}
                    >
                      check
                    </i>
                  ) : (
                    <i
                      className="material-icons"
                      style={{
                        position: "absolute",
                        bottom: "4vh",
                        right: "1vw",
                      }}
                    >
                      access_time
                    </i>
                  )}
                </div>
              ) : (
                <div
                  key={msg._id || msg.uuid}
                  className={
                    msg.senderId === localStorage.getItem("id")
                      ? "right"
                      : "left"
                  }
                >
                  <video
                    src={msg.video}
                    controls
                    name="video"
                    style={{ width: "60%" }}
                  />
                  <br />
                  <span>{moment(msg.sent_time).format("HH:mm A")}</span>
                  {msg.sent === undefined ? (
                    <i
                      className="material-icons"
                      style={{
                        position: "absolute",
                        top: "1vh",
                        right: "1vw",
                      }}
                    >
                      check
                    </i>
                  ) : (
                    <i
                      className="material-icons"
                      style={{
                        position: "absolute",
                        top: "1vh",
                        right: "1vw",
                      }}
                    >
                      access_time
                    </i>
                  )}
                </div>
              )
            )}
        </div>
        <div id="msg-box-bottom-div">
          <i
            className="material-icons"
            onClick={() => document.getElementById("send-image").click()}
          >
            image
          </i>
          <i
            className="material-icons"
            onClick={() => document.getElementById("send-video").click()}
          >
            videocam
          </i>
          <i className="material-icons" onClick={handleShowGifsForMsg}>
            gif
          </i>
          <input
            type="text"
            placeholder="Type your msg here... press enter to send"
            onChange={(e) => {
              e.target.value !== ""
                ? socket.emit("typing", id)
                : socket.emit("stopped", id);
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13 && e.target.value !== "") {
                e.currentTarget.blur();
                const elem = document.getElementById("msg-box-msgs");
                elem.scrollTop = elem.scrollHeight;
                sendMessage("text", e.target.value);
                e.target.value = "";
              }
            }}
          />
        </div>
      </div>

      <input
        type="file"
        id="send-image"
        onChange={sendImage}
        style={{ display: "none" }}
      />
      <input
        type="file"
        id="send-video"
        onChange={sendVideo}
        style={{ display: "none" }}
      />
      <Modal
        show={ctx.showGifsForMsg}
        onHide={handleCloseShowGifsForMsg}
        {...props}
        size="md"
        centered
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#2a2a2a",
            borderBottom: "1px solid black",
          }}
        >
          <Modal.Title>Select Gif</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#2a2a2a" }}>
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

      <Toast
        show={false}
        id="alert"
        style={{
          position: "absolute",
          bottom: "15vh",
          right: "45vw",
          backgroundColor: "black",
          color: "white",
          zIndex: "10000",
        }}
      >
        <Toast.Body>Only jpg and png files allowed</Toast.Body>
      </Toast>
    </div>
  );
}

export default MessagesLeft;
