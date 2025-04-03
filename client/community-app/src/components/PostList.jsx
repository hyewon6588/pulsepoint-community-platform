import React, { useState, useMemo } from "react";
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
import PostDetailModal from "./PostDetailModal";
import "../App.css";

const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      id
      title
      content
      category
      createdAt
      author {
        id
        username
      }
    }
  }
`;

const pinColors = [
  { base: "#b71c1c", highlight: "#ef9a9a" },
  { base: "#e65100", highlight: "#ffcc80" },
  { base: "#2e7d32", highlight: "#a5d6a7" },
  { base: "#0d47a1", highlight: "#90caf9" },
  { base: "#4a148c", highlight: "#ce93d8" },
];

const PostList = () => {
  const { loading, error, data } = useQuery(GET_POSTS);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const posts = Array.isArray(data?.getPosts) ? data.getPosts : [];

  const pinStyleMap = useMemo(() => {
    const map = new Map();
    posts.forEach((post) => {
      const colorIndex =
        post.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
        pinColors.length;
      const rotation = (((post.id.charCodeAt(0) * 17) % 11) - 5).toFixed(2);
      map.set(post.id, {
        color: pinColors[colorIndex],
        rotation,
      });
    });
    return map;
  }, [posts]);

  const handleCardClick = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

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

  return (
    <Container className="village-board-container">
      <h2 className="village-board-title">📌 Community Posts</h2>
      <Row>
        {posts.map((post) => {
          const { color, rotation } = pinStyleMap.get(post.id);

          return (
            <Col key={post.id} md={6} lg={4} className="mb-4">
              <Card
                className="village-card"
                style={{
                  height: "100%",
                  minHeight: "320px",
                  transition: "0.3s",
                  cursor: "pointer",
                  marginTop: "-2px",
                }}
                onClick={() => handleCardClick(post)}
              >
                <div
                  className="pin"
                  style={{
                    transform: `translateX(-50%) rotate(${rotation}deg)`,
                    background: `radial-gradient(circle at 30% 30%, ${color.highlight}, ${color.base})`,
                  }}
                >
                  <div className="pin-glare"></div>
                </div>

                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Card.Title
                      className="post-title"
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.125rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {post.title}
                    </Card.Title>
                    <Badge
                      bg={post.category === "news" ? "success" : "primary"}
                      className="text-capitalize"
                    >
                      {post.category}
                    </Badge>
                  </div>
                  <div className="text-muted small text-start mt-1 mb-2">
                    Posted by: <strong>{post.author.username}</strong>
                  </div>
                  <Card.Text
                    className="text-start mb-3"
                    style={{
                      flexGrow: 1,
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.content.length > 150
                      ? post.content.slice(0, 150) + "..."
                      : post.content}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="text-end text-muted small bg-transparent border-0">
                  {new Date(Number(post.createdAt)).toLocaleDateString()}{" "}
                  {new Date(Number(post.createdAt)).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
      </Row>
      <PostDetailModal
        show={showModal}
        handleClose={handleCloseModal}
        post={selectedPost}
      />
    </Container>
  );
};

export default PostList;
