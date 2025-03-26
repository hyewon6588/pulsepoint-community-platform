import React, { useState, useEffect } from "react";
import { gql, useMutation, useApolloClient } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

// GraphQL mutation
const CREATE_HELP_REQUEST = gql`
  mutation CreateHelpRequest(
    $author: ID!
    $description: String!
    $location: String
  ) {
    createHelpRequest(
      author: $author
      description: $description
      location: $location
    ) {
      id
      description
      location
      createdAt
    }
  }
`;

const CreateHelpRequest = () => {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const client = useApolloClient();

  const [createHelpRequest, { loading, error }] =
    useMutation(CREATE_HELP_REQUEST);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("You must be logged in to create a help request.");
      return;
    }

    try {
      await createHelpRequest({
        variables: { author: userId, description, location },
      });

      await client.refetchQueries({ include: ["GetHelpRequests"] });

      alert("Help request submitted!");
      setDescription("");
      setLocation("");
      navigate("/help-requests");
    } catch (err) {
      console.error("Error submitting help request:", err);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center mt-5"
      style={{ minHeight: "85vh" }}
    >
      <Card
        style={{
          width: "100%",
          minWidth: "640px",
          maxWidth: "640px",
          padding: "2.5rem",
          borderRadius: "12px",
          marginBottom: "3rem",
        }}
      >
        <h3 className="text-center mb-4" style={{ color: "#198754" }}>Submit a Help Request</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label
              style={{
                fontSize: "1.15rem",
                fontWeight: "500",
                color: "#157347",
                textAlign: "left",
                display: "block",
              }}
            >
              Description
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the help you need"
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

          <Form.Group className="mb-3" controlId="formLocation">
            <Form.Label
              style={{
                fontSize: "1.15rem",
                fontWeight: "500",
                color: "#157347",
                textAlign: "left",
                display: "block",
              }}
            >
              Location (optional)
            </Form.Label>
            <Form.Control
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where do you need help?"
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

          {error && <Alert variant="danger">Error: {error.message}</Alert>}

          <div className="d-grid">
            <Button
              variant="success"
              type="submit"
              disabled={loading}
              size="lg"
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default CreateHelpRequest;
