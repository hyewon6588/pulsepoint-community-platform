import React from "react";
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

const HelpRequestList = () => {
  const { loading, error, data, refetch } = useQuery(GET_HELP_REQUESTS);
  const [volunteerHelp] = useMutation(VOLUNTEER_HELP);
  const [resolveHelp] = useMutation(RESOLVE_HELP);

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

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
    <Container className="mt-5">
      <h3 className="text-center mb-4">Help Requests</h3>
      <Row>
        {data.getHelpRequests.map((request) => {
          const isAuthor = String(request.author) === String(userId);
          const isResolved = request.isResolved;

          return (
            <Col key={request.id} md={6} lg={4} className="mb-4">
              <Card
                className="h-100 d-flex flex-column justify-content-between"
                style={{
                  minWidth: "320px",
                  maxWidth: "420px",
                  opacity: request.isResolved ? 0.7 : 1,
                }}
              >
                <Card.Body>
                  <Card.Title className="mb-2">
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
                          variant="info"
                          size="sm"
                          className="me-2"
                          style={{
                            display:
                              !isResolved && !isAuthor
                                ? "inline-block"
                                : "none",
                            visibility: !isResolved ? "visible" : "hidden",
                          }}
                          onClick={() => handleVolunteer(request.id)}
                        >
                          Volunteer
                        </Button>
                      )}
                      {role === "community_organizer" && (
                        <Button
                          variant="success"
                          size="sm"
                          style={{
                            display:
                              !isResolved && role === "community_organizer"
                                ? "inline-block"
                                : "none",
                            visibility: !isResolved ? "visible" : "hidden",
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
