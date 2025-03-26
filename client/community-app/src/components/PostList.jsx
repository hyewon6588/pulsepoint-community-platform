import React from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";

// GraphQL query to fetch community posts
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

const PostList = () => {
  const { loading, error, data } = useQuery(GET_POSTS);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Error loading posts: {error.message}</Alert>
      </Container>
    );
  }

  const posts = Array.isArray(data?.getPosts) ? data.getPosts : [];

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center" style={{ color: "#198754" }}>
        Community Posts
      </h2>
      {/* <Row className="justify-content-center"> */}
      <Row>
        {posts.map((post) => (
          <Col key={post.id} md={6} lg={4} className="mb-4">
            <Card
              className="h-100 shadow-sm border-0"
              style={{ transition: "0.3s", cursor: "pointer" }}
            >
              <Card.Body className="px-4 py-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title className="text-start mb-2">
                    {post.title}
                  </Card.Title>
                  <Badge
                    bg={post.category === "news" ? "success" : "primary"}
                    className="mb-3 text-capitalize align-self-start"
                  >
                    {post.category}
                  </Badge>
                </div>
                <Card.Text className="text-start">{post.content}</Card.Text>
              </Card.Body>
              <Card.Footer className="text-muted small text-end">
                {new Date(Number(post.createdAt)).toLocaleDateString()} at{" "}
                {new Date(Number(post.createdAt)).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PostList;
