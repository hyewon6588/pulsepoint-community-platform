import React, { useState } from "react";
import { Card, Button, Form, ListGroup, Spinner } from "react-bootstrap";
import { useLazyQuery, gql } from "@apollo/client";
import "../App.css";

const COMMUNITY_AI_QUERY = gql`
  query CommunityAIQuery($input: String!) {
    communityAIQuery(input: $input) {
      text
      suggestedQuestions
      retrievedPosts {
        id
        title
        content
      }
    }
  }
`;

const AIChatbot = () => {
  const [input, setInput] = useState("");
  const [submittedInput, setSubmittedInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [fetchAIResponse, { loading }] = useLazyQuery(COMMUNITY_AI_QUERY, {
    onCompleted: (data) => {
      const { text, suggestedQuestions, retrievedPosts } =
        data.communityAIQuery;
      setMessages((prev) => [
        ...prev,
        { role: "user", text: submittedInput },
        { role: "ai", text, suggestedQuestions, retrievedPosts },
      ]);
    },
    onError: (err) => console.error("AI error", err),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSubmittedInput(input);
    fetchAIResponse({ variables: { input } });
    setInput("");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "150px",
        right: "60px",
        width: "450px",
        zIndex: 1000,
      }}
    >
      <Card className="p-3 shadow chatbot">
        <h5 className="text-success mb-3">Community Chatbot</h5>

        <div
          style={{ maxHeight: "350px", overflowY: "auto", overflowX: "hidden" }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-3 d-flex ${
                msg.role === "user"
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              <div
                style={{
                  maxWidth: "80%",
                  marginRight: msg.role === "user" ? "16px" : "0",
                  marginLeft: msg.role === "ai" ? "16px" : "0",
                  position: "relative",
                  overflow: "visible",
                }}
                className={`p-3 rounded text-start ${
                  msg.role === "user" ? "bg-success bg-opacity-10" : "bg-light"
                }`}
              >
                <div className="fw-bold text-success mb-1 text-start">
                  {msg.role === "ai" ? "Chatbot" : "You"}:
                </div>
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {msg.text}
                </div>

                {msg.suggestedQuestions && (
                  <div className="mt-3">
                    <div className="fw-bold text-success mb-1">
                      Suggested Questions:
                    </div>
                    <ListGroup variant="flush">
                      {msg.suggestedQuestions.map((q, i) => (
                        <ListGroup.Item
                          key={i}
                          className="border-0 bg-transparent ps-2 mb-2"
                        >
                          <span className="me-2 mt-1">•</span>{" "}
                          <span className="text-dark">{q}</span>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                )}

                {msg.retrievedPosts && (
                  <div className="mt-3">
                    <div className="fw-bold text-success mb-1">
                      Relevant Posts:
                    </div>
                    <ListGroup variant="flush">
                      {msg.retrievedPosts.map((post) => (
                        <ListGroup.Item
                          key={post.id}
                          className="border-0 bg-transparent ps-3 mb-2"
                        >
                          <span className="fw-semibold text-dark">
                            {post.title}
                          </span>
                          : {post.content}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                )}
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: msg.role === "user" ? "-10px" : "auto",
                    left: msg.role === "ai" ? "-10px" : "auto",
                    width: 0,
                    height: 0,
                    borderTop: "8px solid transparent",
                    borderBottom: "8px solid transparent",
                    borderRight:
                      msg.role === "ai" ? "10px solid #f8f9fa" : "none",
                    borderLeft:
                      msg.role === "user"
                        ? "10px solid rgba(25,135,84,0.1)"
                        : "none",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <Form onSubmit={handleSubmit} className="mt-3 d-flex gap-2">
          <Form.Control
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            className="border-success rounded-pill"
            style={{
              boxShadow: "none",
              paddingRight: "2.5rem",
            }}
            onFocus={(e) =>
              (e.target.style.boxShadow =
                "0 0 0 0.2rem rgba(25, 135, 84, 0.25)")
            }
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />

          <Button
            type="submit"
            variant="link"
            disabled={loading}
            className="p-0 d-flex align-items-center justify-content-center"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "transparent",
            }}
            onMouseOver={(e) => [
              (e.currentTarget.style.backgroundColor = "#198754"),
              (e.currentTarget.children[0].style.color = "white"),
            ]}
            onMouseLeave={(e) => [
              (e.currentTarget.style.backgroundColor = "transparent"),
              (e.currentTarget.children[0].style.color = "#c8d1da"),
            ]}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <i
                className="bi bi-send-fill fs-5"
                style={{ color: "#c8d1da" }}
              />
            )}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default AIChatbot;
