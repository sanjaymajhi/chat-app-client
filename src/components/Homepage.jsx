import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

function Homepage(props) {
  const [showLogin, setShowLogin] = useState(false);
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const [showRegister, setShowRegister] = useState(false);
  const handleCloseRegister = () => setShowRegister(false);
  const handleShowRegister = () => setShowRegister(true);

  const [Login, setLogin] = useState({ email: "", password: "" });
  const [Register, setRegister] = useState({
    f_name: "",
    l_name: "",
    email: "",
    password: "",
  });

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

  const login_form_submit = (e) => {
    e.preventDefault();
    const url = "/user/login/";
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
          localStorage.setItem("token", data.token);
          this.props.handleToken(data.token, data.admin);
          if (data.admin) {
            this.props.history.push("/admin/");
          } else {
            this.props.history.push("/user/profile");
          }
        } else {
          const errors = document.getElementById("errors");
          errors.style.display = "block";
          if (data.error) {
            errors.innerHTML += data.error.msg;
          }
          if (data.errors) {
            let count = 1;
            data.errors.map((err) => {
              errors.innerHTML += "<p>" + count + ". " + err.msg + "<br/></p>";
              count++;
            });
          }
          window.location.hash = "errors";
          setTimeout(function () {
            errors.style.display = "none";
          }, 10000);
        }
      });
  };

  const register = (e) => {
    e.preventDefault();
    console.log(Register);
    const url = "/user/register/";
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
          alert("Registration Successful...\nProceed to Login.");
          this.props.history.push("/user/login/");
        } else {
          const errors = document.getElementById("errors");
          errors.style.display = "block";
          if (data.error) {
            errors.innerHTML += data.error.msg;
          }
          if (data.errors) {
            let count = 1;
            data.errors.map((err) => {
              errors.innerHTML += "<p>" + count + ". " + err.msg + "<br/></p>";
              count++;
            });
          }
          window.location.hash = "errors";
          setTimeout(function () {
            errors.style.display = "none";
          }, 10000);
        }
      });
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
          <Form onSubmit={login_form_submit} onChange={handleChangeLogin}>
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
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Modal.Body>
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
          <Form onSubmit={register} onChange={handleChangeRegister}>
            <Row>
              <Col>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    name="f_name"
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
            <Button variant="primary" type="submit">
              Sign Up
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Homepage;
