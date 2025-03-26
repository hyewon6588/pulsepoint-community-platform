import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";

const SIGNUP_MUTATION = gql`
  mutation Signup(
    $username: String!
    $email: String!
    $password: String!
    $role: String!
  ) {
    signup(
      username: $username
      email: $email
      password: $password
      role: $role
    ) {
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

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "resident",
  });

  const navigate = useNavigate();

  const [signup, { loading, error }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      const token = data?.signup?.token;
      if (token) {
        localStorage.setItem("token", token);
        alert("Signup successful!");
        navigate("/login");
      }
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup({ variables: formData });
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
          marginTop: "3rem",
          borderRadius: "12px",
          boxShadow: "0 0 16px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ width: "100%", minWidth: "520px", maxWidth: "640px" }}>
          <h1 className="text-center mb-3" style={{ fontSize: "2.4rem" }}>
            <span style={{ color: "#198754" }}>Sign Up</span> for the community
          </h1>
          <p
            className="text-center text-muted mb-5"
            style={{ fontSize: "1.1rem" }}
          >
            Fill out the form to create your account.
          </p>

          {error && <Alert variant="danger">Error: {error.message}</Alert>}

          <Form
            onSubmit={handleSubmit}
            className="mx-auto px-2"
            style={{ maxWidth: "460px" }}
          >
            <Form.Group className="mb-4" controlId="formUsername">
              <Form.Label
                style={{
                  fontSize: "1.15rem",
                  fontWeight: "500",
                  color: "#157347",
                  textAlign: "left",
                  display: "block",
                }}
              >
                Username
              </Form.Label>
              <Form.Control
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                size="lg"
                style={{ paddingLeft: "1rem" }}
              />
            </Form.Group>

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
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                size="lg"
                style={{ paddingLeft: "1rem" }}
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
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                size="lg"
                style={{ paddingLeft: "1rem" }}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formRole">
              <Form.Label
                style={{
                  fontSize: "1.15rem",
                  fontWeight: "500",
                  color: "#157347",
                  textAlign: "left",
                  display: "block",
                }}
              >
                Role
              </Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                size="lg"
                style={{ paddingLeft: "1rem" }}
              >
                <option value="resident">Resident</option>
                <option value="business_owner">Business Owner</option>
                <option value="community_organizer">Community Organizer</option>
              </Form.Select>
            </Form.Group>

            <div className="d-grid mt-5">
              <Button
                className="w-100"
                variant="success"
                type="submit"
                disabled={loading}
                size="lg"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
            </div>
          </Form>
        </div>
      </Card>
    </Container>
  );
};

export default Signup;
