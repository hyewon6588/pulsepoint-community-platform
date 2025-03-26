import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [login, { loading, error }] = useMutation(LOGIN);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ variables: { email, password } });
      const { token, user } = res.data.login;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("username", user.username);
      localStorage.setItem("role", user.role);

      window.dispatchEvent(new Event("storage"));
      navigate("/community");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "85vh", padding: "2rem" }}
    >
      <Card
        style={{
          maxWidth: "720px",
          width: "100%",
          padding: "4rem",
          borderRadius: "12px",
          boxShadow: "0 0 16px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ width: "100%", minWidth: "520px", maxWidth: "640px" }}>
          <h1 className="text-center mb-3" style={{ fontSize: "2.4rem" }}>
            <span style={{ color: "#198754" }}>Login</span> to your account
          </h1>
          <p
            className="text-center text-muted mb-5"
            style={{ fontSize: "1.1rem" }}
          > 
            Enter your credentials to access the community.
          </p>

          {error && <Alert variant="danger">Error: {error.message}</Alert>}

          <Form
            onSubmit={handleSubmit}
            className="mx-auto px-2"
            style={{ maxWidth: "460px" }}
          >
            <Form.Group className="mb-4" controlId="formEmail">
              <Form.Label
                style={{
                  fontSize: "1.15rem",
                  fontWeight: "500",
                  color: "#157347",
                  textAlign: "left",
                  display: "block",
                }}
              >
                Email address
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                size="lg"
                style={{
                  borderColor: "#ced4da",
                  paddingLeft: "1rem",
                  marginBottom: "1.5rem",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#198754";
                  e.target.style.boxShadow =
                    "0 0 0 0.2rem rgba(25, 135, 84, 0.25)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#ced4da";
                  e.target.style.boxShadow = "none";
                }}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Label
                style={{
                  fontSize: "1.15rem",
                  fontWeight: "500",
                  color: "#157347",
                  textAlign: "left",
                  display: "block",
                }}
              >
                Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                size="lg"
                style={{
                  borderColor: "#ced4da",
                  paddingLeft: "1rem",
                  marginBottom: "1.25rem",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#198754";
                  e.target.style.boxShadow =
                    "0 0 0 0.2rem rgba(25, 135, 84, 0.25)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#ced4da";
                  e.target.style.boxShadow = "none";
                }}
              />
            </Form.Group>

            <div className="d-grid mt-5">
              <Button
                className="w-100"
                variant="success"
                type="submit"
                disabled={loading}
                size="lg"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </Form>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
