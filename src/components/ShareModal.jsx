import React from "react";
import { Modal, Col, Row } from "react-bootstrap";

function ShareModal(props) {
  const styleShareButton = {
    color: "white",
    border: "1px solid black",
    padding: "1vh 1vw",
    backgroundColor: "#444444",
  };
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header
        closeButton
        style={{
          backgroundColor: "#333333",
          borderBottom: "1px solid black",
        }}
      >
        <Modal.Title>Share Post</Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          backgroundColor: "#333333",
        }}
      >
        <Row>
          <Col>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={
                "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fchat-app-by-sanjay.herokuapp.com%2Fuser%2Fpost%2F" +
                props.postId +
                "&amp;src=sdkpreparse"
              }
              class="fb-xfbml-parse-ignore"
              style={styleShareButton}
            >
              FaceBook
            </a>
          </Col>
          <Col>
            <a
              target="_blank"
              rel="noopener noreferrer"
              class="twitter-share-button"
              href={
                "https://twitter.com/intent/tweet?url=https%3A%2F%2Fchat-app-by-sanjay.herokuapp.com%2Fuser%2Fpost%2F" +
                props.postId
              }
              style={styleShareButton}
            >
              Twitter
            </a>
          </Col>
          <Col>
            <a
              href={
                "https://api.whatsapp.com/send?text=https%3A%2F%2Fchat-app-by-sanjay.herokuapp.com%2Fuser%2Fpost%2F" +
                props.postId
              }
              target="_blank"
              rel="noopener noreferrer"
              style={styleShareButton}
            >
              Whatsapp
            </a>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default ShareModal;
