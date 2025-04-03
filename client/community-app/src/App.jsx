// App.jsx
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PostList from "./components/PostList";
import CreatePost from "./components/CreatePost";
import CreateHelpRequest from "./components/CreateHelpRequest";
import HelpRequestList from "./components/HelpRequestList";
import AIChatbot from "./components/AIChatbot";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  const [showChat, setShowChat] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PostList showTitle={true} />} />
        <Route path="/create-post" element={<CreatePost showTitle={true} />} />
        <Route
          path="/create-help"
          element={<CreateHelpRequest showTitle={true} />}
        />
        <Route
          path="/help-requests"
          element={<HelpRequestList showTitle={true} />}
        />
      </Routes>
      <Button
        onClick={() => setShowChat(!showChat)}
        variant="success"
        style={{
          position: "fixed",
          bottom: "60px",
          right: "60px",
          zIndex: 9999,
          width: "80px",
          height: "80px",
          borderRadius: "50%",
        }}
      >
        <i className="bi bi-chat-dots" style={{ fontSize: "34px" }} />
      </Button>
      <div
        style={{
          position: "fixed",
          bottom: "90px",
          right: "20px",
          zIndex: 9900,
          display: showChat ? "block" : "none",
        }}
      >
        <AIChatbot />
      </div>
    </BrowserRouter>
  );
}

export default App;
