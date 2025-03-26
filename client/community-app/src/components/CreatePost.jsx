import React, { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";

const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      id
      title
      content
      category
      createdAt
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost(
    $author: ID!
    $title: String!
    $content: String!
    $category: String!
  ) {
    createPost(
      author: $author
      title: $title
      content: $content
      category: $category
    ) {
      id
      title
      content
      category
      createdAt
    }
  }
`;

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("news");
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    refetchQueries: [{ query: GET_POSTS }],
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("You must be logged in to create a post.");
      return;
    }
    try {
      await createPost({
        variables: { title, content, category, author: userId },
      });
      alert("Post created successfully");
      setTitle("");
      setContent("");
      navigate("/community");
    } catch (err) {
      console.error("Failed to create post:", err);
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
          maxWidth: "720px",
          padding: "2.5rem",
          borderRadius: "12px",
          marginBottom: "3rem",
        }}
      >
        <h3 className="text-center mb-4" style={{ color: "#198754" }}>Create New Post</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label
              style={{
                fontSize: "1.15rem",
                fontWeight: "500",
                color: "#157347",
                textAlign: "left",
                display: "block",
              }}
            >
              Title
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

          <Form.Group className="mb-3" controlId="formContent">
            <Form.Label
              style={{
                fontSize: "1.15rem",
                fontWeight: "500",
                color: "#157347",
                textAlign: "left",
                display: "block",
              }}
            >
              Content
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Write your post content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
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

          <Form.Group className="mb-4" controlId="formCategory">
            <Form.Label
              style={{
                fontSize: "1.15rem",
                fontWeight: "500",
                color: "#157347",
                textAlign: "left",
                display: "block",
              }}
            >
              Category
            </Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
            >
              <option value="news">News</option>
              <option value="discussion">Discussion</option>
            </Form.Select>
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

export default CreatePost;
