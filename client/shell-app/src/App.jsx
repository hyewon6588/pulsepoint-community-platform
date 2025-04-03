import React, { lazy, Suspense, useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Home from "./Home";
import { Routes, Route, Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Button } from "react-bootstrap";
import "./App.css";

// Apollo Client setup
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

// Micro frontend components
const Login = lazy(() => import("userApp/Login"));
const Signup = lazy(() => import("userApp/Signup"));
const PostList = lazy(() => import("communityApp/PostList"));
const CreatePost = lazy(() => import("communityApp/CreatePost"));
const CreateHelpRequest = lazy(() => import("communityApp/CreateHelpRequest"));
const HelpRequestList = lazy(() => import("communityApp/HelpRequestList"));
const AIChatbot = lazy(() => import("communityApp/AIChatbot"));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [showChat, setShowChat] = useState(false);

  // Sync login state from localStorage
  useEffect(() => {
    const syncLoginState = () => {
      const name = localStorage.getItem("username");
      const userRole = localStorage.getItem("role");
      if (name) {
        setIsLoggedIn(true);
        setUsername(name);
        setRole(userRole);
      } else {
        setIsLoggedIn(false);
        setUsername("");
        setRole("");
      }
    };

    syncLoginState();
    window.addEventListener("storage", syncLoginState);

    return () => {
      window.removeEventListener("storage", syncLoginState);
    };
  }, []);

  // Logout and clear session
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUsername("");
    setRole("");
    window.location.href = "/";
  };

  return (
    <ApolloProvider client={client}>
      <div>
        {/* Navigation Bar */}
        <Navbar
          // bg="dark"
          variant="dark"
          expand="lg"
          fixed="top"
          style={{ width: "100%", height: "90px", backgroundColor: "#497960" }}
        >
          <Container>
            <Navbar.Brand as={Link} to="/">
              Pulsepoint Community
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              {/* Left-side navigation items */}
              <Nav className="me-auto">
                {!isLoggedIn ? (
                  <>
                    <Nav.Link as={Link} to="/login">
                      Login
                    </Nav.Link>
                    <Nav.Link as={Link} to="/signup">
                      Signup
                    </Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/community">
                      Community
                    </Nav.Link>
                    <Nav.Link as={Link} to="/create-post">
                      Create Post
                    </Nav.Link>
                    {role === "resident" && (
                      <Nav.Link as={Link} to="/create-help">
                        Request Help
                      </Nav.Link>
                    )}
                    <Nav.Link as={Link} to="/help-requests">
                      Help Requests
                    </Nav.Link>
                  </>
                )}
              </Nav>

              {/* Right-side user info and logout */}
              {isLoggedIn && (
                <Nav className="ms-auto align-items-center">
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                  <Navbar.Text style={{ color: "white", marginLeft: "10px" }}>
                    Welcome, {username}!
                  </Navbar.Text>
                </Nav>
              )}
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Route View */}
        <Container className="mt-4">
          <Suspense fallback={<p>Loading...</p>}>
            <Routes>
              <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/community" element={<PostList />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/create-help" element={<CreateHelpRequest />} />
              <Route path="/help-requests" element={<HelpRequestList />} />
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
          </Suspense>
        </Container>
      </div>
    </ApolloProvider>
  );
}

export default App;
