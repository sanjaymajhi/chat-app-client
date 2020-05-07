import React, { useState, useRef } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";

function Homepage(props) {
  const [showLogin, setShowLogin] = useState(false);
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => {
    setShowLogin(true);
    loadButtons();
  };

  const [showRegister, setShowRegister] = useState(false);
  const handleCloseRegister = () => setShowRegister(false);
  const handleShowRegister = () => {
    setShowRegister(true);
    loadButtons();
  };

  const [Login, setLogin] = useState({
    email: "",
    password: "",
    method: "native",
  });
  const [Register, setRegister] = useState({
    f_name: "",
    l_name: "",
    email: "",
    password: "",
    method: "native",
    imageUri: "",
  });

  const loadButtons = () => {
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.crossorigin = "anonymous";
    script.src =
      "https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v6.0&appId=593870491214414&autoLogAppEvents=1";
    document.head.appendChild(script);
    googleSDK();
  };

  const googleButton = useRef();
  const prepareLoginButton = () => {
    const button_type = googleButton.current.attributes[0].value;
    window.auth2.attachClickHandler(
      googleButton.current,
      {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();
        if (button_type === "register") {
          setRegister({
            f_name: profile.getGivenName(),
            l_name: profile.getFamilyName(),
            email: profile.getEmail(),
            imageUri: profile.getImageUrl(),
            method: "google",
          });
          document.getElementById("register-button").click();
        } else {
          setLogin({
            email: profile.getEmail(),
            method: "google",
            password: "no",
          });
          document.getElementById("login-button").click();
        }
      },
      (error) => {
        alert(JSON.stringify(error, undefined, 2));
      }
    );
  };

  const googleSDK = () => {
    const script = document.createElement("script");
    script.src =
      "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    window["googleSDKLoaded"] = () => {
      window["gapi"].load("auth2", () => {
        window.auth2 = window["gapi"].auth2.init({
          client_id:
            "696463816448-rsbv7ci8el2kmd18q582li2832bbuvpl.apps.googleusercontent.com",
          cookiepolicy: "single_host_origin",
          scope: "profile email",
        });
        prepareLoginButton();
      });
    };
  };

  const handleChangeLogin = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLogin({ ...Login, [name]: value });
  };

  const handleChangeRegister = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setRegister({ ...Register, [name]: value });
  };

  const errorDisplay = (data, id) => {
    const alert = document.getElementById(id);
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

  const login = (e) => {
    e.preventDefault();
    const url = "/users/login/";
    const payload = {
      ...Login,
    };
    fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          console.log(data);
          localStorage.setItem("token", data.token);
          localStorage.setItem("id", data._id);
          localStorage.setItem("username", data.username);
          localStorage.setItem("f_name", data.f_name);
          localStorage.setItem("l_name", data.l_name);
          localStorage.setItem("imageUri", data.imageUri);
          history.push("/user/profile/" + data.username);
        } else {
          errorDisplay(data, "login-alert");
        }
      });
  };

  const register = (e) => {
    e.preventDefault();
    const url = "/users/register/";
    let data = {
      ...Register,
    };
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.saved === "success") {
          const alert = document.getElementById("register-alert");
          alert.className = "fade alert alert-success show";
          alert.style.display = "block";
          alert.innerHTML = "Registration Successful...\nProceed to Login.";
          setTimeout(() => {
            handleCloseRegister();
            handleShowLogin();
          }, 2000);
        } else {
          errorDisplay(data, "register-alert");
        }
      });
  };

  const fbButton = (e, type) => {
    e.preventDefault();
    window.FB.login(
      (res) => {
        if (res.status === "connected") {
          window.FB.api(
            "/me?fields=email" +
              (type === "register" ? ",first_name,last_name,picture" : ""),
            function (res) {
              if (type === "login") {
                setLogin({
                  email: res.email,
                  method: "facebook",
                  password: "no",
                });
                document.getElementById("login-button").click();
              } else {
                console.log(res);
                setRegister({
                  f_name: res.first_name,
                  l_name: res.last_name,
                  email: res.email,
                  imageUri: res.picture.data.url,
                  method: "facebook",
                });
                document.getElementById("register-button").click();
              }
            }
          );
        }
      },
      {
        scope: "public_profile,email",
      }
    );
  };

  return (
    <div id="home">
      <div>Welcome To InstaChat</div>
      <div>
        <button onClick={handleShowLogin}>Login</button>
        <button onClick={handleShowRegister}>Sign Up</button>
      </div>

      <Modal
        show={showLogin}
        onHide={handleCloseLogin}
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert
            variant={"danger"}
            style={{ display: "none" }}
            id="login-alert"
          ></Alert>
          <Form onSubmit={login} onChange={handleChangeLogin}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
              />
            </Form.Group>
            <Button variant="primary" type="submit" id="login-button">
              Login
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button ref={googleButton} button_type="login">
            Login with Google
          </Button>
          <Button onClick={(e) => fbButton(e, "login")}>
            Login with FaceBook
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showRegister}
        onHide={handleCloseRegister}
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert
            id="register-alert"
            variant={"danger"}
            style={{ display: "none" }}
          ></Alert>
          <Form onSubmit={register} onChange={handleChangeRegister}>
            <Row>
              <Col>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    name="f_name"
                    value={Register.f_name}
                    required={true}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    name="l_name"
                    value={Register.l_name}
                    required={true}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={Register.email}
                required={true}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={Register.password}
              />
            </Form.Group>
            <Button variant="primary" type="submit" id="register-button">
              Sign Up
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button ref={googleButton} button_type="register">
            SignUp with Google
          </Button>
          <Button onClick={(e) => fbButton(e, "register")}>
            SignUp with FaceBook
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Homepage;
