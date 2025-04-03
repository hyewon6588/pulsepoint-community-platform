import React, { useMemo } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import "../App.css";

const GET_HELP_REQUESTS = gql`
  query GetHelpRequests {
    getHelpRequests {
      id
      author
      description
      location
      isResolved
      createdAt
      volunteers {
        id
        username
      }
    }
  }
`;

// Mutation to volunteer
const VOLUNTEER_HELP = gql`
  mutation VolunteerHelp($helpRequestId: ID!, $userId: ID!) {
    volunteerHelp(helpRequestId: $helpRequestId, userId: $userId) {
      id
      volunteers {
        id
        username
      }
    }
  }
`;

// Mutation to resolve request
const RESOLVE_HELP = gql`
  mutation ResolveHelp($helpRequestId: ID!) {
    resolveHelp(helpRequestId: $helpRequestId) {
      id
      isResolved
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

const HelpRequestList = () => {
  const { loading, error, data, refetch } = useQuery(GET_HELP_REQUESTS);
  const [volunteerHelp] = useMutation(VOLUNTEER_HELP);
  const [resolveHelp] = useMutation(RESOLVE_HELP);

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const helpRequests = Array.isArray(data?.getHelpRequests)
    ? data.getHelpRequests
    : [];

  const pinStyleMap = useMemo(() => {
    const map = new Map();
    helpRequests.forEach((helpRequest) => {
      const colorIndex =
        helpRequest.id
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0) %
        pinColors.length;
      const rotation = (((helpRequest.id.charCodeAt(0) * 17) % 11) - 5).toFixed(
        2
      );
      map.set(helpRequest.id, {
        color: pinColors[colorIndex],
        rotation,
      });
    });
    return map;
  }, [helpRequests]);

  const handleVolunteer = async (requestId) => {
    try {
      await volunteerHelp({ variables: { helpRequestId: requestId, userId } });
      refetch();
    } catch (err) {
      console.error("Volunteer error:", err);
    }
  };

  const handleResolve = async (requestId) => {
    try {
      await resolveHelp({ variables: { helpRequestId: requestId } });
      refetch();
    } catch (err) {
      console.error("Resolve error:", err);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  if (error) return <Alert variant="danger">Error: {error.message}</Alert>;

  return (
    // <Container className="mt-5">
    <Container className="village-board-container">
      <h3 className="village-board-title" style={{ marginBottom: "20px" }}>
        🪧 Help Requests
      </h3>
      <p
        style={{
          fontSize: "1.1rem",
          color: "#555",
          marginTop: "0.3rem",
          marginBottom: "2.5rem",
        }}
      >
        See who needs help in your neighborhood and offer your support 🤝
      </p>
      <Row className="g-4">
        {data.getHelpRequests.map((request) => {
          const isAuthor = String(request.author) === String(userId);
          const isResolved = request.isResolved;
          const { color, rotation } = pinStyleMap.get(request.id);

          return (
            <Col key={request.id} md={6} lg={4} className="mb-4">
              <Card
                className="village-card"
                style={{
                  height: "100%",
                  minHeight: "320px",
                  minWidth: "320px",
                  maxWidth: "420px",
                  transition: "0.3s",
                  cursor: "pointer",
                  marginTop: "-2px",
                  opacity: request.isResolved ? 0.7 : 1,
                }}
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
                <Card.Body className="justify-content-center">
                  <Card.Title className="mb-3">
                    <strong>Description:</strong> {request.description}
                  </Card.Title>
                  {request.location && (
                    <Card.Text>
                      <strong>Location:</strong> {request.location}
                    </Card.Text>
                  )}
                  <Card.Text>
                    <strong>Status:</strong> {isResolved ? "Resolved" : "Open"}
                  </Card.Text>
                  <Card.Text>
                    <strong>Volunteers:</strong>{" "}
                    {request.volunteers.length > 0
                      ? request.volunteers.map((v) => v.username).join(", ")
                      : "None"}
                  </Card.Text>
                  <Card.Text className="text-muted small">
                    {new Date(Number(request.createdAt)).toLocaleString()}
                  </Card.Text>

                  {!isResolved && (
                    <>
                      {!isAuthor && (
                        <Button
                          // variant="success"
                          size="sm"
                          className="me-2"
                          style={{
                            backgroundColor: "#6dbf73",
                            border: "none",
                            padding: "0.25rem 1rem",
                            fontSize: "0.95rem",
                            borderRadius: "0.5rem",
                            display:
                              !isResolved && !isAuthor
                                ? "inline-block"
                                : "none",
                            visibility: !isResolved ? "visible" : "hidden",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.filter = "brightness(0.95)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.filter = "brightness(1)";
                          }}
                          onClick={() => handleVolunteer(request.id)}
                        >
                          Volunteer
                        </Button>
                      )}
                      {role === "community_organizer" && (
                        <Button
                          // variant="success"
                          size="sm"
                          style={{
                            backgroundColor: "#a6744f",
                            border: "none",
                            padding: "0.25rem 1rem",
                            fontSize: "0.95rem",
                            borderRadius: "0.5rem",
                            display:
                              !isResolved && role === "community_organizer"
                                ? "inline-block"
                                : "none",
                            visibility: !isResolved ? "visible" : "hidden",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.filter = "brightness(0.95)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.filter = "brightness(1)";
                          }}
                          onClick={() => handleResolve(request.id)}
                        >
                          Resolve
                        </Button>
                      )}
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default HelpRequestList;
