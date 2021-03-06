import React, { useRef, useContext, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Context from "./Context";
import { errorDisplay } from "./functions";
import { Link } from "react-router-dom";

function Homepage(props) {
  const ctx = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const myheaders = new Headers();
      myheaders.append(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );
      fetch("/users/loginByToken", { method: "get", headers: myheaders })
        .then((res) => res.json())
        .then((data) => {
          if (data.saved === "success") {
            localStorage.setItem("token", data.token);
            localStorage.setItem("id", data._id);
            localStorage.setItem("username", data.username);
            localStorage.setItem("f_name", data.f_name);
            localStorage.setItem("l_name", data.l_name);
            localStorage.setItem("imageUri", data.imageUri);
            history.push("/user/explore/");
          } else {
            errorDisplay(data, "login-alert");
          }
        });
    }
  }, []);

  const setShowLogin = (data) =>
    ctx.dispatch({ type: "setShowLogin", payload: data });
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => {
    setShowLogin(true);
    loadButtons();
  };

  const setShowRegister = (data) =>
    ctx.dispatch({ type: "setShowRegister", payload: data });
  const handleCloseRegister = () => setShowRegister(false);
  const handleShowRegister = () => {
    setShowRegister(true);
    loadButtons();
  };

  const setLogin = (data) => ctx.dispatch({ type: "setLogin", payload: data });
  const setRegister = (data) =>
    ctx.dispatch({ type: "setRegister", payload: data });

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
    setLogin({ ...ctx.Login, [name]: value });
  };

  const handleChangeRegister = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setRegister({ ...ctx.Register, [name]: value });
  };

  const history = useHistory();

  const login = (e) => {
    e.preventDefault();
    const url = "/users/login/";
    const payload = {
      ...ctx.Login,
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
      ...ctx.Register,
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
      <Link to="/about" id="about-button">
        <li>About</li>
      </Link>
      <div>Welcome To Insta Chat</div>
      <div>
        <button onClick={handleShowLogin}>Login</button>
        <button onClick={handleShowRegister}>Sign Up</button>
      </div>

      <Modal
        show={ctx.showLogin}
        onHide={handleCloseLogin}
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#2a2a2a",
            borderBottom: "1px solid black",
          }}
        >
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "#2a2a2a",
          }}
        >
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
            <Button variant="secondary" type="submit" id="login-button">
              Login
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: "#2a2a2a",
            borderTop: "1px solid black",
          }}
        >
          <Col>
            <Button
              ref={googleButton}
              button_type="login"
              variant={"secondary"}
            >
              Google Login
            </Button>
          </Col>
          <Col>
            <Button onClick={(e) => fbButton(e, "login")} variant={"secondary"}>
              FB Login
            </Button>
          </Col>
        </Modal.Footer>
      </Modal>

      <Modal
        show={ctx.showRegister}
        onHide={handleCloseRegister}
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#2a2a2a",
            borderBottom: "1px solid black",
          }}
        >
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "#2a2a2a",
          }}
        >
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
                    value={ctx.Register.f_name}
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
                    value={ctx.Register.l_name}
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
                value={ctx.Register.email}
                required={true}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={ctx.Register.password}
              />
            </Form.Group>
            <Button variant="secondary" type="submit" id="register-button">
              Sign Up
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: "#2a2a2a",
            borderTop: "1px solid black",
          }}
        >
          <Col>
            <Button
              ref={googleButton}
              button_type="register"
              variant={"secondary"}
            >
              Google SignUp
            </Button>
          </Col>
          <Col>
            <Button
              onClick={(e) => fbButton(e, "register")}
              variant={"secondary"}
            >
              FB SignUp
            </Button>
          </Col>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Homepage;
