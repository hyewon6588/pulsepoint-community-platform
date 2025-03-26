import React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { FaRegComments, FaHandsHelping, FaBullhorn } from "react-icons/fa";

const Home = ({ isLoggedIn }) => {
  return (
    <Container fluid className="text-center" style={{ padding: "4rem 1rem" }}>
      {/* Hero Section */}
      <div style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          🏘️ Welcome to{" "}
          <span style={{ color: "#198754" }}>My Community App</span>
        </h1>
        <p
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            fontSize: "1.25rem",
            color: "#444",
          }}
        >
          A modern microservice-powered platform for neighborhood announcements,
          discussions, and help requests. Join us and be part of your local
          community.
        </p>

        <div style={{ marginTop: "2rem" }}>
          {!isLoggedIn ? (
            <>
              <Link to="/login">
                <Button variant="success" size="lg" className="me-3">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline-success" size="lg">
                  Signup
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/community">
              <Button variant="success" size="lg">
                Go to Community
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <Row className="justify-content-center">
        <Col md={4} className="mb-4">
          <Card
            className="h-100 shadow-sm"
            style={{ border: "1px solid #cce3d4" }}
          >
            <Card.Body>
              <FaBullhorn
                size={40}
                className="mb-3"
                style={{ color: "#6cc195" }}
              />
              <Card.Title>Post Updates</Card.Title>
              <Card.Text>
                Share news or important updates with neighbors.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card
            className="h-100 shadow-sm"
            style={{ border: "1px solid #cce3d4" }}
          >
            <Card.Body>
              <FaHandsHelping
                size={40}
                className="mb-3"
                style={{ color: "#6cc195" }}
              />
              <Card.Title>Request Help</Card.Title>
              <Card.Text>Need assistance? Let your community know.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card
            className="h-100 shadow-sm"
            style={{ border: "1px solid #cce3d4" }}
          >
            <Card.Body>
              <FaRegComments
                size={40}
                className="mb-3"
                style={{ color: "#6cc195" }}
              />
              <Card.Title>Join Discussions</Card.Title>
              <Card.Text>
                Engage in thoughtful conversations with locals.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
